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
import { store } from '../store.js'

// export const request = (options) => {
//     options.url = options.url || ''
//     options.method = options.method || 'GET'

//     options.node = store.getState().config.coin.node
//     // options.node = window.App.config.qoraNode

//     const node = options.node[options.type]
//     let url = store.getState().config.constants.proxyURL + node.url + node.tail + options.url

//     if (options.method === 'GET' && options.data && Object.entries(options.data).length > 0) {
//         url += '?'
//         url += Object.entries(options.data).map(([key, value]) => {
//             return encodeURIComponent(key) + '=' + encodeURIComponent(value)
//         }).join('&')
//     }

//     const postData = options.method === 'POST' ? {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(options.data)
//     } : void 0
//     console.log('fetching', window.location.origin + url, postData)
//     return fetch(window.location.origin + url, postData).then(response => {
//         console.warn(response)
//         if (options.type === 'explorer') {
//             return response.json().then(data=> {
//                 if (data.error) throw new Error(data.error)
//                 data.success = true
//                 return data
//             })
//         }
//     })
// }

export const request = (options) => {
    options.url = options.url || ''
    options.method = options.method || 'GET'

    options.node = store.getState().config.coin.node
    // options.node = window.App.config.qoraNode

    const node = options.node[options.type]
    let url = store.getState().config.constants.proxyURL + node.url + node.tail + options.url
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
            console.log(url + params)
            xhttp.open(options.method, url + params, true)
            xhttp.send()
        } else {
            // Otherwise it's post, so send it as data. Doesn't even have to be an object
            xhttp.open(options.method, url, true)
            xhttp.setRequestHeader('Accept', 'application/json')
            console.log(options)
            xhttp.send(options.data)
        }
    })
}
