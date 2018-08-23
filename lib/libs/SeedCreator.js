/**
* Clase para crear seeders
*/
class SeedCreator {
  /**
  * Inserta un conjunto de registros en la base de datos.
  * @param {SequelizeModel} model                - Modelo Sequelize.
  * @param {!Object[]}      data                 - Lista de registros.
  * @param {Object}         [options]            - Opciones de configuración.
  * @param {String[]}       [options.schemas=[]] - Esquemas permitidos para la
  *                                                inserción de registros.
  * @param {Logger}         [options.logger]     - Instancia de logger.
  * @return {Promise}
  */
  static async create (model, data, options = {}) {
    SeedCreator.total = data.length
    SeedCreator.cnt   = 0
    options.schemas   = options.schemas || []
    options.logger    = options.logger  || { appPrimary: (title = '', message = '') => console.log(title, message), OK: '', FAIL: 'x' }
    SeedCreator.startAt = Date.now()
    if (_verifyToBulkInsert(model, data)) {
      await model.options.sequelize.transaction(async (t) => {
        options.t = options.transaction || t
        options.logger.appPrimary()
        return _bulkInsert(model, data, options)
      })
    } else {
      await model.options.sequelize.transaction(async (t) => {
        options.t = options.transaction || t
        options.logger.appPrimary()
        for (let i in data) {
          await _create(model, data[i], options)
          options.logger.appPrimary()
        }
      })
    }
    SeedCreator.endAt = Date.now()
    const elapsedTime = (SeedCreator.endAt - SeedCreator.startAt) / 1000
    const result = {
      entries     : SeedCreator.total,
      elapsedTime : elapsedTime
    }
    delete SeedCreator.total
    delete SeedCreator.cnt
    return result
  }
}

/**
* @ignore
* Indica si es posible insertar registros en masa.
* Verifica que todos los registros tengan la clave primaria y no incluyan asociaciones.
* @param {SequelizeModel} model - Modelo Sequelize.
* @param {!Object[]}      data  - Lista de registros.
* @return {Boolean}
*/
function _verifyToBulkInsert (model, data) {
  const PK = Object.keys(model.primaryKeys)[0]
  for (let i in data) {
    let hasPK = false
    for (let fieldName in data[i]) {
      if (typeof data[i][fieldName] === 'object' && !Array.isArray(data[i][fieldName])) { return false }
      if (!model.attributes[fieldName]) { return false }
      if (fieldName === PK) { hasPK = true }
    }
    if (!hasPK) { return false }
  }
  return true
}

/**
* @ignore
* Inserta un conjunto de registros en la base de datos.
* Si la clave primaria es autoincrementabe, también se actualiza la secuencia.
* @param {SequelizeModel} model   - Modelo Sequelize.
* @param {!Object[]}      data    - Datos del registro.
* @param {!Object}        options - Opciones de configuración.
*                                   para la inserción de registros.
* @return {Promise<Number>} ID del registro insertado.
*/
async function _bulkInsert (model, data, options) {
  let schema = model.options.schema ? `${model.options.schema}.` : ''
  options.logger.appPrimary('BULK INSERT', `${schema}${model.name} [${data.length} registros] ...\n`)
  _verifyAccess(model, options)
  const PK = Object.keys(model.primaryKeys)[0]
  await model.bulkCreate(data, { returning: true, transaction: options.t })
  if (model.attributes[PK].autoIncrement === true) {
    await _updateAutoIncrement(model, PK, options)
  }
}

/**
* @ignore
* Verifica si el modelo tiene un esquema que se encuentre entre la lista de esquemas permitidos.
* @param {SequelizeModel} model   - modelo Sequelize.
* @param {!Object}        options - Opciones de configuración.
*                                   para la inserción de registros.
*/
function _verifyAccess (model, options) {
  const SCHEMA = model.options.schema
  if (options.schemas.length > 0) {
    if (SCHEMA && !options.schemas.includes(SCHEMA)) {
      let esquemasPermitidos = options.schemas.toString()
      let data = `  El esquema '${SCHEMA}' no se encuentra en la lista de esquemas que pueden ser modificados\n`
      data += `  Los esquemas permitidos son: ${esquemasPermitidos}\n\n`
      data += `  Verifique que el módulo al que pertenece la tabla tenga permisos de instalación (setup = true)`
      options.logger.appError(`Se necesitan permisos para modificar la tabla '${SCHEMA}.${model.name}'.`, data)
      process.exit(1)
    }
  }
}

/**
* @ignore
* Prepara los datos para insertarlos en la base de datos.
* @param {SequelizeModel} model   - Modelo Sequelize.
* @param {!Object[]}      data    - Lista de registros.
* @param {!Object}        options - Opciones de configuración.
* @return {Promise<Number>} ID del registro insertado.
*/
async function _create (model, data, options) {
  if (Array.isArray(data)) {
    for (let i in data) { await _create(model, data[i], options) } return
  }
  const dataToInsert = {}
  for (let prop in model.attributes) {
    const field = model.attributes[prop]
    if (_isForeignKey(field) && !data[prop]) {
      const ASSOCIATION = _getAssociationModelFromFK(model, field.fieldName)
      if (ASSOCIATION === null) {
        throw new Error(`Se esperaba que el modelo ${model.name} esté asociado con otro modelo como ${prop}.`)
      }
      if (!data[ASSOCIATION.as]) {
        let schema = model.options.schema ? `${model.options.schema}.` : ''
        throw new Error(`Se requiere el campo ${prop} o el objeto ${ASSOCIATION.as} para crear el registro '${schema}${model.name}'.`)
      }
      SeedCreator.total += Array.isArray(data[ASSOCIATION.as]) ? data[ASSOCIATION.as].length : 1
      data[prop] = await _create(ASSOCIATION.target, data[ASSOCIATION.as], options)
    }
    if (typeof data[prop] !== 'undefined') {
      dataToInsert[prop] = data[prop]
    }
  }
  const ID = await _insert(model, dataToInsert, options)
  for (let prop in data) {
    if (!model.attributes[prop]) {
      const ASSOC = _getAssociationModelFromAs(model, prop)
      if (ASSOC && (ASSOC.associationType === 'HasOne' || ASSOC.associationType === 'HasMany')) {
        if (Array.isArray(data[prop])) {
          for (let i in data[prop]) {
            data[prop][i][ASSOC.foreignKey] = ID
          }
        } else {
          data[prop][ASSOC.foreignKey] = ID
        }
        SeedCreator.total += Array.isArray(data[prop]) ? data[prop].length : 1
        await _create(ASSOC.target, data[prop], options)
      }
    }
  }
  return ID
}

/**
* @ignore
* Inserta un registro en la base de datos y devuelve su ID.
* Si la clave primaria es autoincrementabe, también se actualiza la secuencia.
* @param {SequelizeModel} model   - Modelo Sequelize.
* @param {!Object[]}      data    - Datos del registro.
* @param {!Object}        options - Opciones de configuración.
* @return {Promise<Number>} ID del registro insertado.
*/
async function _insert (model, data, options) {
  let schema = model.options.schema ? `${model.options.schema}.` : ''
  try {
    _verifyAccess(model, options)
    const PK     = Object.keys(model.primaryKeys)[0]
    const RESULT = await model.create(data, { transaction: options.t })
    const ID     = RESULT[PK]
    await _updateAutoIncrement(model, PK, options)
    options.logger.appPrimary('INSERT', `[${++SeedCreator.cnt}/${SeedCreator.total}] ${schema}${model.name} .... [${PK}: ${ID}] ${options.logger.OK}`)
    return ID
  } catch (e) {
    options.logger.appError(`INSERT`, `[${++SeedCreator.cnt}/${SeedCreator.total}] ${schema}${model.name} ${options.logger.FAIL}\n`)
    throw e
  }
}

/**
* @ignore
* Actualiza el valor del contador de una clave primaria, solamente si éste fuera de tipo entero y autoincrementable.
* @param {SequelizeModel} model   - Modelo Sequelize.
* @param {String}         PK      - Nombre del campo de la clave primaria.
* @param {!Object}        options - Opciones de configuración.
*/
async function _updateAutoIncrement (model, PK, options) {
  const SCHEMA        = model.options.schema
  const DIALECT       = model.options.sequelize.options.dialect
  const MODEL_NAME    = model.name
  const TABLE_NAME    = `${(!SCHEMA) ? '' : `${SCHEMA}.`}${MODEL_NAME}`
  const SEQUENCE_NAME = `${(!SCHEMA) ? '' : `${SCHEMA}.`}${MODEL_NAME}_${PK}_seq`
  const seq           = model.options.sequelize
  const OPT           = { transaction: options.t, paranoid: false }
  if (model.attributes[PK].type.key === 'INTEGER' && model.attributes[PK].autoIncrement === true) {
    const ID = (await model.max(PK, OPT)) || 1
    switch (DIALECT) {
      case 'postgres' : await seq.query(`ALTER SEQUENCE ${SEQUENCE_NAME} RESTART WITH ${ID + 1}`,          OPT); break
      case 'mysql'    : await seq.query(`ALTER TABLE \`${TABLE_NAME}\` AUTO_INCREMENT = ${ID + 1}`,        OPT); break
      case 'mssql'    : await seq.query(`DBCC CHECKIDENT ('${TABLE_NAME}', RESEED, ${ID})`,                OPT); break
      case 'sqlite'   : await seq.query(`UPDATE SQLITE_SEQUENCE SET SEQ=${ID} WHERE NAME='${TABLE_NAME}'`, OPT); break
      default:
        const data = `  Dialectos soportados: postgres, mysql, mssql y sqlite.\n`
        options.logger.appError(null, `No existe el dialecto '${DIALECT}'.`, data)
    }
  }
}

/**
* @ignore
* Devuelve la asociación correspondiente a una clave foránea.
* @param {SequelizeModel} model      - Modelo sequelize.
* @param {String}         foreignKey - Clave foranea
* @return {Object}
*/
function _getAssociationModelFromFK (model, foreignKey) {
  for (let key in model.associations) {
    const ASSOCIATION = model.associations[key]
    if (ASSOCIATION.foreignKey === foreignKey) { return ASSOCIATION }
  }
  return null
}

/**
* @ignore
* Devuelve la asociación correspondiente a partir del nombre asociado.
* @param {SequelizeModel} model - Modelo sequelize.
* @param {String}         as    - Nombre de la asociacion.
* @return {Object}
*/
function _getAssociationModelFromAs (model, as) {
  for (let key in model.associations) {
    const ASSOCIATION = model.associations[key]
    if (ASSOCIATION.as === as) { return ASSOCIATION }
  }
  return null
}

/**
* @ignore
* Indica si un objeto es atributo con clave foránea.
* @param {Object} obj Objeto.
* @return {Boolean}
*/
function _isForeignKey (obj) {
  if (obj && obj._modelAttribute && (obj._modelAttribute === true) && obj.references) {
    return true
  }
  return false
}

module.exports = SeedCreator
