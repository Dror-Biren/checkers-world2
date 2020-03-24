const socket = io()
let userToken
let userWasInMiddleOfConfirm = false

function submitForm(emitName) {
    socket.emit(emitName, getFormData(), (error, token, codeToConfirm) => {
        userToken = token
        if (error)
            return alert(error)
        moveToNextStage(codeToConfirm)

        window.addEventListener("focus", () => {
            alert("a")
            if (userWasInMiddleOfConfirm)
                moveToNextStage(codeToConfirm, token)
        })
    })
}

function moveToNextStage(codeToConfirm) {
    console.log({ userWasInMiddleOfConfirm })
    let moveToNextPage = true
    if (codeToConfirm) {
        userWasInMiddleOfConfirm = true
        moveToNextPage = confirmCode(codeToConfirm, true)
    }

    userWasInMiddleOfConfirm = false
    if (moveToNextPage)
        animateShiftPage('mainPage', userToken)

}

function getFormData() {
    const fields = document.querySelector("form").elements
    let fieldsData = {}
    for (let field of fields)
        if (field.tagName === "INPUT")
            fieldsData[field.name] = field.value
    return fieldsData
}

function confirmCode(code, isFirstTime) {
    let message = isFirstTime ?
        "Please enter the code sent to your email to continue:" :
        "Oops ... wrong code. Please try again:"
    message += "\n(If you don't see the email, try searching your spam folder)"
    let userAnswer = prompt(message, "Type here")
    if (userAnswer === null) {
        cancelSignUp()
        return false
    }
    if (userAnswer.trim() === code)
        return true
    return confirmCode(code)
}

function cancelSignUp() {
    console.log("cancel sign up")
    socket.emit('deleteUser', userToken, (error) => {
        if (error)
            console.log(error)
    })
}