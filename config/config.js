// Note that qoraNode.explorer.url could be set to 127.0.0.1 even if it's being served to a remote client, as api requests are proxied through this node server
// const fs = require('fs')

const config = {
    server: {
        primary: {
            domain: '192.168.178.35',
            baseURL: 'qora'
        },
        plugins: {
            domain: '192.168.178.35'
        }
    },
    coin: {
        name: 'Karma',
        addressCount: 1, // Default amount of addresses to generate with an account.
        addressVersion: 46, // K for Karma
        node: {
            explorer: {
                // url: "http://127.0.0.1:9090", // Qora
                // url: "http://159.89.132.89:4940", // Karma
                url: 'http://127.0.0.1:4940', // Karma
                tail: '/index/blockexplorer.json'
            },
            api: {
                // url: "http://127.0.0.1:9085", // Qora
                // url: "http://159.89.132.89:4930", // Karma
                url: 'http://127.0.0.1:4930', // Karma
                tail: '/'
            }
        }
    },
    tls: {
        enabled: false// ,
        // options: {
        //     key: fs.readFileSync('ssl/localhost.key', 'utf-8'),
        //     cert: fs.readFileSync('ssl/localhost.crt', 'utf-8')
        // }
    }
}

module.exports = config
