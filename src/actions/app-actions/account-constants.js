import Base58 from '../../qora/deps/Base58.js'
window.Base58 = Base58
// Time for workers
const workers = []
// for (const i of Array(7).keys()) {
//     workers.push(new Epml({ type: 'WORKER', source: new Worker('/src/actions/app-actions/worker.js') }))
// }
export { workers }

// console.log(this._walletEpml)

export const seedConverters = {
    'passphrase': seedSource => {

    },
    'seed': seedSource => Base58.decode(seedSource),
    'file': seedSource => {}
}
