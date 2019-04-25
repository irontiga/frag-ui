import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

// import { logIn } from '../../actions/app-actions.js'
import '@polymer/iron-pages'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-icon'
import '@material/mwc-formfield'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-ripple'
// import '@polymer/paper-spinner/paper-spinner-lite.js'
// import '@polymer/iron-flex-layout/iron-flex-layout-classes.js'

import { doLogin } from '../../redux/app/app-actions.js'
import { doUpdateAccountInfo } from '../../redux/user/actions/update-account-info.js'

// import '@polymer/iron-pages'
// import '@polymer/paper-icon-button/paper-icon-button.js'
// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginSection extends connect(store)(LitElement) {
    static get properties () {
        return {
            loginFunction: { type: Object },
            selectedWallet: { type: Object },
            selectedPage: { type: String },
            wallets: { type: Object },
            loginErrorMessage: { type: String }
        }
    }

    static get styles () {
        return [
            css`
                
            `
        ]
    }

    constructor () {
        super()
        this.selectedPage = 'wallets'
        this.selectedWallet = {}
        this.loginErrorMessage = ''
    }

    render () {
        return html`
            <style>
                #loginSection {
                    padding:0;
                    text-align:left;
                }
                #wallets {
                    max-height: 400px;
                    overflow-y:auto;
                    overflow-x:hidden;
                    border-bottom: 1px solid #eee;
                    border-top: 1px solid #eee;
                }
                .wallet {
                    max-width: 300px;
                    position: relative;
                    padding: 12px 24px;
                    cursor: pointer;
                    display: flex;
                }
                .wallet .wallet-details {
                    padding-left:12px;
                    flex: 1;
                    min-width: 0;
                }
                .wallet div .address{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin:0;
                }
                .wallet .wallet-details h3 {
                    margin:0;
                    padding: 6px 0;
                    font-size:16px;
                }
                h1 {
                    padding: 24px;
                    padding-top:0;
                    margin:0;
                    font-size:24px;
                    font-weight:100;
                }
                .accountIcon {
                    font-size:42px;
                    padding-top:8px;
                }

                #unlockPage {
                    padding: 24px;
                }
                #unlockPage mwc-icon {
                    font-size:48px;
                }

                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #wallets {
                        max-height: calc(var(--window-height) - 130px);
                        height:100%;
                        overflow-y:auto;
                        overflow-x:hidden;
                    }
                    .wallet {
                        max-width: 100%;
                    }
                }

                #birthMonthContainer {
                    --paper-input-container-underline: {
                        display: none;
                        visibility: hidden;
                    }
                }
                #birthMonthContainer select {
                    padding:8px;
                    width:100%;
                }
                .backButton {
                    padding:14px;
                    text-align:left;
                }
            </style>
            
            <div id="loginSection">
                <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="createAccountPages">
                    <div page="wallets" id="walletsPage">
                        <h1>Your accounts</h1>
                        ${(Object.entries(this.wallets || {}).length < 1) ? html`
                            <p style="padding: 0 24px 12px 24px;">You need to create an account before you can log in!</p>
                        ` : ''}
                        <div id="wallets">
                            ${Object.entries(this.wallets || {}).map(wallet => html`
                                <div class="wallet" @click=${() => this.selectWallet(wallet[1])}>
                                    <paper-ripple></paper-ripple>
                                    <div>
                                        <mwc-icon class='accountIcon'>account_circle</mwc-icon>
                                    </div>
                                    <div class="wallet-details">
                                        <h3>${wallet[1].name || wallet[1].address0.substring(0, 5)}</h3>
                                        <p class="address">${wallet[1].address0}</p>
                                    </div>
                                </div>
                            `)}
                        </div>
                        <div style="text-align: right; padding:24px;">
                            <a @click=${() => { this.selectedPage = 'existingSeed' }} style="color: var(--mdc-theme-secondary); text-decoration: underline; cursor: pointer;">I want sign in with my seedphrase</a>
                        </div>
                    </div>
                    <div page="existingSeed" id="existingSeedPage" style=" padding:24px;">
                        <div style="display:flex;">
                            <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                            <paper-input style="width:100%;" label="Seedphrase" id="seedphrase" type="password"></paper-input>
                        </div>
                        <mwc-button style="margin-top:12px; width:100%;" raised @click=${e => this.login(e)}>Login</mwc-button>
                        <div style="text-align: right; padding:24px;">
                            <a @click=${() => { this.selectedPage = 'wallets' }} style="color: var(--mdc-theme-secondary); text-decoration: underline; cursor: pointer;">I want to sign in with a different account</a>
                        </div>
                    </div>
                    <div page="unlock" id="unlockPage">
                        <div style="text-align:center;">
                            <mwc-icon id='accountIcon' style=" padding-bottom:24px;">account_circle</mwc-icon>
                            <br>
                            <span style="font-size:14px; font-weight:600;">${this.selectedWallet.address0}</span>
                        </div>
                        <hr style="margin: 24px 48px;">
                        
                        <div style="display:flex;">
                            <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">calendar_today</mwc-icon>
                            <paper-input-container style="width:100%;" always-float-label="true" id="birthMonthContainer">
                                <label slot="label">Birth month</label>
                                <iron-input slot="input">
                                    <select id="birthMonth">
                                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => html`
                                            <option value="${num}">${num}</option>
                                        `)}
                                    </select>
                                </iron-input>
                            </paper-input-container>
                        </div>
                        
                        <div style="display:flex;">
                            <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                            <paper-input style="width:100%;" always-float-labell label="Pin" id="pin" type="password"  pattern="[0-9]*" inputmode="numeric" maxlength="4"></paper-input>
                        </div>

                        <mwc-button style="margin-top:12px; width:100%;" raised @click=${e => this.login(e)}>Login</mwc-button>
                        
                        <div style="text-align: right; padding:24px;">
                            <a @click=${() => { this.selectedPage = 'wallets' }} style="color: var(--mdc-theme-secondary); text-decoration: underline; cursor: pointer;">I want to sign in with a different account</a>
                        </div>

                        <div style="text-align: right; color: var(--mdc-theme-error)">
                            ${this.loginErrorMessage}
                        </div>
                    </div>

                </iron-pages>
                
                <loading-ripple id="loadingRipple"></loading-ripple>
            </div>
        `
    }

    firstUpdated () {
        this.loadingRipple = this.shadowRoot.getElementById('loadingRipple')
    }

    selectWallet (wallet) {
        this.selectedWallet = wallet
        this.selectedPage = 'unlock'
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.wallets = state.user.storedWallets
    }

    login (e) {
        const wallet = this.selectedWallet
        const birthMonth = this.shadowRoot.querySelector('#birthMonth').value
        const pin = this.shadowRoot.querySelector('#pin').value

        // First decrypt...
        this.loadingRipple.open({
            x: e.clientX,
            y: e.clientY
        })
            .then(() => store.dispatch(doLogin('storedWallet', {
                wallet,
                password: pin + '' + birthMonth
            }, status => { this.loadingRipple.loadingMessage = status })))
            .then(() => {
                store.dispatch(doUpdateAccountInfo({ name: wallet.name }))
                this.cleanup()
                return this.loadingRipple.fade()
            })
            .catch(e => {
                this.loginErrorMessage = e
                console.error(e)
                return this.loadingRipple.close()
            })
        // this.loginFunction({
        //     x: e.clientX,
        //     y: e.clientY
        // }, {
        //     save: false,
        //     sourceType: 'storedWallet',
        //     source: {
        //         wallet,
        //         password: pin + '' + birthMonth
        //     }
        // }).then(() => this.cleanup()).catch(e => {
        //     this.loginErrorMessage = e
        // })
    }

    cleanup () {
        this.wallet = {}
        this.shadowRoot.querySelector('#birthMonth').value = ''
        this.shadowRoot.querySelector('#pin').value = ''
        this.selectedPage = 'wallets'
    }
}

window.customElements.define('login-section', LoginSection)
