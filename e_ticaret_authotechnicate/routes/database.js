

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
