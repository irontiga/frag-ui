const loki = require('lokijs')
const db = new loki('db/db.json')

module.exports = db
