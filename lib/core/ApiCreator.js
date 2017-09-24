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

      // Copiamos el archivo footer en el directorio temporal.
      let fs = require('fs-extra')
      if (app.config.apidoc.footer.filename) fs.copySync(Util.resolve(projectPath, app.config.apidoc.footer.filename), `${this.apidocTempPath}/footer.md`)

      // Actualizamos las rutas del footer, para que apunten al directorio temp.
      app.config.apidoc.footer.filename = (typeof app.config.apidoc.footer.filename != 'undefined') ? './footer.md' : undefined

      // Creamos el archivo 'header.md' que incluye información acerca del uso de la api.
      let infoContent = `\n`
      // Se incluye información sobre los roles de usuarios, si es que hubiesen.
      if (app.config.auth.roles.length > 0) {
        infoContent += `# Roles de usuario\n`
        infoContent += this.rolesApidoc(app.config.auth.roles)
      }

      // Información sobre los modelos.
      infoContent += `# Descripción de los modelos\n`
      for (let i in app.models) {
        let model = app.models[i]
        infoContent += model.apidoc()
      }

      // Titulo para la última parte de la documentación.
      infoContent += `\n# Descripción de los recursos y las rutas\n`

      // Creamos el archivo que contiene la documentación de las rutas en formato txt.
      let apidocContent = ""
      // Documentamos los roles
      apidocContent += this.defineRoles(app.config.auth.roles)
      apidocContent += this.defineErrors(app.config.server.all200)
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
      let infoPath = Util.resolve(this.apidocPath, './info.md')
      let headerPath = Util.resolve(this.apidocTempPath, `./header.md`)

      let input = this.apidocTempPath
      let output = publicPath
      let template = this.apidocTemplatePath
      let apidocTempPath = this.apidocTempPath
      let apidocPath = this.apidocPath
      let executeCommand = (command, executePath) => {
        return new Promise((resolve, reject) => {
          exec(command, {cwd: executePath}, (error, stdout, stderr) => {
            if (error !== null) { reject(error) } else { resolve() }
          })
        })
      }
      async function init() {
        try {
          console.log(` Generando APIDoc ...`)
          await executeCommand('mkdir -p temp', apidocPath)
          await Util.writeFile(apidocJSONFilename, JSON.stringify(app.config.apidoc))
          await Util.writeFile(routesJSFilename, apidocContent)
          let startContent = require('fs').readFileSync(infoPath, 'utf-8')
          let finalInfoContent = `${startContent}\n${infoContent}`
          await Util.writeFile(headerPath, finalInfoContent)
          await executeCommand(`apidoc -i "${input}" -o "${output}" -t "${template}"`, apidocTempPath)
          await executeCommand('rm -rf temp', apidocPath)
          console.log(`\x1b[32m\n APIDoc generado exitosamente\x1b[0m \u2713`)
          resolve()
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
  * @param {!Boolean} all200 Indica si todas las respuestas seran 200 Ok.
  * @return {String}
  */
  defineErrors(all200) {
    let apidocContent = "", errorData, code, responseCode
    errorData = Response.formatErrorJSON(422, UnprocessableEntityError.TYPE, UnprocessableEntityError.MESSAGE)
    code = "422 Unprocessable Entity"
    responseCode = all200 ? `HTTP/1.1 200 Ok` : `HTTP/1.1 ${code}`
    apidocContent += `
  /**
  * @apiDefine error422
  * @apiError (Error 4xx) UnprocessableEntity Ocurre cuando existe algún dato inválido.
  * @apiErrorExample {json} Error: ${code}\n${responseCode}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    errorData = Response.formatErrorJSON(401, UnauthorizedError.TYPE, UnauthorizedError.MESSAGE)
    code = "401 Unauthorized"
    responseCode = all200 ? `HTTP/1.1 200 Ok` : `HTTP/1.1 ${code}`
    apidocContent += `
  /**
  * @apiDefine error401
  * @apiError (Error 4xx) Unauthorized Ocurre cuando no se tiene la clave de acceso.
  * @apiErrorExample {json} Error: ${code}\n${responseCode}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    errorData = Response.formatErrorJSON(403, ForbiddenError.TYPE, ForbiddenError.MESSAGE)
    code = "403 Forbidden"
    responseCode = all200 ? `HTTP/1.1 200 Ok` : `HTTP/1.1 ${code}`
    apidocContent += `
  /**
  * @apiDefine error403
  * @apiError (Error 4xx) Forbidden Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.
  * @apiErrorExample {json} Error: ${code}\n${responseCode}\n${JSON.stringify(errorData, null, 2)}\n
  */
  `
    return apidocContent
  }

  /**
  * Devuelve información acerca de los roles que se hayan definido.
  * @param {Object} roles Colección de roles de usuario (config.auth.roles)
  */
  rolesApidoc(roles) {
    let content = '\nEl servicio web cuenta con los siguientes tipos de usuario:\n'
    content += `| Nombre | Alias |\n|--|--|\n`
    for (let i in roles) {
      let rol = roles[i]
      content += `| \`${rol.nombre}\` | \`${rol.alias}\` |\n`
    }
    return content
  }

}

module.exports = ApiCreator
