import { html } from '@polymer/lit-element'
// This should come from localstorage...below is serverside code....WRONG
// import config from '../server/configLoader.js'
const config = {
    theme: {
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00'
    }
}

const theme = config.theme

const themeStyles = html`
    <style>
        * {
            --primary-color: ${theme.primaryColor};
            --secondary-color: ${theme.secondaryColor};
        }
    </style>
`

export default themeStyles
