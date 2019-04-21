import { combineReducers } from 'redux'

import app from './app-reducer/app-reducer.js'
import blockchain from './blockchain-reducer.js'
import config from './config-reducer/config-reducer.js'
import account from './account-reducer.js'

export default combineReducers({
    account,
    app,
    config,
    blockchain
})
