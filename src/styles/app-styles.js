import { LitElement, html } from 'lit-element'
// import { connect } from 'pwa-helpers'
// import { store } from '../store.js'

import '../styles/styles.scss'
import './app-theme.js'

// class AppStyles extends connect(store)(LitElement) {
class AppStyles extends LitElement {
// static get styles () {
    //     return [
    //         css`
    //             html, * {
    //                 color: var(--color, green);
    //             }
    //         `
    //     ]
    // }

    /* Disable shadow DOM, so that the styles DO bleed */
    createRenderRoot () {
        return this
    }

    render () {
        return html`
            <style>
                /* NOT THE IDEAL SOLUTION. Would be better to compile sass and inline it here...
                someone can do this for me at some point...or I could  */
                /* https://material.io/develop/web/components/layout-grid/ */

                /* @import url('/'); */

                * {
                    font-family: "Roboto", sans-serif;
                    color: #333;
                }
            </style>
            <app-theme></app-theme>
        `
    }
}

window.customElements.define('app-styles', AppStyles)
