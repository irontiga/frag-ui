// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...
const INITIAL_STATE = {
    theme: {
        color: 'green'
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state
    }
}
