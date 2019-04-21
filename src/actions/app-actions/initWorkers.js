import { Epml, EpmlWorkerPlugin } from 'epml/src/epml.all.js'
Epml.registerPlugin(EpmlWorkerPlugin)

export const INIT_WORKERS = 'INIT_WORKERS'

export const doInitWorkers = (numberOfWorkers) => {
    const workers = []
    return (dispatch, getState) => {
        dispatch(initWorkers()) // loading
        try {
            for (let i = 0; i < numberOfWorkers; i++) {
                workers.push(new Epml({ type: 'WORKER', source: new Worker('/src/actions/app-actions/worker.js') }))
            }
            dispatch(initWorkers('success', workers))
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