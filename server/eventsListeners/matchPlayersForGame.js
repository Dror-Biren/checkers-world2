let waitingForMatch = null

function lookForMatchOpponent(socket, user) {
    //console.log(0)

    if (waitingForMatch === null)
        return waitForMatch(socket, user)

    //console.log("1---"+user.username)
    //console.log("2---"+waitingForMatch.user.username)
    if (user.username === waitingForMatch.user.username) {
        console.log(`User "${user.username}" can not match to a game with himself`)
        throw new Error('ERROR: opening parallel games')
    }

    return matchWasFound(socket, user)
}

function waitForMatch(socket, user) {
    waitingForMatch = { socket, user }
}

function matchWasFound(socket, user) {
    const match = waitingForMatch
    waitingForMatch = null

    startNewGame(socket, user, match.socket, match.user)
    return match
}

function startNewGame(socket1, user1, socket2, user2) {
    console.log("Try to start new game between:")
    console.log(`${user1.username} (${user1.rating})  -vs-  ${user2.username} (${user2.rating})`)

    socket1.requestRematch = socket2.requestRematch = false
    socket1.gameInProgress = socket2.gameInProgress = true
    
    socket1.ratingAtGameStart = user1.rating
    socket2.ratingAtGameStart = user2.rating

    const createCallback = function ({ username }) {
        const usersString = user1.username + " vs " + user2.username
        return function (error) {
            if (error)
                throw new Error(`failed to init game at user "${username}" (${usersString})`)
            console.log(`Game was successfuly init at user: ${username} (${usersString})`)
        }
    }

    const isUser1White = Math.random() < 0.5
    socket1.emit('initGame', isUser1White, user1.rating, user2, createCallback(user1))
    socket2.emit('initGame', !isUser1White, user2.rating, user1, createCallback(user2))
}

function dontMatchDissconctedUser(user) {
    if (waitingForMatch && user.username === waitingForMatch.user.username)
        waitingForMatch = null
}

module.exports = { lookForMatchOpponent, dontMatchDissconctedUser, startNewGame }