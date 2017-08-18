'use strict'
const bodyParser = require('body-parser')
const cors = require('cors')

class Middleware {

  constructor(path, controller) {
    if ((typeof path == 'string') && (typeof controller) == 'function') {
      if (path.startsWith('/')) {
        this.name = null
        this.path = path
      } else {
        this.name = path
        this.path = null
      }
      this.controller = controller
    } else if ((typeof path == 'function')) {
      this.name = null
      this.path = '/'
      this.controller = path
    } else {
      let msg = `No se puede crear el middleware porque algunos argumentos no son válidos`
      throw new Error(msg)
    }
  }

  isGlobal() {
    if (this.path == null) {
      return false
    }
    if (this.path.startsWith("/")) {
      return true
    }
    return false
  }

}

const CORS = new Middleware(cors({
  "origin": "*",
  "methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "preflightContinue": false,
  "allowedHeaders": "Content-Type,Authorization,Content-Length,Content-Range"
}))
const BODY_PARSER_JSON = new Middleware(bodyParser.json())
const BODY_PARSER_URL_ENCODED = new Middleware(bodyParser.urlencoded({ extended: false }))
const ERROR_HANDLER = new Middleware((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    let msg = "Formato JSON incorrecto"
    return res.error422(msg)
  }
  res.error500(err)
})

Middleware.CORS = CORS
Middleware.BODY_PARSER_JSON = BODY_PARSER_JSON
Middleware.BODY_PARSER_URL_ENCODED = BODY_PARSER_URL_ENCODED
Middleware.ERROR_HANDLER = ERROR_HANDLER

module.exports = Middleware
