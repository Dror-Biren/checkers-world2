let isAnimetionRunning = true

animateScroll(true, 1000)

function animateScroll(isOpening, delay, nextAction = () => {}) {
    isAnimetionRunning = true

    const right = document.getElementById("right")
    const middle = document.getElementById("middle")
    const left = document.getElementById("left")
    const menuContent = document.getElementById("menuContent")

    right.style.visibility = "visible"
    middle.style.visibility = "visible"
    left.style.visibility = "visible"
    menuContent.style.visibility = "visible"

    const speed = 0.8
    const maxCutPrecent = 50.3
    const minCutPrecent = 6
    let cutPrecent = isOpening ? maxCutPrecent : minCutPrecent

    setFrameState()
    setTimeout(animate, delay)

    function animate() {
        setTimeout(() => {
            cutPrecent += (isOpening ? -1 : 1) * speed

            let isAnimetionDone = false

            if (cutPrecent > maxCutPrecent) {
                cutPrecent = maxCutPrecent
                isAnimetionDone = true
            }
            if (cutPrecent < minCutPrecent) {
                cutPrecent = minCutPrecent
                isAnimetionDone = true
            }

            setFrameState()

            if (isAnimetionDone) {
                isAnimetionRunning = false
                nextAction()
            } else
                animate()
        }, 20)
    }

    function setFrameState() {
        const imgShape = `inset(0% ${cutPrecent}% 0% ${cutPrecent}%)`
        middle.style["clip-path"] = imgShape
        const menuContentShape = `inset(0% ${cutPrecent+3.6}% 0% ${cutPrecent-4.2}%)`
        menuContent.style["clip-path"] = menuContentShape
        right.style.left = (minCutPrecent - cutPrecent) + "%"
        left.style.left = (cutPrecent - minCutPrecent) + "%"
    }
}



function animateShiftPage(pageName, token) {
    if (isAnimetionRunning)
        return
    animateScroll(false, 500, () => {
        shiftPageAndPreserveToken(pageName, token)
    })
}