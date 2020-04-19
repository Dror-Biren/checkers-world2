const { updateUserRating } = require('../usersCode/userOperations')
const { startNewGame } = require('./matchPlayersForGame')

function startGameEventsListening(user, opponent, socket, opponentSocket) {

    socket.on('clientPlayedMove', async(move, callback) => {
        try {
            console.log(`User "${user.username}" played:`, move)
            await opponentSocket.emit('opponentPlayedMove', move, (error) => {
                if (error)
                    throw new Error(`User "${opponent.username}" failed to received opponent move`)
                console.log(`User "${opponent.username}" successfully received opponent move`)
            })
            callback()
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('gameEnd', async(isUserWon, callback) => {
        try {
            const status = isUserWon ? "win" : "lose"
            console.log(`User "${user.username}" has ${status} against "${opponent.username}"`)
            socket.gameInProgress = false
            const ratingChange = await updateUserRating(
                user, opponentSocket.ratingAtGameStart, isUserWon)
            callback(undefined, ratingChange)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('requestRematch', async(callback) => {
        try {      
            console.log(`User "${user.username}" request a rematch`)
            if (socket.requestRematch)
                startNewGame(socket, user, opponentSocket, opponent)
            else
                opponentSocket.requestRematch = true        
            callback()
        }
        catch(error) {
            callback(error.message)
        }
    })

    socket.on('disconnect', async() => {
        if (!socket.gameInProgress)
            return console.log(`User "${user.username}" have dissconcted (after his game against "${opponent.username}" was over)`)

        socket.gameInProgress = opponentSocket.gameInProgress = false
        console.log(`User "${user.username}" lost against "${opponent.username}" 'due to disconnection`)
        const ratingChange = await updateUserRating(opponent, user.rating, true)
        updateUserRating(user, opponentSocket.ratingAtGameStart, false)

        opponentSocket.emit('opponentDisconnect', ratingChange, (error) => {
            if (error)
                throw new Error(`User "${opponent.username}" failed to recived opponent-disconnect-message`)
            console.log(`User "${opponent.username}" recived opponent-disconnect-message successfully`)
        })
    })

    //async function gameEnd(isUserWon) {}
}

module.exports = startGameEventsListening