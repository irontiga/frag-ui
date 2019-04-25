import { parentEpml } from '../connect.js'
import { EpmlStream } from 'epml'

const BLOCK_CHECK_INTERVAL = 3000
const BLOCK_CHECK_TIMEOUT = 3000

export const BLOCK_STREAM_NAME = 'new block'

const onNewBlockFunctions = []

let mostRecentBlock = {
    height: -1
}

export const onNewBlock = newBlockFn => onNewBlockFunctions.push(newBlockFn)

const blockStream = new EpmlStream(BLOCK_STREAM_NAME, () => mostRecentBlock)

export const check = () => {
    const c = doCheck()
    // CHANGE TO Promise.prototype.finally
    c.then(() => {
        setTimeout(() => check(), BLOCK_CHECK_INTERVAL)
    })
    c.catch(() => {
        setTimeout(() => check(), BLOCK_CHECK_INTERVAL)
    })
}

const doCheck = async () => {
    let timeout = setTimeout(() => {
        throw new Error('Block check timed out')
    }, BLOCK_CHECK_TIMEOUT)

    const block = await parentEpml.request('apiCall', {
        type: 'api',
        url: 'blocks/last'
    })
    clearTimeout(timeout)

    const parsedBlock = JSON.parse(JSON.parse(block)) // Dang that's weird lol
    // console.log(parsedBlock, mostRecentBlock)
    if (parsedBlock.height > mostRecentBlock.height) {
        console.log('NNEEEWWW BLLOOCCCKKK')
        mostRecentBlock = parsedBlock
        blockStream.emit(mostRecentBlock)
        onNewBlockFunctions.forEach(fn => fn(mostRecentBlock))
    }
}
