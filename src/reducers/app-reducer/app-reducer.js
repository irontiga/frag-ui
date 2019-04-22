// Loading state, login state, isNavDrawOpen state etc. None of this needs to be saved to localstorage.
import { LOG_IN, LOG_OUT, INIT_WORKERS } from '../../actions/app-actions/app-actions.js'
import { initWorkersReducer } from './initWorkersReducer.js'

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
    }
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
        default:
            return state
    }
}
