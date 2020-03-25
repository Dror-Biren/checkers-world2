const socket = io()
let client
identifiedToken((user) => {
    client = user
    document.querySelector("h2").innerHTML = `Hi ${client.username}!`
})

function requstNewGame() {
    socket.emit('requestNewGame', getToken(), (error) => {
        if (error)
            return alert(error)
        shiftPageAndPreserveToken('game')
    })
}