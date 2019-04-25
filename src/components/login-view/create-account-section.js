import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import { doLogin } from '../../redux/app/app-actions.js'
import { doStoreWallet } from '../../redux/user/user-actions.js'

// import { logIn } from '../../actions/app-actions.js'
import '@polymer/iron-pages'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-icon'
import '@material/mwc-formfield'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import 'random-sentence-generator'

import './loading-ripple.js'
// import '@polymer/paper-spinner/paper-spinner-lite.js'
// import '@polymer/iron-flex-layout/iron-flex-layout-classes.js'

// import '@polymer/iron-pages'
// import '@polymer/paper-icon-button/paper-icon-button.js'
// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class CreateAccountSection extends connect(store)(LitElement) {
    static get properties () {
        return {
            tosAccepted: { type: Boolean },
            selectedPage: { type: String },
            error: { type: Boolean },
            errorMessage: { type: String },
            nextButtonText: { type: String },
            saveAccount: { type: Boolean },
            createAccountLoading: { type: Boolean },
            hasSavedSeedphrase: { type: Boolean }
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
        this.selectedPage = 'tos'
        this.tosAccepted = false
        this.nextButtonText = 'Next'
        this.saveAccount = true
        this.hasSavedSeedphrase = false
        this.createAccountLoading = false
        const welcomeMessage = 'Welcome to Karmaship'
        this.welcomeMessage = welcomeMessage

        this.pages = {
            tos: {
                next: e => {
                    this.error = false
                    this.errorMessage = ''
                    // Validation not needed... Button disabled if not checked
                    // if (!this.tosAccepted) {
                    //     this.error = true
                    //     this.errorMessage = 'You must tick the box and accept the terms of service'
                    //     return
                    // }
                    this.selectPage('info')
                },
                prev: () => {}
            },
            info: {
                next: e => {
                    this.error = false
                    this.errorMessage = ''
                    // const dob = this.shadowRoot.getElementById('dobInput').value
                    // console.log(dob)
                    // const dobValid = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(dob)
                    // if (!dobValid) {
                    //     this.error = true
                    //     this.errorMessage = 'Please enter a valid date of birth (dd/mm/yyyy)'
                    //     return
                    // }
                    const birthMonth = this.shadowRoot.getElementById('birthMonth').value
                    // console.log(birthMonth, this.shadowRoot.getElementById('birthMonth'))
                    if (!(!isNaN(birthMonth) && birthMonth > 0 && birthMonth <= 12)) {
                        this.error = true
                        this.errorMessage = 'Please enter a valid birth month'
                        return
                    }
                    const pin = this.shadowRoot.getElementById('createPin').value
                    if (!(pin.length === 4)) {
                        this.error = true
                        this.errorMessage = 'Please enter a 4 digit pin'
                        return
                    }
                    // const randSeedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    // const seedPhrase = this.shadowRoot.getElementById('seedPhrase').value
                    // console.log(randSeedPhrase, seedPhrase)
                    if (!this.hasSavedSeedphrase) {
                        this.error = true
                        this.errorMessage = 'Please save your seedphrase!'
                        return
                    }

                    this.nextButtonText = 'Create'
                    this.selectPage('save')
                },
                prev: () => this.selectPage('tos')
            },
            save: {
                next: e => {
                    // Create account and login :)
                    this.createAccountLoading = true

                    let username = this.shadowRoot.getElementById('username').value.replace(/^\s+|\s+$/g, '') // Removing leading and trailing whitespace
                    const email = this.shadowRoot.getElementById('email').value

                    if (!username) {
                        this.errorMessage = 'Please choose a username'
                    }

                    const seedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    const password = this.shadowRoot.getElementById('createPin').value + this.shadowRoot.getElementById('birthMonth').value

                    this.loadingRipple.welcomeMessage = welcomeMessage + ', ' + username

                    this.loadingRipple.open({
                        x: e.clientX,
                        y: e.clientY
                    })
                        .then(() => store.dispatch(doLogin('phrase', seedPhrase, status => {
                            this.loadingRipple.loadingMessage = status
                        })))
                        .then(wallet => {
                            if (!this.saveAccount) return
                            return store.dispatch(doStoreWallet(wallet, password, username, () => {
                                console.log('STATUS UPDATE <3')
                                this.loadingRipple.loadingMessage = status
                            }))
                        })
                        .then(() => {
                            this.cleanup()
                            return this.loadingRipple.fade()
                        })
                        .catch(e => {
                            this.errorMessage = e
                            console.error('COCK', e)
                            this.loadingRipple.close()
                        })

                    // this.loginFunction(, {
                    //     sourceType: 'phrase',
                    //     save: this.saveAccount
                    // }).then(() => {
                    //     // CLEANUP TIME.. change to state listener...on login -> cleanup
                    //     this.cleanup()
                    // })
                },
                prev: () => {
                    this.nextButtonText = 'Next'
                    this.selectPage('info')
                }
            }
        }
        this.pageIndexes = {
            'tos': 0,
            'info': 1,
            'save': 2
        }

        this.nextEnabled = false
        this.prevEnabled = false
    }

    cleanup () { // Practically the constructor...what a waste
        this.shadowRoot.getElementById('randSentence').generate()
        this.shadowRoot.getElementById('createPin').value = ''
        this.shadowRoot.getElementById('birthMonth').value = ''
        this.tosAccepted = false
        this.hasSavedSeedphrase = false
        this.selectPage('tos')
        this.error = false
        this.errorMessage = ''
        this.nextButtonText = 'Next'
        this.saveAccount = true
        this.createAccountLoading = false
    }

    render () {
        return html`
            <style>
                .flex {
                    display: flex;
                }
                .flex.column {
                    flex-direction: column;
                }
                #createAccountSection {
                    max-height: var(--window-height);
                    max-width: 480px;
                    /* max-height: 500px; */
                    max-height:calc(100% - 100px);
                }
                #createAccountPages {
                    flex-shrink:1;
                    text-align: left;
                    /* overflow:auto; */
                    left:0;
                }
                #createAccountPages [page] {
                    flex-shrink:1;
                }
                /* #tosContent { */
                .section-content {
                    padding:0 24px;
                    padding-bottom:0;
                    /* display:inline-block; */
                    overflow:auto;
                    flex-shrink:1;
                    max-height: calc(100vh - 296px);
                    
                }
                #tosContent > p {
                    margin-top:0;
                }

                mwc-checkbox::shadow .mdc-checkbox::after, mwc-checkbox::shadow .mdc-checkbox::before {
                    background-color:var(--mdc-theme-primary)
                }
                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #createAccountSection {
                        /* max-height: calc(var(--window-height) - 204px); */
                        max-height: calc(var(--window-height) - 38px);
                        /* height: calc(var(--window-height) - 38px); */
                        /* max-width:var(--layout-breakpoint-tablet); */
                        max-width: 100%;
                        height:100%;
                    }
                    /* #tosContent { */
                    .section-content {
                        /* padding:12px; */
                        max-height:calc(var(--window-height) - 166px);
                        min-height:calc(var(--window-height) - 166px);
                    }
                    #tosContent {
                        max-height:calc(var(--window-height) - 206px);
                        min-height:calc(var(--window-height) - 206px)
                    }
                    #nav {
                        flex-shrink:0;
                        padding-top:8px;
                    }
                }

                #infoContent{
                    /* padding:12px; */
                }
                @keyframes fade {
                    from {
                        opacity: 0;
                        /* transform: translateX(-20%) */
                    }
                    to {
                        opacity: 1;
                        /* transform: translateX(0) */
                    }
                }
                iron-pages .animated {
                    animation-duration: 0.6s;
                    animation-name: fade;
                }

                #birthMonthContainer {
                    --paper-input-container-underline: {
                        border:0;
                    }
                }
                #birthMonthContainer select {
                    padding:8px;
                    width:100%;
                }
            </style>
            
            <div id="createAccountSection" class="flex column">
                <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="createAccountPages">
                    <div page="tos" id="tosPage" class="flex column">
                        <div id="tosContent" class="section-content">
                            <p>
                                Congratulations! By agreeing to these terms of service you will become a part of the Karmaship Community [alpha v2.0]
                            </p>
                            <hr>
                            <ol>
                                <li>
                                    Economy
                                    <ol>
                                        <li>Our current economic model is subject to change as it becomes optimized.</li>
                                    </ol>
                                </li>
                                <li>
                                    Redeeming User Rewards
                                    <ol>
                                        <li>All users will be able to redeem their rewards at this event given certain parameters subject to change.</li>
                                    </ol>
                                </li>
                                <li>
                                    Information we Collect and Use
                                    <ol>
                                        <li>We collect several different types of information for various purposes to provide and improve our Service to you.</li>
                                        <li>
                                            Types of Data Collected
                                            <ol>
                                                <li>Email Address</li>
                                                <li>Usage Data</li>
                                            </ol>
                                        </li>
                                        <li>
                                            We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or the instructions provided in any email we send.
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                    Rewards
                                    <ol>
                                        <li>At the end of Alpha 2.0, existing users will be rewarded for their participation when they migrate over to beta. This reward is yet to be determined.</li>
                                    </ol>
                                </li>
                            </ol>
                        </div>
                        <div style="text-align:right; padding-right:8px; height:40px;">
                            <p style="vertical-align: top; line-height: 40px; margin:0;">
                                <label for="tosCheckbox" @click=${() => this.shadowRoot.getElementById('tosCheckbox').click()}>I agree to these terms of service</label>
                                <mwc-checkbox
                                    id="tosCheckbox"
                                    style="margin-bottom:-12px;"
                                    @click=${e => { this.tosAccepted = !e.target.checked }}
                                    ?checked="${this.tosAccepted}"></mwc-checkbox>
                            </p>
                        </div>
                        
                    </div>

                    <div page="info">
                        <div id="infoContent" class="section-content" style="">
                            <!-- <paper-input always-float-labell id="dobInput" label="Date of birth (needed to login again)" type="date"></paper-input> -->

                            <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 26px;">calendar_today</mwc-icon>
                                <paper-input-container style="width:100%; flex:1;" always-float-label="true" id="birthMonthContainer">
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
                            <br>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                                <paper-input style="width:100%;" always-float-labell label="Pin" id="createPin" type="password"  pattern="[0-9]*" inputmode="numeric" maxlength="4"></paper-input>
                            </div>
                            <br>
                            <p style="margin-bottom:0;">
                                Below is a randomly generated seedphrase. You can regenerate it until you find one that you like. Please write it down and/or memorise it. You will need it in order to login to your account.
                            </p>
                            <br>
                            <div style="display: inline-block; padding:8px; width:calc(100% - 76px); margin-top:24px; background: var(--mdc-theme-secondary-bg); border-radius:2px;">
                                <random-sentence-generator
                                    template="adverb verb the adjective noun and verb the adjective noun with the adjective noun"
                                    id="randSentence"></random-sentence-generator>
                            </div>
                            <paper-icon-button
                                icon="icons:autorenew"
                                style="top:-12px; margin:8px;"
                                @click=${() => this.shadowRoot.getElementById('randSentence').generate()}
                            ></paper-icon-button>
                            <br>
                             <!-- <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                                <paper-input style="width:100%;" id="seedPhrase" always-float-labell label="Repeat seed phrase"></paper-input>
                            </div> --><br>
                            <div style="text-align:right;">
                                <label
                                for="tosCheckbox"
                                @click=${() => this.shadowRoot.getElementById('saveCheckbox').click()}>
                                I have saved my seedphrase!</label>
                            <mwc-checkbox
                                id="saveCheckbox"
                                style="vertical-align: top; margin-top: -10px; display: inline-block;"
                                @click=${e => { this.hasSavedSeedphrase = !e.target.checked }} ?checked="${this.hasSavedSeedphrase}"></mwc-checkbox>
                            </div>
                        </div>
                    </div>

                    <div page="save">
                        <div id="saveContent" class="section-content">
                            <p>Your account is now ready to be created. It will be saved in this browser. If you do not want your new account to be saved in your browser you can uncheck the box below. You will still be able to login with your new account(after logging out), you'll just have to retype your seedphrase.</p>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 28px;">perm_identity</mwc-icon>
                                <paper-input style="width:100%;" label="Username" id="username" type="text"></paper-input>
                            </div>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 28px;">email</mwc-icon>
                                <paper-input style="width:100%;" label="Email" id="email" type="text"></paper-input>
                            </div>
                            <div style="text-align:right; padding-right:8px; min-height:40px;">
                                <p style="vertical-align: top; line-height: 40px; margin:0;">
                                    <label 
                                    for="tosCheckbox"
                                    @click=${() => this.shadowRoot.getElementById('saveCheckbox').click()}
                                    >Save in this browser</label>
                                    <mwc-checkbox id="saveCheckbox" style="margin-bottom:-12px;" @click=${e => { this.saveAccount = !e.target.checked }} ?checked="${this.saveAccount}"></mwc-checkbox>
                                </p>
                            </div>
                        </div>
                    </div>
                </iron-pages>
                <div id="errorMessage" style="height:24px; line-height:24px; vertical-align:top; color: var(--mdc-theme-error); text-align:right; padding: 0 16px; padding-bottom:6px;">
                   
                    <span style="margin-top:-4px;height:24px;">
                        ${this.error ? html`
                             <mwc-icon style="line-height:24px; vertical-align: top; margin-top:-2px;">block</mwc-icon>
                            ${this.errorMessage}` : ''}
                    </span>
                </div>
                <div id="nav">
                    <mwc-button 
                        ?disabled=${this.selectedPage === 'tos'}
                        @click=${() => this.pages[this.selectedPage].prev()}
                        style="margin: 0 0 12px 12px;">
                        <mwc-icon>keyboard_arrow_left</mwc-icon> Back 
                    </mwc-button>
                    <mwc-button 
                        ?disabled=${!this.tosAccepted}
                        @click=${e => this.pages[this.selectedPage].next(e)}
                        style="margin: 0 12px 12px 0; float:right;">
                        ${this.nextButtonText} <mwc-icon>keyboard_arrow_right</mwc-icon>
                    </mwc-button>
                </div>
            </div>

            <loading-ripple id="loadingRipple" welcome-message="${this.welcomeMessage}"></loading-ripple>
        `
    }

    firstUpdated () {
        this.loadingRipple = this.shadowRoot.getElementById('loadingRipple')
    }

    _pageChange (newPage, oldPage) {
        if (!this.shadowRoot.querySelector('#createAccountPages') || !newPage) {
            return
        }
        const pages = this.shadowRoot.querySelector('#createAccountPages').children
        // Run the animation on the newly selected page
        const newIndex = this.pageIndexes[newPage]
        if (!pages[newIndex].className.includes('animated')) {
            pages[newIndex].className += ' animated'
        }

        if (typeof oldPage !== 'undefined') {
            const oldIndex = this.pageIndexes[oldPage]
            // Stop the animation of hidden pages
            // pages[oldIndex].className = pages[oldIndex].className.split(' animated').join('');
            pages[oldIndex].classList.remove('animated')
        }
    }

    selectPage (newPage) {
        const oldPage = this.selectedPage
        this.selectedPage = newPage
        this._pageChange(newPage, oldPage)
    }

    stateChanged (state) {
        // this.loggedIn = state.app.loggedIn
    }

    createAccount () {

    }
}

window.customElements.define('create-account-section', CreateAccountSection)
