// const url = require('url')
const Path = require('path')

const Hapi = require('hapi')

const Inert = require('inert') // For serving static files
const h2o2 = require('h2o2') // Proxy
// const Nes = require('nes') Future, would be cool to work with qora for ws

function serverFactory (routes, address, port, tls) {
    this.server = new Hapi.Server({
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../')
            }
        },
        address: address,
        port: port,
        tls: tls
    })

    this.startServer = async () => {
        try {
            await this.server.register([
                Inert,
                h2o2
            ])

            this.server.route(routes)

            await this.server.start()

            delete this.startServer
            return this.server
        } catch (e) {
            throw e
        }
    }
}

module.exports = serverFactory
