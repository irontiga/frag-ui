"use strict";
import TransactionBase from "./TransactionBase.js"
import { QORA_DECIMALS } from "../constants.js"

// tx_hex="${tx_type}${timestamp_hex}${reference_hex}${registrant_pubkey_hex}${owner_hex}${name_size}${name_hex}${value_size}${value_hex}${fee_hex}"

export default class RegisterNameTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 3
        this.fee = 0
        this.tests.push(
            () => {
                if (!(this._registrantPublicKey instanceof Uint8Array && this._registrantPublicKey.length == 32)) {
                    return "Invalid registrant " + Base58.encode(this._registrantPublicKey)
                }
                return true
            }
        )
    }

    // set recipient(recipient) {// Always Base58 encoded. Accepts Uint8Array or Base58 string.
    //     this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient);
    // }
    
    // Registrant publickey
    set registrantPublicKey (registrantPublicKey) {
        this._registrantPublicKey = registrantPublicKey instanceof Uint8Array ? registrantPublicKey : this.constructor.Base58.decode(registrantPublicKey)
    }

    set registrantAddress(registrantAddress) {// Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._registrantAddress = registrantAddress instanceof Uint8Array ? registrantAddress : this.constructor.Base58.decode(registrantAddress);
    }

    set name(name /* UTF8 String */) {
        // ...yes? no?
        this.nameText = name;

        // Not sure about encoding here...
        //this._message = message instanceof Uint8Array ? message : this.constructor.Base58.decode(message);
        this._nameBytes = this.constructor.utils.stringtoUTF8Array(name)
        this._nameLength = this.constructor.utils.int32ToBytes(this._nameBytes.length)
    }

    set value (value) {
        this.valueText = value;

        // Not sure about encoding here...
        //this._message = message instanceof Uint8Array ? message : this.constructor.Base58.decode(message);
        this._valueBytes = this.constructor.utils.stringtoUTF8Array(value)
        this._valueLength = this.constructor.utils.int32ToBytes(this._valueBytes.length)
    }

    // set amount(amount) {
    //     this._amount = amount * QORA_DECIMALS;
    //     this._amountBytes = this.constructor.utils.int64ToBytes(amount);
    // }
    
    get params() {
        const params = super.params;
        params.push(
            // this._registrantPublicKey,
            this._registrantAddress,
            this._nameLength,
            this._nameBytes,
            this._valueLength,
            this._valueBytes,
            this._feeBytes
        )
        return params;
    }
}