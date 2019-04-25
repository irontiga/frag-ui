import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { listenForRequest } from '../../transactionRequest.js'

import '@polymer/paper-dialog/paper-dialog.js'

class ConfirmTransactionDialog extends connect(store)(LitElement) {
    static get properties () {
        return {
            txInfo: { type: Object }
        }
    }

    static get styles () {
        return css`
            
        `
    }

    constructor () {
        super()

        this.txInfo = html``
        listenForRequest(args => this.requestTransaction(args))
    }

    render () {
        return html`
            <style>
                
            </style>

            <paper-dialog>
                <h2>Transaction request</h2>
                <div id="txInfo">
                    ${this.txInfo}
                <div class="buttons">
                    <paper-button @click=${e => this.decline(e)} dialog-dismiss>Decline</paper-button>
                    <paper-button @click=${e => this.confirm(e)} dialog-confirm autofocus>Confirm</paper-button>
                </div>
            </paper-dialog>
        `
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
    }

    requestTransaction (transaction) {
        this.txInfo = transaction.render()
        return new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    confirm (e) {
        this._resolve({
            confirmed: true
        })
    }

    decline (e) {
        this._resolve({
            confirmed: false,
            reason: 'User declined transaction'
        })
    }
}

window.customElements.define('confirm-transaction-dialog', ConfirmTransactionDialog)
