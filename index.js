'use strict'

module.exports = {
  Insac: require('./lib/Insac'),
  Config: require('./lib/core/Config'),
  Model: require('./lib/core/Model'),
  Route: require('./lib/core/Route'),
  Resource: require('./lib/core/Resource'),
  Middleware: require('./lib/core/Middleware'),
  Seed: require('./lib/core/Seed'),
  Fields: require('./lib/tools/Fields'),
  Validators: require('./lib/tools/Validators'),
  ResponseErrors: require('./lib/core/Response').errors
}
