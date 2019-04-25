const fetch = require('node-fetch')

const config = require('../../config/config-loader.js')

const checkName = require('./checkName.js')

const db = require('../db.js')
const pendingRegisteredNames = db.addCollection('pendingRegisteredNames')

const airdropNode = config.coin.node.airdrop
const airdropBaseUrl = airdropNode.protocol + '://' + airdropNode.domain + ':' + airdropNode.port

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

    if (airdrop.error) {
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
        success: true,
        data: airdrop
    }
}

module.exports = getAirdrop
