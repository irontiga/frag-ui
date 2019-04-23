// Loading state, login state, isNavDrawOpen state etc. None of this needs to be saved to localstorage.
import { LOG_IN, LOG_OUT, INIT_WORKERS, ADD_PLUGIN_URL, ADD_PLUGIN, NAVIGATE } from './app-actions.js'
// import { initWorkersReducer } from './initWorkersReducer.js'
import { initWorkersReducer } from './reducers/init-workers.js'

const INITIAL_STATE = {
    loggedIn: false,
    drawerOpen: false,
    workers: {
        workers: [],
        ready: false,
        loading: false
    },
    wallet: {
        addresses: [
            {
                address: ''
            }
        ]
    },
    plugins: [],
    registeredUrls: [],
    url: ''
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INIT_WORKERS:
            return initWorkersReducer(state, action)
        case LOG_IN:
            return {
                ...state,
                wallet: action.wallet,
                pin: action.pin, // Probably shouldn't store this plain text...ever. Better store a quick hash... stops someone from peeping your pin...not that that's the vital part
                loggedIn: true
            }
        case LOG_OUT:
            return {
                ...state,
                loggedIn: false,
                wallet: INITIAL_STATE.wallet
            }
        case ADD_PLUGIN:
            return {
                ...state,
                plugins: [
                    ...state.plugins,
                    action.payload
                ]
            }
        case ADD_PLUGIN_URL:
            return {
                ...state,
                registeredUrls: {
                    ...state.registeredUrls,
                    [action.payload.url]: action.payload
                }
            }
        case NAVIGATE:
            return {
                ...state,
                url: action.url
            }
        default:
            return state
    }
}
