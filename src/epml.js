import { Epml, EpmlReadyPlugin, RequestPlugin, ContentWindow as EpmlContentWindowPlugin } from 'epml/src/epml.all.js'

// Epml.registerPlugin(contentWindowsPlugin)
Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)
Epml.registerPlugin(EpmlContentWindowPlugin)

export { Epml }
