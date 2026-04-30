const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  },
  priceRange: {
    type: DataTypes.ENUM('budget', 'mid-range', 'luxury', 'ultra-luxury'),
    allowNull: true,
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  roomTypes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  checkInTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  checkOutTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  cancellationPolicy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  petPolicy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nearbyAttractions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  distanceFromAirport: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  distanceFromCityCenter: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  parkingAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  wifiAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  breakfastIncluded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  airportTransfer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  mainImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  galleryImages: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'Hotels',
  timestamps: true,
});

Hotel.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Hotel.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
User.hasMany(Hotel, { as: 'createdHotels', foreignKey: 'createdBy' });
User.hasMany(Hotel, { as: 'updatedHotels', foreignKey: 'updatedBy' });

module.exports = Hotel;
