import '@material/mwc-icon'
import { LitElement, html } from '@polymer/lit-element'
import theme from './theme.js'
import styles from './styles.js'

import './components/test-test.js'

// import { connect } from 'pwa-helpers'
import { store } from './store.js'
// function connect (a) { 
//     return a
// }

// import { Button } from '@material/button'
// import { Icon } from "@material/mwc-icon"

const stork = []
for (let i = 0; i < 10; i++) {
    stork.push(html`<li>${i}</li>`)
}
setTimeout(() => {
    stork.push(html`<li>3 seconds :)</li>`)
    console.log(stork)
}, 3000)

// class MyElement extends connect(store)(LitElement) {
class MyElement extends LitElement {
    static get properties () {
        return {
        }
    }

    stateChanged (state) {
        this.todos = state.todos
        this.filter = state.filter
    }

    render () {
        return html`
            ${theme}
            ${styles}
            Hello world!
            <mwc-icon>sentiment_very_satisfied</mwc-icon>
            <ul>${
    [0, 1, 2, 3, 4, 5].map(i => html`<li>${i}</li>`)
}</ul>
            <!-- <ul>${store}</ul> -->
            <test-test></test-test>
          `
    }
}

customElements.define('my-element', MyElement)
