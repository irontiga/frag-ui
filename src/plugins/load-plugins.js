import { store } from '../store.js'
import { Epml } from '../epml.js'
// import { ContentWindow as EpmlContentWindow } from 'epml'
import { addPluginRoutes } from './addPluginRoutes'
import { doAddPlugin } from '../redux/app/app-actions.js'

// Epml.registerPlugin(EpmlContentWindow)

let retryLoadPluginsInterval = 0
export const loadPlugins = () => fetch('/getPlugins')
    .then(response => response.json())
    .then(response => {
        // console.log(response)
        const plugins = response.plugins
        const config = store.getState().config
        // console.log(config)
        pluginLoader(plugins, config)
    })
    .catch(err => {
        retryLoadPluginsInterval += 1000
        console.error(err)
        console.error(`Could not load plugins. Retrying in ${retryLoadPluginsInterval / 1000} second(s)`)
        setTimeout(loadPlugins, retryLoadPluginsInterval)
    })

export const pluginLoader = (plugins, config) => {
    plugins.forEach(plugin => {
        const frame = document.createElement('iframe')
        frame.className += 'pluginJSFrame'
        frame.sandbox = 'allow-scripts allow-same-origin'
        // Why not support http/https, pass the plugin as a location hash
        frame.src = window.location.protocol + '//' + window.location.hostname + ':' + config.server.plugins.port + '/src/plugins/plugin-mainjs-loader.html#' + plugin + '/main.js'

        const insertedFrame = window.document.body.appendChild(frame)

        const epmlInstance = new Epml({
            type: 'WINDOW',
            source: insertedFrame.contentWindow
        })

        addPluginRoutes(epmlInstance)
        epmlInstance.imReady()
        // console.log('I\'m ready!')

        store.dispatch(doAddPlugin(epmlInstance))
        // Wimp.registerTarget(plugin, insertedFrame.contentWindow)
    })

    // Wimp.registerTarget('all-plugin-loaders', plugins)

    // this.wimps.pluginLoader = parentWimpAPI('all-plugin-loaders')
    // Can be called now as the plugins have been loaded, and show-plugin is not being shown yet so it does not matter
    // Wimp.init()
}
