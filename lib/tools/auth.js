/** @ignore */ const crypto = require('crypto')
/** @ignore */ const uuid   = require('uuid/v4')
/** @ignore */ const jwt    = require('jsonwebtoken')

/**
* Crea un hash md5 a partir de una cadena de texto.
* @param {!String} str - Cadena de texto.
* @return {String}
*/
exports.md5 = (str) => {
  return crypto.createHash('md5').update(str + '').digest('hex')
}

/**
* Crea un token.
* @param {Object} [data]            - Objeto que se almacenará dentro del token.
* @param {!Object} privateKey       - Clave privada (private.key) a utilizar para generar el token.
* @param {Object} [exp=86400]       - Tiempo de expiración del token en segundos.
* @param {Object} [algorithm=RS256] - Algoritmo de encriptación.
* @return {String}
*/
exports.createToken = (data, privateKey, exp = 86400, algorithm = 'RS256') => {
  let tokenId  = uuid()
  let issuedAt = Math.floor(Date.now() / 1000) + exp  // tiempo actual en segundos
  let expire   = issuedAt + exp                       // 1 dia = 86400 segundos = 86400000 milisegundos
  let payload  = {
    jti  : tokenId,   // Json Token Id: Identificador único para el token
    iat  : issuedAt,  // Issued at: Tiempo en que se generó el token
    exp  : expire,    // Tiempo en segundos en que el token expirará
    data : data       // Datos del token
  }
  return jwt.sign(payload, privateKey, { algorithm })
}

/**
* Decodifica un token.
* @param {String} token     - Token.
* @param {String} publicKey - Clave pública (public.pem) a utilizar para decodificar el token.
* @return {Object}
*/
exports.decodeToken = (token, publicKey) => {
  return jwt.verify(token, publicKey)
}
