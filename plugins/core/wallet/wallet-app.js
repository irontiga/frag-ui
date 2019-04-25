import { LitElement, html, css } from 'lit-element'
import { Epml } from '../../../src/epml.js'

import '@polymer/paper-spinner/paper-spinner-lite.js'
import 'time-elements'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

const TX_TYPES = {
    1: 'Genesis',
    2: 'Payment',

    3: 'Name registration',
    4: 'Name update',
    5: 'Sell name',
    6: 'Cancel sell name',
    7: 'Buy name',

    8: 'Create poll',
    9: 'Vote in poll',

    10: 'Arbitrary',

    11: 'Issue asset',
    12: 'Transfer asset',
    13: 'Create asset order',
    14: 'Cancel asset order',
    15: 'Multi-payment transaction',

    16: 'Deploy AT',

    17: 'Message',

    18: 'Delegation',
    19: 'Supernode',
    20: 'Airdrop'
}

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const coreEpml = new Epml({
    type: 'PROXY',
    source: {
        id: 'visible-plugin',
        target: 'core-plugin',
        proxy: parentEpml
    }
})

class WalletApp extends LitElement {
    static get properties () {
        return {
            loading: { type: Boolean },
            lastAddress: { type: String },
            transactions: { type: Array },
            lastBlock: { type: Object },
            addressesInfo: { type: Object },
            selectedAddress: { type: Object },
            selectedAddressInfo: { type: Object },
            selectedAddressTransactions: { type: Array },
            addressesUnconfirmedTransactions: { type: Object },
            addressInfoStreams: { type: Object },
            unconfirmedTransactionStreams: { type: Object }
        }
    }
    static get observers () {
        return [
            // "_addressObserver(selectedAddress.address)"
            '_getSelectedAddressInfo(addressesInfo, selectedAddress)'
        ]
    }

    static get styles () {
        return css`
            .red{
                color: var(--paper-red-500);
            }
            .green{
                color: var(--paper-green-500);
            }
            paper-spinner-lite{
                height:75px;
                width:75px;
                --paper-spinner-color: var(--primary-color);
                --paper-spinner-stroke-width: 2px;
            }
            .unconfirmed{
                font-style: italic;
            }
                        .roboto {
                font-family: "Roboto", sans-serif;
            }
            .mono {
                font-family: "Roboto Mono", monospace;
            }
            .weight-100{
                font-weight: 100;
            }
            
            .text-white-primary{
                color: var(--white-primary)
            }
            .text-white-secondary{
                color: var(--white-secondary)
            }
            .text-white-disabled{
                color: var(--white-disabled)
            }
            .text-white-hint{
                color: var(--white-divider)
            }
        `
    }

    constructor () {
        super()
        this.lastAddress = ''
        this.transactions = []
        this.lastBlock = {
            height: 0
        }
        this.addressesInfo = {}
        this.selectedAddress = {}
        this.selectedAddressInfo = {
            nativeBalance: {
                total: {}
            }
        }
        // selectedAddressTransactions: {
        //     value: [],
        //         computed: '_getAllTransactions(selectedAddressInfo.transactions, addressesUnconfirmedTransactions)'
        // },
        this.addressesUnconfirmedTransactions = {}
        this.addressInfoStreams = {}
        this.unconfirmedTransactionStreams = {}
    }

    render () {
        return html`
            <div ?hidden="${!this.loading}" class="layout horizontal center" style="height:100vh;">
                <div class="layout vertical center" style="width:100%;">
                    <paper-spinner-lite ?active="${this.loading}" alt="Loading address"></paper-spinner-lite>
                </div>
            </div>
            
            
            <div ?hidden="${this.loading}">
                <div id="topbar" style="background:${this.selectedAddress.color}; color: ${this.textColor(this.selectedAddress.textColor)}; padding: 40px;">
                    <span class="mono weight-1300">
                        <iron-icon icon="account-balance-wallet"></iron-icon> ${this.selectedAddress.address}
                    </span>
                    <!-- <template is="dom-if" if="{{!address.name}}">
                                        <paper-button on-tap="setName"><i>Set name</i></paper-button>
                                    </template> -->
                    <br>
                    <div class="layout horizontal wrap">
                        <div>
                            <span class="mono weight-100" style="font-size: 70px;">${this.floor(this.selectedAddressInfo.nativeBalance.total[0])}<span
                                    style="font-size:24px; vertical-align: top; line-height:60px;">.${this.decimals(this.selectedAddressInfo.nativeBalance.total[0])}
                                    KMX</span></span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <div>
                            <span class="mono weight-100" style="font-size: 70px;">${this.floor(this.selectedAddressInfo.nativeBalance.total[1])}<span
                                    style="font-size:24px; vertical-align: top; line-height:60px;">.${this.decimals(this.selectedAddressInfo.nativeBalance.total[1])}
                                    KEX</span></span>
                        </div>
                    </div>
                </div>
            
                <div id="contentDiv" style="margin: 8px;">
            
            
            
                    <div class="layout horizontal">
                        <paper-card style="width:100%">
            
                            <!-- <div class="card-content"  hidden$="{{!isEmptyArray(address.transactions)}}"> -->
                            <div class="card-content" ?hidden="${!this.isEmptyArray(this.selectedAddressTransactions)}">
                                Address has no transactions yet. Start by sending some KMX to <b>${this.selectedAddress.address}</b> or
                                by claiming KEX from the airdrop.
                            </div>
            
                            <vaadin-grid ?hidden="${this.isEmptyArray(this.selectedAddressTransactions)}" height-by-rows style="height:auto;"
                                aria-label="Transactions" items="${this.selectedAddressTransactions}">
            
                                <vaadin-grid-column flex-grow="x">
                                    <template class="header">
                                        <iron-icon style="height:16px" icon="device:access-time"></iron-icon>
                                    </template>
                                    <template>
                                        <span class$="{{_unconfirmedClass(item.unconfirmed)}}">
                                            <time-ago datetime$="{(new Date(this.item.transaction.timestamp).toISOString())}">
                                                {{item.transaction.dateTime}}
                                            </time-ago>
                                        </span>
                                    </template>
                                </vaadin-grid-column>
            
                                <vaadin-grid-column>
                                    <template class="header">
                                        Type
                                    </template>
                                    <template>
                                        <span class$="{{_unconfirmedClass(item.unconfirmed)}}">
                                            {{getTxType(item.transaction.type)}}
                                        </span>
                                    </template>
                                </vaadin-grid-column>
            
                                <vaadin-grid-column>
                                    <template class="header">
                                        Amount
                                        <!-- + fee -->
                                    </template>
                                    <template>
                                        <span class$="mono {{txColor(item.transaction)}} {{_unconfirmedClass(item.unconfirmed)}}">
                                            <!-- Ugly to avoid the space -->
                                            <iron-icon hidden$="{{sendOrRecieve(item.transaction)}}" icon="icons:add-circle" style="height:16px;"></iron-icon>
                                            <iron-icon hidden$="{{!sendOrRecieve(item.transaction)}}" icon="icons:remove-circle"
                                                style="height:16px; font-size:16px;"></iron-icon><span>[[floor(item.transaction.amount)]]</span><span
                                                style="font-size:12px; vertical-align:top; line-height:16px;">[[decimals(item.transaction.amount)]]</span>
                                            <!-- +
                                                            <span>[[floor(item.transaction.fee)]]</span
                                                                ><span style="font-size:8px; vertical-align:top; line-height:16px;">[[decimals(item.transaction.fee)]]</span> -->
                                        </span>
                                    </template>
                                </vaadin-grid-column>
            
                                <vaadin-grid-column flex-grow="4">
                                    <template class="header">
                                        Sender/Recipient
                                    </template>
                                    <template>
                                        <span class$="{{_unconfirmedClass(item.unconfirmed)}}">{{senderOrRecipient(item.transaction)}}</span>
                                    </template>
                                </vaadin-grid-column>
            
                                <vaadin-grid-column>
                                    <template class="header">
                                        Confirmations
                                    </template>
                                    <template>
                                        <span class$="{{_unconfirmedClass(item.unconfirmed)}}">
                                            <template is="dom-if" if="{{!item.unconfirmed}}">
                                                {{getConfirmations(item.transaction.blockHeight, lastBlock.height)}}
                                            </template>
                                            <template is="dom-if" if="{{item.unconfirmed}}">
                                                0
                                            </template>
                                        </span>
                                    </template>
                                </vaadin-grid-column>
            
                            </vaadin-grid>
            
                        </paper-card>
                    </div>
                </div>
            </div>
        `
    }

    _getAllTransactions (transactions, addressesUnconfirmedTransactions) {
        // console.log("UPDATING TRANSACTIONS")
        const unconfirmedTransactions = addressesUnconfirmedTransactions[this.selectedAddress.address]
        // console.log(transactions, unconfirmedTransactions)
        if (!(transactions && unconfirmedTransactions)) return []
        return [].concat(unconfirmedTransactions, transactions)
    }

    _getSelectedAddressInfo (addressesInfo, selectedAddress) {
        console.log('========SETTING SELECTED ADDR INFO', addressesInfo[selectedAddress.address])
        // return addressesInfo[selectedAddress.address]
        this.selectedAddressInfo = addressesInfo[selectedAddress.address]
        this.loading = false
    }

    firstUpdated () {
        parentEpml.ready().then(() => {
            // Guess this is our version of state management...should make a plugin for it...proxied redux or whatever lol
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                // console.log('==========================SELECTED ADDRESS',selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return // Not ready yet ofc
                this.selectedAddress = selectedAddress
                const addr = selectedAddress.address
                // console.log(selectedAddress)
                // console.log(addr)

                // Let's just assume ok
                // const ready = coreEpml.ready()
                // await ready
                // console.log('Core ready FFUCCC')

                if (!this.addressInfoStreams[addr]) {
                    console.log('AND DIDN\'T FIND AN EXISTING ADDRESS STREAM')
                    this.addressInfoStreams[addr] = coreEpml.subscribe(`address/${addr}`, addrInfo => {
                        addrInfo = JSON.parse(addrInfo)
                        console.log(addrInfo)
                        this.loading = false

                        addrInfo.nativeBalance = addrInfo.nativeBalance || { total: {} }
                        // console.log('NATIVE FUCKING BITCH',addrInfo)
                        // addrInfo.nativeBalance.total['0'] = addrInfo.nativeBalance.total['0'] || 0
                        // addrInfo.nativeBalance.total['1'] = addrInfo.nativeBalance.total['1'] || 0

                        this.addressesInfo = {
                            ...this.addressesInfo,
                            [addr]: addrInfo
                        }
                        console.log(this.addressesInfo)
                        // const addressesInfoStore = this.addressesInfo
                        // this.addressesInfo = {}
                        // this.addressesInfo = addressesInfoStore
                    })
                }
                if (!this.unconfirmedTransactionStreams[addr]) {
                    console.log('AND DIDN\'T FIND AN EXISTING UNCONFIRMED TX STREAM')
                    this.addressesUnconfirmedTransactions[addr] = []

                    this.unconfirmedTransactionStreams[addr] = coreEpml.subscribe(`unconfirmedOfAddress/${addr}`, unconfirmedTransactions => {
                        unconfirmedTransactions = JSON.parse(unconfirmedTransactions)
                        unconfirmedTransactions = unconfirmedTransactions.map(tx => {
                            return {
                                transaction: tx,
                                unconfirmed: true
                            }
                        })

                        console.log('RECEIVED UNCONFIRMED TX INFO', unconfirmedTransactions)

                        this.addressesUnconfirmedTransactions[addr] = unconfirmedTransactions
                        const addressesUnconfirmedTransactionsStore = this.addressesUnconfirmedTransactions
                        this.addressesUnconfirmedTransactions = {}
                        this.addressesUnconfirmedTransactions = addressesUnconfirmedTransactionsStore
                    })
                }
            })
        })

        coreEpml.ready().then(() => coreEpml.listen('New block', block => {
            // console.log("---- BLOCK ----" ,block)
            this.lastBlock = block
        }))

        parentEpml.imReady()
        coreEpml.imReady()
    }

    isEmptyArray (arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
    floor (num) {
        num = parseFloat(num)
        return isNaN(num) ? 0 : this._format(Math.floor(num))
    }
    decimals (num) {
        num = parseFloat(num) // So that conversion to string can get rid of insignificant zeros
        // return isNaN(num) ? 0 : (num + "").split(".")[1]
        return num % 1 > 0 ? (num + '').split('.')[1] : '0'
    }

    sendOrRecieve (tx) {
        return tx.sender == this.selectedAddress.address
    }

    senderOrRecipient (tx) {
        return this.sendOrRecieve(tx) ? tx.recipient : tx.sender
    }

    txColor (tx) {
        return this.sendOrRecieve(tx) ? 'red' : 'green'
    }
    getTxType (type) {
        return TX_TYPES[type]
    }
    subtract (num1, num2) {
        return num1 - num2
    }
    getConfirmations (height, lastBlockHeight) {
        return lastBlockHeight - height + 1
    }

    // _addressObserver(address){
    //     if(!address || this.lastAddress == address){
    //         return
    //     }
    //     console.log("UPDATING")
    //     this._updateAccount(address);
    //     this.lastAddress = address
    // }

    _format (num) {
        return num.toLocaleString()
    }

    textColor (color) {
        return color === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)'
    }
    _unconfirmedClass (unconfirmed) {
        return unconfirmed ? 'unconfirmed' : ''
    }
}

window.customElements.define('wallet-app', WalletApp)
