'use strict'
const fs = require('fs')
const path = require('path')
const util = require('util')
const async = require('async')
const mkdirp = require('mkdirp')
const { exec } = require('child_process')

const UTIL = module.exports = {}
const APP_PATH = path.dirname(require.main.filename)

UTIL.path = {}
UTIL.path.APP = APP_PATH
UTIL.path.create = (filePath) => {
  return path.resolve(APP_PATH, filePath)
}

UTIL.integer = {}
UTIL.integer.MAX_VALUE = 2147483647

UTIL.json = (data) => {
  return JSON.parse(JSON.stringify(data))
}

UTIL.log = (data) => {
  console.log(util.inspect(data, false, null))
}

// Comandos
UTIL.cmd = {}
UTIL.cmd.exec = (command, executePath = './') => {
  executePath = path.resolve(APP_PATH, executePath)
  return new Promise((resolve, reject) => {
    exec(command, {cwd: executePath}, (error, stdout, stderr) => {
      if (error !== null) { reject(stderr) } else { resolve(stdout) }
    })
  })
}

// Directorios
UTIL.dir = {}
UTIL.dir.exist = (dirPath) => {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
}
UTIL.dir.create = (dirPath) => {
  mkdirp.sync(path.resolve(APP_PATH, dirPath))
}
UTIL.dir.isEmpty = (dirPath) => {
  return fs.readdirSync(dirPath).length > 0
}
UTIL.dir.delete = (dirPath) => {
  dirPath = path.resolve(APP_PATH, dirPath)
  if (UTIL.dir.exist(dirPath)) {
    fs.readdirSync(dirPath).forEach(fileName => {
      const filePath = path.resolve(dirPath, fileName)
      if (UTIL.dir.exist(filePath)) {
        UTIL.dir.delete(filePath)
      }
      UTIL.file.delete(filePath)
    })
    fs.rmdirSync(dirPath)
  }
}

// Archivos
UTIL.file = {}
UTIL.file.exist = (filePath) => {
  return fs.existsSync(filePath) && !(fs.statSync(filePath).isDirectory())
}
UTIL.file.read = (filePath) => {
  return fs.readFileSync(path.resolve(APP_PATH, filePath), 'utf-8')
}
UTIL.file.write = (filePath, content) => {
  mkdirp.sync(path.dirname(filePath))
  fs.writeFileSync(path.resolve(APP_PATH, filePath), content)
}
UTIL.file.delete = (filePath) => {
  filePath = path.resolve(APP_PATH, filePath)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
UTIL.file.find = (dirPath, ext, onFind) => {
  dirPath = path.resolve(APP_PATH, dirPath)
  function _find (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((fileName) => {
        _find(path.resolve(filePath, fileName))
      })
    } else {
      if (filePath.endsWith(ext)) {
        const dirPath = path.dirname(filePath)
        const fileName = filePath.split(path.sep).pop().replace(ext, '')
        const dirName = dirPath.split(path.sep).pop()
        const fileExt = ext
        onFind({ filePath, dirPath, fileName, dirName, fileExt })
      }
    }
  }
  _find(dirPath)
}
UTIL.file.findAsync = (dirPath, ext, onFind) => {
  return new Promise((resolve, reject) => {
    dirPath = path.resolve(APP_PATH, dirPath)
    const callbacks = []
    function _find (filePath) {
      if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach((fileName) => {
          _find(path.resolve(filePath, fileName))
        })
      } else {
        if (filePath.endsWith(ext)) {
          const dirPath = path.dirname(filePath)
          const fileName = filePath.split(path.sep).pop().replace(ext, '')
          const dirName = dirPath.split(path.sep).pop()
          const fileExt = ext
          callbacks.push(async (done) => {
            try {
              await onFind({ filePath, dirPath, fileName, dirName, fileExt })
              done()
            } catch (err) { done(err) }
          })
        }
      }
    }
    _find(dirPath)
    async.waterfall(callbacks, (err, result) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}
