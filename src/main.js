// import '@babel/polyfill'

import 'core-js/es'
import 'regenerator-runtime/runtime'

/* Webcomponents polyfill... https://github.com/webcomponents/webcomponentsjs#using-webcomponents-loaderjs */
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
/* Es6 browser but transpi;led code */
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
// import 'core-js/modules/es.promise.js'
// import 'core-js/modules/es.array.iterator'
import './initStore.js'
import './components/main-app.js'
