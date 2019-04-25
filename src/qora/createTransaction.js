import { store } from '../store.js'
import { transactions } from './transactions/transactions.js'
import { requestTransaction } from '../transactionRequest.js'

export const processTransaction = bytes => request({
    url: 'transactions/process',
    method: 'POST',
    type: 'api',
    data: Base58.encode(bytes)
})
//
export const CreateTransaction = (type, keyPair, params) => {
    const tx = new transactions[type]()
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })
    tx.keyPair = keyPair
    return requestTransaction(tx)
        .then(response => {
            if (response.confirmed) {
                return tx.signedBytes
            }
        })
}