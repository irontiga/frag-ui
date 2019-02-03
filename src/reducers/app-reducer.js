// Loading state, login state, isNavDrawOpen state etc. None of this needs to be saved to localstorage.
import { LOG_IN, LOG_OUT } from '../actions/app-actions.js'

const INITIAL_STATE = {
    loggedIn: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
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
