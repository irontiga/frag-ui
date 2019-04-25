// import { addPluginRoutes } from '../../../plugins/addPluginRoutes.js'
import { ADD_PLUGIN, ADD_PLUGIN_URL } from '../app-action-types.js'
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

const addPlugin = (payload) => {
    return {
        type: ADD_PLUGIN,
        payload
    }
}
