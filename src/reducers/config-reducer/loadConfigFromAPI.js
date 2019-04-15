export const loadConfigFromAPI = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...action.payload, // This is the initial state as loaded from the api
                loaded: true,
                loading: false
            }
        case 'error':
            return {
                ...state,
                loaded: false,
                loading: false
            }
        default:
            return {
                ...state,
                loading: true
            }
    }
}
