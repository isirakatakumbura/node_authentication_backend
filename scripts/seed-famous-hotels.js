require('dotenv').config();

const { sequelize } = require('../config/db');
const Hotel = require('../models/hotel');
const User = require('../models/user');

const hotels = [
  {
    name: 'Galle Face Hotel',
    description: 'Historic seafront heritage hotel facing Galle Face Green in Colombo.',
    phone: '+94 11 754 1010',
    email: 'information@gallefacehotel.com',
    website: 'https://gallefacehotel.com/',
    address: '2 Galle Road, Colombo 3',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Restaurants, bars, spa and wellness, pool, wedding and event venues',
    roomTypes: 'Rooms, suites, signature suites',
    wifiAvailable: true,
  },
  {
    name: 'Cinnamon Grand Colombo',
    description: 'Five-star city hotel on Galle Road in Colombo, known for dining and business stays.',
    phone: '+94 11 249 7361',
    website: 'https://www.cinnamonhotels.com/cinnamon-grand-colombo',
    address: '77 Galle Road, Colombo 03',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Restaurants, cafes, bars, event spaces and city-hotel facilities',
  },
  {
    name: 'Shangri-La Colombo',
    description: 'Luxury hotel in Colombo between Galle Face Green and Beira Lake.',
    phone: '+94 11 788 8288',
    website: 'https://www.shangri-la.com/colombo/shangrila/',
    address: '1 Galle Face, Colombo 2',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Restaurants, wellness facilities, business-district location and hotel car service',
    airportTransfer: true,
  },
  {
    name: 'Heritance Kandalama',
    description: 'Nature-focused luxury hotel in Sri Lanka\'s Cultural Triangle near Sigiriya.',
    phone: '+94 66 555 5000',
    email: 'hkinfo@heritancehotels.com',
    website: 'https://www.heritancehotels.com/kandalama/',
    address: 'PO Box 11, Dambulla',
    city: 'Dambulla',
    state: 'Central Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Restaurants, spa, business centre, complimentary Wi-Fi and nature experiences',
    wifiAvailable: true,
  },
  {
    name: 'Jetwing Lighthouse',
    description: 'Coastal luxury hotel in Galle overlooking the Indian Ocean from Dadella.',
    phone: '+94 91 2223744',
    email: 'resv.lighthouse@jetwinghotels.com',
    website: 'https://www.jetwinghotels.com/jetwinglighthouse/',
    address: '433 A, Dadella',
    city: 'Galle',
    state: 'Southern Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Dining spaces, coastal views, event spaces and sustainable tourism initiatives',
  },
  {
    name: 'Cape Weligama',
    description: 'Luxury coastal resort with villas and suites on Sri Lanka’s southern cliffs.',
    phone: '+94 41 225 3000',
    email: 'concierge.capeweligama@resplendentceylon.com',
    website: 'https://www.resplendentceylon.com/resort/cape-weligama/',
    address: 'Abimanagama Rd',
    city: 'Weligama',
    state: 'Southern Province',
    country: 'Sri Lanka',
    priceRange: 'luxury',
    amenities: 'Villas and suites, ocean-view dining, pools, beach access and curated experiences',
  },
];

const getAuditUser = async () => {
  const superadmin = await User.findOne({
    where: { role: 'superadmin' },
    order: [['createdAt', 'ASC']],
  });

  if (superadmin) {
    return superadmin;
  }

  return User.findOne({
    where: { role: 'admin' },
    order: [['createdAt', 'ASC']],
  });
};

const seedHotels = async () => {
  await sequelize.authenticate();

  const auditUser = await getAuditUser();
  const auditUserId = auditUser ? auditUser.id : null;
  let created = 0;
  let updated = 0;

  for (const hotelData of hotels) {
    const existingHotel = await Hotel.findOne({ where: { name: hotelData.name } });

    if (existingHotel) {
      await existingHotel.update({
        ...hotelData,
        updatedBy: auditUserId,
      });
      updated += 1;
      continue;
    }

    await Hotel.create({
      ...hotelData,
      createdBy: auditUserId,
      updatedBy: auditUserId,
    });
    created += 1;
  }

  console.log(`Seeded famous Sri Lanka hotels. Created: ${created}. Updated: ${updated}.`);
};

if (require.main === module) {
  seedHotels()
    .catch((error) => {
      console.error('Failed to seed famous Sri Lanka hotels:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await sequelize.close();
    });
}

module.exports = { hotels, seedHotels };
