const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    userAccountAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userMarginAccountUsdc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isInLiquidation: {
        type: DataTypes.BOOLEAN,
    },
    isMarketMaker: {
        type: DataTypes.BOOLEAN
    }
});

module.exports = User;


// user = {
//     address, 
//     userAccount_data
// }

// history = {
//     referencinguser,
//     usdcvalue,
//     positions,
//     totalNetoptionValue,
//     OpenOrders,
//     totalMarginRequirement,
//     OrderbookLocked,
//     time,
// }

// transactions = {

// }

