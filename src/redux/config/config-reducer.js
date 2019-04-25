// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...NOT set via this
import { loadStateFromLocalStorage } from '../../localStorageHelpers'
import { LOAD_CONFIG_FROM_API } from './config-actions.js'
// import { loadConfigFromAPI } from './loadConfigFromAPI.js'
// Import case reducers
// import { loadConfigFromAPI } from './loadConfigFromAPI.js'
import { loadConfigFromAPI } from './reducers/load-config-from-api.js'

const DEFAULT_INITIAL_STATE = {
    styles: {
        theme: {
            color: 'green'
        }
    },
    coin: {
        name: ''
    },
    server: {},
    user: {
        language: 'english',
        theme: 'light'
    },
    savedWallets: {},
    loaded: false
}

export default (state = loadStateFromLocalStorage('config') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_CONFIG_FROM_API:
            return loadConfigFromAPI(state, action)
        default:
            return state
    }
}
