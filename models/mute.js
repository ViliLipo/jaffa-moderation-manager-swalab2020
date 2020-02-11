const Sequelize = require('sequelize');
const database = require('./database.js');

const { Model } = Sequelize;

class Mute extends Model {}

Mute.init({
  user: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  post: {
    type: Sequelize.Integer,
  },
  global: {
    type: Sequelize.bool,
    defaultValue: false,
  },
}, {
  sequelize: database,
  modelName: 'mute',
});


module.exports = Mute;
