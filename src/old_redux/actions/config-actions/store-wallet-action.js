export const STORE_WALLET = 'STORE_WALLET'

export const doStoreWallet = (walletStoreData) => {
    return (dispatch, getState) => {
        dispatch(storeWallet(walletStoreData))
    }
}

const storeWallet = walletStoreData => {
    return {
        type: STORE_WALLET,
        walletStoreData
    }
}
