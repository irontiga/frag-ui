import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers/reducers.js'

import { doLoadConfigFromAPI } from './actions/config-actions.js'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
)

if (!store.getState().config.loaded) store.dispatch(doLoadConfigFromAPI())
