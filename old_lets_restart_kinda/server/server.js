'use strict'

const ServerFactory = require('./ServerFactory.js')

const primaryRoutes = require('./routes/primaryRoutes.js')
const pluginRoutes = require('./routes/pluginRoutes.js')

// const QORA_CONFIG = require("../config.js")
const config = require('../config/config-loader.js')

console.log(config.primary.host)
const primaryServer = new ServerFactory(config.primary.host, config.primary.port, config.tls.enabled ? config.tls.options : void 0)

primaryServer.startServer(primaryRoutes)
    .then(server => {
        console.log(`Primary server started at ${server.info.uri} and listening on ${server.info.address}`)
    })
    .catch(e => {
        console.error(e)
    })

const pluginServer = new ServerFactory(config.plugins.host, config.plugins.port, config.tls.enabled ? config.tls.options : void 0)

pluginServer.startServer(pluginRoutes)
    .then(server => {
        console.log(`Plugin server started at ${server.info.uri} and listening on ${server.info.address}`)
    })
    .catch(e => {
        console.error(e)
    })
