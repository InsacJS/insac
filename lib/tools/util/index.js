/** @ignore */ const fs       = require('fs')
/** @ignore */ const path     = require('path')
/** @ignore */ const mkdirp   = require('mkdirp')
/** @ignore */ const { exec } = require('child_process')

// |=============================================================|
// |-------------- CONSTANTES -----------------------------------|
// |=============================================================|

/**
* Valor máximo de un número entero
* @const {Number}
*/
const INTEGER_MAX_VALUE = 2147483647

exports.INTEGER_MAX_VALUE = INTEGER_MAX_VALUE

// |=============================================================|
// |-------------- VARIOS ---------------------------------------|
// |=============================================================|

/**
* Devuelve una lista que contiene información de los archivos encontrados.
* Adicionalmente puede ejecutar una función (onFind) cuando encuentra un archivo.
* @param {String}   dirPath                - Directorio de búsqueda.
* @param {String}   ext                    - Extensión del archivo.
* @param {Function} [onFind]               - Función que se ejecuta cuando encuentra el archivo.
* @param {Object}   [options]              - Opciones adicionales de búsqueda
* @param {String[]} [options.ignoredPaths] - Lista de las rutas que serán ignoradas
* @return {Object[]}
* @property {!String} fileName - Nombre del archivo, sin la extensión.
* @property {!String} filePath - Ruta absoluta del archivo.
* @property {!String} dirName  - Nombre del directorio dond se encuentra el archivo.
* @property {!String} dirPath  - Ruta absoluta del directorio donde se encuentra el archivo.
* @property {!String} fileExt  - Extensión del archivo.
* @example
* const result = util.findAsync('/search/path', '.config.js', (fileInfo) => {
*   console.log('FileName = ', fileInfo.fileName)
*   console.log('FilePath = ', fileInfo.filePath)
*   console.log('DirName  = ', fileInfo.dirName)
*   console.log('DirPath  = ', fileInfo.dirPath)
*   console.log('FileExt  = ', fileInfo.fileExt)
* })
* console.log(result) // Muestra una lista de todos los archivos encontrados
*/
exports.find = function find (dirPath, ext, onFind, options = {}) {
  options.ignoredPaths = options.ignoredPaths || []
  const result = []
  function _isIgnored (filePath) {
    for (let i in options.ignoredPaths) {
      if (filePath.startsWith(options.ignoredPaths[i])) { return true }
    }
  }
  function _find (filePath) {
    if (_isIgnored(filePath)) { return }
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
        const fileInfo = { filePath, dirPath, fileName, dirName, fileExt }
        if (onFind) { onFind(fileInfo) }
        result.push(fileInfo)
      }
    }
  }
  _find(dirPath)
  return result
}

/**
* Devuelve una lista que contiene información de los archivos encontrados.
* Adicionalmente puede ejecutar una función (async onFind) cuando encuentra un archivo.
* @param {String}        dirPath           - Directorio de búsqueda.
* @param {String}        ext               - Extensión del archivo.
* @param {AsyncFunction} onFind            - Función asíncrona que se ejecuta cuando
*                                            encuentra el archivo.
* @param {Object}   [options]              - Opciones adicionales de búsqueda
* @param {String[]} [options.ignoredPaths] - Lista de las rutas que serán ignoradas
* @return {Promise<Object[]>}
* @property {!String} fileName - Nombre del archivo, sin la extensión.
* @property {!String} filePath - Ruta absoluta del archivo.
* @property {!String} dirName  - Nombre del directorio dond se encuentra el archivo.
* @property {!String} dirPath  - Ruta absoluta del directorio donde se encuentra el archivo.
* @property {!String} fileExt  - Extensión del archivo.
* @example
* const result = await util.findAsync('/search/path', '.config.js', async (fileInfo) => {
*   console.log('FileName = ', fileInfo.fileName)
*   console.log('FilePath = ', fileInfo.filePath)
*   console.log('DirName  = ', fileInfo.dirName)
*   console.log('DirPath  = ', fileInfo.dirPath)
*   console.log('FileExt  = ', fileInfo.fileExt)
* })
* console.log(result) // Muestra una lista de todos los archivos encontrados
*/
exports.findAsync = async function findAsync (dirPath, ext, onFind, options = {}) {
  options.ignoredPaths = options.ignoredPaths || []
  const result = []
  function _isIgnored (filePath) {
    for (let i in options.ignoredPaths) {
      if (filePath.startsWith(options.ignoredPaths[i])) { return true }
    }
  }
  async function _find (filePath) {
    if (_isIgnored(filePath)) { return }
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
        const fileInfo = { filePath, dirPath, fileName, dirName, fileExt }
        if (onFind) { await onFind(fileInfo) }
        result.push(fileInfo)
      }
    }
  }
  await _find(dirPath)
  return result
}

/**
* Devuelve una promesa que simula una tarea.
* @param {Number} timeout - Tiempo de espera.
* @return {Promise}
*/
exports.timer = function timer (timeout) {
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
exports.cmd = function cmd (command, executePath) {
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
exports.toJson = function toJson (data) {
  return JSON.parse(JSON.stringify(data))
}

/**
* Devuelve un array de datos a partir de un array de objetos,
* indicando una propiedad del objeto.
* @param {Object[]} data     - Lista de objetos.
* @param {String}   property - Propiedad a extraer.
* @return {String|Number|Boolean[]}
*/
exports.toArray = function toArray (data, property) {
  const result = []
  const props = property.split('.')
  data.forEach(obj => {
    for (let i in props) { obj = obj[props[i]] }
    result.push(obj)
  })
  return result
}

// |=============================================================|
// |-------------- DIRECTORIOS ----------------------------------|
// |=============================================================|

/**
* Indica si existe un directorio.
* @param {String} dirPath - Ruta del directorio
* @return {Boolean}
*/
exports.isDir = function isDir (dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
}

/**
* Crea un directorio recursivamente.
* @param {String} dirPath - Ruta del directorio
*/
exports.mkdir = function mkdir (dirPath) {
  mkdirp.sync(dirPath)
}

/**
* Elimina un directorio recursivamente.
* @param {String} dirPath - Ruta del directorio
*/
exports.rmdir = function rmdir (dirPath) {
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

/**
* Copia un directorio.
* @param {String} source - Ruta de origen.
* @param {String} target - Ruta de destino.
*/
exports.copyDir = function copyDir (source, target) {
  function _copy (sourcePath, targetPath) {
    if (fs.statSync(sourcePath).isDirectory()) {
      mkdirp.sync(targetPath)
      fs.readdirSync(sourcePath).forEach(fileName => {
        _copy(path.resolve(sourcePath, fileName), path.resolve(targetPath, fileName))
      })
    } else {
      fs.createReadStream(sourcePath).pipe(fs.createWriteStream(targetPath))
    }
  }
  _copy(source, target)
}

// |=============================================================|
// |-------------- ARCHIVOS -------------------------------------|
// |=============================================================|

/**
* Indica si existe un archivo.
* @param {String} filePath - Ruta del archivo.
* @return {Boolean}
*/
exports.isFile = function isFile (filePath) {
  return fs.existsSync(filePath) && !(fs.statSync(filePath).isDirectory())
}

/**
* Devuelve el contenido de un archivo de texto.
* @param {String} filePath - Ruta del archivo.
* @return {String}
*/
exports.readFile = function readFile (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

/**
* Crea un archivo.
* @param {String} filePath - Ruta del archivo.
* @param {String} content  - Contenido del archivo.
*/
exports.writeFile = function writeFile (filePath, content) {
  mkdirp.sync(path.dirname(filePath))
  fs.writeFileSync(filePath, content)
}

/**
* Elimina un archivo.
* @param {String} filePath - Ruta del archivo.
*/
exports.removeFile = function removeFile (filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

/**
* Copia un archivo.
* @param {String} sourcePath - Ruta de origen.
* @param {String} targetPath - Ruta de destino.
*/
exports.copyFile = function copyFile (sourcePath, targetPath) {
  fs.createReadStream(sourcePath).pipe(fs.createWriteStream(targetPath))
}

/**
* Devuelve la cantidad de ficheros existentes dentro de un directorio.
* @param {String} dirPath           - Ruta del directorio.
* @param {String} [ext='.js']        - Se contarán todos los ficheros que tengan esta extensión.
* @param {Boolean} [recursive=true] - Indica si se buscarán dentro de los subdirectorios.
* @return {Number}
*/
exports.countFiles = function countFiles (dirPath, ext = '.js', recursive = true) {
  let sw = false
  function _count (dirPath) {
    if (fs.statSync(dirPath).isDirectory()) {
      if (!recursive && sw) { return 0 }
      sw = true
      let count = 0
      fs.readdirSync(dirPath).forEach(fileName => {
        count += _count(path.resolve(dirPath, fileName))
      })
      return count
    } else {
      return dirPath.endsWith(ext) ? 1 : 0
    }
  }
  return _count(dirPath)
}

/**
* Devuelve el contenido de un archivo, alternativamente, es posible ejecutar
* su contenido si se trata de una función devolviendo en todo caso el resultado de dicha función.
* @param {String} app      - Instancia del servidor (es para mostrar los logs).
* @param {String} filePath - Ruta del archivo.
* @return {Object} data
* @example
* module.exports = (app) => {
*   const data = {}
*   return data
* }
*
* @example
* const data = {}
* module.exports = data
*/
exports.loadFile = async function loadFile (app, filePath) {
  let content = {}
  try {
    if (fs.existsSync(filePath) && !(fs.statSync(filePath).isDirectory())) {
      content = require(filePath)
    }
    if (typeof content === 'function') {
      content = await content(app)
    }
    app.logger.appPrimary('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
  } catch (e) {
    app.logger.appError('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.FAIL}\n`)
    throw e
  }
  return content
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
exports.metadata = function metadata (req, result) {
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
