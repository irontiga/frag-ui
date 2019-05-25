const fetch = require('node-fetch')

const config = require('../../config/config-loader.js')
const db = require('../db.js')

const pendingRegisteredNames = db.addCollection('pendingRegisteredNames')

const apiNode = config.coin.node.api

const timeTillExpire = 10 * 60 * 1000 // 10 minutes

setInterval(() => {
    const pendingNames = pendingRegisteredNames.find()
    const expiryTime = Date.now() - timeTillExpire
    pendingNames.forEach(item => {
        if (item.time < expiryTime) {
            pendingRegisteredNames.remove(item)
        }
    })
}, 6 * 1000)
// }, 60 * 1000) // Every minute

const checkName = async name => {
    const dbLookup = pendingRegisteredNames.find({ name })
    console.log(dbLookup)
    if (dbLookup.length > 0) {
        return {
            success: false,
            errorMessage: 'Username is pending registration. If it is unclaimed you can try again in 10 minutes'
        }
    }

    const url = apiNode.url + apiNode.tail + 'names/' + name
    console.log(url)
    const nameInfo = await fetch(url).then(res => res.json())
    console.log('b')
    console.log(nameInfo)
    if (nameInfo.owner) {
        return {
            success: false,
            errorMessage: 'Username already registered'
        }
    }
    return {
        success: true
    }
}

module.exports = checkName
