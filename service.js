require('dotenv').config();
const sequelize = require('./db');
const { User, History } = require('./models')


// update/create users
const updateUserData = async ({ userAccountAddress, userMarginAccountUsdc, isInLiquidation, isMarketMaker }) => {
    await sequelize.sync({ force: false })
    try {
        const [user, created] = await User.findOrCreate({
            where: { userAccountAddress },
            defaults: {
                userMarginAccountUsdc, isInLiquidation, isMarketMaker
            }
        });

        if (!created) {
            const { dataValues: updatedUser } = await user.update({ userMarginAccountUsdc, isInLiquidation, isMarketMaker })
            return {
                status: 200,
                data: updatedUser,
                message: 'User was successfully updated'
            }
        }
        return {
            status: 200,
            data: user.dataValues,
            message: 'User was successfully created'
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
        // await sequelize.close()
        return {
            status: 200,
            data: allUsers,
            message: 'Users successfully grabbed',
        }
    } catch (error) {
        // await sequelize.close()
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
        const { dataValues: user } = await User.findOne({ where: { userAccountAddress } })
        if (!user) {
            return {
                status: 200,
                data: user,
                message: 'No User found'
            }
        }
        return {
            status: 200,
            data: user,
            message: 'User successfully grabbed'
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
                where: {
                    userAccountAddress
                }
            }
        })
        allHistory = allHistory.map(history => history.dataValues)
        return {
            status: 200,
            data: allHistory,
            message: 'User history successfully grabbed'
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
    userAccountAddress,
    userMarginAccountUsdc = '',
    usdcValue,
    positions,
    openOrders,
    totalNetOptionValue,
    totalMarginRequirement,
    liquidationStatus,
    orderbookLocked
}) => {
    await sequelize.sync({ force: false })
    try {
        const [{ dataValues: user }, isNewUser] = await User.findOrCreate({
            where: { userAccountAddress },
            defaults: {
                userMarginAccountUsdc
            }
        });

        const newHistoryData = {
            usdcValue,
            positions,
            openOrders,
            totalNetOptionValue,
            totalMarginRequirement,
            liquidationStatus,
            orderbookLocked,
            uid: user.id
        }

        console.log(isNewUser ? `New User: ` : `Existing User: `, user)

        // grab most recent existing history
        const recentHistoryRes = await History.findOne({
            where: { uid: user.id },
            order: [['createdAt', 'DESC']]
        })

        // if there is existing history.... check if most recent one matches the newHistoryData
        if (recentHistoryRes) {
            const { id, createdAt, updatedAt, addedOn, ...recentHistory } = recentHistoryRes.dataValues
            const isSame = Object.keys(recentHistory).every(key => JSON.stringify(newHistoryData[key]) === JSON.stringify(recentHistory[key]))
            // console.log("Recent History", recentHistory)
            console.log("History Matches: ", isSame)
            if (!isSame) {
                const { dataValues: newHistory } = await History.create(newHistoryData)
                return {
                    status: 200,
                    data: newHistory,
                    message: 'Added new history'
                }
            }
            return {
                status: 200,
                data: recentHistory,
                message: 'Recent history matches new history data'
            }
        }
        const { dataValues: newHistory } = await History.create(newHistoryData)
        return {
            status: 200,
            data: newHistory,
            message: `Created 1st history for ` + (isNewUser ? 'new' : 'existing') + ` user`
        }

    } catch (error) {
        return {
            status: 400,
            data: error,
            message: 'Unable to create history with associated user'
        }
    }
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
//     // const testData = {
//     //     userAccountAddress: 'userAccountAddress4',
//     //     userMarginAccountUsdc: 'userMarginAccountUsdc',
//     //     positions: [{ test: "test2" }, { value: 'value' }],
//     //     openOrders: [{ test: "test" }],
//     //     totalNetOptionValue: [1, 2],
//     //     totalMarginRequirement: 1,
//     //     liquidationStatus: false,
//     //     usdcValue: 100,
//     //     orderbookLocked: 1
//     // }
//     // console.log(await addHistory(testData))

//     console.log(await getAllUsers())
// })()


module.exports = {
    updateUserData,
    getAllUsers,
    getOneUser,
    getAllHistory,
    getUserHistory,
    addHistory
}