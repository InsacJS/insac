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

  errors : require('./lib/tools/errors'),
  fake   : require('./lib/tools/fake'),
  util   : require('./lib/tools/util')
}
