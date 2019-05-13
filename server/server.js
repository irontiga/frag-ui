const io = require('socket.io')
const ServerFactory = require('./ServerFactory.js')

const primaryRoutes = require('./routes/primaryRoutes.js')
const pluginRoutes = require('./routes/pluginRoutes.js')

const chatServer = require('./routes/chat.js')

// const QORA_CONFIG = require("../config.js")
const config = require('../config/config-loader.js')

console.log(config.server.primary.host)

async function start () {
    const primaryServer = new ServerFactory(primaryRoutes, config.server.primary.host, config.server.primary.port, config.tls.enabled ? config.tls.options : void 0)
    primaryServer.startServer()
        .then(server => {
            console.log(`Primary server started at ${server.info.uri} and listening on ${server.info.address}`)
        })
        .catch(e => {
            console.error(e)
        })

    const pluginServer = new ServerFactory(pluginRoutes, config.server.plugins.host, config.server.plugins.port, config.tls.enabled ? config.tls.options : void 0)
    const pluginSocket = io(pluginServer.server.listener)
    const chatTing = await chatServer(pluginServer.server, pluginSocket)
    pluginServer.startServer()
        .then(server => {
            console.log(`Plugin server started at ${server.info.uri} and listening on ${server.info.address}`)
        })
        .catch(e => {
            console.error(e)
        })
}

start()
