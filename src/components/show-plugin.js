import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
// import { Epml, ContentWindow as EpmlContentWindowPlugin } from 'epml'

// Epml.registerPlugin(EpmlContentWindowPlugin)

class ShowPlugin extends connect(store)(LitElement) {
    static get properties () {
        return {}
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
            <iframe src="http://i7-16gb-hp-laptop:9087/plugins/wallet/index.html" id="showPluginFrame"></iframe>
        `
    }

    firstUpdated () {
        console.log(this)
        // const frameElement = this.shadowRoot.getElementById('showPluginFrame')
        // this._walletEpml = new Epml({ type: 'WINDOW', source: frameElement })
        console.log(this._walletEpml)
    }
}

window.customElements.define('show-plugin', ShowPlugin)
