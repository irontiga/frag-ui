import { loadStateFromLocalStorage } from '../../localStorageHelpers'
import { STORE_WALLET, CLAIM_AIRDROP, UPDATE_ACCOUNT_INFO } from './user-action-types.js'

const DEFAULT_INITIAL_STATE = {
    storedWallets: {},
    hasClaimedAirdrop: false,
    accountInfo: {}
}

export default (state = loadStateFromLocalStorage('user') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case STORE_WALLET:
            return {
                ...state,
                storedWallets: {
                    ...(state.storedWallets || {}),
                    [action.payload.address0]: action.payload // Overwriting = good. If you forgot your password but remember your seed or whatever.
                }
            }
        case CLAIM_AIRDROP:
            return {
                ...state,
                hasClaimedAirdrop: true
            }
        case UPDATE_ACCOUNT_INFO: {
            return {
                ...state,
                accountInfo: {
                    ...state.accountInfo,
                    ...action.payload
                }
            }
        }
        default:
            return state
    }
}
