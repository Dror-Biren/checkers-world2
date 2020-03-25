const socket = io()

function submitForm(emitName) {
    socket.emit(emitName, getFormData(), (error, token) => {
        if (error)
            return alert(error)
        animateShiftPage('mainPage', token)
    })
}

function getFormData() {
    const fields = document.querySelector("form").elements
    let fieldsData = {}
    for (let field of fields)
        if (field.tagName === "INPUT")
            fieldsData[field.name] = field.value
    return fieldsData
}