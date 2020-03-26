const io = require('./server/boringConfig/appInit')
const startSiteEventsListening = require('./server/eventsListeners/siteEvents')
const startDeveloperEventsListening = require('./server/eventsListeners/developerEvents')

io.on('connection', (socket) => {
    console.log("---"+process.env.PORT)
    console.log(`New socket connection  (id: ${socket.id})`)
    startSiteEventsListening(socket)
    if (process.env.DEV_MODE === "true")
        startDeveloperEventsListening(socket)
})


/*
io.on('connection', (socket) => {
    console.log('New WebSocket connection with id:', socket.id)
    const isSocketOnGamePage = socket.handshake.headers.referer.endsWith("game.html")

    if (isSocketOnGamePage) {
        let thisGameRoom = joinToGameRoom(socket)
        startGameEventsListening(socket, thisGameRoom)
    }
    else
        startSiteEventsListening(socket)
})
*/