const config = {
    primary: {
        domain: "127.0.0.1",
        port: 9080, // Port to access the Qora UI from
        directory: "./src/", // Core Qora-lite code.,
        page404: "./src/404.html",
        host: "0.0.0.0"
    },
    plugins: {
        domain: "127.0.0.1",
        port: 9081, // Port for plugins to be loaded from. User will never interact with this port
        directory: "./plugins", // Where the plugin folders are stored,
        default: "wallet",
        host: "0.0.0.0"
    },
    icon: "./src/img/icon.png",
    addressColors: [
        "#256480",
        "#002530",
        "#02564e",
        "#d32f2f",
        "#795548",
        "#004d40",
        "#006064",
        "#9c27b0",
        "#2196f3",
        "#d81b60"
    ],
    addressCount: 1,
    qoraNode: {
        explorer: {
            // url: "http://127.0.0.1:9090", // Qora
            url: "http://127.0.0.1:4940", // Karma
            tail: "/index/blockexplorer.json"
        },
        api: {
            // url: "http://127.0.0.1:9085", // Qora
            url: "http://127.0.0.1:4930", // Karma
            tail: "/"
        }
    },
    pollingInterval: 3000,   // How long between checking for new unconfirmed transactions and new blocks (in milliseconds). 
                            // Might be better increased over a weaker or metered connection, or perhaps lowered when using a local node4
    tls: {
        enabled: false,
        options: {
            key: "",
            cert: ""
        }
    }
}

module.exports = config