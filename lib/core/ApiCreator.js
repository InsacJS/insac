'use strict'
/** @ignore */ const _ = require('lodash')
/** @ignore */ const Response = require('../core/Response')
/** @ignore */ const UnprocessableEntityError = require('../errors/UnprocessableEntityError')
/** @ignore */ const UnauthorizedError = require('../errors/UnauthorizedError')
/** @ignore */ const ForbiddenError = require('../errors/ForbiddenError')
/** @ignore */ const { exec } = require('child_process')
/** @ignore */ const Util = require('../utils/Util')

/**
* Clase que permite crear la documentación
*/
class ApiCreator {

  /**
  * Crea una instancia de la clase ApiCreator
  */
  constructor() {

    /**
    * Ruta del directorio que se utilizará para generar la documentación.
    * @type {String}
    */
    this.apidocPath = Util.resolve(__dirname, `./../../apidoc`)

    /**
    * Ruta del directorio donde se encuentra el template que se utilizará para la documentación.
    * @type {String}
    */
    this.apidocTemplatePath = Util.resolve(this.apidocPath, `./template`)

    /**
    * Ruta del directorio temporal que se utilizará para generar la documentación.
    * @type {String}
    */
    this.apidocTempPath = Util.resolve(this.apidocPath, `./temp`)
  }

  /**
  * Genera la documentación para la aplicación.
  * @param {Insac} app Instancia de la aplicación.
  * @return {Promise}
  */
  create(app) {
    return new Promise((resolve, reject) => {
      let projectPath = app.config.projectPath, publicPath = app.config.path.public

      // Copiamos los archivos header y footer en un directorio temporal.
      const fs = require('fs-extra')
      if (app.config.apidoc.header.filename) fs.copySync(Util.resolve(projectPath, app.config.apidoc.header.filename), `${this.apidocTempPath}/header.md`)
      if (app.config.apidoc.footer.filename) fs.copySync(Util.resolve(projectPath, app.config.apidoc.footer.filename), `${this.apidocTempPath}/footer.md`)

      // Actualizamos las rutas del header y footer, para que apunten al directorio temp.
      app.config.apidoc.header.filename = (typeof app.config.apidoc.header.filename != 'undefined') ? './header.md' : undefined
      app.config.apidoc.footer.filename = (typeof app.config.apidoc.footer.filename != 'undefined') ? './footer.md' : undefined

      // Creamos el archivo que contiene la documentación de las rutas en formato txt.
      let apidocContent = ""
      // Documentamos los roles
      apidocContent += this.defineRoles(app.config.auth.roles)
      apidocContent += this.defineErrors()
      // Documentamos las rutas
      for (let i in app.routes) {
        apidocContent += app.routes[i].apidoc()
      }
      // Documentamos los recursos
      for (let i in app.resources) {
        apidocContent += app.resources[i].apidoc()
      }

      let apidocJSONFilename = Util.resolve(this.apidocTempPath, `./apidoc.json`)
      let routesJSFilename = Util.resolve(this.apidocTempPath, `./routes.js`)

      let input = this.apidocTempPath
      let output = publicPath
      let template = this.apidocTemplatePath
      let apidocTempPath = this.apidocTempPath
      let createApidoc = (input, output, template, apidocTempPath) => {
        return new Promise((resolve, reject) => {
          exec(`apidoc -i "${input}" -o "${output}" -t "${template}"`, {cwd: apidocTempPath}, (error, stdout, stderr) => {
            if (error !== null) {
              reject(error)
            } else {
              resolve('OK')
            }
          })
        })
      }

      async function init() {
        try {
          await Util.writeFile(apidocJSONFilename, JSON.stringify(app.config.apidoc))
          await Util.writeFile(routesJSFilename, apidocContent)
          await createApidoc(input, output, template, apidocTempPath)
          resolve('OK')
        } catch(err) { reject(err) }
      }

      init()

    })
  }

  /**
  * Define la parte de la documentación que corresponde a los roles.
  * @param {Object[]} roles Roles de usuario definidos en config.auth.roles.
  * @return {String}
  */
  defineRoles(roles) {
    let apidocContent = ""
    for (let i in roles) {
      let rol = roles[i]
      apidocContent += `
    /**
    * @apiDefine ${rol.alias} Rol: ${rol.nombre}
    * Solo los usuarios que tengan este rol pueden acceder a este recurso.
    */
    `
    }
    return apidocContent
  }

  /**
  * Define la parte de la documentación que corresponde a los errores.
  * @return {String}
  */
  defineErrors() {
    let apidocContent = "", errorData, code
    errorData = Response.formatErrorJSON(422, UnprocessableEntityError.TYPE, UnprocessableEntityError.MESSAGE)
    code = "422 Unprocessable Entity"
    apidocContent += `
  /**
  * @apiDefine error422
  * @apiError (Error 4xx) UnprocessableEntity Ocurre cuando existe algún dato inválido.
  * @apiErrorExample {json} Error: ${code}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    errorData = Response.formatErrorJSON(401, UnauthorizedError.TYPE, UnauthorizedError.MESSAGE)
    code = "401 Unauthorized"
    apidocContent += `
  /**
  * @apiDefine error401
  * @apiError (Error 4xx) Unauthorized Ocurre cuando no se tiene la clave de acceso.
  * @apiErrorExample {json} Error: ${code}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    errorData = Response.formatErrorJSON(403, ForbiddenError.TYPE, ForbiddenError.MESSAGE)
    code = "403 Forbidden"
    apidocContent += `
  /**
  * @apiDefine error403
  * @apiError (Error 4xx) Forbidden Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.
  * @apiErrorExample {json} Error: ${code}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    return apidocContent
  }

}

module.exports = ApiCreator
