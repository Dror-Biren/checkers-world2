
function identifiedToken(callbackWhenIdentified) {
    socket.emit('findUserByToken', getToken(), (error, user) => {
        if (error) {
            shiftPageAndPreserveToken('index','')
            alert("authentication for user have failed")
        }
        else {
            console.log('token identified successfully!\n user:',user)
            callbackWhenIdentified(user)
        }
    })
}

function getToken() {
    const url = window.location.href
    const tokenIndex = url.indexOf('?')+1
    return tokenIndex? url.substring(tokenIndex) : ""
}

function shiftPageAndPreserveToken(pageName, token=getToken()) {
    let newUrl = pageName + ".html"
    if (token)
        newUrl += '?' + token
    window.location.href = newUrl
    //socket.emit('printB')
    //window.addEventListener("load", alert("------"), false);
    document.addEventListener("DOMContentLoaded", RunGame.test(), false)
}