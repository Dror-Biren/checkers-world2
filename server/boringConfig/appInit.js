
require("dotenv").config({})
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

/*
app.get('/', function(req, res) {
    //res.render('./index')
    res.send(200)
})
*/

const publicDirectoryPath = path.join(__dirname, '../../client')
console.log(publicDirectoryPath)



app.use(express.static(publicDirectoryPath))

//socketio.listen(server)

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

module.exports = io