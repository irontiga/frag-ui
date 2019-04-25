import transactions from './transactions/transactions.js'
import { request as _request } from './request.js'
import Base58 from './deps/Base58.js'

export { transactions }

export const request = {
    api: options => {
        options.type = 'api'
        return _request(options)
    },
    explorer: options => {
        options.type = 'explorer'
        return _request(options).then(grr => {
            console.log('GRRR', grr)
            return grr
        })
    },
    _request
}

export const processTransaction = bytes => request({
    url: 'transactions/process',
    method: 'POST',
    type: 'api',
    data: Base58.encode(bytes)
})

export const createTransaction = (type, keyPair, params) => {
    const tx = new transactions[type]()
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })
    tx.keyPair = keyPair
    return tx.signedBytes
}
