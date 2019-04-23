import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from '../plugins/addPluginRoutes.js'

class ShowPlugin extends connect(store)(LitElement) {
    static get properties () {
        return {
            app: { type: Object },
            pluginConfig: { type: Object },
            url: { type: String }
        }
    }

    static get styles () {
        return css`
            iframe#showPluginFrame {
                width:100%;
                height:calc(var(--window-height) - 68px);
                border:0;
                padding:0;
                margin:0;
            }
        `
    }

    render () {
        return html`
            <iframe src="${this.app.registeredUrls[this.url] ? `
                ${window.location.protocol}//${this.pluginConfig.domain}:${this.pluginConfig.port}/plugins/${this.app.registeredUrls[this.url].page}
            ` : `about:blank`}" id="showPluginFrame"></iframe>
        `
    }

    firstUpdated (changedProps) {
        console.log(changedProps)
        const showingPluginEpml = new Epml({
            type: 'WINDOW',
            source: this.shadowRoot.getElementById('showPluginFrame').contentWindow
        })
        addPluginRoutes(showingPluginEpml)
        showingPluginEpml.imReady()
        this.showingPluginEpml = showingPluginEpml
        console.log(showingPluginEpml)
    }

    updated (changedProps) {
        if (changedProps.has('url')) {
            //
        }

        if (changedProps.has('computerUrl')) {
            if (this.computedUrl !== 'about:blank') {
                this.loading = true
                // this.
            }
        }
    }

    stateChanged (state) {
        this.app = state.app
        this.pluginConfig = state.config.server.plugins
        this.url = state.app.url.split('/')[2]
    }
}

window.customElements.define('show-plugin', ShowPlugin)
