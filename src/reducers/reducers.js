import { combineReducers } from 'redux'
import test from './test-reducer.js'
import app from './app-reducer.js'
import blockchain from './blockchain-reducer.js'

export default combineReducers({
    test,
    app,
    blockchain
})
