const Sequelize = require('sequelize')
const _         = require('lodash')
const path      = require('path')
const Seed      = require('../../../../../lib/libs/SeedCreator')

let config

let LIBROS
let AUTORES

describe('\n - Función create con registros anidados [BelongsTo]', () => {
  before(() => {
    config = _.cloneDeep(require('../../../../test_config'))
    LIBROS  = require(path.resolve(__dirname, 'seeds/libro.seed.js'))()
    AUTORES = require(path.resolve(__dirname, 'seeds/autor.seed.js'))()
  })

  it('Prueba con el dialecto postgres', async () => {
    await _test('postgres')
  })
  it('Prueba con el dialecto mysql', async () => {
    await _test('mysql')
  })
  it('Prueba con el dialecto mssql', async () => {
    await _test('mssql')
  })
  it('Prueba con el dialecto sqlite', async () => {
    await _test('sqlite')
  })
})

async function _test (dialect) {
  const sequelize = await createSequelizeInstance(_.cloneDeep(config.DATABASE[dialect]))
  await Seed.create(sequelize.models.libro, _.cloneDeep(LIBROS), { schemas: ['uno', 'dos'] })
  await Seed.create(sequelize.models.autor, _.cloneDeep(AUTORES), { schemas: ['uno', 'dos'] })
  expect(true).to.equal(true)
  await sequelize.close()
}

async function createSequelizeInstance (DB_CONFIG) {
  await _createDatabase(DB_CONFIG)
  const DATABASE   = DB_CONFIG.database
  const USERNAME   = DB_CONFIG.username
  const PASSWORD   = DB_CONFIG.password
  const PARAMS     = DB_CONFIG.params
  const sequelize  = new Sequelize(DATABASE, USERNAME, PASSWORD, PARAMS)
  const pathModels = path.resolve(__dirname, './models')
  sequelize.import(`${pathModels}/autor.model.js`)
  sequelize.import(`${pathModels}/libro.model.js`)
  sequelize.models.libro.associate(sequelize.models)
  await sequelize.dropSchema('dos', { force: true })
  await sequelize.dropSchema('uno', { force: true })
  await sequelize.createSchema('uno')
  await sequelize.createSchema('dos')
  await sequelize.sync({ force: true })
  return sequelize
}

async function _createDatabase (DB_CONFIG) {
  const DATABASE = DB_CONFIG.database
  let sequelizeROOT
  try {
    sequelizeROOT = _createRootInstance(DB_CONFIG)
    await sequelizeROOT.authenticate()
    await sequelizeROOT.query(`CREATE DATABASE ${DATABASE}`)
  } catch (e) {
    const MSG = e.message
    const EXIST_DATABASE = MSG.includes('already exists') || MSG.includes('database exists') || MSG.includes('near')
    if (EXIST_DATABASE) {
      return
    }
    throw e
  } finally {
    await sequelizeROOT.close()
  }
}

function _createRootInstance (DB_CONFIG) {
  const DIALECT = DB_CONFIG.params.dialect
  let database = null
  switch (DIALECT) {
    case 'postgres' : database = 'postgres'; break
    case 'mysql'    : database = null;       break
    case 'mssql'    : database = 'master';   break
    case 'sqlite'   : database = 'database'; break
    default: database = null
  }
  const username = DB_CONFIG.username
  const password = DB_CONFIG.password
  const params   = _.cloneDeep(DB_CONFIG.params)
  return new Sequelize(database, username, password, params)
}
