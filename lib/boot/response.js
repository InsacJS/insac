const { Response, errors } = require('response-handler')
const _                    = require('lodash')

module.exports = (app) => {
  Response.successFormat = (result) => {
    const RESULT = {
      status  : result.status,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  }

  Response.errorFormat = (result) => {
    return {
      status  : result.status,
      message : result.message,
      errors  : result.errors
    }
  }

  Response.onError = (err, req) => {
    if (err.code === 500) {
      console.log('\n ' + _.pad(' ERROR INTERNO ', 50, '\\') + ' \n')
      console.log(err)
      // logger.error(err.message, '')
      // app.EMAIL.send.error(err, req)
    }
  }

  Response.errorHandler = (err) => {
    if (err && (err.name === 'InputDataValidationError')) {
      return errors.BadRequestError.create(err.errors)
    }
    return err
  }
}
