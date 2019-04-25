export const loginReducer = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...state,
                wallet: action.payload.wallet,
                pin: action.payload.pin, // Probably shouldn't store this plain text...ever. Better store a quick hash... stops someone from peeping your pin...not that that's the vital part
                loggedIn: true,
                logginIn: false
            }
        case 'error':
            return {
                ...state,
                pin: '',
                loggedIn: false,
                logginIn: false
            }
        // Nah, excessive store updates, unnecessary
        // case 'progress':
        //     return {
        //         ...state,
        //         loggedIn: false,
        //         logginIn: true,
        //         loginProgress: action.payload
        //     }
        default:
            return {
                ...state,
                loading: true,
                logginIn: true
            }
    }
}
