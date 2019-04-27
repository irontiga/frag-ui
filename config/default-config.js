const config = {
    version: process.env.npm_package_version,
    coin: {
        name: 'Frag',
        baseUrl: 'frag',
        symbol: 'FRG',
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
            },
            airdrop: {
                protocol: 'http',
                domain: '127.0.0.1',
                port: 4999,
                url: '/airdrop/',
                dhcpUrl: '/airdrop/ping/',
                pingInterval: 10 * 60 * 1000
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
            tablet: '',
            desktop: '',
            mobile: ''
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
                background: '#efefe', /* Sets the background color to the theme background color. */

                warning: '#FFA000',
                error: '#F44336'
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
        },
        // Will make theme be calculated from config.styles.themes[config.user.theme]... or make theme the base..so it becomes theme = {...config.styles.theme, ...config.styles.themes[config.user.theme]}
        themes: {
            light: {
                // ...
            },
            dark: {
                // ...
            }
            // And more... perhaps installable or user definable, like slack (...used to be? haven't been on it in ages)
        }
    },
    server: {
        primary: {
            domain: '127.0.0.1',
            port: 9086, // Port to access the Qora UI from
            directory: './src/', // Core Qora-lite code.,
            page404: './src/404.html',
            host: '0.0.0.0' // This probably shouldn't be the default...
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
        workerURL: '/build/es6/worker.js'
    },
    crypto: {
        kdfThreads: 16,
        staticSalt: '4ghkVQExoneGqZqHTMMhhFfxXsVg2A75QeS1HCM5KAih', // Base58 encoded
        bcryptRounds: 11, // Note it's kinda 10 * log.2.16, cause it runs on all 16 threads
        bcryptVersion: '2a',
        get staticBcryptSalt () {
            return `$${this.bcryptVersion}$${this.bcryptRounds}$IxVE941tXVUD4cW0TNVm.O`
        }
    }
}

module.exports = config
