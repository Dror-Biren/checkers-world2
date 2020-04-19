function identifiedToken(callbackWhenIdentified) {
    socket.emit('findUserByToken', getToken(), (error, user) => {
        if (error) {
            shiftPageAndPreserveToken('index', '')
            return alert("authentication for user have failed")
        }
        if (!user.isConfirmed && !isThisPage("confirm"))
            return shiftPageAndPreserveToken('confirm')

        //console.log('token identified successfully!\n user:', user)
        callbackWhenIdentified(user)
    })
}

function isThisPage(pageName) {
    return window.location.href.includes('/' + pageName + ".html")
}

function getToken() {
    const url = window.location.href
    const tokenIndex = url.indexOf('?') + 1
    return tokenIndex ? url.substring(tokenIndex) : ""
}

function shiftPageAndPreserveToken(pageName, token = getToken()) {
    let newUrl = pageName + ".html"
    if (token)
        newUrl += '?' + token
    window.location.href = newUrl
}


