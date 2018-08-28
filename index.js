/*!
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
module.exports = {
  Insac: require('./lib/Insac'),

  Module : require('./lib/core/Module'),
  Dao    : require('./lib/core/Dao'),

  Field : require('./lib/libs/FieldCreator'),
  THIS  : require('./lib/libs/FieldCreator').THIS,

  ResponseError   : require('./lib/libs/ResponseError'),
  ResponseSuccess : require('./lib/libs/ResponseSuccess'),

  errors    : require('./lib/tools/errors'),
  successes : require('./lib/tools/successes'),

  fake : require('./lib/tools/fake'),
  util : require('./lib/tools/util')
}
