import { Epml, EpmlReadyPlugin, RequestPlugin } from 'epml/src/epml.all.js'

// Epml.registerPlugin(contentWindowsPlugin)
Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)

export { Epml }
