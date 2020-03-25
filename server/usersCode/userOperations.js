const User = require('./userSchema')
const sendConfirmEmail = require('./emailSender')

async function signUpUser({ username, email, password, confirmPassword }) {
    if (password !== confirmPassword)
        throw new Error("Password and confirm password does not match")
    const codeToConfirm = generateRandomCode()
    const user = new User({ username, email, password, codeToConfirm })
    await user.save()
    const token = await user.generateAuthToken()
    sendConfirmEmail(user)
    return { user, token }
}

function generateRandomCode() {
    let code = ''
    for (let i = 0; i < process.env.CONFIRM_CODE_LENGTH; i++)
        code += parseInt(Math.random() * 10)
    return code
}

async function logInUser({ usernameOrMail, password }) {
    const user = await User.findByCredentials(usernameOrMail, password)
    const token = await user.generateAuthToken()
    return { user, token }
}

async function getTopUsers(isLimited) {
    let options = { sort: { rating: -1 } }
    if (isLimited)
        options.limit = parseInt(process.env.LEADERS_TABLE_AMOUNT)
    return await User.find({}, null, options)
}

async function updateUserRating(user, opponentRating, isUserWon) {
    const ratingChange = calcRatingChange(user.rating, opponentRating, isUserWon)

    user.rating += ratingChange
    await user.save()
    return ratingChange
}

function calcRatingChange(player1Rating, player2Rating, isPlayer1Won) {
    const expectedScore = calcExpectedScore()
    const realScore = isPlayer1Won ? 1 : 0
    return process.env.RATING_CHANGE_SPEED * (realScore - expectedScore)

    function calcExpectedScore() {
        const exponentDiffer = 10 ** ((player2Rating - player1Rating) / 400)
        return 1 / (1 + exponentDiffer)
    }
}

module.exports = {
    signUpUser,
    logInUser,
    getTopUsers,
    updateUserRating,
}