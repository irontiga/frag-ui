import { store } from '../store.js'
import { doAddPluginUrl } from '../actions/app-actions/app-actions.js'
import { api } from '../qora/api.js'

export const routes = {
    'hello': async req => {
        return 'Hello from awesomeness'
    },

    'pluginsLoaded': async req => {
        // Hmmm... not sure what this one does
    },

    'registerUrl': async req => {
        const { url, title, menus, icon, page, parent = false } = req
        store.dispatch(doAddPluginUrl({
            url,
            title,
            menus,
            icon,
            page,
            parent
        }))
    },

    'registerTopMenuModal': async req => {
        // const { icon, frameUrl, text } = req
        // Leave as not implemented for now, don't need cause we are using a normal page for send money...better on mobile
    },

    'addMenuItem': async req => {
        // I assume this is...idk
    },

    'apiCall': async req => {
        return api(req)
    },

    'addresses': async req => {
        return store.getState().app.wallet.addresses.map(address => {
            return {
                address: address.address,
                color: address.color,
                nonce: address.nonce,
                textColor: address.textColor
            }
        })
    },

    // Singular
    'address': async req => {
        // nvm
    },

    'transaction': async req => {
        // One moment please...this requires templates in the transaction classes
    }
}