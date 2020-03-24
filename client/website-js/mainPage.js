const socket = io()
let client
identifiedToken((user) => {
    client = user
    document.querySelector("h2").innerHTML = `Hi ${client.username}!`
})

function confirmLogOut() {
    if (confirm("Are you sure you want to log-out?"))
        animateShiftPage('index', '')
}

function printAllUsers() {
    socket.emit('getTopUsers', false, (error, users) => {
        if (error)
            alert(error)
        else
            console.log("all users:", users)
    })
}