import { NAVIGATE, NETWORK_CONNECTION_STATUS } from './app-action-types.js'

export * from './actions/login.js'
export * from './actions/init-worker.js'
export * from './actions/plugins.js'

export const doNavigate = loca => {
    return (dispatch, getState) => {
        dispatch(navigate(loca))
    }
}

// Action creator
const navigate = loca => {
    // Action
    // console.log(loca)
    return {
        type: NAVIGATE,
        url: loca.pathname
    }
}

export const updateNetworkConnectionStatus = status => {
    return {
        type: NETWORK_CONNECTION_STATUS,
        payload: status
    }
}

// export const logIn = () => {
//     return { type: LOG_IN }
// }

// export const logOut = () => {
//     return { type: LOG_OUT }
// }
