// import { Epml, EpmlWorkerPlugin } from 'epml/src/epml.all.js'
import { Epml, EpmlReadyPlugin, RequestPlugin, EpmlWorkerPlugin } from 'epml'

import utils from './qora/deps/utils.js'
// import { STATIC_SALT, STATIC_BCRYPT_SALT } from './qora/constants.js' // Get these by asking the parent...or just pass them along with the request or whatever. Yup, pass em along
// import { HmacSha512, AES_CBC, Sha512, base64_to_bytes, bytes_to_base64 } from "asmcrypto.js"
import { Sha512, bytes_to_base64 as bytesToBase64 } from 'asmcrypto.js' // Cause the linter is overly eager...
import bcrypt from 'bcryptjs'

Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)
Epml.registerPlugin(EpmlWorkerPlugin)

// console.log('HIIIII IN THE WORKERRRR')

const parentEpml = new Epml({type: 'WORKER', source: self})

parentEpml.route('kdf', async req => {
    // console.log(req)
    const { salt, key, nonce, staticSalt, staticBcryptSalt } = req.data
    const combinedBytes = utils.appendBuffer(salt, utils.stringtoUTF8Array(staticSalt + key + nonce))
    const sha512Hash = new Sha512().process(combinedBytes).finish().result
    const sha512HashBase64 = bytesToBase64(sha512Hash)
    const result = bcrypt.hashSync(sha512HashBase64.substring(0, 72), staticBcryptSalt)
    return { key, nonce,result
    }
})

parentEpml.imReady()
