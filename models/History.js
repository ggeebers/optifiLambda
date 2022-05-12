const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const History = sequelize.define('History', {
    usdcValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    positions: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
    },
    openOrders: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
    },
    totalNetOptionValue: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    totalMarginRequirement: {
        type: DataTypes.INTEGER,
    },
    liquidationStatus: {
        type: DataTypes.BOOLEAN,
    },
    orderbookLocked: {
        type: DataTypes.INTEGER,
    }
});

module.exports = History;

// store data if user information is different than current


