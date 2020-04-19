const { signUpUser, logInUser, getTopUsers } = require('../usersCode/userOperations')
const sendConfirmEmail = require('../usersCode/emailSender')
const { lookForMatchOpponent, dontMatchDissconctedUser } = require('./matchPlayersForGame')
const findUserByToken = require('../usersCode/authentication')
const startGameEventsListening = require('./gameEvents')

function startSiteEventsListening(socket) {
    socket.on('logIn', async(userData, callback) => {
        try {
            const { token } = await logInUser(userData)
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
            const { token } = await signUpUser(userData)
                //userOfSocket = user
            console.log("Successfully sign-up client with data:", userData)
            callback(undefined, token)
        } catch (error) {
            console.log("Failed to sign-up client with data:", userData)
            callback(error.message)
        }
    })


    socket.on('savedConfirmed', async(token, callback) => {
        try {
            const user = await findUserByToken(token)
            user.isConfirmed = true
            await user.save()
            callback()
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('getTopUsers', async(isLimited, callback) => {
        console.log('get all users (request)')
        try {
            const users = await getTopUsers(isLimited)
            callback(undefined, users)
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('requestNewGame', async(token, callback) => {
        try {
            const user = await findUserByToken(token)
            console.log(`User "${user.username}" request to start new game`)
            user.isNewGameRequested = true
            await user.save()
            callback()
        } catch (error) {
            callback(error.message)
        }
    })

    socket.on('enterGamePage', async(token, callback) => {
        try {
            const user = await findUserByToken(token)
            console.log(`User "${user.username}" enter game page`)
            if (!user.isNewGameRequested)
                return callback(undefined, false)
            user.isNewGameRequested = false
            await user.save()

            socket.on('disconnect', () => dontMatchDissconctedUser(user))
            const match = lookForMatchOpponent(socket, user)
            if (match) {
                startGameEventsListening(user, match.user, socket, match.socket)
                startGameEventsListening(match.user, user, match.socket, socket)
            }
            callback(undefined, true)
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

    socket.on('sendEmailAgain', async(token, callback) => {
        try {
            let user = await findUserByToken(token)
            await sendConfirmEmail(user)
            callback()
        } catch (error) {
            callback(error.message)
        }
    })
}

module.exports = startSiteEventsListening



/*
    socket.on('confirm', async({ token, codeToConfirm }, callback) => {
        try {
            const user = await findUserByToken(token)
            if (codeToConfirm !== user.codeToConfirm)
                throw new Error("Oops ... wrong code. Please try again:")
            user.isConfirmed = true
            await user.save()
            console.log("Successfully confirm user:", user.username)
            callback(undefined, token)
        } catch (error) {
            console.log("Failed to confirm user:", user.username)
            callback(error.message)
        }
    })
*/