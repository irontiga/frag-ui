import { generateSaveWalletData } from '../../../qora/storeWallet.js'
import { STORE_WALLET, UPDATE_STORED_WALLET_NAME } from '../user-action-types.js'
// import { doStoreWallet } from '../../../redux/user/user-actions.js'

export const doStoreWallet = (wallet, password, name, statusUpdateFn = () => {}) => {
    return (dispatch, getState) => {
        return generateSaveWalletData(wallet, password, getState().config.crypto.kdfThreads, statusUpdateFn).then(data => {
            console.log(data)
            dispatch(storeWallet({
                ...data,
                name
            }))
        })
    }
}

const storeWallet = payload => {
    return {
        type: STORE_WALLET,
        payload
    }
}

export const doUpdateStoredWalletName = (address, name) => {
    return (dispatch, getState) => {
        return updateStoredWalletName({
            address, name
        })
    }
}

const updateStoredWalletName = payload => {
    return {
        type: UPDATE_STORED_WALLET_NAME,
        payload
    }
}
