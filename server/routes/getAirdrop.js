const db = require('../db.js')
const fetch = require('node-fetch')

const config = require('../../config/config-loader.js')

const pendingRegisteredNames = db.addCollection('pendingRegisteredNames')

const airdropNode = config.coin.node.airdrop
const airdropBaseUrl = airdropNode.protocol + '://' + airdropNode.domain + ':' + airdropNode.port

const apiNode = config.coin.node.api

const timeTillExpire = 60 * 1000

setInterval(() => {
    const pendingNames = pendingRegisteredNames.find()
    const expiryTime = Date.now() - timeTillExpire
    pendingNames.forEach(item => {
        if (item.time > expiryTime) {
            pendingRegisteredNames.remove(item)
        }
    })
}, 60 * 1000) // Every minute

const checkName = async name => {
    const dbLookup = pendingRegisteredNames.find({ name })
    if (dbLookup.length > 0) {
        return {
            success: false,
            errorMessage: 'Name is pending registration. If it is unclaimed you can try again in 10 minutes'
        }
    }

    const url = apiNode.url + apiNode.tail + 'names/' + name
    const nameInfo = await fetch(url).then(res => res.json())
    console.log(nameInfo)
    if (nameInfo.owner) {
        return {
            success: false,
            errorMessage: 'Name already registered'
        }
    }
    return {
        success: true
    }
}

const claimAirdrop = address => {
    const url = airdropBaseUrl + airdropNode.url + address
    console.log(url)
    return fetch(url).then(response => response.json())
}

const getAirdrop = async (name, address) => {
    console.log(name, address)
    const check = await checkName(name)
    if (!check.success) {
        return check
    }

    let airdrop
    try {
        airdrop = await claimAirdrop(address)
    } catch (e) {
        console.log(e)
        return {
            success: false,
            errorMessage: e
        }
    }

    if(airdrop.error) {
        return {
            success: false,
            errorMessage: airdrop.error
        }
    }

    console.log(airdrop)

    pendingRegisteredNames.insert({
        name,
        time: Date.now()
    })

    return {
        success: true
    }
}

module.exports = getAirdrop
