
socket.on('initGame', (isPlayerWhite, clientRating, opponentUser, callback) => {
    try {
        isGameOver = false
        isGameStart = true
        client.rating = clientRating
        opponent = opponentUser
        isClientWhite = isPlayerWhite
        
        PrepareGame.resetGame()
        if (isPlayerWhite)
            Title.annonceGameStart()
        else
            Title.waitingToOpponent(true)

        PlayersInfo.setText()
        PlayersInfo.setOrder()
        if (isBoardUpsideDown === isPlayerWhite)
            RunGame.flipBoard()

        
        callback()
    } catch (error) {
        callback(error)
    }
})

socket.on('opponentPlayedMove', (clicks, callback) => {
    try {
        console.log('opponent Played Move-', clicks)
        if (isBoardUpsideDown) {
            clicks.row1 = boardHeight - 1 - clicks.row1
            clicks.column1 = boardWidth / 2 - 1 - clicks.column1
            clicks.row2 = boardHeight - 1 - clicks.row2
            clicks.column2 = boardWidth / 2 - 1 - clicks.column2
        }

        RunGame.tileWasClickedInCorrectTime(clicks.row1, clicks.column1)
        RunGame.tileWasClickedInCorrectTime(clicks.row2, clicks.column2)

        callback()
    } catch (error) {
        callback(error)
    }
})

socket.on('opponentDisconnect', (ratingChange, callback) => {
    try {
        if (isGameOver)
            return
        console.log(`opponent disconnect - client have won ${ratingChange} points`)
        RunGame.endTheGame(true)
        PlayersInfo.updateRating(ratingChange)
        callback()
    } catch (error) {
        callback(error)
    }
})