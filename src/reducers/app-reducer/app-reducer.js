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
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INIT_WORKERS:
            return initWorkersReducer(state, action)
        case LOG_IN:
            return {
                ...state,
                loggedIn: true
            }
        case LOG_OUT:
            return {
                ...state,
                loggedIn: false
            }
        default:
            return state
    }
}
