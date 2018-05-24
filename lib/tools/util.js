/** @ignore */ const fs     = require('fs')
/** @ignore */ const path   = require('path')
/** @ignore */ const mkdirp = require('mkdirp')
/** @ignore */ const exec   = require('child_process').exec

/** @ignore */ const NODE_MODULES_PATH = path.resolve(process.cwd(), 'node_modules')

// |=============================================================|
// |-------------- CONSTANTES -----------------------------------|
// |=============================================================|

exports.INTEGER_MAX_VALUE = 2147483647

// |=============================================================|
// |-------------- VARIOS ---------------------------------------|
// |=============================================================|

/**
* Busca un archivo y ejecuta una función cuando lo encuentra. Ignora la carpeta node_modules.
* @param {String}   dirPath - Directorio de búsqueda.
* @param {String}   ext     - Extensión del archivo.
* @param {Function} onFind  - Función que se ejecuta cuando encuentra el archivo.
*/
exports.find = (dirPath, ext, onFind) => {
  dirPath = path.resolve(process.cwd(), dirPath)
  function _find (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      if (filePath.startsWith(NODE_MODULES_PATH)) { return }
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
* Busca un archivo y ejecuta una función asíncrona cuando lo encuentra. Ignora la carpeta node_modules.
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
      if (filePath.startsWith(NODE_MODULES_PATH)) { return }
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

/**
* Devuelve la IP de un Request.
* @param {Request} req - Objeto request
* @return {String}
*/
exports.ip = (req) => {
  const IP = req.connection.remoteAddress
  return IP ? (IP.startsWith('::ffff:') ? IP.substr(7) : (IP === '::1' ? '127.0.0.1' : IP)) : ''
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
  if (start > count) start = 0
  let end = start + limit - 1
  if (start === 0) { end = 0 }
  if (end > count) { end = count }
  return { count, limit, page, start, end }
}
