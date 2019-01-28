import { LitElement, html } from '@polymer/lit-element'

// import { Button } from '@material/button'
// import { Icon } from "@material/mwc-icon"

class TestTest extends LitElement {
    static get properties () {
        return {
            mood: { type: String }
        }
    }

    render () {
        return html`
        <style>
            span { 
                color: var(--secondary-color, blue)
            }
        </style>
            <span>HELLO!</span>
          `
    }
}

customElements.define('test-test', TestTest)

export default TestTest