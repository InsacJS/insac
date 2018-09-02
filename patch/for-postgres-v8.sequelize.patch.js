const path = require('path')
const fs   = require('fs')

function readFile (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function writeFile (filePath, content) {
  fs.writeFileSync(filePath, content)
}

const QUERY_GENERATOR_PATH = path.resolve(process.cwd(), 'node_modules/sequelize/lib/dialects/postgres/query-generator.js')

let queryGeneratorContent = readFile(QUERY_GENERATOR_PATH)

const oldLine = `SELECT t.typname enum_name, array_agg(e.enumlabel ORDER BY enumsortorder) enum_value FROM pg_type t`
const newLine = `SELECT t.typname enum_name, array_agg(e.enumlabel) enum_value FROM pg_type t`

queryGeneratorContent = queryGeneratorContent.replace(oldLine, newLine)

writeFile(QUERY_GENERATOR_PATH, queryGeneratorContent)
