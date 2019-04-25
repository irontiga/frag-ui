import { store } from '../store.js'
import { EpmlStream } from 'epml'

const LOGIN_STREAM_NAME = 'logged_in'
const CONFIG_STREAM_NAME = 'config'
const SELECTED_ADDRESS_STREAM_NAME = 'selected_address'

export const loggedInStream = new EpmlStream(LOGIN_STREAM_NAME, () => store.getState().app.loggedIn)
export const configStream = new EpmlStream(CONFIG_STREAM_NAME, () => store.getState().config)
export const selectedAddressStream = new EpmlStream(SELECTED_ADDRESS_STREAM_NAME, () => store.getState().app.selectedAddress)

let oldState = {
    app: {}
}
store.subscribe(() => {
    const state = store.getState()
    if (oldState.app.loggedIn !== state.app.loggedIn) {
        loggedInStream.emit(state.app.loggedIn)
    }
    // This one may be a little on the heavy side...AHHH, NEED TO MOVE STORAGE OF ENCRYPTED SEED. DONE <3
    if (oldState.config !== state.config) {
        configStream.emit(state.config)
    }
    if (oldState.app.selectedAddress !== state.app.selectedAddress) {
        console.log('Selected address changed')
        // selectedAddressStream.emit(state.selectedAddress)
        selectedAddressStream.emit({
            address: state.app.selectedAddress.address,
            color: state.app.selectedAddress.color,
            nonce: state.app.selectedAddress.nonce,
            textColor: state.app.selectedAddress.textColor
        })
    }
    oldState = state
})
