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
                action: (request, context) => "You called me with: " + request.path
            },
            {
                path: '/users',
                method: 'GET',
                action: (request, context) => getAllUsers()
            },
            {
                path: '/users/:publicKey',
                method: 'GET',
                action: (request, context) => getOneUser(request.paths.publicKey)
            },
            {
                path: '/users',
                method: 'POST',
                action: (request, context) => updateUserData(request.body)
            },
            {
                path: '/history',
                method: 'GET',
                action: (request, context) => getAllHistory()
            },
            {
                path: '/history/:userPublicKey',
                method: 'GET',
                action: (request, context) => getUserHistory(request.paths.userPublicKey)
            },
            {
                path: '/history',
                method: 'POST',
                action: (request, context) => addHistory(request.body)
            },
        ]
    }
})