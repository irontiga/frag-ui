// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...NOT set via this
import { loadStateFromLocalStorage } from '../../localStorageHelpers.js'
import { LOAD_CONFIG_FROM_API, STORE_WALLET } from '../../actions/config-actions/config-actions.js'
// import { loadConfigFromAPI } from './loadConfigFromAPI.js'
// Import case reducers
import { loadConfigFromAPI } from './loadConfigFromAPI.js'

const DEFAULT_INITIAL_STATE = {
    styles: {
        theme: {
            color: 'green'
        }
    },
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
        case STORE_WALLET:
            return {
                ...state,
                storedWallets: {
                    ...(state.storedWallets || {}),
                    [action.walletStoreData.address0]: action.walletStoreData
                }
            }
        default:
            return state
    }
}
