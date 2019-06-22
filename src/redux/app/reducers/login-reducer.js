// export const loginReducer = (state, action) => {
//     switch (action.status) {
//         case 'success':
//             return {
//                 ...state,
//                 wallet: action.payload.wallet,
//                 pin: action.payload.pin, // Probably shouldn't store this plain text...ever. Better store a quick hash... stops someone from peeping your pin...not that that's the vital part
//                 loggedIn: true,
//                 loggingIn: false
//             }
//         case 'error':
//             return {
//                 ...state,
//                 pin: '',
//                 loggedIn: false,
//                 loggingIn: false
//             }
//         // Nah, excessive store updates, unnecessary
//         // case 'progress':
//         //     return {
//         //         ...state,
//         //         loggedIn: false,
//         //         logginIn: true,
//         //         loginProgress: action.payload
//         //     }
//         default:
//             return {
//                 ...state,
//                 loggingIn: true
//             }
//     }
// }

export const loginReducer = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...state,
                wallet: action.payload.wallet,                loggedIn: true,
                loggingIn: false
            }
        case 'error':
            return {
                ...state,
                loggedIn: false,
                loggingIn: false
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
                loggingIn: true
            }
    }
}
