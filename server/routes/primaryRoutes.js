const path = require('path')

const routes = require('./commonRoutes.js')
const getPluginDirs = require('../getPluginDirs.js')

routes.push(
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            console.log(request.params)
            return h.redirect('/karma/wallet')
        }
    },
    {
        method: 'GET',
        path: '/karma/{path*}',
        handler: {
            file: path.join(__dirname, '../../index.html')
            // file: path.join(__dirname, "../../build/src/index.html") // Production
        }
    },
    {
        method: 'GET',
        path: '/getPlugins',
        handler: (request, h) => {
            // pluginLoader.loadPlugins()
            return getPluginDirs().then(dirs => {
                return { plugins: dirs }
            })
        }
    },
    {
        method: '*',
        path: '/proxy/{url*}',
        handler: {
            proxy: {
                mapUri: (request) => {
                    // http://127.0.0.1:3000/qoraProxy/explorer/addr=Qewuihwefuiehwfiuwe
                    // protocol :// path:port / blockexplorer.json?addr=Qwqfdweqfdwefwef
                    const url = request.url.href.slice(7)// Chop out "/proxy/"
                    // let url = remote.url + "/" + request.url.href.replace('/' + remote.path + '/', '')
                    return {
                        uri: url
                    }
                },
                passThrough: true,
                xforward: true
            }
        }
    }
)

module.exports = routes
