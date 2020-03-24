const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendConfirmEmail(email, username) {
    const codeToConfirm = generateRandomCode()
    await sgMail.send({
        to: email,
        from: 'drorcheckersworld@gmail.com',
        subject: 'Your login code to checkers-world',
        text: `Hi ${username}!\n` +
            `Thanks for joining in :)\n\n` +
            `your login code is ${codeToConfirm}.\n\n` +
            `A wonderful world of checkers is waiting just for you.\n` +
            `We hope you like it!\n` +
            `Checkers-world-of-Dror Team.`
    })
    return codeToConfirm
}

function generateRandomCode() {
    let code = ''
    for (let i = 0; i < process.env.LOGIN_CODE_LENGTH; i++)
        code += parseInt(Math.random() * 10)
    return code
}

module.exports = sendConfirmEmail

/*
const sendCancelationEmail = (email, username) => {
    sgMail.send({
        to: email,
        from: 'drorbiren@gmail.com',
        subject: 'Sorry to see you go! (checkers-world)',
        text: `Goodbye, ${username}. I hope to see you back sometime soon :(`
    })
}
*/