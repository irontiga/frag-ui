export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export const doLogin = (wallet, pin) => {
    return (dispatch, getState) => {
        dispatch(login(wallet, pin))
        // getState().epmlInstances.request('login').. actually rather emit the event via a stream... we'll get there...
    }
}

const login = (wallet, pin) => {
    return {
        type: LOG_IN,
        wallet,
        pin
    }
}