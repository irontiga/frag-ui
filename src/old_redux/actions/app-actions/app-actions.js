// export { LOG_IN, LOG_OUT, CREATE_ACCOUNT } from './create-account-actions.js'
export * from './login-actions.js'
export * from './init-worker-actions.js'

export const ADD_PLUGIN_URL = 'ADD_PLUGIN_URL'
export const NAVIGATE = 'NAVIGATE'

// BOUND action craetor
export const doAddPluginUrl = (urlOptions) => {
    return (dispatch, getState) => {
        dispatch(addPluginUrl(urlOptions))
    }
}

// Action creator
export const navigate = loca => {
    // Action
    console.log(loca)
    return {
        type: NAVIGATE,
        url: loca.pathname
    }
}

const addPluginUrl = (urlOptions) => {
    return {
        type: ADD_PLUGIN_URL,
        urlOptions
    }
}

// export const logIn = () => {
//     return { type: LOG_IN }
// }

// export const logOut = () => {
//     return { type: LOG_OUT }
// }
