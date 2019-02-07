import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import Epml from 'epml/src/Epml.js'

import './app-view.js'
import './app-theme.js'

class MainApp extends connect(store)(LitElement) {
    static get properties () {
        return {
            name: { type: 'String' }
        }
    }

    static get styles () {
        return [
            css`

            `
        ]
    }

    render () {
        return html`
            <app-theme></app-theme>
            <!-- Core layout goes here? Then the log out button can go alongside the log out button...and scale down to it? -->
            <!-- No. login-view will go inside of app-view. Theme, plugin loading, and maybe the web workers will go here. -->

            <app-view></app-view>

            <!-- <input type="text" placeholder="name" value="${this.name}" @input=${this._nameChanged}>

            <iframe src="http://i7-16gb-hp-laptop:9087/plugins/wallet/index.html" id="walletFrame"></iframe> -->
        `
    }

    firstUpdated () {
        console.log(this)
        // this._walletEpml = new Epml(this.shadowRoot.getElementById('walletFrame'))
        console.log(this._walletEpml)
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
