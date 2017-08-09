'use strict'
<<<<<<< HEAD

module.exports = require('./lib/Insac')
=======
var Insac = require('./lib/Insac');

module.exports = () => { return new Insac(); }
module.exports.DataType = Insac.DataType;
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
