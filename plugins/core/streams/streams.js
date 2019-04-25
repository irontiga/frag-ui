import { parentEpml } from '../connect.js'
import { AddressWatcher } from './AddressWatcher.js'
import { UnconfirmedTransactionWatcher } from './UnconfirmedTransactionWatcher.js'

import { onNewBlock, check } from './onNewBlock.js'

const addrWatcher = new AddressWatcher()
const txWatcher = new UnconfirmedTransactionWatcher()

parentEpml.subscribe('logged_in', async isLoggedIn => {
    if (isLoggedIn === 'true') {
        // console.log('"logged_in stream" in core/main.js', isLoggedIn)
        const addresses = await parentEpml.request('addresses')
        const parsedAddress = JSON.parse(addresses)
        // console.log(parsedAddress)
        addrWatcher.reset()
        parsedAddress.forEach(addr => addrWatcher.addAddress(addr))
        txWatcher.reset()
        parsedAddress.forEach(addr => txWatcher.addAddress(addr))
    }
})

onNewBlock(block => {
    console.log('New block', block)
    addrWatcher.testBlock(block)
})
check()
