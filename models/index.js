const User = require('./User');
const History = require('./History');

User.hasMany(History, { as: 'user', foreignKey: 'uid' });
History.belongsTo(User, { as: 'user', foreignKey: 'uid' })

module.exports = { User, History };