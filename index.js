/*!
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
module.exports = {
  Insac              : require('./lib/Insac'),
  Module             : require('./lib/core/Module'),
  Dao                : require('./lib/core/Dao'),
  Field              : require('./lib/core/Field'),
  THIS               : require('./lib/core/Field').THIS,
  ResourceModule     : require('./lib/modules/ResourceModule'),
  SendGridMailModule : require('./lib/modules/SendGridMailModule'),
  ServiceModule      : require('./lib/modules/ServiceModule'),
  util               : require('./lib/tools/util'),
  auth               : require('./lib/tools/auth'),
  logger             : require('./lib/tools/logger'),
  errors             : require('./lib/tools/errors')
}
