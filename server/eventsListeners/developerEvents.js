//const { deleteUser, deleteAllUsers } = require('../usersCode/userOperations')
const User = require('../usersCode/userSchema')

function startDeveloperEventsListening(socket) {
    socket.on('deleteUser', async(username, callback) => {
        try {
            const deleted = await User.deleteOne({ username })
            callback(undefined, deleted)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('deleteAllUsers', async(callback) => {
        try {
            let deletions = await User.deleteMany({})
            callback(undefined, deletions.deletedCount)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('getUser', async(username, callback) => {
        try {
            const user = await User.findOne({ username })
            callback(undefined, user)
        } catch (error) {
            callback(error.message)
        }
    })
}

module.exports = startDeveloperEventsListening