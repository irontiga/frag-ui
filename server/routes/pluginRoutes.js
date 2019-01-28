const Path = require('path')
const routes = require('./commonRoutes.js')
const config = require('../../config/config-loader.js')

routes.push(
    {
        method: 'GET',
        path: '/plugins/{path*}',
        handler: (request, h) => {
            const filePath = Path.join(__dirname, '../../', config.plugins.directory, request.params.path)
            console.log(filePath)
            const response = h.file(filePath)
            response.header('Access-Control-Allow-Origin', config.plugins.domain + ':' + config.plugins.port) // Should be
            return response
        }
    },
    {
        method: 'GET',
        path: '/plugins/404',
        handler: (request, h) => {
            return h.file(Path.join(__dirname, '../../', config.primary.page404))
        }
    }
)

module.exports = routes
