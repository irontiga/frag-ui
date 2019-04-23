import { Epml } from '../../../epml.js'
import { EpmlWorkerPlugin } from 'epml'
Epml.registerPlugin(EpmlWorkerPlugin)

export const INIT_WORKERS = 'INIT_WORKERS'

export const doInitWorkers = (numberOfWorkers, workerURL) => {
    const workers = []
    return (dispatch, getState) => {
        dispatch(initWorkers()) // loading
        try {
            for (let i = 0; i < numberOfWorkers; i++) {
                workers.push(new Epml({ type: 'WORKER', source: new Worker(workerURL) }))
            }
            Promise.all(workers.map(workerEpml => workerEpml.ready()))
                .then(() => {
                    // console.log('All workers ready')
                    dispatch(initWorkers('success', workers))
                })
        } catch (e) {
            dispatch(initWorkers('error', e))
        }
    }
}
const initWorkers = (status, payload) => {
    return {
        type: INIT_WORKERS,
        status,
        payload
    }
}