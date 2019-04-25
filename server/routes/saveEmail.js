const loki = require('lokijs')

var db = new loki('../../emails.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
})

let emails
// implement the autoloadback referenced in loki constructor
function databaseInitialize () {
    emails = db.getCollection('emails')
    if (emails === null) {
        emails = db.addCollection('emails')
    }
    // kick off any program logic or start listening to external events
    runProgramLogic()
}

// example method with any bootstrap logic to run after database initialized
function runProgramLogic () {
    var entryCount = db.getCollection('emails').count()
    console.log('number of entries in database : ' + entryCount)
}

module.exports = (email) => {
    emails.insert({
        email,
        time: Date.now()
    })
    return {
        success: true
    }
}
