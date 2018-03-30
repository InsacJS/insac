/*!
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
module.exports = {
  Insac              : require('./lib/Insac'),
  util               : require('./lib/tools/util'),
  logger             : require('./lib/tools/logger'),
  Dao                : require('./lib/tools/Dao'),
  Module             : require('./lib/modules/Module'),
  ResourceModule     : require('./lib/modules/ResourceModule'),
  SendGridMailModule : require('./lib/modules/SendGridMailModule'),
  ServiceModule      : require('./lib/modules/ServiceModule'),
  Validator          : require('input-data-validator').Validator,
  successes          : require('response-handler').successes,
  Response           : require('response-handler').Response,
  errors             : require('response-handler').errors,
  Options            : require('sequelize-options').Options,
  Apidoc             : require('apidoc-creator').Apidoc,
  Field              : require('./lib/tools/Field'),
  THIS               : require('field-creator').THIS,
  Seed               : require('seed-creator')
}

// const { Insac }    = require('@insac/core/Insac')
// const { Module }   = require('@insac/core/Module')
// const { Response } = require('@insac/core/Response')
//
// const { Field } = require('@insac/core/Field')
// const { Dao }   = require('@insac/core/Dao')
// const { Seed }  = require('@insac/core/Seed')
//
//
// // const { Apidoc } = require('@insac/core')
// // const { Database } = require('@insac/core')
// // const { Response } = require('@insac/core')
// // const { Validator } = require('@insac/core')
//
// const { ResourceModule } = require('@insac/modules')
//
// const { util } = require('@insac/tools/util')
// const { logger } = require('@insac/tools/logger')
// const { errors } = require('@insac/tools/errors')
