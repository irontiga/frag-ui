import { LitElement, html } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
// import { Epml, ContentWindow as EpmlContentWindowPlugin } from 'epml'

// Epml.registerPlugin(EpmlContentWindowPlugin)

class ShowPlugin extends connect(store)(LitElement) {
    static get properties () {
        return {}
    }

    render () {
        return html`
            <iframe src="http://i7-16gb-hp-laptop:9087/plugins/wallet/index.html" id="walletFrame"></iframe>
        `
    }

    firstUpdated () {
        console.log(this)
        // const frameElement = this.shadowRoot.getElementById('walletFrame')
        // this._walletEpml = new Epml({ type: 'WINDOW', source: frameElement })
        console.log(this._walletEpml)
    }
}

window.customElements.define('show-plugin', ShowPlugin)
