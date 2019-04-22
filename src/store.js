import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Base58 from './qora/deps/Base58.js'

import reducers from './reducers/reducers.js'

import { doLoadConfigFromAPI } from './actions/config-actions/config-actions.js'
import { doInitWorkers } from './actions/app-actions/init-worker-actions.js'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

window.Base58 = Base58
export const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
)

const workerInitChecker = () => {
    const state = store.getState()
    // console.log('store changed', state)
    // Once config is loaded set up the workers
    if (state.config.loaded) {
        // Once the workers are loaded we can get rid of this subscription (clean up)
        if (state.app.workers.ready) {
            // console.log('unsubbing')
            workerInitSubscription() // unsubscribes
        } else {
            // Make sure it isn't busy at the moment and go set them up
            // console.log('Dispatching worker initialization')
            if (!state.app.workers.loading) store.dispatch(doInitWorkers(state.config.crypto.kdfThreads, state.config.constants.workerURL))
            // if (!state.app.workers.loading) store.dispatch(doInitWorkers(16))
        }
    }
}
workerInitChecker()
const workerInitSubscription = store.subscribe(workerInitChecker)

if (!store.getState().config.loaded) store.dispatch(doLoadConfigFromAPI())
