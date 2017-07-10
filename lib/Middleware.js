'use strict'
var bodyParser = require('body-parser');
var cors = require('cors');
var Send = require('./Send');

class Middleware {

  constructor(path, callback) {
    // Atributos
    this.path;
    this.callback;
    // Valores por defecto
    if (path && callback) {
      this.path = path;
      this.callback = callback;
    }
    if (path && !callback) {
      this.path = '/';
      this.callback = path;
    }
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
