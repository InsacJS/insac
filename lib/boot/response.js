const { Response, errors } = require('response-handler')
const _                    = require('lodash')
const path                 = require('path')
const util                 = require('../tools/util')

const PATH_RESPONSE = path.resolve(process.cwd(), 'src/config/response.js')

module.exports = (app) => {
  const CUSTOM_CONFIG = util.isFile(PATH_RESPONSE) ? require(PATH_RESPONSE)(app) : {}

  Response.successFormat = CUSTOM_CONFIG.successFormat || ((result) => {
    const RESULT = {
      status  : result.status,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  })

  Response.errorFormat = CUSTOM_CONFIG.errorFormat || ((result) => {
    return {
      status  : result.status,
      message : result.message,
      errors  : result.errors
    }
  })

  Response.onError = CUSTOM_CONFIG.onError || ((err, req) => {
    if (err.code === 500) {
      console.log('\n ' + _.pad(' ERROR INTERNO ', 50, '\\') + ' \n')
      console.log(err)
      // logger.error(err.message, '')
      // app.EMAIL.send.error(err, req)
    }
  })

  Response.errorHandler = CUSTOM_CONFIG.errorHandler || ((err, req) => {
    if (err && (err.name === 'InputDataValidationError')) {
      return errors.BadRequest.create(err.errors)
    }
    return err
  })
}
