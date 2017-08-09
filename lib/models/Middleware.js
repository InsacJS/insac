'use strict'
const bodyParser = require('body-parser');
const cors = require('cors');

class Middleware {

  constructor(name, path, controller) {
    this.name = name;
    this.path = path;
    this.controller = controller;
  }

}

const CORS = new Middleware('cors', '/', cors({
  "origin": "*",
  "methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "preflightContinue": false,
  "allowedHeaders": "Content-Type,Authorization,Content-Length,Content-Range"
}))
const BODY_PARSER = new Middleware('body-parser', '/', bodyParser.json())
const URL_ENCODED = new Middleware('url-encoded', '/', bodyParser.urlencoded({ extended: false }))
const JSON_VALIDATE = new Middleware('json-validate', '/', (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    let msg = "Formato JSON incorrecto";
    return res.error422(msg)
  }
  res.error500(err)
})

Middleware.CORS = CORS
Middleware.BODY_PARSER = BODY_PARSER
Middleware.URL_ENCODED = URL_ENCODED
Middleware.JSON_VALIDATE = JSON_VALIDATE

module.exports = Middleware
