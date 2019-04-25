import Base58 from './deps/Base58.js'
import { request } from './request.js'

export const processTransaction = bytes => request({
    url: 'transactions/process',
    method: 'POST',
    type: 'api',
    data: Base58.encode(bytes)
})
