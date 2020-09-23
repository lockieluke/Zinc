const pkjson = require('./../../package.json')

const appname = document.getElementById('appname')

appname.innerText = pkjson.name.replace(pkjson.name[0], pkjson.name[0].toUpperCase()) + ' ' + pkjson.version

appname = null
pkjson = null