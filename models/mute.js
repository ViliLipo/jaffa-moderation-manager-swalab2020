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
    type: Sequelize.INTEGER,
  },
  global: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize: database,
  modelName: 'mutes',
});

Mute.sync({ force: true })
  .then(() => {
    Mute.create({ user: 'Mutedman', global: true });
  });

module.exports = Mute;
