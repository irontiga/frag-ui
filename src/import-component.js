// import { componentTree, componentFunctions } from './components.js'
import path from 'path'

const BASE_URL = path.join(__dirname, 'src') 
//
const importComponent = component => {
    const url = path.join(BASE_URL, component.file)
    return import(url)
}

export default (components) => {
    // components = Array.isArray(components) ? components : [components]
    components = [].concat(components) // If not an array, make it one
    return Promise.all(components.map(component => importComponent(component)))
}
