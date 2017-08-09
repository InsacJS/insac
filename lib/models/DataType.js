'use strict'

const STRING_NAME = 'STRING'
const INTEGER_NAME = 'INTEGER'

class DataType {

  constructor(name, args) {
    this.name = name
    this.args = args
  }

}

function STRING(length) {
  let name = STRING_NAME
  let a = (length) ? length : 255
  let args = [a]
  return new DataType(name, args)
}

function INTEGER() {
  let name = INTEGER_NAME
  return new DataType(name)
}

DataType.STRING = STRING
DataType.INTEGER = INTEGER

DataType.STRING_NAME = STRING_NAME
DataType.INTEGER_NAME = INTEGER_NAME

module.exports = DataType
