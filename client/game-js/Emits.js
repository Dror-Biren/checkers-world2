let Emits = {}

Emits.emitEnterGamePage = function() {
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

Emits.emitMove = function() {
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


Emits.emitEndGame = function(isClientWon) {
    socket.emit('gameEnd', isClientWon, (error, ratingChange) => {
        if (error)
            return console.log(error)
        console.log("End-of-game-message received successfully!")
        const status = ratingChange > 0 ? "won" : "lost"
        console.log(`client have ${status} ${ratingChange} points`)
        PlayersInfo.updateRating(ratingChange)
    })
}

Emits.emitRequestRematch = function() {
    socket.emit('requestRematch', (error) => {
        if (error)
            return console.log(error)
        rematchButton.disabled = true
        Title.waitingToStartGame(true)
    })
}