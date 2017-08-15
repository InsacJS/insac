'use strict'

const ONE_TO_ONE_VALUE = '1:1'
const ONE_TO_MANY_VALUE = '1:N'

class Reference {
  constructor(model, key, type) {
    this.model = model,
    this.key = key,
    this.type = type
  }
}

function ONE_TO_ONE(model, key) {
  return new Reference(model, key, ONE_TO_ONE_VALUE)
}
function ONE_TO_MANY(model, key) {
  return new Reference(model, key, ONE_TO_MANY_VALUE)
}

Reference.ONE_TO_ONE = ONE_TO_ONE
Reference.ONE_TO_MANY = ONE_TO_MANY

Reference.ONE_TO_ONE_VALUE = ONE_TO_ONE_VALUE
Reference.ONE_TO_MANY_VALUE = ONE_TO_MANY_VALUE

module.exports = Reference
