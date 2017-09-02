'use strict'
/** @ignore */ const path = require('path')
/** @ignore */ const jwt = require('jwt-simple')
/** @ignore */ const crypto = require('crypto')

/**
* Contiene varias funciones que pueden ser utilizadas en cualquier lugar
*/
class Util {

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
    let tokenEncrypted
    try {
      tokenEncrypted = jwt.encode(token, key)
    } catch(err) { }
    return tokenEncrypted
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
    let tokenDecoded
    try {
      tokenDecoded = jwt.decode(tokenEncrypted, key)
    } catch (err) { }
    return tokenDecoded
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

}

module.exports = Util
