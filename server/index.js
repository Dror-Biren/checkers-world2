const io = require('./boringConfig/appInit')
const startSiteEventsListening = require('./eventsListeners/siteEvents')
const startDeveloperEventsListening = require('./eventsListeners/developerEvents')

io.on('connection', (socket) => {
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