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
                    color: var(--mdc-theme-on-surface);
                    --window-height: ${this.windowHeight};
                }
            </style>
            <app-theme></app-theme>
        `
    }

    constructor () {
        super()
        this.windowHeight = html`100vh`
        window.addEventListener('resize', () => this._windowResized())
        this._windowResized()
    }

    // For mobile chrome's address bar
    _windowResized () {
        const ua = navigator.userAgent
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
        console.log(isMobile, "MOBILE")
        const isChrome = /Chrome/i.test(ua)

        if (isMobile && isChrome) {
            this.windowHeight = html`calc(100vh - 56px)`
            // document.body.style.setProperty('--window-height', 'calc(100vh - 56px)')
            console.log('not same')
        } else {
            this.windowHeight = html`100vh`
            // document.body.style.setProperty('--window-height', '100vh')
            console.log('same')
        }
    }
}

window.customElements.define('app-styles', AppStyles)
