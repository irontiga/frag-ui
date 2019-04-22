import { store } from '../store.js'
import Epml from '../epml.js'
import { ContentWindow as EpmlContentWindow } from 'epml'
import { doAddPlugin } from '../actions/app-actions/plugin-actions.js'

Epml.registerPlugin(EpmlContentWindow)

export const loadPlugins = (plugins, config) => {
    plugins.forEach(plugin => {
        const frame = document.createElement('iframe')
        frame.className += 'pluginJSFrame'
        frame.sandbox = 'allow-scripts allow-same-origin'
        // Why not support http/https, pass the plugin as a location hash
        frame.src = window.location.protocol + '//' + window.location.hostname + ':' + config.plugins.port + '/plugins/plugin-mainjs-loader.html#' + plugin + '/main.js'

        const insertedFrame = window.document.body.appendChild(frame)

        store.disptach(doAddPlugin(new Epml({
            type: 'WINDOW',
            source: insertedFrame
        })))
        // Wimp.registerTarget(plugin, insertedFrame.contentWindow)
    })

    // Wimp.registerTarget('all-plugin-loaders', plugins)

    // this.wimps.pluginLoader = parentWimpAPI('all-plugin-loaders')
    // Can be called now as the plugins have been loaded, and show-plugin is not being shown yet so it does not matter
    // Wimp.init()
}
