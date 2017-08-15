'use strict'

const ONE_TO_ONE_NAME = '1:1'
const ONE_TO_MANY_NAME = '1:N'

class Reference {
  constructor(model, key, type) {
    this.model = model,
    this.key = key,
    this.type = type
  }
}

function ONE_TO_ONE(model, key) {
  return new Reference(model, key, ONE_TO_ONE_NAME)
}
function ONE_TO_MANY(model, key) {
  return new Reference(model, key, ONE_TO_MANY_NAME)
}

Reference.ONE_TO_ONE = ONE_TO_ONE
Reference.ONE_TO_MANY = ONE_TO_MANY

Reference.ONE_TO_ONE_NAME = ONE_TO_ONE_NAME
Reference.ONE_TO_MANY_NAME = ONE_TO_MANY_NAME

module.exports = Reference
