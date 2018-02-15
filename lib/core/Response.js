/* global LOGGER */
const { Response, errors } = require('insac-response')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = (app) => {
  /**
  * |=============================================================|
  * |------------ FORMATO DE RESPUESTA ---------------------------|
  * |=============================================================|
  */
  app.successFormat = (result) => {
    const RESULT = {
      status: result.status,
      message: result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data) { RESULT.metadata = result.data }
    return RESULT
  }
  app.errorFormat = (result) => {
    return {
      status: result.status,
      message: result.message,
      errors: result.errors
    }
  }
  function onError (err, req) {
    if (err.code === 500) {
      console.log('\n //////////////// ERROR INTERNO \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n')
      console.log(err)
      LOGGER.error(err.message, '')
      // app.EMAIL.send.error(err, req)
    }
  }

  function errorHandler (err) {
    if (err && (err.name === 'InsacValidationError')) {
      return errors.BadRequestError.create(err.errors)
    }
    return err
  }

  app.use(Response.error({ errorFormat: app.errorFormat, onError, errorHandler }))

  /**
  * |=============================================================|
  * |------------ MIDDLEWARES ESCENCIALES ------------------------|
  * |=============================================================|
  */
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.use(cors({
    'origin': '*',
    'methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue': true,
    'Access-Control-Allow-Headers': 'Authorization,Content-Type,Content-Length'
  }))
  app.use((req, res, next) => {
    LOGGER.info(`[${req.method}] ${req.originalUrl}`)
    return next()
  })
}
