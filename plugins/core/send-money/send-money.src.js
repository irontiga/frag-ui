import { LitElement, html, css } from 'lit-element'
import { ERROR_CODES } from '../../../src/qora/constants.js'
import { Epml } from '../../../src/epml.js'

const KMX_IN_USD = 5 // 1 KMX - 5 USD

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const coreEpml = new Epml({
    type: 'PROXY',
    source: {
        id: 'visible-plugin',
        target: 'core-plugin',
        proxy: parentEpml
    }
})

class SendMoneyPage extends LitElement {
    static get properties () {
        return {
            addresses: { type: Array },
            amount: { type: Number },
            errorMessage: { type: String },
            sendMoneyLoading: { type: Boolean },
            data: { type: Object },
            addressesInfo: {  type: Object },
            selectedAddress: { type: Object },
            selectedAddressInfo: { type: Object },
            addressesUnconfirmedTransactions: { type: Object },
            addressInfoStreams: { type: Object },
            unconfirmedTransactionStreams: { type: Object },
            maxWidth: { type: String }
        }
    }

    static get observers () {
        return [
            // "_setSelectedAddressInfo(selectedAddress.*, addressesInfo)"
            '_usdKeyUp(usdAmount)',
            '_kmxKeyUp(amount)'
        ]
    }

    static get styles () {
        return css`
            #sendMoneyWrapper {
                /* Extra 3px for left border */
                /* overflow: hidden; */
            }

            /* #sendMoneyWrapper>* {
                width: auto !important;
                padding: 0 15px;
            } */

            #sendMoneyWrapper paper-button {
                float: right;
            }

            #sendMoneyWrapper .buttons {
                /* --paper-button-ink-color: var(--paper-green-500);
                    color: var(--paper-green-500); */
                width: auto !important;
            }

            .address-item {
                --paper-item-focused: {
                    background: transparent;
                }
                ;
                --paper-item-focused-before: {
                    opacity: 0;
                }
                ;
            }

            .address-balance {
                font-size: 42px;
                font-weight: 100;
            }

            .show-transactions {
                cursor: pointer;
            }

            .address-icon {
                border-radius: 50%;
                border: 5px solid;
                /*border-left: 4px solid;*/
                padding: 8px;
            }

            paper-input {
                margin: 0;
            }

            .selectedBalance {
                font-size: 14px;
                display: block;
            }

            .selectedBalance .balance {
                font-size: 22px;
                font-weight: 100;
            }
        `
    }

    render () {
        return html`
            <div id="sendMoneyWrapper" style="width:auto; margin:10px;">
                <div class="layout horizontal center">
                    <paper-card style="width:100%; max-width:740px;">
                        <div style="background-color: ${this.selectedAddress.color}; padding:12px 15px; margin:0; color: ${this.textColor(this.selectedAddress.textColor)};">

                            <h3 style="margin:0; padding:8px 0;">Send money</h3>

                            <div class="selectedBalance">
                                <!--  style$="color: {{selectedAddress.color}}" -->
                                <span class="balance">${this.selectedAddressInfo.nativeBalance.total[0]} KMX
                                    (${this.selectedAddressInfo.nativeBalance.total[0] * KMX_IN_USD} USD)</span> available for
                                transfer from
                                <span>${this.selectedAddress.address}</span>
                            </div>
                        </div>
            
                        <div class="card-content">
                            <!-- KMX <paper-toggle-button checked="{{useUSDAmount}}" style="cursor:pointer; display: inline"></paper-toggle-button> USD -->
            
                            <paper-input id="USDAmountInput" label="Amount (USD)" ?hidden="${!this.useUSDAmount}" value="${this.usdAmount}"
                                type="number">
                                <div slot="prefix">$ &nbsp;</div>
                            </paper-input>
                            <paper-input id="amountInput" required label="Amount (KMX)" type="number" invalid=${this.validAmount} value="${this.amount}"
                                error-message="Insufficient funds" @keyup="${() => this._checkAmount}"></paper-input>
            
                            <paper-input label="To (address or name)" type="text" value="${this.recipient}"></paper-input>
            
                            <!-- <paper-input label="Fee" type="text" value="{{fee}}"></paper-input> -->
            
                            <p style="color:red">${this.errorMessage}</p>
                            <p style="color:green;word-break: break-word;">${this.successMessage}</p>
            
                            <div class="buttons">
                                <div>
                                    <paper-button autofocus on-tap="_sendMoney">Send &nbsp;
                                        <iron-icon icon="send"></iron-icon>
                                    </paper-button>
                                </div>
                            </div>

                            ${this.sendMoneyLoading ? html`
                                <paper-progress auto></paper-progress>
                            ` : ''}
                        </div>
                    </paper-card>
            
                </div>
            </div>
        `
    }

    _floor (num) {
        return Math.floor(num)
    }

    _checkAmount () {
        this.validAmount = this.amount >= this.selectedAddressInfo.nativeBalance.total[0]
    }

    textColor (color) {
        return color == 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)'
    }

    async _sendMoney (e) {
        const amount = this.amount * Math.pow(10, 8)
        let recipient = this.recipient
        // var fee = this.fee

        // Check for valid...^

        this.sendMoneyLoading = true

        console.log(this.selectedAddress)

        let lastRef = await parentEpml.request('apiCall', {
            data: {
                type: 'api',
                url: `addresses/lastreference/${this.selectedAddress.address}/unconfirmed`
            }
        })
        lastRef = lastRef.data

        let recipientAsNameInfo = await parentEpml.request('apiCall', {
            data: {
                type: 'api',
                url: `names/${recipient}`
            }
        // eslint-disable-next-line handle-callback-err
        }).catch(err => {
            return JSON.stringify({})
        })
        console.log(recipientAsNameInfo)

        if (recipientAsNameInfo.success) {
            recipientAsNameInfo = JSON.parse(recipientAsNameInfo.data)
            recipient = recipientAsNameInfo.value
        }

        parentEpml.request('transaction', {
            data: {
                type: 2,
                nonce: this.selectedAddress.nonce,
                params: {
                    recipient,
                    amount,
                    lastReference: lastRef
                    // ,
                    // fee
                }
            }
        }).then(response => {
            const responseData = JSON.parse(response.data)
            if (!responseData.reference) {
                throw new Error(`Error! ${ERROR_CODES[responseData]}. Error code ${responseData}`)
            }

            this.errorMessage = ''
            this.recipient = ''
            this.amount = ''
            this.successMessage = 'Success! ' + response.data
        }).catch(err => {
            console.log(err)
            this.errorMessage = err
        })
    }

    _getSelectedAddressInfo (addressesInfo, selectedAddress) {
        return this.addressesInfo[selectedAddress.address]
    }

    constructor () {
        super()

        this.addresses = []
        this.errorMessage = ''
        this.sendMoneyLoading = false
        this.data = {}
        this.addressesInfo = {}
        this.selectedAddress = {}
        this.selectedAddressInfo = {}
            //computed: '_getSelectedAddressInfo(addressesInfo, selectedAddress)'
        this.addressesUnconfirmedTransactions = {}
        this.addressInfoStreams = {}
        this.unconfirmedTransactionStreams = {}
        this.maxWidth = '600'

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                selectedAddress = JSON.parse(selectedAddress)
                this.selectedAddress = {}
                if (!selectedAddress) return
                const addr = selectedAddress.address

                await coreEpml.ready()

                if (!this.addressInfoStreams[addr]) {
                    this.addressInfoStreams[addr] = coreEpml.subscribe(`address/${addr}`, addrInfo => {
                        console.log('Send money page received', addrInfo)
                        // Ahh....actually if no balance....no last reference and so you can't send money
                        addrInfo.nativeBalance = addrInfo.nativeBalance || { total: {} }
                        addrInfo.nativeBalance.total['0'] = addrInfo.nativeBalance.total['0'] || 0
                        this.set(`addressesInfo.${addr}`, addrInfo)
                        const addressesInfoStore = this.addressesInfo
                        this.addressesInfo = {}
                        this.addressesInfo = addressesInfoStore
                    })
                }

                if (!this.unconfirmedTransactionStreams[addr]) {
                    this.unconfirmedTransactionStreams[addr] = coreEpml.subscribe(`unconfirmedOfAddress/${addr}`, unconfirmedTransactions => {
                        this.addressesUnconfirmedTransactions[addr] = unconfirmedTransactions
                    })
                }
            })
        })
    }
}

window.customElements.define('send-money-page', SendMoneyPage)
