export const loadConfigFromAPI = (state, action) => {
    switch (action.status) {
        case 'success':
            console.log('success!!!', action)
            return {
                ...action.payload, // This is the new initial state
                loaded: true,
                loading: false
            }
        case 'error':
            return {
                ...state,
                loaded: false,
                loading: false,
                loadingError: action.payload
            }
        default:
            return {
                ...state,
                loading: true
            }
    }
}
