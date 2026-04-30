const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sub_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  num_of_days: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_b2c: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  price_currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  popular_destinations: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  tour_packages: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  trending_tour: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'tours',
  timestamps: false,
});

module.exports = Tour;
