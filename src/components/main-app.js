import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { updateName } from '../actions/test-actions.js'
import './login-view.js'
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
        <style>
                /* *, html {
                    --color: ${this.name};
                } */
        </style>
            Hello ${this.name} :)
            <input type="text" placeholder="name" value="${this.name}" @input=${this._nameChanged}>
            <login-view></login-view>
        `
    }

    _nameChanged (e) {
        store.dispatch(updateName(e.target.value))
    }

    stateChanged (state) {
        this.name = state.test.name
    }
}

window.customElements.define('main-app', MainApp)
