export const initWorkersReducer = (state, action) => {
    // action.payload = new state
    console.log('action', action)
    switch (action.status) {
        case 'success':
            return {
                ...state,
                workers: {
                    ...action.payload,
                    ready: true,
                    loading: false
                }
            }
        case 'error':
            return {
                ...state,
                workers: {
                    ...state.workers,
                    ready: false,
                    loading: false,
                    lastError: action.payload
                }
            }
        default:
            return {
                ...state,
                workers: {
                    ...state.workers,
                    // ready: true,
                    loading: true
                }
            }
    }
}
