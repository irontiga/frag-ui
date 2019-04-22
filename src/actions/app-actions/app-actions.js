// export { LOG_IN, LOG_OUT, CREATE_ACCOUNT } from './create-account-actions.js'
export * from './login-actions.js'
export * from './init-worker-actions.js'

export const ADD_PLUGIN_URL = 'ADD_PLUGIN_URL'

export const doAddPluginUrl = (urlOptions) => {
    return (dispatch, getState) => {
        dispatch(addPluginUrl(urlOptions))
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
