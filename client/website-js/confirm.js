const socket = io()
let client

identifiedToken((user) => {
    client = user
    document.querySelector("h2").innerHTML = `Hi ${client.username}!`
})

function confirmCode() {
    const input = document.getElementById('input').value.trim()
    if (input !== client.codeToConfirm)
        return alert('Oops... wrong code.\n' + 'Please try again:')
    socket.emit('savedConfirmed', getToken(), (error) => {
        if (error)
            return alert(error)
        animateShiftPage('mainPage')
    })
}

function sendEmailAgain() {
    socket.emit('sendEmailAgain', getToken(), (error) => {
        alert(error ?
            "Sorry, something went wrong... The email wasn't sent" :
            "Email sent successfully!")
    })
}