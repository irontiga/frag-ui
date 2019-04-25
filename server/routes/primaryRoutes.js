const path = require('path')

const routes = require('./commonRoutes.js')
const getPluginDirs = require('../getPluginDirs.js')
const getAirdrop = require('./getAirdrop.js')
const checkName = require('./checkName.js')
const saveEmail = require('./saveEmail.js')

const config = require('../../config/config-loader.js')

routes.push(
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            console.log(request.params)
            return h.redirect(`/${config.coin.baseUrl}/wallet`)
        }
    },
    {
        method: 'GET',
        path: `/${config.coin.baseUrl}/{path*}`,
        handler: {
            file: path.join(__dirname, '../../index.html')
            // file: path.join(__dirname, "../../build/src/index.html") // Production
        }
    },
    {
        method: 'GET',
        path: '/favicon.ico',
        handler: {
            file: path.join(__dirname, '../../favicon.ico')
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
            }).catch(e => console.error(e))
        }
    },
    {
        method: 'GET',
        path: '/getAirdrop/{name}/{address}',
        handler: (request, h) => {
            // console.log(request.params)
            // pluginLoader.loadPlugins()
            return getAirdrop(request.params.name, request.params.address).then(res => {
                console.log(res)
                return res
            }).catch(err => {
                console.error(err)
                throw err
            })
        }
    },
    {
        method: 'GET',
        path: '/checkName/{name}',
        handler: (request, h) => {
            // console.log(request.params)
            // pluginLoader.loadPlugins()
            return checkName(request.params.name)
        }
    },
    {
        method: 'GET',
        path: '/saveEmail/{email}',
        handler: (request, h) => {
            // console.log(request.params)
            // pluginLoader.loadPlugins()
            return saveEmail(request.params.email)
        }
    },
    {
        method: '*',
        path: '/proxy/{url*}',
        handler: {
            proxy: {
                mapUri: (request) => {
                    // console.log(request)
                    // http://127.0.0.1:3000/proxy/explorer/addr=Qewuihwefuiehwfiuwe
                    // protocol :// path:port / blockexplorer.json?addr=Qwqfdweqfdwefwef
                    // const url = request.url.href.slice(7)// Chop out "/proxy/"
                    const url = request.url.pathname.slice(7) + request.url.search// Chop out "/proxy/"
                    // let url = remote.url + "/" + request.url.href.replace('/' + remote.path + '/', '')
                    // console.log(url)
                    // console.log(request)
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
