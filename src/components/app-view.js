import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { loadPlugins } from '../plugins/load-plugins.js'

// import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'

import './wallet-profile.js'
import './sidenav-menu.js'
import './show-plugin.js'

import '@polymer/app-layout/app-layout.js'
import '@polymer/paper-ripple'
/* Should probably only import the parts I need
import './helpers/helpers.js';
import './app-drawer/app-drawer.js';
import './app-drawer-layout/app-drawer-layout.js';
import './app-grid/app-grid-style.js';
import './app-header/app-header.js';
import './app-header-layout/app-header-layout.js';
import './app-toolbar/app-toolbar.js';
import './app-box/app-box.js';
*/
import { doLogout } from '../redux/app/app-actions.js'

class AppView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: {
                type: Boolean,
                hasChanged: (some, thing) => {
                // console.log('loggedIn CHANGED!!!', some, thing)
                }
            },
            config: { type: Object },
            urls: { type: Object }
        }
    }

    static get styles () {
        return [
            css`
            :host {
                --app-drawer-width: 240px;;
            }

            app-drawer-layout:not([narrow]) [.menu-toggle-button] {
                display: none;
            }

            app-drawer {
                box-shadow: var(--shadow-2)
            }
            app-header {
                box-shadow: var(--shadow-2)
            }
            app-toolbar {
                background: var(--mdc-theme-surface);
                color: var(--mdc-theme-on-surface);
            }
        `
        ]
    }

    render () {
        return html`
        <style>

        </style>
        <!--style="height: var(--window-height);" -->
        <app-drawer-layout responsive-width='${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-desktop')}' fullbleed>
            <app-drawer swipe-open slot="drawer" id="appdrawer">
                <app-header-layout>

                    <wallet-profile></wallet-profile>

                    <sidenav-menu drawer-toggle></sidenav-menu>

                </app-header-layout>
            </app-drawer>

            <app-header-layout style="height: var(--window-height);">

                <app-header id='appHeader' slot="header" fixedd>
                    <app-toolbar>

                        <paper-icon-button class="menu-toggle-button" drawer-toggle icon="menu"></paper-icon-button>
                        
                        <div main-title>
                            <span class="qora-title">
                                &nbsp;${this.config.coin.name} 
                            </span>
                            
                            <small>
                                <!-- <i>{{route.path}}#{{hashRoute.path}}</i> -->
                            </small>
                        </div>

                        <template is="dom-repeat" items="{{topMenuItems}}">
                            <paper-button style="font-size:16px; height:40px;" on-tap="_openTopMenuModal">{{item.text}}&nbsp;<iron-icon icon="{{item.icon}}"></iron-icon></paper-button>
                        </template>

                        <div style="display:inline">
                            <!-- <paper-icon-button icon="icons:settings" on-tap="openSettings"></paper-icon-button> -->
                            <paper-icon-button title="Log out" icon="icons:power-settings-new" style="background:#fff; border-radius:50%;" @click=${e => this.logout(e)}></paper-icon-button>
                            
                        </div>
                    </app-toolbar>
                </app-header>
                
                <show-plugin size='100' logged-in="{{loggedIn}}" config="{{config}}" current-plugin-frame="{{currentPluginFrame}}" route="{{route}}" data="{{routeData}}" subroute="{{subroute}}" url="{{activeUrl}}"></show-plugin>
            
            </app-header-layout>
        </app-drawer-layout>

    `
    }

    constructor () {
        super()
        // console.log('loading plugins')
        loadPlugins()
    }

    firstUpdated () {
    //
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
        this.urls = state.app.registeredUrls
    }

    async logout (e) {
        console.log('LOGGIN OUTTT')
        // Add a glorious animation please!
        store.dispatch(doLogout())
    }
}

window.customElements.define('app-view', AppView)
