// PhraseWallet storage and storing them in localstorage etc
import { loadStateFromLocalStorage } from '../localStorageHelpers.js'

const DEFAULT_INITIAL_STATE = {
    encryptedSeeds: []
}

export default (state = loadStateFromLocalStorage('account') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state
    }
}
