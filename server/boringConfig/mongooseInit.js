const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("Connection to the data-base was successful"))
.catch(() => console.log("Error! failed to connect to data-base"))

