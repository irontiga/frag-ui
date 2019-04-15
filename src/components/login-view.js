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
                /* html, * {
                    color: var(--color, #333);
                } */
            `
        ]
    }

    render () {
        return html`
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
            </div>


            <div id="ripple">
                <!-- Ripple and spin on login click... can shrink back down and shake if there's an error
                or just fade out if there's success    
            -->
                <div id="spinner"></div>
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
