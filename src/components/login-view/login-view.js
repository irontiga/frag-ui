import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import { createWallet } from '../../qora/createWallet.js'
import { generateSaveSeedData } from '../../qora/storeWallet.js'
import { doLogin } from '../../actions/app-actions/app-actions.js'

// import { logIn } from '../../actions/app-actions.js'

import '@material/mwc-button'
import '@material/mwc-icon'

import '@polymer/iron-pages'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'

import './create-account-section.js'
import './login-section.js'

// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: 'Boolean' },
            selectedPage: { type: 'String' },
            pages: { type: Object },
            rippleIsOpen: { type: Boolean },
            config: { type: Object },
            rippleLoadingMessage: { type: String }
        }
    }

    static get styles () {
        return [
            css`
                * {
                    --paper-spinner-color: var(--mdc-theme-secondary);
                }
                #rippleWrapper{
                    position:fixed;
                    top:0;
                    left:0;
                    bottom:0;
                    right:0;
                    height:0;
                    width:0;
                    z-index:999;
                    overflow: visible;
                    --ripple-activating-transition: transform 0.4s cubic-bezier(0.6, 0.0, 1, 1), opacity 0.6s cubic-bezier(0.6, 0.0, 1, 1);
                    /* --ripple-disable-transition: opacity 0.375s ease; */
                    --ripple-disable-transition: opacity 0.5s ease;
                }
                #ripple{
                    border-radius:50%;
                    border-width:0;
                    //transition:all 0.5s ease;
                    /* height:0;
                    width:0;
                    margin:0; */
                    /* margin-top: -300vh; */
                    /* margin-left:-300vh; */
                    margin-left:-100vmax;
                    margin-top: -100vmax;
                    height:200vmax;
                    width:200vmax;
                    overflow:hidden;
                    /* border:300vh solid var(--mdc-theme-secondary); */
                    /* border:0 solid rgba(85,85,85,1); */
                    /* background:transparent; */
                    background: var(--mdc-theme-secondary);
                    transform: scale(0);
                }
                #rippleShader {
                    background: var(--mdc-theme-surface);
                    opacity:0;
                    height:100%;
                    width:100%;
                }
                #ripple.activating{
                    transition: var(--ripple-activating-transition);
                     /* 200vh... */
                    /* border:300vh solid rgba(34,34,34,1);
                    margin-top: -300vh;
                    margin-left:-300vh;  */
                    transform: scale(1)
                }
                .activating #rippleShader {
                    transition: var(--ripple-activating-transition);
                    opacity: 1;
                }
                #ripple.disabling{
                    transition: var(--ripple-disable-transition);
                    opacity: 0;
                }
                #rippleContentWrapper {
                    position: absolute;
                    top:100vmax;
                    left:100vmax;
                    height:var(--window-height);
                    width:100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #rippleContent {
                    opacity: 0;
                    text-align:center;
                }
                .activating-done #rippleContent {
                    opacity: 1;
                    transition: var(--ripple-activating-transition);
                }
            `
        ]
    }

    constructor () {
        super()

        this.selectedPage = 'welcome'
        this.rippleIsOpen = false
        this.pages = {
            'welcome': 0,
            'create-account': 1,
            'login': 2
        }
        this.rippleLoadingMessage = 'Getting information'
    }

    firstUpdated () {
        this.shadowRoot.getElementById('createAccountSection').loginFunction = (...args) => this.login(...args)
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
                    font-size: 1rem;
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
            
            <div class="login-page" ?hidden=${this.loggedIn}>
                <div class="login-card-container">
                    <div class="login-card">
                        <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="loginContainerPages">
                            <div page="welcome">
                                <i style="visibility: hidden; float:right; padding:24px;">${this.config.coin.name} ${this.config.version}</i>
                                <br>
                                <br>
                                <!-- <h1>Karma</h1> -->
                                <img src="/img/karma/logo/KARMASHIP_LOGO_COLOR_WEB_MED.png" style="max-width: 300px; width:60%;">
                                <!-- <p>Enter the Karmaconomy</p> -->
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
                                <div style="text-align: right; padding:12px;">
                                    <br><br>
                                    <p style="margin:0; font-size: 0.9rem">Karmaship, LLC [alpha build v2.0]</p>
                                    <p style="font-size: 0.9rem"><i><small>Rewarding real life experiences</small></i></p>
                                </div>
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
                                <create-account-section id="createAccountSection"></create-account-section>
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
            <div id="rippleWrapper">
                <div id="ripple">
                    <div id="rippleShader"></div>
                    <div id="rippleContentWrapper">
                        <div id="rippleContent">
                            <h1>Welcome to ${this.config.coin.name}</h1>
                            <paper-spinner-lite active></paper-spinner-lite>
                            <p>${this.rippleLoadingMessage}</p>
                        </div>
                    </div>
                </div>
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

    // _loginClick (e) {
    //     logIn()
    // }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
    }

    loginAnimation (rippleOrigin) {
        const rippleWrapper = this.shadowRoot.getElementById('rippleWrapper')
        const ripple = this.shadowRoot.getElementById('ripple')
        const rippleContentWrapper = this.shadowRoot.getElementById('rippleContentWrapper')

        // Position the center of the ripple
        console.dir(rippleWrapper)
        console.log(rippleOrigin)
        rippleWrapper.style.top = rippleOrigin.y + 'px'
        rippleWrapper.style.left = rippleOrigin.x + 'px'
        rippleContentWrapper.style.marginTop = -rippleOrigin.y + 'px'
        rippleContentWrapper.style.marginLeft = -rippleOrigin.x + 'px'

        ripple.classList.add('activating')

        const transitionEventNames = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd']

        const closeRipple = () => {
            return new Promise((resolve, reject) => {
                let rippleClosed = false
                const rippleClosedEvent = e => {
                    if (!rippleClosed) {
                        rippleClosed = true
                        transitionEventNames.forEach(name => ripple.removeEventListener(name, rippleClosedEvent))
                        // Reset the ripple
                        ripple.classList.remove('activating')
                        ripple.classList.remove('activating-done')
                        ripple.classList.remove('disabling')
                        this.rippleIsOpen = false
                        resolve()
                    }
                }

                ripple.classList.add('disabling')
                transitionEventNames.forEach(name => ripple.addEventListener(name, rippleClosedEvent))
            })
        }

        return new Promise((resolve, reject) => {
            this.rippleIsOpen = false
            const transitionedEvent = () => {
                // First time
                if (!this.rippleIsOpen) {
                    ripple.classList.add('activating-done')
                    transitionEventNames.forEach(name => ripple.removeEventListener(name, transitionedEvent))
                    resolve(closeRipple)
                }
                this.rippleIsOpen = true
            }
            transitionEventNames.forEach(name => ripple.addEventListener(name, transitionedEvent))
        })
    }

    async login (rippleOrigin, params) {
        const closeRipple = await this.loginAnimation(rippleOrigin)
        try {
            const wallet = await createWallet(this, params)
            store.dispatch(doLogin(wallet, params.pin))
            if (params.save) {
                const saveSeedData = await generateSaveSeedData(wallet, params.pin, this.config.crypto.kdfThreads)
            }
            closeRipple()
        } catch (e) {
            alert(e)
        }
    }
}

window.customElements.define('login-view', LoginView)
