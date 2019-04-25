/*
options = {
    type: "explorer/api"
    node: {
        explorer: {
            url: "",
            tail: ""
        },
        api: {
            url: "",
            tail: ""
        }
    },
    url: "",
    data: {}
}
*/

// import { PROXY_URL } from './constants.js'
// REQUIRES window.App.qoraNode (main-app.js, defined in app.js)

import { store } from '../store.js'

/* CONVERT TO USING FETCH YOU DUMBASS */
export const request = (options) => {
    options.url = options.url || '';
    options.method = options.method || 'GET'

    options.node = store.getState().config.coin.node
    // options.node = window.App.config.qoraNode

    const node = options.node[options.type]
    const url = store.getState().config.constants.proxyURL + node.url + node.tail + options.url

    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            // Check the request is complete:
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    let response = xhttp.responseText
                    if (options.type === 'explorer') {
                        response = JSON.parse(response)

                        if (response.error) { return reject(response.error) }

                        response.success = true
                    }
                    resolve(response)
                } else {
                    console.error('SOME ERROR', xhttp.responseText, xhttp.statusText)
                    reject(xhttp.statusText)
                }
            }
        }

        // If it's get then convert data into a query string...
        if (options.method === 'GET') {
            let params = '?';
            // Let's not make errors if there is no data
            options.data = options.data || {}

            params += Object.keys(options.data).map(key => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key])
            }).join('&')

            params = params === '?' ? '' : params // No question mark if no params
            // console.log(options, url, params)
            xhttp.open(options.method, url + params, true)
            xhttp.send()
        } else {
            // Otherwise it's post, so send it as data. Doesn't even have to be an object
            xhttp.open(options.method, url, true)
            xhttp.setRequestHeader('Accept', 'application/json')
            // console.log(options)
            xhttp.send(options.data)
        }
    })
}
