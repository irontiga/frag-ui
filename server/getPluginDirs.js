const fs = require('fs')
const path = require('path')
const util = require('util')
const config = require('../config/config-loader.js')
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const readFile = util.promisify(fs.readFile)

const getPluginDirs = async () => {
    const pluginDir = path.join(__dirname, '../', config.server.plugins.directory)
    let listings = await readdir(pluginDir)
    listings = await Promise.all(listings.map(listing => stat(path.join(pluginDir, listing))
        .then(dirStats => dirStats.isDirectory() ? listing : false)
    ))
    let directories = listings.filter(listing => listing)

    directories = await Promise.all(directories.map(dir => {
        return readFile(path.join(pluginDir, dir, '/main.js'))
            .then(file => {
                return dir
            })
            // .catch(err => {
            //     return false
            // })
    }))
    return directories.filter(dir => dir)
}
// const plugins = new getPlugins();
// plugins.getPlugins();
//
// console.log(plugins.plugins);

module.exports = getPluginDirs
