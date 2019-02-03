const configURL = '/getConfig'

const baseConfig = {}

const loadConfigFromLocalStorage = () => {
    try {
        const config = localStorage.getItem('config')
        if (config === null) return void 0
        return JSON.parse(config)
    } catch (e) {
        return void 0
    }
}

const loadConfigFromAPI = () => {
    return fetch(configURL).then(res => res.json())
}

const loadConfig = async () => loadConfigFromLocalStorage() || loadConfigFromAPI()

export const saveConfigToLocalStorage = (config) => {
    try {
        const configJSON = JSON.stringify(config)
        localStorage.setItem('config', configJSON)
    } catch (e) {
        console.log(e)
    }
}
