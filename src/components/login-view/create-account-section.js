import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

// import { logIn } from '../../actions/app-actions.js'
import '@polymer/iron-pages'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-icon'
import '@material/mwc-formfield'
import '@polymer/paper-input/paper-input.js'

import 'random-sentence-generator'
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
            errorMessage: { type: String }
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

        this.pages = {
            tos: {
                next: () => {
                    console.log('to info, from tos')

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
                prev: ''
            },
            info: {
                next: () => {
                    console.log('to something from info')
                    this.error = false
                    this.errorMessage = ''
                    const dob = this.shadowRoot.getElementById('dobInput').value
                    const dobValid = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/.test(dob)
                    if (!dobValid) {
                        this.error = true
                        this.errorMessage = 'Please enter a valid date of birth (dd/mm/yyyy)'
                        return
                    }
                    const pin = this.shadowRoot.getElementById('createPin').value
                    if (!(pin.length === 4)) {
                        this.error = true
                        this.errorMessage = 'Please enter a 4 digit pin'
                        return
                    }
                    const randSeedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    const seedPhrase = this.shadowRoot.getElementById('seedPhrase').value
                    console.log(randSeedPhrase, seedPhrase)
                    if (!(randSeedPhrase === seedPhrase)) {
                        this.error = true
                        this.errorMessage = 'Seed phrase does not match the generated one'
                        return
                    }
                    console.log('yay')
                },
                prev: 'tos'
            }
        }
        this.pageIndexes = {
            'tos': 0,
            'info': 1
        }

        this.nextEnabled = false
        this.prevEnabled = false
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
                    padding:12px;
                    padding-bottom:0;
                    /* display:inline-block; */
                    overflow:auto;
                    flex-shrink:1;
                    max-height: calc(100vh - 278px);
                    
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
                        /* max-width:var(--layout-breakpoint-tablet); */
                        max-width: 100%;
                        height:100%;
                    }
                    /* #tosContent { */
                    .section-content {
                        padding:8px;
                        max-height:calc(var(--window-height) - 178px);

                    }
                    #nav {
                        flex-shrink:0;
                        padding-top:8px;
                    }
                }

                #infoContent{
                    padding:12px;
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
                                <mwc-checkbox id="tosCheckbox" style="margin-bottom:-12px;" @input=${e => { this.tosAccepted = !e.target.checked }} ?checked="${this.tosAccepted}"></mwc-checkbox>
                            </p>
                        </div>
                        
                    </div>

                    <div page="info">
                        <div id="infoContent" class="section-content">
                            <paper-input always-float-labell id="dobInput" label="Date of birth (needed to login again)" type="date"></paper-input>
                            <paper-input always-float-labell label="Pin" id="createPin" type="password"  pattern="[0-9]*" inputmode="numeric" maxlength="4"></paper-input>
                            
                            <p style="margin-bottom:0;">
                                Below is a randomly generated seedphrase. You can regenerate it until you find one that you like. Please write it down and/or memorise it. You will need it in order to login to your account.
                            </p>
                            <div style="display: inline-block; padding:8px; width:calc(100% - 72px); margin-top:24px; background: var(--mdc-theme-primary-bg); border-radius:2px;">
                                <random-sentence-generator
                                    template="adverb verb the adjective noun and verb the adjective noun with the adjective noun"
                                    id="randSentence"></random-sentence-generator>
                            </div>
                            <paper-icon-button
                                icon="icons:autorenew"
                                style="top:-12px; margin:8px;"
                                @click=${() => this.shadowRoot.getElementById('randSentence').generate()}
                            ></paper-icon-button>
                            <paper-input id="seedPhrase" always-float-labell label="Repeat seed phrase"></paper-input>
                        </div>
                    </div>
                </iron-pages>
                <div id="errorMessage" style="height:24px; line-height:24px; vertical-align:top; color:red; text-align:right; padding: 0 16px; padding-bottom:6px;">
                   
                    <span style="margin-top:-4px;height:24px;">
                        ${this.error ? html`
                             <mwc-icon style="line-height:24px;">block</mwc-icon>
                            ${this.errorMessage}` : ''}
                    </span>
                </div>
                <div id="nav">
                    <mwc-button 
                        ?disabled=${this.selectedPage === 'tos'}
                        @click=${() => this.selectPage(this.pages[this.selectedPage].prev)}
                        style="margin: 0 0 12px 12px;">
                        <mwc-icon>keyboard_arrow_left</mwc-icon> Back 
                    </mwc-button>
                    <mwc-button 
                        ?disabled=${!this.tosAccepted}
                        @click=${() => this.pages[this.selectedPage].next()}
                        style="margin: 0 12px 12px 0; float:right;">
                        Next <mwc-icon>keyboard_arrow_right</mwc-icon>
                    </mwc-button>
                </div>
            </div>
            
        `
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
}

window.customElements.define('create-account-section', CreateAccountSection)
