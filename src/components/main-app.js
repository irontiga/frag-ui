import { LitElement, html } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { updateName } from '../actions/actions.js'

class MainApp extends connect(store)(LitElement) {
    static get properties () {
        return {
            name: { type: 'String' }
        }
    }
    render () {
        return html`
            Hello ${this.name} :)
            <input type="text" placeholder="name" value="${this.name}" @input=${this._nameChanged}>`
    }

    _nameChanged (e) {
        store.dispatch(updateName(e.target.value))
    }

    stateChanged (state) {
        this.name = state.test.name
    }
}

window.customElements.define('main-app', MainApp)
