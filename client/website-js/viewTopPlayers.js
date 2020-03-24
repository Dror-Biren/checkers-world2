const socket = io()

socket.emit('getTopUsers', true, (error, users) => {
    if (error) {
        alert("Sorry ... something went wrong. Please try again later")
        shiftPageAndPreserveToken('mainPage')
    }
    else
        generateTable(users)
})


function generateTable(users) {
    const table = document.querySelector("table")
    
    let index = 1
    for (let user of users) {
        const row = table.insertRow()

        const userIndexCell = row.insertCell()
        const userIndexText = document.createTextNode(index+')')
        userIndexCell.appendChild(userIndexText)

        const usernameCell = row.insertCell()
        const usernameText = document.createTextNode(user.username)
        usernameCell.appendChild(usernameText)

        const ratingCell = row.insertCell()
        const ratingText = document.createTextNode(parseInt(user.rating))
        ratingCell.appendChild(ratingText)

        index++
    }
}