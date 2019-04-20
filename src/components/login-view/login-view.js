import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import { logIn } from '../../actions/app-actions.js'

import '@material/mwc-button'
import '@material/mwc-icon'

import '@polymer/iron-pages'
import '@polymer/paper-icon-button/paper-icon-button.js'
import './create-account-section.js'
import './login-section.js'

// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: 'Boolean' },
            selectedPage: { type: 'String' },
            pages: { type: Object }
        }
    }

    static get styles () {
        return [
            css`
                /* html, * {
                    color: var(--color, #333);
                } */
            `
        ]
    }

    constructor () {
        super()

        this.selectedPage = 'welcome'
        this.pages = {
            'welcome': 0,
            'create-account': 1,
            'login': 2
        }
    }

    render () {
        return html`
            <style>
                /* GO SASSSSSSS ASAPPP */
                .login-page {
                    height: var(--window-height);
                    width:100vw;
                    max-width:100vw;
                    max-height:var(--window-height);
                    position:absolute;
                    top:0;
                    left:0;
                    /* background: var(--mdc-theme-surface); */
                    background: var(--mdc-theme-background);
                }
                .login-card-container {
                    max-width:100vw;
                    max-height:var(--window-height);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: var(--window-height);
                    overflow:hidden;
                }
                #loginContainerPages [page] {
                    background: var(--mdc-theme-surface);
                }
                .login-card {
                    min-width: 340px;
                    /* background:#fff; */
                    text-align:center;
                }
                .login-card p {
                    margin-top: 0;
                    font-size:1rem;
                    font-style: italic;
                }
                .login-card h1{
                    margin-bottom:12px;
                    font-size:64px;
                }
                .login-card [page="welcome"] mwc-button {
                    margin: 6px;
                    width: 90%;
                    max-width:90vw;
                    margin: 4px;
                }
                .login-card iron-pages {
                    height:100%;
                }
                @media only screen and (min-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Desktop/tablet */
                    .login-card {
                        /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
                    }
                    #loginContainerPages [page] {
                        /* border: 1px solid var(--mdc-theme-on-surface); */
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        border-radius: 4px;
                        padding: 6px;
                    }
                    #loginContainerPages [page="welcome"] {

                    }
                }
                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    .login-page {
                        background: var(--mdc-theme-surface);
                    }
                    .login-card{
                        /* height:100%; */
                        width:100%;
                        margin:0;
                        top:0;
                        max-width:100%;
                    }
                }

                @keyframes fade {
                    from {
                        opacity: 0;
                        transform: translateX(-20%)
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0)
                    }
                }
                iron-pages .animated {
                    animation-duration: 0.6s;
                    animation-name: fade;
                }
                div[page] > paper-icon-button {
                    margin:12px;
                }
            </style>
            
            <div class="login-page">
                <div class="login-card-container">
                    <div class="login-card">
                        <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="loginContainerPages">
                            <div page="welcome">
                                <i style="float:right; padding:24px;">Karmship Alpha 2.0</i>
                                <br>
                                <br>
                                <h1>Karma</h1>
                                <p>Enter the Karmaconomy</p>
                                <br><br><br>
                                <mwc-button
                                    @click=${() => this.selectPage('create-account')}
                                    raised
                                >
                                    Create account
                                </mwc-button>
                                <mwc-button
                                    @click=${() => this.selectPage('login')}
                                >
                                    Login
                                </mwc-button>
                                <!-- <login-welcome-page selected-page="{{selectedPage}}"></login-welcome-page> -->
                            </div>
                            
                            <div page="create-account" style="text-align:left">
                                <!-- <paper-icon-button
                                    icon="icons:arrow-back"
                                    @click=${() => this.selectPage('welcome')}
                                ></paper-icon-button> -->
                                <mwc-button
                                    @click=${() => this.selectPage('welcome')}
                                ><mwc-icon>keyboard_arrow_left</mwc-icon> Login</mwc-button>
                                <br>
                                <create-account-section></create-account-section>
                            </div>
                            
                            <div page="login">
                                login
                                <paper-icon-button
                                    icon="icons:arrow-back"
                                    @click=${() => this.selectPage('welcome')}
                                ></paper-icon-button>
                                <br>
                            </div>
                        </iron-pages>
                        
                    </div>
                </div>
            </div>
            <div id="ripple">
                <!-- Ripple and spin on login click... can shrink back down and shake if there's an error
                or just fade out if there's success    
            -->
                <div id="spinner"></div>
            </div>
        `
    }

    selectPage (newPage) {
        const oldPage = this.selectedPage
        this.selectedPage = newPage
        this._pageChange(newPage, oldPage)
    }

    _pageChange (newPage, oldPage) {
        if (!this.shadowRoot.querySelector('#loginContainerPages') || !newPage) {
            return
        }
        const pages = this.shadowRoot.querySelector('#loginContainerPages').children
        // Run the animation on the newly selected page
        const newIndex = this.pages[newPage]
        if (!pages[newIndex].className.includes('animated')) {
            pages[newIndex].className += ' animated'
        }

        if (typeof oldPage !== 'undefined') {
            const oldIndex = this.pages[oldPage]
            // Stop the animation of hidden pages
            // pages[oldIndex].className = pages[oldIndex].className.split(' animated').join('');
            pages[oldIndex].classList.remove('animated')
        }
    }
    _backToWelcome () {
        this.selectedPage = 'welcome'
    }

    _loginClick (e) {
        logIn()
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
    }
}

window.customElements.define('login-view', LoginView)
