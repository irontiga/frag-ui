const config = {
    version: process.env.npm_package_version,
    coin: {
        name: 'Frag',
        addressCount: 1,
        addressVersion: 58, // Q for Qora
        node: {
            explorer: {
                // url: "http://127.0.0.1:9090", // Qora
                url: 'http://127.0.0.1:4940', // Karma
                tail: '/index/blockexplorer.json'
            },
            api: {
                // url: "http://127.0.0.1:9085", // Qora
                url: 'http://127.0.0.1:4930', // Karma
                tail: '/'
            }
        },
        decimals: 100000000
    },
    user: {
        language: 'english', // default...english
        theme: 'light' // maybe could become dark
    },
    styles: {
        breakpoints: {
            tablet: "",
            desktop: "",
            mobile: ""
        },
        theme: {
            colors: {
                primary: '#1a237e', /* Sets the text color to the theme primary color. */
                primaryBg: '#e8eaf6', /* Sets the background color to the theme primary color. */
                onPrimary: '#fff', /* Sets the text color to the color configured for text on the primary color. */

                secondary: '#f06292', /* Sets the text color to the theme secondary color. */
                secondaryBg: '#fce4ec', /* Sets the background color to the theme secondary color. */
                onSecondary: '#000000', /* Sets the text color to the color configured for text on the secondary color. */

                surface: '#fff', /* Sets the background color to the surface background color. */
                onSurface: '#333', /* Sets the text color to the color configured for text on the surface color. */
                background: '#efefe'/* Sets the background color to the theme background color. */
            },

            addressColors: [
                '#256480',
                '#002530',
                '#02564e',
                '#d32f2f',
                '#795548',
                '#004d40',
                '#006064',
                '#9c27b0',
                '#2196f3',
                '#d81b60'
            ]
        }
    },
    server: {
        primary: {
            domain: '127.0.0.1',
            port: 9086, // Port to access the Qora UI from
            directory: './src/', // Core Qora-lite code.,
            page404: './src/404.html',
            host: '0.0.0.0', // This probably shouldn't be the default...
            baseURL: 'frag'
        },
        plugins: {
            domain: '127.0.0.1',
            port: 9087, // Port for plugins to be loaded from. User will never interact with this port
            directory: './plugins', // Where the plugin folders are stored,
            default: 'wallet',
            host: '0.0.0.0'
        }
    },

    icon: './src/img/icon.png',
    // Might be better increased over a weaker or metered connection, or perhaps lowered when using a local node4
    tls: {
        enabled: false,
        options: {
            key: '',
            cert: ''
        }
    },
    constants: {
        pollingInterval: 3000, // How long between checking for new unconfirmed transactions and new blocks (in milliseconds).
        proxyURL: '/proxy/',
    },
    crypto: {
        kdfThreads: 16,
        staticSalt: '4ghkVQExoneGqZqHTMMhhFfxXsVg2A75QeS1HCM5KAih', // Base58 encoded
        bcryptRounds: 10,
        staticBcryptSalt: '$IxVE941tXVUD4cW0TNVm.O' // Will have version/rounds pre-pended
    }
}

module.exports = config
