/* STUFF THAT WE'RE NOT USING RESOLVE...WE'RE IMPORTING THE FILES DIRECTLY */
import { LitElement, html } from 'lit-element'
import { installRouter } from 'pwa-helpers/router.js'
// import { LitElement, html, css, unsafeCSS } from 'lit-element'
// Feel like I need to use sass for every element and just import it all individually...may result in some duplicate sass I guess
// ...but maybe the bundler can be smart...doubt it
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doNavigate } from '../redux/app/app-actions.js'
import '../plugins/streams.js'

import '../styles/app-styles.js'
// import styles from '../styles/styles.scss'
// import './app-view.js'
import './login-view/login-view.js'

// import('./app-view.js') // Async
import './app-view.js' // Screw em then, let's make ff work

installRouter((location) => store.dispatch(doNavigate(location)))

// console.log('==============')
// console.log(styles)
// console.log('==============')

class MainApp extends connect(store)(LitElement) {
    static get properties () {
        return {
            name: { type: 'String' },
            loggedIn: { type: Boolean }
        }
    }

    static get styles () {
        return [
            // css`
            //     ${unsafeCSS(styles)}
            // `
            // css(styles)
        ]
    }

    // constructor () {
    //     super()
    // }
    //  ?hidden=${!this.loggedIn}
    render () {
        return html`
            <app-styles></app-styles>
            <!-- Core layout goes here? Then the log out button can go alongside the log out button...and scale down to it? -->
            <!-- No. login-view will go inside of app-view. Theme, plugin loading, and maybe the web workers will go here. -->
            
            <login-view></login-view>
            
            <app-view></app-view> <!-- Might dynamic import this one... YUP DEFINITELY :) -->
            

            <!-- <input type="text" placeholder="name" value="${this.name}" @input=${this._nameChanged}> -->
        `
    }

    _nameChanged (e) {
        // store.dispatch(updateName(e.target.value))
    }

    stateChanged (state) {
        // this.name = state.test.name
        this.loggedIn = state.app.loggedIn
        document.title = state.config.coin.name
    }

    connectedCallback () {
        super.connectedCallback()
    }
}

window.customElements.define('main-app', MainApp)
