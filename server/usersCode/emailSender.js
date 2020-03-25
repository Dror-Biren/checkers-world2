const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendConfirmEmail(user) {
    await sgMail.send({
        to: user.email,
        from: 'drorcheckersworld@gmail.com',
        subject: 'Your login code to checkers-world',
        text: `Hi ${user.username}!\n` +
            `Thanks for joining in :)\n\n` +
            `your login code is ${user.codeToConfirm}.\n\n` +
            `A wonderful world of checkers is waiting just for you.\n` +
            `We hope you like it!\n` +
            `Checkers-world-of-Dror Team.`
    })
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