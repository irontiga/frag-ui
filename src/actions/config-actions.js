export const LOAD_CONFIG_FROM_API = 'LOAD_CONFIG_FROM_API'

const configUrl = '/getConfig'

export const doLoadConfigFromAPI = () => {
    return (dispatch, getState) => {
        if (getState().configLoaded) return dispatch(loadConfigFromAPI('success')) // Already loaded :)..not needed...this could still be used to reset config from the api
        dispatch(loadConfigFromAPI())
        fetch(configUrl)
            .then(res => res.json())
            .then(data => dispatch(loadConfigFromAPI('success', data.config)))
            .catch(err => dispatch(loadConfigFromAPI('error', err)))
    }
}

const loadConfigFromAPI = (status, payload) => {
    return {
        type: LOAD_CONFIG_FROM_API,
        status,
        payload
    }
}
