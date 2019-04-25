import { stateAwait } from '../stateAwait.js'
import { store } from '../store.js'
import { Sha512 } from 'asmcrypto.js'
import utils from '../qora/deps/utils.js'
// import { HmacSha512, AES_CBC, Sha512, base64_to_bytes, bytes_to_base64 } from "asmcrypto.js"

export const kdf = async (seed, salt, status = () => {}) => {
    const state = store.getState()
    const config = state.config
    const workers = state.app.workers.workers
    status('Waiting for workers to be ready')
    await stateAwait(state => state.app.workers.ready)
    status('Deriving key parts')
    salt = new Uint8Array(salt)
    const seedParts = await Promise.all(workers.map((worker, index) => {
        const nonce = index
        return worker.request('kdf', {
            key: seed,
            salt,
            nonce,
            staticSalt: config.crypto.staticSalt,
            staticBcryptSalt: config.crypto.staticBcryptSalt
        }).then(data => {
            // console.log('response:', data)
            data = JSON.parse(data)
            if (seed !== data.key) throw new Error('Error, incorrect key. ' + seed + ' !== ' + data.key)
            if (nonce !== data.nonce) throw new Error('Error, incorrect nonce')
            return data.result
        })
    }))
    status('Combining key parts')
    const result = new Sha512().process(utils.stringtoUTF8Array(config.crypto.staticSalt + seedParts.reduce((a, c) => a + c))).finish().result
    status('Key is ready ')
    return result
}
