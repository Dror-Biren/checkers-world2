
let waitingForMatch = null

function lookForMatchOpponent(socket, user) {
    if (waitingForMatch === null)
        return waitForMatch(socket, user)
   /*
    if (user.username === waitingForMatch.user.username)
        throw new Error('ERROR: opening parallel games')
    */
    return matchWasFound(socket, user)
}

function waitForMatch(socket, user) {
    waitingForMatch = {socket, user}
}

function matchWasFound(socket, user) {
    const match = waitingForMatch
    waitingForMatch = null

    startNewGame(socket, user, match.socket, match.user)
    return match
}

function startNewGame(socket1, user1, socket2, user2) {
    const callback = function(error) {
        const usersString = `${user1.username}, ${user2.username}`
        if(error)
            throw new Error(`failed to init game between users: ${usersString}`)
        console.log(`game was successfuly init between users: ${usersString}`)   
    }

    const isUser1White = Math.random() < 0.5
    socket1.emit('initGame', isUser1White, user2, callback)
    socket2.emit('initGame', !isUser1White, user1, callback)
}

function userHasDisconnectedInGamePage(user) {
    if (waitingForMatch && user.username === waitingForMatch.user.username)
        waitingForMatch = null
    user.isNowOnGamePage = false
    user.save()
}

module.exports = {lookForMatchOpponent, userHasDisconnectedInGamePage}
