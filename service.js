require('dotenv').config();
const sequelize = require('./db');
const { User, History } = require('./models')

// update/create users
const updateUserData = async ({ userAccountAddress, userMarginAccountUsdc, isInLiquidation, isMarketMaker }) => {
    await sequelize.sync({ force: false })
    try {
        let [user, created] = await User.findOrCreate({
            where: { userAccountAddress },
            defaults: { userMarginAccountUsdc, isInLiquidation, isMarketMaker }
        });
        user = created ? user : await user.update({ userMarginAccountUsdc, isInLiquidation, isMarketMaker })
        return {
            status: 200,
            data: user.dataValues,
            message: created ? 'User was successfully created' : 'User was successfully updated'
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to create/update user'
        }
    }
};

// grab all users
const getAllUsers = async () => {
    await sequelize.sync({ force: false })
    try {
        let allUsers = await User.findAll()
        allUsers = allUsers.map(user => user.dataValues)
        return {
            status: 200,
            data: allUsers,
            message: 'Users successfully grabbed',
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to grab users'
        }
    }
}

// grab one user
const getOneUser = async (userAccountAddress) => {
    await sequelize.sync({ force: false })
    try {
        const user = await User.findOne({ where: { userAccountAddress } })
        return {
            status: 200,
            data: user ? user.dataValues : null,
            message: user ? 'User successfully grabbed' : 'No user found'
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to grab users'
        }
    }
}

// grab all history
const getAllHistory = async () => {
    await sequelize.sync({ force: false })
    try {
        let allHistory = await History.findAll()
        allHistory = allHistory.map(history => history.dataValues)
        return {
            status: 200,
            data: allHistory,
            message: 'History successfully grabbed'
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to grab all history'
        }
    }
}

// grab history for one user
const getUserHistory = async (userAccountAddress) => {
    await sequelize.sync({ force: false })
    try {
        let allHistory = await History.findAll({
            include: {
                model: User,
                as: 'user',
                where: { userAccountAddress }
            }
        })
        allHistory = allHistory.map(history => history.dataValues)
        const isUser = allHistory.length > 0 ? true : await User.findOne({ where: { userAccountAddress } })
        return {
            status: 200,
            data: allHistory,
            message: allHistory.length > 0 ? 'User history successfully grabbed' : isUser ? `No history for user` : `User does not exist`
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to grab user history'
        }
    }
}

// add only new history for user (create user if does not exist)
const addHistory = async ({
    userAccountAddress, usdcValue,
    positions, openOrders,
    totalNetOptionValue,
    totalMarginRequirement,
    liquidationStatus,
    orderbookLocked
}) => {
    await sequelize.sync({ force: false })
    try {
        const user = await User.findOne({ where: { userAccountAddress } });
        if (!user) return {
            status: 200,
            data: null,
            message: `User does not exist. Unable to add history for: ${userAccountAddress}`
        }
        const newHistoryData = {
            uid: user.id, usdcValue,
            positions, openOrders,
            orderbookLocked,
            totalNetOptionValue,
            totalMarginRequirement,
            liquidationStatus,
        }
        const recentHistoryRes = await History.findOne({
            where: { uid: user.dataValues.id },
            order: [['createdAt', 'DESC']]
        })
        if (recentHistoryRes) {
            const { id, createdAt, updatedAt, addedOn, ...recentHistory } = recentHistoryRes.dataValues
            const isSame = Object.keys(recentHistory).every(key => JSON.stringify(newHistoryData[key]) === JSON.stringify(recentHistory[key]))
            const history = isSame ? recentHistoryRes : await History.create(newHistoryData)
            return {
                status: 200,
                data: history.dataValues,
                message: isSame ? 'Recent history matches new history data' : 'Added new history'
            }
        }
        const { dataValues: newHistory } = await History.create(newHistoryData)
        return {
            status: 200,
            data: newHistory,
            message: `Created 1st history for ${userAccountAddress}`
        }
    } catch (error) {
        return {
            status: 400,
            data: error,
            message: `Unable to create history for ${userAccountAddress}`
        }
    }
}

module.exports = {
    updateUserData,
    getAllUsers,
    getOneUser,
    getAllHistory,
    getUserHistory,
    addHistory
}

// (async () => {
//     // await sequelize.sync({ force: false })
//     // const updateUser = await updateUserData({
//     //     userAccountAddress: 'userAccountAddress',
//     //     userMarginAccountUsdc: 'userMarginAccountUsdc',
//     //     isInLiquidation: false,
//     //     isMarketMaker: false
//     // })
//     // console.log(updateUser)
//     // const allUsers = await getAllUsers()
//     // console.log(allUsers)
//     // const oneUser = await getOneUser('address111')

//     // console.log(oneUser)
//     const testData = {
//         userAccountAddress: 'testestetest',
//         positions: [{ test: "fire" }, { value: 'value' }],
//         openOrders: [{ test: "test" }],
//         totalNetOptionValue: [1, 2],
//         totalMarginRequirement: 1,
//         liquidationStatus: false,
//         usdcValue: 100,
//         orderbookLocked: 1
//     }
//     console.log(await addHistory(testData))

//     // console.log(await updateUserData(
//     //     {
//     //         userAccountAddress: 'seanNguyen',
//     //         userMarginAccountUsdc: 'test',
//     //         isInLiquidation: false,
//     //         isMarketMaker: true
//     //     }
//     // ))
// })()
