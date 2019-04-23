import { routes } from './pluginRoutes.js'

export const addPluginRoutes = epmlInstance => {
    // console.log('Adding routes')
    Object.keys(routes).forEach(key => {
        epmlInstance.route(key, routes[key])
    })
}
