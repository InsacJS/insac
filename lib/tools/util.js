/** @ignore */ const fs     = require('fs')
/** @ignore */ const path   = require('path')
/** @ignore */ const mkdirp = require('mkdirp')
/** @ignore */ const exec   = require('child_process').exec
/** @ignore */ const crypto = require('crypto')
/** @ignore */ const uuid   = require('uuid/v4')
/** @ignore */ const jwt    = require('jsonwebtoken')
/** @ignore */ const errors = require('./errors')

// |=============================================================|
// |-------------- CONSTANTES -----------------------------------|
// |=============================================================|

exports.INTEGER_MAX_VALUE = 2147483647

// |=============================================================|
// |-------------- VARIOS ---------------------------------------|
// |=============================================================|

/**
* Busca un archivo y ejecuta una función cuando lo encuentra.
* @param {String}   dirPath - Directorio de búsqueda.
* @param {String}   ext     - Extensión del archivo.
* @param {Function} onFind  - Función que se ejecuta cuando encuentra el archivo.
*/
exports.find = (dirPath, ext, onFind) => {
  dirPath = path.resolve(process.cwd(), dirPath)
  function _find (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((fileName) => {
        _find(path.resolve(filePath, fileName))
      })
    } else {
      if (filePath.endsWith(ext)) {
        const dirPath  = path.dirname(filePath)
        const fileName = filePath.split(path.sep).pop().replace(ext, '')
        const dirName  = dirPath.split(path.sep).pop()
        const fileExt  = ext
        onFind({ filePath, dirPath, fileName, dirName, fileExt })
      }
    }
  }
  _find(dirPath)
}

/**
* Busca un archivo y ejecuta una función asíncrona cuando lo encuentra.
* @param {String}        dirPath - Directorio de búsqueda.
* @param {String}        ext     - Extensión del archivo.
* @param {AsyncFunction} onFind  - Función asíncrona que se ejecuta cuando
*                                  encuentra el archivo.
* @return {Promise}
*/
exports.findAsync = async (dirPath, ext, onFind) => {
  dirPath = path.resolve(path.dirname(require.main.filename), dirPath)
  async function _find (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      const directories = fs.readdirSync(filePath)
      for (let i in directories) {
        await _find(path.resolve(filePath, directories[i]))
      }
    } else {
      if (filePath.endsWith(ext)) {
        const dirPath  = path.dirname(filePath)
        const fileName = filePath.split(path.sep).pop().replace(ext, '')
        const dirName  = dirPath.split(path.sep).pop()
        const fileExt  = ext
        await onFind({ filePath, dirPath, fileName, dirName, fileExt })
      }
    }
  }
  await _find(dirPath)
}

/**
* Devuelve una promesa que simula una tarea.
* @param {Number} timeout - Tiempo de espera.
* @return {Promise}
*/
exports.timer = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, timeout)
  })
}

/**
* Ejecuta un comando desde la terminal.
* @param {String} command     - Comando a ejecutar.
* @param {String} executePath - Ruta desde donde se ejecutará el comando.
* @return {Promise}
*/
exports.cmd = (command, executePath) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: executePath }, (error, stdout, stderr) => {
      if (error !== null) { reject(stderr) } else { resolve(stdout) }
    })
  })
}

/**
* Devuelve datos parseados de una respuesta sequelize.
* @param {Object} data - Resultado de una consulta sequelize.
* @return {Object}
*/
exports.json = (data) => {
  return JSON.parse(JSON.stringify(data))
}

/**
* Imprime por consola todas las propiedades de un objeto,
* incluyendo las prppiedades anidadas.
* @param {Object} data - Objeto.
*/
exports.log = (data) => {
  console.log(require('util').inspect(data, false, null))
}

/**
* Crea un objeto a partir de otro, indicando las propiedades a incluir
* en el nuevo objeto.
* @param {Object}   data       - Objeto base.
* @param {String[]} properties - Propieades a copiar.
* @return {Object}
*/
exports.obj = (data, properties) => {
  const result = {}
  Object.keys(data).forEach(key => {
    if (typeof data[key] !== 'undefined') result[key] = data[key]
  })
  return result
}

/**
* Devuelve un array de datos a partir de un array de objetos,
* indicando una propiedad del objeto.
* @param {Object[]} data     - Lista de objetos.
* @param {String}   property - Propiedad a extraer.
* @return {String|Number|Boolean[]}
*/
exports.array = (data, property) => {
  const result = []
  const props = property.split('.')
  data.forEach(obj => {
    for (let i in props) { obj = obj[props[i]] }
    result.push(obj)
  })
  return result
}

/**
* Devuelve un número aleatorio entre A y B.
* @param {Number} [a=1]       - Número A
* @param {Number} [b=1000000] - Número B
* @return {Number}
*/
exports.random = (a = 1, b = 1000000) => {
  return Math.floor((Math.random() * b) + a)
}

// |=============================================================|
// |-------------- DIRECTORIOS ----------------------------------|
// |=============================================================|

/**
* Indica si existe un directorio.
* @param {String} dirPath - Ruta del directorio
* @return {Boolean}
*/
exports.isDir = (dirPath) => {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
}

/**
* Crea un directorio recursivamente.
* @param {String} dirPath - Ruta del directorio
*/
exports.mkdir = (dirPath) => {
  mkdirp.sync(path.resolve(process.cwd(), dirPath))
}

/**
* Elimina un directorio recursivamente.
* @param {String} dirPath - Ruta del directorio
*/
exports.rmdir = (dirPath) => {
  dirPath = path.resolve(process.cwd(), dirPath)
  function _rmdir (dirPath) {
    if (fs.statSync(dirPath).isDirectory()) {
      fs.readdirSync(dirPath).forEach(fileName => {
        const filePath = path.resolve(dirPath, fileName)
        if (fs.statSync(dirPath).isDirectory()) {
          _rmdir(filePath)
        } else { fs.unlinkSync(filePath) }
      })
      fs.rmdirSync(dirPath)
    } else { fs.unlinkSync(dirPath) }
  }
  _rmdir(dirPath)
}

// |=============================================================|
// |-------------- ARCHIVOS -------------------------------------|
// |=============================================================|

/**
* Indica si existe un archivo.
* @param {String} filePath - Ruta del archivo.
* @return {Boolean}
*/
exports.isFile = (filePath) => {
  return fs.existsSync(filePath) && !(fs.statSync(filePath).isDirectory())
}

/**
* Devuelve el contenido de un archivo de texto.
* @param {String} filePath - Ruta del archivo.
* @return {String}
*/
exports.readFile = (filePath) => {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
}

/**
* Crea un archivo.
* @param {String} filePath - Ruta del archivo.
* @param {String} content  - Contenido del archivo.
*/
exports.writeFile = (filePath, content) => {
  mkdirp.sync(path.dirname(filePath))
  fs.writeFileSync(path.resolve(process.cwd(), filePath), content)
}

/**
* Elimina un archivo.
* @param {String} filePath - Ruta del archivo.
*/
exports.removeFile = (filePath) => {
  filePath = path.resolve(process.cwd(), filePath)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

/**
* Copia un archivo.
* @param {String} sourcePath - Ruta de origen.
* @param {String} targetPath - Ruta de destino.
*/
exports.copyFile = (sourcePath, targetPath) => {
  fs.createReadStream(sourcePath).pipe(fs.createWriteStream(targetPath))
}

// |=============================================================|
// |-------------- FILTROS Y CONSULTAS --------------------------|
// |=============================================================|

/**
* Crea los metadatos para una consulta de tipo findAndCountAll.
* @param {Request}         req    - Objeto Request
* @param {SequelizeResult} result - Resultado de la consulta findAndCountAll
* @return {Object}
*/
exports.metadata = (req, result) => {
  let count = result.count
  let limit = req.query.limit
  let page  = req.query.page
  let start = req.query.offset + 1
  let end   = start + req.query.limit - 1
  if (end > count) end = count
  if (start > limit || end === 0) {
    start = 0
    end   = 0
  }
  return { count, limit, page, start, end }
}

// |=============================================================|
// |-------------- AUTENTICACIÓN --------------------------------|
// |=============================================================|

/**
* Crea un hash md5 a partir de una cadena de texto.
* @param {!String} str - Cadena de texto.
* @return {String}
*/
exports.md5 = (str) => {
  return crypto.createHash('md5').update(str + '').digest('hex')
}

/**
* Devuelve un código de tipo UUIDV4.
* @return {String}
*/
exports.uuid = () => uuid()

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
  let issuedAt = Math.floor(Date.now() / 1000) // tiempo actual en segundos
  let expire   = issuedAt + exp                // 1 dia = 86400 segundos
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
* Devuelve un error de tipo Unauthorized si el token ha expirado.
* Devuelve un error de tipo BadRequest si el token es inválido.
* @param {String} token     - Token.
* @param {String} publicKey - Clave pública (public.pem) a utilizar para decodificar el token.
* @return {Object}
* @throws {Unauthorized|BadRequest}
*/
exports.decodeToken = (token, publicKey) => {
  try {
    return jwt.verify(token, publicKey).data
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new errors.InvalidToken('La sesión ha expirado.')
    }
    if (err.name === 'JsonWebTokenError') {
      throw new errors.BadRequest('El token es inválido.')
    }
    throw err
  }
}

/**
* Códifica una cadena de texto en base 64.
* @param {String} str - Cadena de texto.
* @return {String}
*/
exports.encodeBase64 = (str) => {
  return Buffer.from(str).toString('base64')
}

/**
* Decodifica una cadena de texto de base 64.
* @param {String} str - Cadena de texto.
* @return {String}
*/
exports.decodeBase64 = (str) => {
  return Buffer.from(str, 'base64').toString()
}
