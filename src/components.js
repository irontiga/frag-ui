// All these paths are resolved BEFORE building. Rollup handles things for the client side.

// There are imports which append themselves to the dom and export that specific instance. There are purely meant to be used as an api, rather than as a component
const componentFunctions = {
    'loading-ripple': {
        file: 'components/loading-ripple.js'
    },
    'toast': {
        file: 'components/toast.js'
    },
    'confirm-transaction-dialog': {
        file: 'components/confirm-transaction-dialog'
    }
}

// This is the actual app structure. Each component is given access to itself I guess, after being loaded via dynamic import or systemjs
const componentTree = {
    'main-app': {
        file: 'components/main-app.js',
        children: {
            'app-styles': {
                file: 'styles/app-styles.js',
                children: {
                    'app-theme': {
                        file: 'styles/app-theme.js'
                    }
                }
            },
            'app-view': {
                file: 'components/app-view.js',
                children: {
                    'show-plugin': {
                        file: 'components/show-plugin.js'
                    },
                    'sidenav-menu': {
                        file: 'components/sidenav-menu.js'
                    },
                    'wallet-profile': {
                        file: 'components/wallet-profile.js'
                    }
                }
            },
            'login-view': {
                file: 'components/login-view/login-view.js',
                children: {
                    'create-account-section': {
                        file: 'components/login-view/create-account-section.js'
                    },
                    'login-section': {
                        file: 'components/login-view/login-section.js'
                    }
                }
            },
            'confirm-transaction-dialog': {} // Perhaps should be more like the login loading ripple? Add itself to the dom and exports a reference. Mmm
        }
    }
    // confirm-transaction-dialog and loading-ripple goes here? Split up the element and the api? Nah, the element is the api
}

// import './create-account-section.js'
// import './login-section.js'

export { componentTree, componentFunctions }
