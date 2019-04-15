/* STUFF THAT WE'RE NOT USING RESOLVE...WE'RE IMPORTING THE FILES DIRECTLY */
import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import '../styles/app-styles.js'
// import styles from '../styles/styles.scss'
import './app-view.js'

// console.log('==============')
// console.log(styles)
// console.log('==============')

class MainApp extends connect(store)(LitElement) {
    static get properties () {
        return {
            name: { type: 'String' }
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

    render () {
        return html`
            <app-styles></app-styles>
            <!-- Core layout goes here? Then the log out button can go alongside the log out button...and scale down to it? -->
            <!-- No. login-view will go inside of app-view. Theme, plugin loading, and maybe the web workers will go here. -->

            <app-view></app-view>
<!-- 
            <div class="mdc-layout-grid">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-middle" style="width:400px;">
                        <mwc-button>Login</mwc-button>
                        <mwc-button>Create account</mwc-button>
                        <h1 class="pinko">
                            PINKO
                        </h1>
                    </div>
                </div>
            </div> -->


            <!-- <input type="text" placeholder="name" value="${this.name}" @input=${this._nameChanged}> -->
        `
    }

    _nameChanged (e) {
        // store.dispatch(updateName(e.target.value))
    }

    stateChanged (state) {
        // this.name = state.test.name
        this.loggedIn = state.app.loggedIn
    }
}

window.customElements.define('main-app', MainApp)
