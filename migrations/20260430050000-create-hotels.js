'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hotels', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactPerson: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: true,
      },
      pricePerNight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      priceRange: {
        type: Sequelize.ENUM('budget', 'mid-range', 'luxury', 'ultra-luxury'),
        allowNull: true,
      },
      amenities: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      roomTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      totalRooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      checkInTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      checkOutTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      cancellationPolicy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      petPolicy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nearbyAttractions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      distanceFromAirport: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      distanceFromCityCenter: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      parkingAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      wifiAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      breakfastIncluded: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      airportTransfer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mainImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      galleryImages: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Hotels');
  },
};
