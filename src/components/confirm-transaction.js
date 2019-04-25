import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

class ConfirmTransaction extends connect(store)(LitElement) {
    static get properties () {
        return {

        }
    }

    static get styles () {
        return css`
            
        `
    }

    render () {
        return html`
            <style>
            
            </style>
        `
    }

    stateChanged (state) {
        // this.name = state.test.name
        this.config = state.config
    }
}

window.customElements.define('confirm-transaction', ConfirmTransaction)
