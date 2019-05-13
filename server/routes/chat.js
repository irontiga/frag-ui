// Meh
const Loki = require('lokijs')
const chatDB = new Loki('chat.db', {
    autoload: true,
    autoloadCallback: initDB,
    autosave: true,
    autosaveInterval: 4
})
// const messages = chatDB.addCollection('messages')

let messages
function initDB () {
    messages = chatDB.getCollection('messages')
    if (messages === null) {
        messages = chatDB.addCollection('messages')
    }
    // kick off any program logic or start listening to external events
    dbIsReady()
}

let dbIsReady
const dbReady = new Promise((resolve, reject) => {
    dbIsReady = resolve
})

module.exports = async function (server, socket) {
    await dbReady
    server.route({
        method: 'GET',
        path: '/chat/messages',
        handler: function (request, reply) {
            return messages.chain().find().limit(30).data()
        }
    })

    server.route({
        method: 'GET',
        path: '/chat/messages/{user}',
        handler: (req, reply) => {
            // nahhh
        }
    })

    server.route({
        method: 'POST',
        path: '/chat/messages',
        handler: (req, h) => {
            try {
                const message = {
                    name: req.payload.name,
                    message: req.payload.message
                }
                messages.insert(message)
                socket.emit('message', message)
                return h.response({
                    success: true
                }).code(200)
            } catch (e) {
                h.response().code(500)
            }
        }
    })

    socket.on('connection', () => {
        // console.log('Someone connected to chat')
    })
}
