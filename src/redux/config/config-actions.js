export const LOAD_CONFIG_FROM_API = 'LOAD_CONFIG_FROM_API'

const configUrl = '/getConfig'

// This is an action creator... it takes dispatch and getState, and then uses dispatch to dispatch the actual action. loadConfigFromAPI is the actual action
export const doLoadConfigFromAPI = () => {
    console.log('do load config')
    return (dispatch, getState) => {
        // console.log(getState().config.loaded, 'test1')
        if (getState().config.loaded) return dispatch(loadConfigFromAPI('success')) // Already loaded :)..not needed...this could still be used to reset config from the api
        dispatch(loadConfigFromAPI())
        fetch(configUrl)
            .then(res => res.json())
            .then(data => dispatch(loadConfigFromAPI('success', data.config)))
            .catch(err => {
                console.error(err)
                dispatch(loadConfigFromAPI('error', err))
            })
    }
}

const loadConfigFromAPI = (status, payload) => {
    return {
        type: LOAD_CONFIG_FROM_API,
        status,
        payload
    }
}
