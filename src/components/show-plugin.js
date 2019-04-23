import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
// import { Epml, ContentWindow as EpmlContentWindowPlugin } from 'epml'

// Epml.registerPlugin(EpmlContentWindowPlugin)

class ShowPlugin extends connect(store)(LitElement) {
    static get properties () {
        return {
            app: { type: Object },
            pluginConfig: { type: Object },
            url: { type: String },
            computedUrl: { type: String }
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

    constructor () {
        super()
        this.computedUrl = 'about:blank'
    }

    render () {
        return html`
            <iframe src="${this.computedUrl}" id="showPluginFrame"></iframe>
        `
    }

    computeUrl (url) {
        return `${window.location.protocol}//${this.pluginConfig.domain}:${this.pluginConfig.port}/plugins/${url}`
    }

    updated (changedProps) {
        if (changedProps.has('url')) {
            const url = this.app.url.split('/')[2]
            this.computedUrl = url ? this.computeUrl(this.app.registeredUrls[url].page) : 'about:blank'
        }
    }

    stateChanged (state) {
        console.log(Object.freeze(state))
        this.app = state.app
        this.pluginConfig = state.config.server.plugins
        this.url = state.app.url
    }

    firstUpdated () {
        // console.log(this)
        // const frameElement = this.shadowRoot.getElementById('showPluginFrame')
        // this._walletEpml = new Epml({ type: 'WINDOW', source: frameElement })
        // console.log(this._walletEpml)
    }
}

window.customElements.define('show-plugin', ShowPlugin)
