const Hotel = require('../models/hotel');
const User = require('../models/user');

const stringFields = [
  'name',
  'description',
  'phone',
  'email',
  'website',
  'contactPerson',
  'address',
  'city',
  'state',
  'country',
  'postalCode',
  'currency',
  'priceRange',
  'amenities',
  'roomTypes',
  'cancellationPolicy',
  'petPolicy',
  'nearbyAttractions',
  'mainImage',
  'galleryImages',
];

const decimalFields = [
  'latitude',
  'longitude',
  'pricePerNight',
  'distanceFromAirport',
  'distanceFromCityCenter',
];

const integerFields = ['totalRooms'];

const timeFields = ['checkInTime', 'checkOutTime'];

const booleanFields = [
  'parkingAvailable',
  'wifiAvailable',
  'breakfastIncluded',
  'airportTransfer',
];

const priceRanges = ['budget', 'mid-range', 'luxury', 'ultra-luxury'];

const hotelInclude = [
  {
    model: User,
    as: 'creator',
    attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
  },
  {
    model: User,
    as: 'updater',
    attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
  },
];

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  const normalized = String(value).trim();
  return normalized === '' ? null : normalized;
};

const normalizeDecimal = (value, fieldName, errors) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);
  if (Number.isNaN(number)) {
    errors.push(`${fieldName} must be a valid number`);
    return null;
  }

  return number;
};

const normalizeInteger = (value, fieldName, errors) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);
  if (!Number.isInteger(number)) {
    errors.push(`${fieldName} must be a whole number`);
    return null;
  }

  return number;
};

const normalizeTime = (value, fieldName, errors) => {
  const normalized = normalizeString(value);
  if (!normalized) {
    return null;
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(normalized)) {
    errors.push(`${fieldName} must use HH:mm or HH:mm:ss format`);
    return null;
  }

  return normalized.length === 5 ? `${normalized}:00` : normalized;
};

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }

  return false;
};

const buildHotelPayload = (body, options = {}) => {
  const { partial = false } = options;
  const errors = [];
  const payload = {};

  stringFields.forEach((field) => {
    if (partial && !hasOwn(body, field)) {
      return;
    }

    payload[field] = normalizeString(body[field]);
  });

  decimalFields.forEach((field) => {
    if (partial && !hasOwn(body, field)) {
      return;
    }

    payload[field] = normalizeDecimal(body[field], field, errors);
  });

  integerFields.forEach((field) => {
    if (partial && !hasOwn(body, field)) {
      return;
    }

    payload[field] = normalizeInteger(body[field], field, errors);
  });

  timeFields.forEach((field) => {
    if (partial && !hasOwn(body, field)) {
      return;
    }

    payload[field] = normalizeTime(body[field], field, errors);
  });

  booleanFields.forEach((field) => {
    if (partial && !hasOwn(body, field)) {
      return;
    }

    payload[field] = normalizeBoolean(body[field]);
  });

  if (hasOwn(payload, 'currency') && !payload.currency) {
    payload.currency = 'USD';
  }

  if (hasOwn(payload, 'currency') && payload.currency) {
    payload.currency = payload.currency.toUpperCase();
  }

  if (hasOwn(payload, 'name') && !payload.name) {
    errors.push('Hotel name is required');
  }

  if (payload.currency && payload.currency.length !== 3) {
    errors.push('currency must be a 3-letter code');
  }

  if (payload.priceRange && !priceRanges.includes(payload.priceRange)) {
    errors.push('priceRange must be budget, mid-range, luxury, or ultra-luxury');
  }

  if (payload.latitude !== undefined && payload.latitude !== null && (payload.latitude < -90 || payload.latitude > 90)) {
    errors.push('latitude must be between -90 and 90');
  }

  if (payload.longitude !== undefined && payload.longitude !== null && (payload.longitude < -180 || payload.longitude > 180)) {
    errors.push('longitude must be between -180 and 180');
  }

  if (payload.pricePerNight !== undefined && payload.pricePerNight !== null && payload.pricePerNight < 0) {
    errors.push('pricePerNight cannot be negative');
  }

  if (payload.totalRooms !== undefined && payload.totalRooms !== null && payload.totalRooms < 0) {
    errors.push('totalRooms cannot be negative');
  }

  if (payload.distanceFromAirport !== undefined && payload.distanceFromAirport !== null && payload.distanceFromAirport < 0) {
    errors.push('distanceFromAirport cannot be negative');
  }

  if (payload.distanceFromCityCenter !== undefined && payload.distanceFromCityCenter !== null && payload.distanceFromCityCenter < 0) {
    errors.push('distanceFromCityCenter cannot be negative');
  }

  return { payload, errors };
};

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const getCurrentUserId = (req) => {
  if (!req.user || !isValidId(req.user.id)) {
    return null;
  }

  return Number(req.user.id);
};

const sendHotelError = (res, error, fallbackMessage) => {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Invalid hotel data',
      errors: error.errors.map((validationError) => validationError.message),
    });
  }

  return res.status(500).json({ message: fallbackMessage, error: error.message });
};

const createHotel = async (req, res) => {
  try {
    const { payload, errors } = buildHotelPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Invalid hotel data', errors });
    }

    const currentUserId = getCurrentUserId(req);
    payload.createdBy = currentUserId;

    const hotel = await Hotel.create(payload);
    const createdHotel = await Hotel.findByPk(hotel.id, { include: hotelInclude });

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: createdHotel,
    });
  } catch (error) {
    console.error('CREATE HOTEL ERROR:', error);
    sendHotelError(res, error, 'Failed to create hotel');
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: hotelInclude,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ hotels });
  } catch (error) {
    console.error('GET ALL HOTELS ERROR:', error);
    sendHotelError(res, error, 'Failed to retrieve hotels');
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid hotel id' });
    }

    const hotel = await Hotel.findByPk(id, { include: hotelInclude });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ hotel });
  } catch (error) {
    console.error('GET HOTEL ERROR:', error);
    sendHotelError(res, error, 'Failed to retrieve hotel');
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid hotel id' });
    }

    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const { payload, errors } = buildHotelPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Invalid hotel data', errors });
    }

    payload.updatedBy = getCurrentUserId(req);

    await hotel.update(payload);
    const updatedHotel = await Hotel.findByPk(id, { include: hotelInclude });

    res.status(200).json({
      message: 'Hotel updated successfully',
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error('UPDATE HOTEL ERROR:', error);
    sendHotelError(res, error, 'Failed to update hotel');
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid hotel id' });
    }

    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    await hotel.destroy();

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('DELETE HOTEL ERROR:', error);
    sendHotelError(res, error, 'Failed to delete hotel');
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};
