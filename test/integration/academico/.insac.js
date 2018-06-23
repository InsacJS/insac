const path = require('path')

exports.PATH = {
  project : __dirname,
  modules : path.resolve(__dirname, './src/modules'),
  config  : path.resolve(__dirname, './src/config'),
  hooks   : path.resolve(__dirname, './src/hooks'),
  logs    : path.resolve(__dirname, './logs'),
  public  : path.resolve(__dirname, './public'),
  apidoc  : path.resolve(__dirname, './public/apidoc')
}

exports.APIDOC = {
  header: { title: 'INTRODUCCIÓN', filename: 'HEADER.md' }
}
