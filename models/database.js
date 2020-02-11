const Sequelize = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite', storage: './moderation.db',
});

module.exports = database;
