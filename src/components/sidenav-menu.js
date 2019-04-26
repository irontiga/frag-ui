import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import '@material/mwc-icon'
import '@polymer/paper-ripple'

class SidenavMenu extends connect(store)(LitElement) {
    static get properties () {
        return {
            config: { type: Object },
            urls: { type: Object }// ,
            // menuItemClick: { type: Function }
        }
    }

    static get styles () {
        return [
            css`
                ul#sideNavMenu {
                    padding:0;
                    margin:0;
                }

                ul#sideNavMenu li {
                    list-style: none;
                    position: relative;
                    height:48px;
                    line-height:48px;
                }

                ul#sideNavMenu li a {
                    text-decoration: none;
                    color: var(--mdc-theme-on-surface);
                    display: block;
                    padding-left:24px;
                    width: 100%;
                }
                ul#sideNavMenu li a mwc-icon {
                    vertical-align: top;
                    padding-top: 12px;
                    padding-right: 18px;
                }
            `
        ]
    }
    // .menuItemClick=${() => this.shadowRoot.getElementById('appdrawer').close()}
    render () {
        return html`
            <style>

            </style>
            
            <div>
                <ul id="sideNavMenu">
                    ${Object.entries(this.urls).map(([url, urlInfo]) => html`
                        <!-- Now to make the router interpret this url to meaning iframe src = url.page -->
                        <li @click=${() => this.menuItemClick()}>
                            <paper-ripple></paper-ripple>
                            <a href="/${this.config.coin.baseUrl}/${url}">
                                <mwc-icon>${urlInfo.icon}</mwc-icon>
                                <span>${urlInfo.title}</span>
                            </a>
                        </li>
                    `)}
                </ul>
            </div>

        `
    }

    menuItemClick () {
        //
        console.log('hi')
    }

    stateChanged (state) {
        this.config = state.config
        this.urls = state.app.registeredUrls
    }
}

window.customElements.define('sidenav-menu', SidenavMenu)
