const Sequelize = require('sequelize')
const _         = require('lodash')
const path      = require('path')

const Seed = require('../../../../../lib/libs/SeedCreator')
const util = require(`../../../../../lib/tools/util`)

let config

describe('\n - Función create con registros anidados [HasOne, HasMany]', () => {
  before(() => {
    config = _.cloneDeep(require('../../../../test.config'))
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
  const PERSONAS  = require(path.resolve(__dirname, 'seeds/persona.seed.js'))()
  const USUARIOS  = require(path.resolve(__dirname, 'seeds/usuario.seed.js'))()
  const ROLES     = require(path.resolve(__dirname, 'seeds/rol.seed.js'))()

  let sequelize = await createSequelizeInstance(_.cloneDeep(config.DATABASE[dialect]))
  await Seed.create(sequelize.models.persona, _.cloneDeep(PERSONAS), { schemas: ['auth'] })
  expect(await sequelize.models.persona.count()).to.equal(PERSONAS.length)
  expect(await sequelize.models.usuario.count()).to.equal(USUARIOS.length)
  expect(await sequelize.models.rol.count()).to.equal(ROLES.length)
  await sequelize.close()

  sequelize = await createSequelizeInstance(_.cloneDeep(config.DATABASE[dialect]))
  await Seed.create(sequelize.models.usuario, _.cloneDeep(USUARIOS), { schemas: ['auth'] })
  expect(await sequelize.models.persona.count()).to.equal(PERSONAS.length)
  expect(await sequelize.models.usuario.count()).to.equal(USUARIOS.length)
  expect(await sequelize.models.rol.count()).to.equal(ROLES.length)
  await sequelize.close()

  sequelize = await createSequelizeInstance(_.cloneDeep(config.DATABASE[dialect]))
  await Seed.create(sequelize.models.rol, _.cloneDeep(ROLES), { schemas: ['auth'] })
  expect(await sequelize.models.persona.count()).to.equal(PERSONAS.length)
  expect(await sequelize.models.usuario.count()).to.equal(USUARIOS.length)
  expect(await sequelize.models.rol.count()).to.equal(ROLES.length)
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
  util.find(pathModels, '.model.js', ({ filePath }) => { sequelize.import(filePath) })
  for (let modelName in sequelize.models) { sequelize.models[modelName].associate(sequelize.models) }
  await sequelize.dropSchema('auth', { force: true })
  await sequelize.createSchema('auth')
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
