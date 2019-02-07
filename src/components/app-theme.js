import { LitElement, html } from 'lit-element'
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
                    --mdc-theme-primary: ${this.theme.colors.primary}; /* Sets the text color to the theme primary color. */
                    --mdc-theme-primary-bg: ${this.theme.colors.primaryBg}; /* Sets the background color to the theme primary color. */
                    --mdc-theme-on-primary: ${this.theme.colors.onPrimary}; /* Sets the text color to the color configured for text on the primary color. */

                    --mdc-theme-secondary: ${this.theme.colors.secondary}; /* Sets the text color to the theme secondary color. */
                    --mdc-theme-secondary-bg: ${this.theme.colors.secondaryBg};/* Sets the background color to the theme secondary color. */
                    --mdc-theme-on-secondary: ${this.theme.colors.onSecondary}; /* Sets the text color to the color configured for text on the secondary color. */
                    
                    --mdc-theme-surface: ${this.theme.colors.surface}; /* Sets the background color to the surface background color. */
                    --mdc-theme-on-surface: ${this.theme.colors.onSurface};/* Sets the text color to the color configured for text on the surface color. */
                    --mdc-theme-background: ${this.theme.colors.background};/* Sets the background color to the theme background color. */
                }
            </style>
        `
    }

    stateChanged (state) {
        this.theme = state.config.theme
    }
}

window.customElements.define('app-theme', AppTheme)
