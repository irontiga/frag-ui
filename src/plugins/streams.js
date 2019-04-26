import { store } from '../store.js'
import { EpmlStream } from 'epml'

const LOGIN_STREAM_NAME = 'logged_in'
const CONFIG_STREAM_NAME = 'config'
const SELECTED_ADDRESS_STREAM_NAME = 'selected_address'

export const loggedInStream = new EpmlStream(LOGIN_STREAM_NAME, () => store.getState().app.loggedIn)
export const configStream = new EpmlStream(CONFIG_STREAM_NAME, () => store.getState().config)
export const selectedAddressStream = new EpmlStream(SELECTED_ADDRESS_STREAM_NAME, () => store.getState().app.selectedAddress)

const INTERVAL = 10 * 60 * 1000 // 10 minutes

let oldState = {
    app: {}
}

let pingInterval = setInterval(() => {}, INTERVAL)

// protocol: 'http',
//     domain: '127.0.0.1',
//         port: 4999,
//             url: '/airdrop/',
//                 dhcpUrl: '/airdrop/ping/'

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

        clearInterval(pingInterval)
        const fn = () => {
            console.log('PINGING DHCP')
            if (!state.app.selectedAddress.address) return
            const node = store.getState().config.coin.node.airdrop
            const url = node.protocol + '://' + node.domain + ':' + node.port + node.dhcpUrl + state.app.wallet.addresses[0].address
            console.log(url)
            fetch(url).then(res => console.log('Ping resonse', res)).catch(err => console.error('Ping error', err))
        }
        pingInterval = setInterval(fn, INTERVAL)
        fn()
    }
    oldState = state
})
