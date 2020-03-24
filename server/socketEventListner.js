const { signUpUser, logInUser, getTopUsers, updateUserRating, deleteUser } = require('./usersCode/userOperations')
const { lookForMatchOpponent, userHasDisconnectedInGamePage } = require('./matchPlayersForGame')
const findUserByToken = require('./usersCode/authentication')

function startSiteEventsListening(socket) {

    socket.on('logIn', async(userData, callback) => {

        try {
            let { token } = await logInUser(userData)
            console.log("Successfully log-in client with data:", userData)

            //userOfSocket = user
            callback(undefined, token)
        } catch (error) {
            console.log("Failed to log-in client with data:", userData)
            callback(error.message)
        }
    })

    socket.on('signUp', async(userData, callback) => {

        try {
            let { token, codeToConfirm } = await signUpUser(userData)
                //userOfSocket = user
            console.log("Successfully sign-up client with data:", userData)
            callback(undefined, token, codeToConfirm)
        } catch (error) {
            console.log("Failed to sign-up client with data:", userData)
            callback(error.message)
        }
    })

    socket.on('getTopUsers', async(isLimited, callback) => {
        console.log('get all users (request)')
        try {
            let users = await getTopUsers(isLimited)
            callback(undefined, users)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('enterGamePage', async(token, callback) => {
        try {
            let user = await findUserByToken(token)
            console.log(`user "${user.username}" request to start new game`)
            if (user.isNowOnGamePage)
                throw new Error('ERROR: opening parallel games')
            user.isNowOnGamePage = true
            user.save()

            socket.on('disconnect', () => userHasDisconnectedInGamePage(user))
            const match = lookForMatchOpponent(socket, user)
            if (match) {
                startGameEventsListening(user, match.user, socket, match.socket)
                startGameEventsListening(match.user, user, match.socket, socket)
            }
            callback()
        } catch (error) {
            //console.log(error)
            callback(error.message)
        }
    })

    socket.on('findUserByToken', async(token, callback) => {
        try {
            let user = await findUserByToken(token)
            callback(undefined, user)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('deleteUser', async(token, callback) => {
        try {
            let user = await findUserByToken(token)
            deleteUser(user)
            callback()
        } catch (error) {
            //console.log(error)
            callback(error.message)
        }
    })
}


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
        updateUserRating(user, opponentRatingAtGameStart, false)

        opponentSocket.emit('opponentDisconnect', ratingChange, (error) => {
            if (error)
                throw new Error(`user "${opponent.username}" failed to recived opponent-disconnect-message`)
            console.log(`user "${opponent.username}" recived opponent-disconnect-message successfully`)
        })
    })

    //async function gameEnd(isUserWon) {}
}

module.exports = startSiteEventsListening