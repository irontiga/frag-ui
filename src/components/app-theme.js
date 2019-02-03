import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

class AppTheme extends connect(store)(LitElement) {
    // static get styles () {
    //     return [
    //         css`
    //             html, * {
    //                 color: var(--color, green);
    //             }
    //         `
    //     ]
    // }

    /* Disable shady css, so that the styles DO bleed */
    createRenderRoot () {
        return this
    }

    render () {
        return html`
            <style>
                *, html {
                    --color: ${this.theme.color};

                    --mdc-theme-primary: #1a237e; /* Sets the text color to the theme primary color. */
                    --mdc-theme-primary-bg: #e8eaf6; /* Sets the background color to the theme primary color. */
                    --mdc-theme-on-primary: #fff; /* Sets the text color to the color configured for text on the primary color. */

                    --mdc-theme-secondary: #f06292; /* Sets the text color to the theme secondary color. */
                    --mdc-theme-secondary-bg: #fce4ec;/* Sets the background color to the theme secondary color. */
                    --mdc-theme-on-secondary: #000000; /* Sets the text color to the color configured for text on the secondary color. */
                    
                    --mdc-theme-surface: #fff; /* Sets the background color to the surface background color. */
                    --mdc-theme-on-surface: #333;/* Sets the text color to the color configured for text on the surface color. */
                    --mdc-theme-background: #efefef;/* Sets the background color to the theme background color. */
                }
            </style>
        `
    }

    stateChanged (state) {
        this.theme = state.config.theme
    }
}

window.customElements.define('app-theme', AppTheme)
