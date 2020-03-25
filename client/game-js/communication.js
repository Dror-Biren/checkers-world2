let Communication = {};
const socket = io()

Communication.emitEnterGamePage = function() {
    socket.emit('enterGamePage', getToken(), (error, isNewGameRequested) => {
        if (error) {
            shiftPageAndPreserveToken('mainPage')
            return alert(error)
        }
        if (isNewGameRequested)
            return console.log('Enter-to-game-page message received successfully!')
        shiftPageAndPreserveToken('mainPage')
    })
}

Communication.emitMove = function() {
    let clicks = {
        row1: clicked.prvTile.row,
        column1: clicked.prvTile.column,
        row2: clicked.tile.row,
        column2: clicked.tile.column
    }

    console.log('about to emit the move:', clicks)
    socket.emit('clientPlayedMove', /*getToken(), */ clicks, (error) => {
        console.log(error ? error : `move received successfully!`)
    })
}


Communication.emitEndGame = function(isClientWon) {
    socket.emit('gameEnd', isClientWon, (error, ratingChange) => {
        if (error)
            return console.log(error)
        console.log("End-of-game-message received successfully!")
        console.log(`client have ${ratingChange > 0 ? "won" : "lost"} ${ratingChange} points`)
        PlayersInfo.updateRating(ratingChange)
    })
}


socket.on('initGame', (isPlayerWhite, opponentUser, callback) => {
    try {
        isGameStart = true
        opponent = opponentUser

        if (isPlayerWhite)
            Title.annonceGameStart()
        else
            Title.waitingToOpponent(true)

        if (isBoardUpsideDown === isPlayerWhite)
            RunGame.flipBoard()

        isClientWhite = isPlayerWhite
        PlayersInfo.setText()
        callback()
    } catch (error) {
        callback(error)
    }
})

socket.on('opponentPlayedMove', (clicks, callback) => {
    try {
        console.log('opponent Played Move-', clicks)
        if (isBoardUpsideDown) {
            clicks.row1 = boardHeight - 1 - clicks.row1;
            clicks.column1 = boardWidth / 2 - 1 - clicks.column1;
            clicks.row2 = boardHeight - 1 - clicks.row2;
            clicks.column2 = boardWidth / 2 - 1 - clicks.column2;
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