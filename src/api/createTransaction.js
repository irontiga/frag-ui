import { transactionTypes } from './transactions/transactions.js'
import { requestTransaction } from '../transactionRequest.js'
import { processTransaction } from './processTransaction.js'

export const createTransaction = (type, keyPair, params) => {
    const tx = new transactionTypes[type]()
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })
    tx.keyPair = keyPair
    return requestTransaction(tx)
        .then(response => {
            if (!response.confirmed) {
                return {
                    success: false,
                    reason: response.reason
                }
            }
            const signedBytes = tx.signedBytes
            return processTransaction(signedBytes)
        })
}
