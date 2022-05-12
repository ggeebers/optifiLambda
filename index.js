const router = require('aws-lambda-router');

const {
    updateUserData,
    getAllUsers,
    getOneUser,
    getAllHistory,
    getUserHistory,
    addHistory
} = require('service.js');


exports.handler = router.handler({
    proxyIntegration: {
        routes: [
            {
                path: '/',
                method: 'GET',
                action: (request, context) => {
                    console.log("path: /")
                    return "You called me with: " + request.path;
                }
            },
            {
                path: '/users',
                method: 'GET',
                action: (request, context) => {
                    return getAllUsers()
                }
            },
            {
                path: '/users/:publicKey',
                method: 'GET',
                action: (request, context) => {
                    return getOneUser(request.paths.publicKey)
                }
            },
            {
                path: '/users',
                method: 'POST',
                action: (request, context) => {
                    return updateUserData(request.body)
                }
            },
            {
                path: '/history',
                method: 'GET',
                action: (request, context) => {
                    return getAllHistory()
                }
            },
            {
                path: '/history/user/:publicKey',
                method: 'GET',
                action: (request, context) => {
                    return getUserHistory(request.paths.publicKey)
                }
            },
            {
                path: '/history',
                method: 'POST',
                action: (request, context) => {
                    return addHistory(request.body)
                }
            },
        ]
    }
})