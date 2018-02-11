/* global LOGGER */
const { Response } = require('insac-response')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = (app) => {
  /**
  * |=============================================================|
  * |------------ MIDDLEWARES ESCENCIALES ------------------------|
  * |=============================================================|
  */
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.use(cors({
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'preflightContinue': true,
    'headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  }))

  /**
  * |=============================================================|
  * |------------ FORMATO DE RESPUESTA ---------------------------|
  * |=============================================================|
  */
  function successFormat (result) {
    return {
      status: result.status,
      message: result.message,
      count: result.metadata,
      data: result.data
    }
  }
  function errorFormat (result) {
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

  app.use(Response.success({ successFormat }))
  app.use(Response.error({ errorFormat, onError }))
}
