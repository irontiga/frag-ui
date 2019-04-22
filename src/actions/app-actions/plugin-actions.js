export const ADD_PLUGIN = 'ADD_PLUGIN'

export const doAddPlugin (epmlInstance) => {
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