import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import './login-view.js'

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

class AppView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: 'Boolean' }
        }
    }

    static get styles () {
        return [
            css`
                .ripple-wrapper {
                    position:fixed;
                    top:0;
                    left:0;
                    bottom:0;
                    right:0;
                    height:0;
                    width:0;
                    z-index:999;
                }
                .ripple {
                    border-radius:50%;
                    border-width:0;
                    //transition:all 0.5s ease;
                    height:0;
                    width:0;
                    margin:0;
                    border:0 solid rgba(85,85,85,1);
                    background:transparent;
                }
                .ripple.activating {
                    transition:all 0.3s cubic-bezier(0.4, 0.0, 1, 1);
                    border:300vh solid rgba(34,34,34,1); /* 200vh... */
                    margin-top: -300vh;
                    margin-left:-300vh; 
                }
                .ripple.disabling {
                    /*padding:300vh;
                    margin-top: -600vh;
                    margin-left:-600vh;
                    border-color: rgba(85,85,85,1);*/
                    transition:all 0.375s ease;
                    border-color: rgba(34,34,34,0);
                }
            `
        ]
    }

    render () {
        return html`
            <!-- Layout goes here. We'll make components for the side nav menu and the show-plugin etc.-->



            <app-drawer-layout fullbleed>
                <app-drawer swipe-open slot="drawer" id="appdrawer">
                    <app-header-layout has-scrolling-region>
                        <div id="accountDrawer" style$="background-color: {{selectedAddress.color}}; color: {{textColor(selectedAddress.textColor)}};">
                            
                                <iron-icon style$="color: {{textColor(selectedAddress.textColor)}};height:60px; width:60px; padding:12px;" icon="account-circle"></iron-icon>
                                
                                <div style="display:inline" hidden$="{{!showName}}">
                                    <template is="dom-if" if="{{!selectedAddress.hasName}}">
                                        <span><i>No name set</i></span>
                                        <paper-icon-button icon="editor:mode-edit" on-tap="_openSetNameDialog"></paper-icon-button>
                                    </template>
                                    
                                    <template is="dom-if" if="{{selectedAddress.hasName}}">
                                        <span>{{selectedAddress.name}}</span>
                                    </template>
                                </div>
                            

                            <paper-menu-button horizontal-align="left" id="accountMenu" style="padding:0; max-width:100%;">
                                <div slot="dropdown-trigger" style="position:relative">
                                    <!--                                <paper-icon-button noink icon="account-circle"></paper-icon-button>-->
                                    <div style="max-width:auto !important; padding:8px; text-overflow: ellipsis; overflow:hidden; font-size:16px; white-space: nowrap; color: {{textColor(selectedAddress.textColor)}};">
                                        <iron-icon icon="icons:arrow-drop-down"></iron-icon>
                                        {{selectedAddress.address}}
                                    </div>
                                    <paper-ripple></paper-ripple>
                                </div>
                                <paper-tooltip position="bottom">Account</paper-tooltip>
                                <div slot="dropdown-content">
                                    <paper-listbox slot="dropdown-content" selected="{{selectedAddress}}" attr-for-selected="address">
                                        <template is="dom-repeat" items="{{addresses}}">
                                            <paper-item address="{{item}}">
                                                <i class="dot" style$="color: {{item.color}}"></i>{{item.address}}
                                                <paper-ripple></paper-ripple>
                                            </paper-item>
                                        </template>
                                    </paper-listbox>
                                </div>
                            </paper-menu-button>
                        </div>
                        
                        

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
                                        <!--
<a is="pushstate-anchor" href="{{_genIframeUrl(item.url)}}">
</a>
-->
                                        <iron-icon drawer-toggle style="opacity:1" icon="{{item.icon}}"></iron-icon>
                                        &nbsp;{{item.title}}
                                        <paper-ripple></paper-ripple>
                                    </paper-item>
                                </template>
                            </template>
                            
                        </paper-listbox>

                    </app-header-layout>
                </app-drawer>

                <app-header-layout>

                    <app-header slot="header">
                        <app-toolbar>
                            
                            <!-- on-tap="_toggleDrawer" -->
                            <button icon="menu" drawer-toggle class="show-only-mobile">tog</button>
                            
                            <div main-title>
                                <span class="qora-title">
                                    <!-- Qora |  -->
                                </span> {{activeUrl.title}} <small>
                                    <!-- <i>{{route.path}}#{{hashRoute.path}}</i> -->
                                </small>
                            </div>

                            <template is="dom-repeat" items="{{topMenuItems}}">
                                <paper-button style="font-size:16px; height:40px;" on-tap="_openTopMenuModal">{{item.text}}&nbsp;<iron-icon icon="{{item.icon}}"></iron-icon></paper-button>
                            </template>

                            <div style="display:inline">
                                <!-- <paper-icon-button icon="icons:settings" on-tap="openSettings"></paper-icon-button> -->
                                <paper-button on-tap="_openBackupSeedDialog" style="font-size:14px;">Backup account</paper-button>
                                <paper-tooltip position="top">Logout</paper-tooltip>
                                <paper-icon-button icon="power-settings-new" on-tap="logOut"></paper-icon-button>
                            </div>
                        </app-toolbar>
                    </app-header>
                    
                    <show-plugin logged-in="{{loggedIn}}" config="{{config}}" current-plugin-frame="{{currentPluginFrame}}" route="{{route}}" data="{{routeData}}" subroute="{{subroute}}" url="{{activeUrl}}"></show-plugin>

                </app-header-layout>
            </app-drawer-layout>

        `
    }
}

window.customElements.define('app-view', AppView)
