const { updateUserRating } = require('../usersCode/userOperations')

function startGameEventsListening(user, opponent, socket, opponentSocket) {
    const opponentRatingAtGameStart = opponent.rating

    socket.on('clientPlayedMove', async(move, callback) => {
        try {
            console.log(`user "${user.username}" played:`, move)
            await opponentSocket.emit('opponentPlayedMove', move, (error) => {
                if (error)
                    throw new Error(`user "${opponent.username}" failed to received opponent move`)
                console.log(`user "${opponent.username}" successfully received opponent move`)
            })
            callback()
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('gameEnd', async(isUserWon, callback) => {
        try {
            const status = isUserWon ? "win" : "lose"
            console.log(`user "${user.username}" has ${status} against "${opponent.username}"`)
            const ratingChange = await updateUserRating(
                user, opponentRatingAtGameStart, isUserWon)
            callback(undefined, ratingChange)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('disconnect', async() => {
        console.log(`User "${user.username}" lost against "${opponent.username}" 'due to disconnection`)
        const ratingChange = await updateUserRating(opponent, user.rating, true)
        updateUserRating(opponent, user.rating, true)
        updateUserRating(user, opponentRatingAtGameStart, false)

        opponentSocket.emit('opponentDisconnect', ratingChange, (error) => {
            if (error)
                throw new Error(`user "${opponent.username}" failed to recived opponent-disconnect-message`)
            console.log(`user "${opponent.username}" recived opponent-disconnect-message successfully`)
        })
    })

    //async function gameEnd(isUserWon) {}
}

module.exports = startGameEventsListening