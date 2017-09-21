'use strict'
/** @ignore */ const path = require('path')
/** @ignore */ const fs = require('fs')
/** @ignore */ const jwt = require('jwt-simple')
/** @ignore */ const crypto = require('crypto')

/**
* Clase que describe múltiples funciones estáticas que permiten realizar
* tareas comunes.
*/
class Util {

  /**
  * Devuelve un array con el contenido de los archivos encontrados en el
  * directorio especificado. Generalmente son funciones. Alternativamente
  * se puede especificar el nombre de un archivo en específico.
  * @param {!String} path Ruta del directorio de búsqueda.
  * @param {Object} [options] Opciones de búsqueda.
  * @param {String} [options.fileName] Nombre del archivo.
  * @param {Boolean} [options.recursive=true] Indica si buscará dentro de los subdirectorios.
  * @param {String} [options.ext='js'] Extensión del archivo.
  * @param {String} [options.key=true] Indica si el elemento se almacenará con una clave (fileName) ó
  *                                    simplemente con un contador indice que comienza en 0.
  * @return {Function[]} Lista del contenido de todos los archivos encontrados.
  */
  static getContentFiles(path, options = {}) {
    options = {
      fileName: (typeof options.fileName != 'undefined') ? options.fileName : undefined,
      recursive: (typeof options.recursive != 'undefined') ? options.recursive : true,
      ext: (typeof options.ext != 'undefined') ? options.ext : 'js',
      key: (typeof options.key != 'undefined') ? options.key : true,
    }
    if (options.recursive === false) {
      try {
        let content = []
        if (options.key === true) {
          content[options.fileName] = require(`${path}/${options.fileName}.${options.ext}`)
        } else {
          content.push(require(`${path}/${options.fileName}.${options.ext}`))
        }
        return content
      } catch(err) {
        // Si el error es de otro tipo, se lo muestra.
        if (!err.message.startsWith('Cannot find module')) {
          console.log(err)
        }
      }
      // Si no se encuentra el archivo, devuelve un array vacio.
      return []
    }
    // Verifica que el directorio o archivo exista
    try {
      fs.statSync(path)
    } catch(err) {
      // Si el error es de otro tipo, se lo muestra.
      if (!err.message.startsWith('ENOENT: no such file or directory')) {
        console.log(err)
      }
      // Si no se encuentra el archivo, devuelve un array vacio.
      return []
    }
    // Busca dentro del directorio
    if (fs.statSync(path).isDirectory()) {
      let contentFiles = []
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        let result = Util.getContentFiles(newPath, options)
        for (let name in result) {
          if (options.key === true) {
            contentFiles[name] = result[name]
          } else {
            contentFiles.push(result[name])
          }
        }
      })
      return contentFiles
    } else {
      // Verifica el si es el archivo que se pide.
      let a = path.lastIndexOf('/')
      let b = path.substr(a + 1) // file.ext
      let c = b.endsWith(`.${options.ext}`) ? b.replace(`.${options.ext}`,'') : b // file
      let content = require(path)
      let fullName = options.fileName + (options.ext ? `.${options.ext}` : '')
      if (!options.fileName || (options.fileName && (b == fullName))) {
        let result = []
        if (options.key === true) {
          result[c] = content
        } else {
          result.push(content)
        }
        return result
      }
      return []
    }
  }

  /**
  * Sobreescribe los valores de las propiedades del objeto A con los valores del objeto B..
  * @param {Object} objA Objeto A
  * @param {Object} objB Objeto B
  * @return {Object}
  */
  static overrideProperties(objA, objB) {
    for (let prop in objA) {
      if (typeof objA[prop] == 'object') {
        if (typeof objB[prop] == 'object') {
          Util.overrideProperties(objA[prop], objB[prop])
        }
      } else {
        if (typeof objB[prop] != 'undefined') {
          objA[prop] = objB[prop]
        }
      }
    }
  }

  /**
  * Crea un token.
  * @param {!Object} data - Objeto que se guardará dentro del token.
  * @param {!String} key - Clave con la que se creará el token.
  * @param {Number} [exp=86400] - Tiempo en segundos en el que expirará el token a partir de su creación.
  * @return {String|undefined} Token encriptado ó undefined si ubiera algun error.
  *
  * @example
  * const { Util } = require('insac')
  *
  * let data = {
  *   id: 1,
  *   usuario: 'Juan Perez',
  *   rol: 'admin'
  * }
  *
  * let token = Util.createToken(data, 'SECRET')
  *
  * // token = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOj...
  */
  static createToken(data, key, exp = 86400) {
    // Convierte un número en base 36, luego obtiene los 10 primeros caracteres
    // despues del punto decimal
    let tokenId = Math.random().toString(36).substr(2, 10) + ''
    let issuedAt = Date.now()                // tiempo actual en milisegundos
    let expire = issuedAt + (exp * 1000)     // 1 dia = 86400 segundos = 86400000 milisegundos
    let token = {
      iat: issuedAt,         // Issued at: Tiempo en que se generó el token
      jti: tokenId,          // Json Token Id: Identificador único para el token
      exp: expire,           // Tiempo en que el token expirará
      data: data
    }
    return jwt.encode(token, key)
  }

  /**
  * Decodifica un token.
  * @param {!String} tokenEncrypted - Token encriptado.
  * @param {!String} key - Clave con la que se decodificará el token.
  * @return {Object|undefined} Token decodificado. Si hubiere algún tipo de error al decodificar, devolverá undefined.
  * @property {Number} iat - Tiempo en el que se creó el token.
  * @property {String} jti - Identificador único del token.
  * @property {Number} exp - Tiempo en el que expirará el token.
  * @property {Object} data - Objeto que se guardó dentro del token.
  *
  * @example
  * const { Util } = require('insac')
  *
  * let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOj...'
  *
  * let tokenDecoded = Util.decodeToken(token, 'SECRET')
  *
  * // tokenDecoded = {
  * //   iat: 1503801350952,
  * //   jti: 'eh2tb9pa3o',
  * //   exp: 1503887750952,
  * //   data: {
  * //     id: 1,
  * //     usuario: 'Juan Perez',
  * //     rol: 'admin'
  * //   }
  * // }
  */
  static decodeToken(tokenEncrypted, key) {
    return jwt.decode(tokenEncrypted, key)
  }

  /**
  * Encripta un password (texto) con un hash md5.
  * @param {!String} str - Password a encriptar (texto legible).
  * @return {String} Password encriptado (texto encriptado)
  *
  * @example
  * const { Util } = require('insac')
  *
  * let pass = 'admin'
  *
  * let passEncrypted = Util.encryptPassword(pass)
  *
  * // passEncrypted = 21232f297a57a5a743894a0e4a801fc3
  */
  static encryptPassword(str) {
    return crypto.createHash('md5').update(str + '').digest('hex')
  }

  /**
  * Crea un archivo de texto.
  * @param {String} filePath Ruta del archivo a crear.
  * @param {String} data Texto a incluir en el archivo.
  * @return {Promise}
  */
  static writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, function (err) {
        if (err) {
          reject(err)
        }
        resolve('OK')
      })
    })
  }

  /**
  * Lee un archivo de texto.
  * @param {String} filePath Ruta del archivo a crear.
  * @param {String} [encode="utf8"] Condificación del texto.
  * @return {Promise}
  */
  static readFile(filePath, encode = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, encode, function (err, data) {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }

}

Util.resolve = path.resolve

module.exports = Util
