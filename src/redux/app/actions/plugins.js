// import { addPluginRoutes } from '../../../plugins/addPluginRoutes.js'

export const ADD_PLUGIN_URL = 'ADD_PLUGIN_URL'
export const ADD_PLUGIN = 'ADD_PLUGIN'

// BOUND action creator
export const doAddPluginUrl = (urlOptions) => {
    return (dispatch, getState) => {
        dispatch(addPluginUrl(urlOptions))
    }
}

const addPluginUrl = (payload) => {
    return {
        type: ADD_PLUGIN_URL,
        payload
    }
}

export const doAddPlugin = (epmlInstance) => {
    // Add the appropriate routes here
    return (dispatch, getState) => {
        dispatch(addPlugin(epmlInstance))
    }
}

const addPlugin = (epmlInstance) => {
    return {
        type: ADD_PLUGIN,
        instance: epmlInstance
    }
}
