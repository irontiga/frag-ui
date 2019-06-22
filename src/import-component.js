// import { componentTree, componentFunctions } from './components.js'
import path from 'path'

const BASE_URL = path.join(__dirname, 'src') 
//
const importComponent = component => {
    const url = path.join(BASE_URL, component.file)
    return import(url)
}

export default importComponent
