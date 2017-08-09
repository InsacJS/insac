'use strict'
const bodyParser = require('body-parser');
const cors = require('cors');
<<<<<<< HEAD

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
=======
const Send = require('./Send');

class Middleware {

  constructor(name, path, callback) {
    this.name = name;
    this.path = path;
    this.callback = callback;
  }

  static corsDefault() {
    return cors({
      "origin": "*",
      "methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "preflightContinue": false,
      "allowedHeaders": "Content-Type,Authorization,Content-Length,Content-Range"
    });
  }

  static jsonValidate() {
    return (err, req, res, next) => {
      res.set('Content-Type','application/json');
      if (err instanceof SyntaxError) {
        let msg = "Formato JSON incorrecto";
        Send.error400(res, msg);
      }
      Send.error500(res);
    };
  }

  static jsonParser() {
    return bodyParser.json();
  }

  static urlEncode() {
    return bodyParser.urlencoded({ extended: false });
  }

}

module.exports = Middleware;
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
