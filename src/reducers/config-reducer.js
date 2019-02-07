// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...NOT set via this
import { loadStateFromLocalStorage } from '../localStorageHelpers.js'
import { LOAD_CONFIG_FROM_API } from '../actions/config-actions.js'

const DEFAULT_INITIAL_STATE = {
    theme: {
        color: 'green'
    },
    user: {
        language: 'english',
        theme: 'light'
    },
    loaded: false
}

export default (state = loadStateFromLocalStorage('config') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_CONFIG_FROM_API:
            switch (action.status) {
                case 'success':
                    return {
                        ...action.payload,
                        loaded: true,
                        loading: false
                    }
                case 'error':
                    return {
                        ...state,
                        loaded: false,
                        loading: false
                    }
                default:
                    return {
                        ...state,
                        loading: true
                    }
            }
        default:
            return state
    }
}
