import { UPDATE_NAME } from '../actions/test-actions.js'

const INITIAL_STATE = {
    name: 'irontiga'
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_NAME:
            return {
                ...state,
                name: action.name
            }
        default:
            return state
    }
}
