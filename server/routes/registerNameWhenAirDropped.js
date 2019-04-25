// Server probably more reliable than user
const fetch = require('node-fetch')
const config = require('../../config/config-loader.js')

const CHECK_LAST_REF_INTERVAL = 30 * 1000 // err 30 seconds

const pendingNames = {}

const registerNameWhenAirdropped = (address, signedBytes) => {
    pendingNames[address] = signedBytes
}

const node = config.coin.node.api
const baseUrl = node.url + node.tail

const checkLastRefs = () => {
    Object.entries(pendingNames).forEach(([address, signedBytes]) => {
        fetch(baseUrl + 'addresses/lastreference/', address)
            .then(async res => res.text())
            .then(res => {
                if (res === 'false') return
                fetch(baseUrl + 'transactions/process', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: signedBytes
                })

            })
    })
}

setInterval(() => checkLastRefs(), CHECK_LAST_REF_INTERVAL)

module.exports = registerNameWhenAirdropped
