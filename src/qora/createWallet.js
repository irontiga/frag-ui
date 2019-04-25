
import { kdf } from './kdf.js'
import PhraseWallet from './PhraseWallet.js'
import Base58 from './deps/Base58.js'
import { decryptStoredWallet } from './decryptStoredWallet.js'

export const createWallet = async (sourceType, source, statusUpdateFn) => {
    let version, seed
    switch (sourceType) {
        case 'phrase':
            version = 2
            seed = await kdf(source, void 0, statusUpdateFn)
            break
        case 'seed':
            seed = Base58.decode(source)
            break
        case 'storedWallet':
            seed = await decryptStoredWallet(source.password, source.wallet, statusUpdateFn)
    }
    // console.log('making wallet')
    const wallet = new PhraseWallet(seed, version)
    // console.log('returning wallet')
    return wallet
}
