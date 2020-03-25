let PlayersInfo = {}

PlayersInfo.setOrder = function() {
    blackPlayerInfo.style.order = 1
    document.getElementById("buttons").style.order = 2
    whitePlayerInfo.style.order = 3
}

PlayersInfo.flipOrder = function() {
    whitePlayerInfo.style.order = 4 - whitePlayerInfo.style.order
    blackPlayerInfo.style.order = 4 - blackPlayerInfo.style.order
}

PlayersInfo.setText = function() {
    const clientInfo = isClientWhite ? whitePlayerInfo : blackPlayerInfo
    const opponentInfo = isClientWhite ? blackPlayerInfo : whitePlayerInfo

    clientInfo.children[0].innerHTML = client.username
    clientInfo.children[1].innerHTML = parseInt(client.rating)
    opponentInfo.children[0].innerHTML = opponent.username
    opponentInfo.children[1].innerHTML = parseInt(opponent.rating)
}

PlayersInfo.updateRating = function(ratingChange) {
    const clientInfo = isClientWhite ? whitePlayerInfo : blackPlayerInfo
    const opponentInfo = isClientWhite ? blackPlayerInfo : whitePlayerInfo

    ratingChange = parseInt(ratingChange)

    clientInfo.children[1].innerHTML += PlayersInfo.creatRatingChangeText(ratingChange)
    opponentInfo.children[1].innerHTML += PlayersInfo.creatRatingChangeText(-ratingChange)
}

PlayersInfo.creatRatingChangeText = function(ratingChange) {
    if (ratingChange >= 0)
        ratingChange = "+" + ratingChange
    const textColor = ratingChange >= 0 ? "green" : "red"
    return `<span style="color:${textColor}"> ${ratingChange}</span>`
}