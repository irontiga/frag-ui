import { addPluginRoutes } from '../../plugins/addPluginRoutes.js'
export const ADD_PLUGIN = 'ADD_PLUGIN'

export const doAddPlugin = (epmlInstance) => {
    // Add the appropriate routes here
    addPluginRoutes(epmlInstance)
    epmlInstance.imReady()
    console.log('I\'m ready!')
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