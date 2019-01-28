let config = require('../config/default-config.js')
let userConfig = {}
try {
    userConfig = require('../config/config.js')
} catch (e) {
    console.warn('Error loading user config. If you haven\'t created any custom config then this warning can be safely ignored.')
}

const checkKeys = (storeObj, newObj) => {
    for (const key in newObj) {
        if (!storeObj.hasOwnProperty(key)) return

        if (typeof newObj[key] === 'object') {
            storeObj[key] = checkKeys(storeObj[key], newObj[key])
        } else {
            storeObj[key] = newObj[key]
        }
    }
    return storeObj
}

config = checkKeys(config, userConfig)

module.exports = config
