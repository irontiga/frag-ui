// export const LOG_IN = 'LOG_IN'
// export const LOG_OUT = 'LOG_OUT'
// export const CREATE_ACCOUNT = 'CREATE_ACCOUNT'

// /*
// ACTION UPDATES STATE
// ACTION CREATOR GETS THE INFORMATION/DOES THE STUFF WITH WHICH WE WILL UPDATE THE STATE
// REDUCER JUST INTERPRETS THE DATA FROM THE ACTION AND DIRECTLY MODIFIES THE STATE
// */

// export const doLogin = (seed, version) => {
//     return (dispatch, getState) => {

//     }
// }

// export const doSaveAccount = () => {
//     return (dispatch, getState) => {

//     }
// }

// // Maybe don't need a createAccount action...maybe only login and save, where create account in the ui is just both. Perhaps the seed conversion should be seperate to the state entirely...yes I think so
// // walletVersion 1 or 2... 2 is my, "modern" version, localStorageKey is the key to encrypt it with in local storage
// // progressUpdate fires with the current progress...maybe
// export const doCreateAccount = ({ seed, seedType = 0, walletVersion, saveToLocalstorage, localstorageKey }, progressUpdate) => {
//     return (dispatch, getState) => {
//         const state = getState()
//         dispatch(createAccount('loading', 'Preparing to ...')) // Loading

//     }
// }
// // The actual action itself
// const createAccount = (status, payload) => {
//     return {
//         type: CREATE_ACCOUNT,
//         status,
//         payload
//     }
// }

// const configUrl = '/getConfig'

// // This is an action creator... it takes dispatch and getState, and then uses dispatch to dispatch the actual action. loadConfigFromAPI is the actual action
// export const doLoadConfigFromAPI = () => {
//     return (dispatch, getState) => {
//         if (getState().configLoaded) return dispatch(loadConfigFromAPI('success')) // Already loaded :)..not needed...this could still be used to reset config from the api
//         dispatch(loadConfigFromAPI())
//         fetch(configUrl)
//             .then(res => res.json())
//             .then(data => dispatch(loadConfigFromAPI('success', data.config)))
//             .catch(err => dispatch(loadConfigFromAPI('error', err)))
//     }
// }

// const loadConfigFromAPI = (status, payload) => {
//     return {
//         type: LOAD_CONFIG_FROM_API,
//         status,
//         payload
//     }
// }
