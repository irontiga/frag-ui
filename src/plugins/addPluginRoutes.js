import { routes } from './pluginRoutes.js'

export const addPluginRoutes = epmlInstance => {
    // console.log('Adding routes')
    Object.entries(routes).forEach(([route, handler]) => {
        epmlInstance.route(route, handler)
    })
}
