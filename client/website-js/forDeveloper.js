const socket = new io()

function printUser() {
    const username = prompt("enter username:")
    socket.emit('getUser', username, (error, user) => {
        if (error)
            return alert(error)
        if (user)
            return console.log("user:", user)
        alert('there is no user with username ' + username)
    })
}

function printAllUsers() {
    socket.emit('getTopUsers', false, (error, users) => {
        if (error)
            return alert(error)
        console.log("all users:")
        for (let user of users)
            console.log(user)
    })
}

function deleteUser() {
    const username = prompt("enter username:")
    socket.emit('deleteUser', username, (error, user) => {
        if (error)
            return alert(error)
        if (user)
            return alert("user deleted.")
        alert('there is no user with username ' + username)
    })
}

function deleteAllUsers() {
    if (confirm("Are you sure you want to delete all users?"))
        socket.emit('deleteAllUsers', (error, deletionsAmount) => {
            if (error)
                alert(error)
            else
                alert("deletions amount: " + deletionsAmount)
        })
}