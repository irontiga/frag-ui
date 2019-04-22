import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

// import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'

import './wallet-profile.js'
import './show-plugin.js'

import '@polymer/app-layout/app-layout.js'
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
import { doLogout } from '../actions/app-actions/app-actions.js'

class AppView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { 
                type: Boolean,
                hasChanged: (some, thing) => {
                    console.log('loggedIn CHANGED!!!', some, thing)
                }
            },
            config: { type: Object }
        }
    }

    static get styles () {
        return [
            css`
                :host {
                  --app-drawer-width: 240px;;
                }

                app-drawer-layout:not([narrow]) [drawer-toggle] {
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
                    <app-header-layout has-scrolling-region>

                        <wallet-profile></wallet-profile>

                        <paper-listbox class="sideNavMenu" attr-for-selected="item-url" selected="{{route.path}}">
                            <template is="dom-repeat" items="{{urls}}">
                                <template is="dom-if" if="menus.length > 0">
                                    <template is="dom-repeat" items="{{menus}}">
                                         <!-- on-tap="_closeSideMenu" -->
                                        <span drawer-toggle>
                                            <a href="{{_genIframeUrl(item.url)}}">{{item.title}}</a>
                                        </span>
                                    </template>
                                </template>

                                <template is="dom-if" if="menus.length == 0">
                                    <paper-item  drawer-toggle item-url="{{_genIframeUrl(item.url)}}" style="width:auto;">
                                        <iron-icon drawer-toggle style="opacity:1" icon="{{item.icon}}"></iron-icon>
                                        &nbsp;{{item.title}}
                                        <paper-ripple></paper-ripple>
                                    </paper-item>
                                </template>
                            </template>
                            
                        </paper-listbox>

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

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
    }

    async logout (e) {
        console.log('LOGGIN OUTTT')
        // Add a glorious animation please!
        store.dispatch(doLogout())
    }
}

window.customElements.define('app-view', AppView)
