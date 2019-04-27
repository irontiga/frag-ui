import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import download from '../api/deps/download.js'

// import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog'
import '@polymer/paper-toast'

class WalletProfile extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: Boolean },
            config: { type: Object },
            user: { type: Object },
            wallet: { type: Object },
            dialog: { type: Object },
            newName: { type: String }
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
        this.user = {
            accountInfo: {}
        }
    }

    render () {
        return html`
            <style>
                #profileInMenu {
                    padding:12px;
                    border-bottom: 1px solid #eee;
                }
                #profileInMenu:hover {
                    /* cursor:pointer; */
                }
                #accountIcon {
                    font-size:48px;
                    color: var(--mdc-theme-primary);
                    display: inline-block;
                }
                #accountName {
                    margin: 0;
                    font-size: 18px;
                    font-weight:100;
                    display: inline-block;
                    width:100%;
                }
                #address {
                    white-space: nowrap; 
                    overflow: hidden;
                    text-overflow: ellipsis;

                    margin:0;
                    margin-top: -6px;
                    font-size:12px;
                    /* padding-top:8px; */
                }


            </style>

            <div id="profileInMenu">
                <!-- <paper-ripple></paper-ripple> -->
                <div>
                    <mwc-icon id='accountIcon'>account_circle</mwc-icon>
                </div>
                <div style="padding: 8px 0;">
                    <span id="accountName">
                        <!-- No name set  -->
                        ${this.user.accountInfo.name}
                        <!-- <mwc-icon style="float:right; top: -10px;">keyboard_arrow_down</mwc-icon> -->
                        <paper-icon-button
                            @click=${() => this.dialog.open()}
                            style="float:right; top: -10px;"
                            icon="icons:more-vert"></paper-icon-button>
                    </span>
                    <p id="address">${this.wallet.addresses[0].address}</p>
                </div>
            </div>

            <paper-dialog id="profileDialog" with-backdrop>
                <!-- Gets moved to documnet.body so we need to put styles herer -->
                <style>
                    /* Dialog styles */
                    #dialogAccountIcon {
                        font-size:76px;
                        color: var(--mdc-theme-primary);
                    }

                    h1 {
                        font-weight: 100;
                    }

                    span {
                        font-size: 18px;
                        word-break: break-all;
                    }
                    .title {
                        font-weight:600;
                        font-size:12px;
                        line-height: 32px;
                        opacity: 0.66;
                    }
                    #profileList {
                        padding:0;
                    }
                    #profileList > * {
                        padding-left:24px;
                        padding-right:24px;
                    }
                    #nameDiv:hover {
                        cursor: pointer;
                    }
                    .red-button {
                        /* --mdc-theme-on-primary: var(--mdc-theme-error); */
                        --mdc-theme-primary: var(--mdc-theme-error);
                    }
                </style>

                <div style="text-align:center">
                    <mwc-icon id="dialogAccountIcon">account_circle</mwc-icon>
                    <h1>Profile</h1>
                    <hr>
                </div>
                <div id="profileList">
                    <div id="nameDiv" style="position:relative;" @mouseup=${/* () => this.openSetName() */ ''}>
                        <span class="title">Name</span>
                        <br>
                        ${/*this.name*/ true ? html`
                             <span class="">${this.user.accountInfo.name}</span>
                            ` : html`
                            <span class="">Set name <mwc-icon style="float:right; margin-top:-6px;">call_made</mwc-icon></span>
                            <paper-ripple></paper-ripple>
                        `}
                        <br><br>
                    </div>
                    <span class="title">Address</span>
                    <br>
                    <div><span class="">${this.wallet.addresses[0].address}</span></div>
                    <br>
                    <div id="nameDiv" style="position:relative;" @click=${() => this.downloadBackup()}>
                        <span class="title">Backup</span>
                        <br>
                        <span class="">Download wallet backup <mwc-icon style="float:right; margin-top:-6px;">save_alt</mwc-icon></span>
                        <paper-ripple></paper-ripple>
                        <br><br>
                    </div>
                </div>
                <div class="buttons">
                    <mwc-button dialog-confirm>Close</mwc-button>
                </div>
            </paper-dialog>

            <paper-dialog style="width:400px;" id="setNameDialog" with-backdrop>
                <h1 style="font-size: 24px; padding-top: 6px;">Set name</h1>

                <p style="margin-bottom:0;">
                    Note that this can only ever be done <strong>once</strong>. Name can contain any utf-8 character, however letters will
                    be converted to lowercase.
                </p>
                <paper-input @input=${e => { this.newName = e.target.value }} style="margin-top:0;" label="Name" type="text"></paper-input>

                <div class="buttons">
                    <mwc-button dialog-dismiss class="red-button">Cancel</mwc-button>
                    <!-- dialog-confirm -->
                    <mwc-button class="confirm" @click=${() => this._setName()}>Go</mwc-button>
                </div>
            </paper-dialog>

            <paper-toast id="toast" horizontal-align="right" vertical-align="top" vertical-offset="64"></paper-toast>

        `
    }

    openSetName () {
        if (this.name) return
        if (this.setNameInProgress) return
        this.setNameDialog.open()
    }

    _setName () {
        this.setNameDialog.close()
        this.dialog.close()
        this.toast.text = 'Name has been set. It may take a few minutes to show.'
        this.toast.duration = 6000
        this.toast.open()
        this.setNameInProgress = true
        setTimeout(() => {
            this.setNameInProgress = false
        }, 5 * 60 * 1000) // 5 minutes
    }

    firstUpdated () {
        const container = document.body.querySelector('main-app').shadowRoot.querySelector('app-view').shadowRoot
        const dialog = this.shadowRoot.getElementById('profileDialog')
        this.dialog = container.appendChild(dialog)
        const setNameDialog = this.shadowRoot.getElementById('setNameDialog')
        this.setNameDialog = container.appendChild(setNameDialog)

        const toast = this.shadowRoot.getElementById('toast')
        // querySelector('show-plugin').shadowRoot.

        const isMobile = window.matchMedia(`(max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')})`).matches
        if (isMobile) {
            toast.verticalAlign = 'bottom'
            toast.verticalOffset = 0
        }

        this.toast = container.appendChild(toast)
    }

    downloadBackup () {
        console.log('DOWNLAOD')
        const state = store.getState()
        const data = state.user.storedWallets[state.app.selectedAddress.address]
        // 'application/json' - omit...
        const dataString = JSON.stringify(data)
        return download(dataString, 'karma_backup.json')
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
        this.user = state.user
        this.wallet = state.app.wallet
    }
}

window.customElements.define('wallet-profile', WalletProfile)
