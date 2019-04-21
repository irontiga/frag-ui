
import { kdf } from './kdf.js'
import PhraseWallet from './PhraseWallet.js'
import Base58 from './deps/Base58.js'

export const createWallet = async (_this, { saveToLocalstorage = false, seedType, seed }) => {
    let version
    switch (seedType) {
        case 'phrase':
            version = 2
            seed = await kdf(seed, void 0, (status) => {
                _this.rippleLoadingMessage = status
            })
            break
        case 'seed':
            seed = Base58.decode(this.generationSeed)
            break
    }
    console.log('making wallet')
    const wallet = new PhraseWallet(seed, version)
    console.log('returning wallet')
    return wallet
}
