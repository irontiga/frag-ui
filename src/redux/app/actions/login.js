// import { doSelectAddress } from '../app-actions.js'

import { createWallet } from '../../../qora/createWallet.js'
import { LOG_IN, LOG_OUT, SELECT_ADDRESS } from '../app-action-types.js'
// export const doLogin = (wallet, pin) => {
/*
    sourceType: 'storedWallet',
    source: {
        wallet,
        password: pin + '' + birthMonth
    }
*/

export const doSelectAddress = address => {
    return (dispatch, getState) => {
        dispatch(selectAddress(address))
    }
}

const selectAddress = address => {
    return {
        type: SELECT_ADDRESS,
        address
    }
}

export const doLogin = (sourceType, source, statusUpdateFn) => {
    return async (dispatch, getState) => {
        dispatch(login())
        return createWallet(sourceType, source, statusUpdateFn)
            .then(wallet => {
                dispatch(login('success', {
                    wallet,
                    pin: source.pin
                }))
                dispatch(selectAddress(wallet._addresses[0]))
                return wallet
            })
            .catch(err => {
                dispatch(login('error', err))
                throw err // Throw it again so that it bubbles
            })
    }
}

const login = (status, payload) => {
    return {
        type: LOG_IN,
        status,
        payload
    }
}

export const doLogout = () => {
    // Maybe add some checks for ongoing stuff...who knows
    return (dispatch, getState) => {
        dispatch(logout())
    }
}

const logout = () => {
    return {
        type: LOG_OUT
    }
}
