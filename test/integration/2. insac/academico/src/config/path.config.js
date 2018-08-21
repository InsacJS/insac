const path = require('path')

const PROJECT_PATH = process.env.PROJECT_PATH

const PATH = {
  project : PROJECT_PATH,
  sources : path.resolve(PROJECT_PATH, 'src'),
  logs    : path.resolve(PROJECT_PATH, 'logs'),
  public  : path.resolve(PROJECT_PATH, 'public')
}

module.exports = PATH
