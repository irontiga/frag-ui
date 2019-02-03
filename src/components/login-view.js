import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { logIn } from '../actions/app-actions.js'

import '@material/mwc-button'

// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: 'Boolean' }
        }
    }

    static get styles () {
        return [
            css`
                html, * {
                    color: var(--color, red);
                }
            `
        ]
    }

    render () {
        return html`
            <div>
                <mwc-button>WEOW</mwc-button>
                hello :)
            </div>
        `
    }

    _loginClick (e) {
        logIn()
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
    }
}

window.customElements.define('login-view', LoginView)
