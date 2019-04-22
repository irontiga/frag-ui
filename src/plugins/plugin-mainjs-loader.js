'use strict'
import { Epml } from '../epml.js'
import { ContentWindow } from 'epml'

Epml.registerPlugin(ContentWindow)

window.Epml = Epml

const pluginScript = document.createElement('script')
pluginScript.async = false
const hash = window.location.hash
pluginScript.src = hash.slice(1)

document.body.appendChild(pluginScript)
