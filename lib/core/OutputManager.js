'use strict'
/** @ignore */ const Field = require('../fields/Field')
/** @ignore */ const UnprocessableEntityError = require('../errors/UnprocessableEntityError')

/**
* Esta clase se encarga de controlar que el resultado sea tal cual como se describe en la ruta.
*/
class OutputManager {

  /**
  * Crea una instancia de la calse OutputManager
  */
  constructor() {

    /**
    * Objeto que contiene todos los campos válidos a ser devueltos.
    * @type {Object}
    */
    this.outputTemplate = {}

    /**
    * Objeto que se utiliza para realizar consultas sequelize.
    * @type {Object}
    */
    this.sequelizeOptions = {}

    /**
    * Conjunto de datos válidos.
    * @type {Object}
    */
    this.data = {}
  }

  /**
  * Inicializa la propiedad sequelizeOptions que devuelve un objeto para realizar una
  * consulta con todos los campos especificados en la ruta.
  * @param {Route} route Ruta para la que se creará la consulta.
  * @param {Model[]} models Modelos de la aplicación.
  * @param {Object} db Objeto que contiene todos los modelos sequelize,
  * una instancia y una referencia de la clase Sequelize.
  */
  init(route, models, db) {
    this.sequelizeOptions = route.model ? route.model.queryOptions(route.output, models, db) : undefined
  }

  /**
  * Crea el objeto que se utilizará como modelo de resultado.
  * @param {ExpressRequest} req Objeto request de express, que se obtiene del argumento de un callback.
  * @param {Route} route Ruta para la que se creará la consulta.
  * @param {Model[]} models Modelos de la aplicación.
  */
  createOutputTemplate(req, route, models) {
    this.outputTemplate = this._createOutputTemplate(req.query.fields, route, models)
  }

  /**
  * Devuelve la propiedad sequelizeOptions optimizada en base a la query enviada a través de la URL.
  * @param {ExpressRequest} req Objeto request de express, que se obtiene del argumento de un callback.
  * @param {Route} route Ruta para la que se creará la consulta.
  * @param {Model[]} models Modelos de la aplicación.
  * @return {Object}
  */
  getOptions(req, route, models) {
    if (!route.model) {
      return
    }
    let finalOptions = this._optimizeOptions(this.outputTemplate, this.sequelizeOptions)
    // Se incluyen los filtros offset y limit si la ruta es un recurso y el resultado es un array.
    if (route.model && Array.isArray(route.output)) {
      finalOptions.offset = req.query.offset || 0
      finalOptions.limit = req.query.limit || 50
    }
    return finalOptions
  }

  /**
  * Devuelve una promesa cuya tarea es crear los metadatos.
  * @param {ExpressRequest} req Objeto request de express, que se obtiene del argumento de un callback.
  * @param {Route} route Ruta para la que se creará la consulta.
  * @param {Object} db Modelos sequelize.
  * @return {Promise}
  */
  createMetadata(req, route, db) {
    return new Promise((resolve, reject) => {
      async function task() {
        try {
          let options = { }
          if (req.options.where) options.where = req.options.where
          let total = await db.administrativo.count(options)
          let metadata = {
            limit: req.query.limit || 50,
            offset: req.query.offset || 0,
            total: total
          }
          resolve(metadata)
        } catch(err) {
          reject(err)
        }
      }
      task()
    })
  }

  /**
  * Almacena de forma temporal el valor del resultado devuelto por el controlador de la ruta.
  * Se almacena el resultado final, es decir, contiene solamente los campos que hayan sido declarados
  * en la propiedad output de la ruta.
  * @param {Object} result
  */
  setResult(result) {
    if (result) {
      this.data = this._intersect(this.outputTemplate, result)
    }
  }

  /**
  * Devuelve el resultado almacenado.
  * @return {Object}
  */
  getResult() {
    return this.data
  }

  /**
  * Devuelve un template a partir de los filtros para una determinada ruta.
  * Este es el template final, un objeto que se utiliza para crear el resultado final.
  * @param {String} filter Valor de la variable req.query.fields.
  * @param {Route} route Ruta para la que se creará el template.
  * @param {Model[]} models Colección de modelos.
  * @return {Object}
  */
  _createOutputTemplate(filter, route, models) {
    let queryOutput = this._queryTemplate(filter, route, models)     // queryOutput
    let finalOutput = this._intersect(route.output, queryOutput, true)
    return finalOutput
  }

  /**
  * Devuelve un template a partir de los filtros para una determinada ruta.
  * Este es un template parcial, un objeto que representa los posibles campos de salida
  * que se crea a partir del campo fields que se envía a través de la query.
  * Este campo fields puede contener la palabra all, que dignifica que se incluirán
  * todos los campos del modelo excluyendo a las referencias y asociaciones.
  * @param {String} query Valor de la variable req.query.fields.
  * @param {Route} route Ruta para la que se creará el template.
  * @param {Model[]} models Colección de modelos.
  * @return {Object}
  */
  _queryTemplate(query, route, models) {
    query = (query) ? query : 'all'
    let queryTemplate = { }
    // Si no se especifica los campos a devolver, por defecto devuelve todos los campos del modelo.
    while(query.indexOf("()") != -1) {
      query = query.replace("()","(all)")
    }
    // Reemplaza los espacios en blanco
    while(query.indexOf(" ") != -1) {
      query = query.replace(" ","")
    }
    let iniM = 0, finM = 0, iniF = 0, finF = 0, level = 0, modelsQuery = []
    for (let index in query) {
      let c = query[index]
      if (c == ",") {
        finF = parseInt(index) - iniF
        if (finF > 1) {
          let fieldName = query.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == "(") {
        finM = parseInt(index) - iniM
        let modelName = query.substr(iniM, finM)
        modelsQuery[level] = modelName
        level++
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == ")") {
        finF = parseInt(index) - iniF
        finM = parseInt(index) - iniM
        if (finF > 1) {
          let fieldName = query.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
        level--
      }
      if ((parseInt(index) == (query.length - 1)) && (iniF < query.length)) {
        let fieldName = query.substr(iniF)
        this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
      }
    }
    return queryTemplate
  }

  /**
  * Inserta las propiedades sobre el modelo que le corresponde.
  * @ignore
  */
  _buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route) {
    this._insertar(queryTemplate, 0, level, modelsQuery, fieldName, route.output, route.model)
  }

  /**
  * Inserta las propiedades sobre el modelo que le corresponde de forma recursiva.
  * @ignore
  */
  _insertar(obj, cnt, level, modelsQuery, fieldName, output, rootModel) {
    output = Array.isArray(output) ? output[0] : output
    if (cnt >= level) {
      if (fieldName == 'all') {
        for (let prop in output) {
          if (output[prop] instanceof Field) {
            obj[prop] = output[prop]
          }
        }
      } else {
        if (output[fieldName] instanceof Field){
          obj[fieldName] = output[fieldName]
        }
      }
      return
    }
    let modelQuery = modelsQuery[cnt]
    if (typeof modelQuery != 'undefined') {
      let modelName = modelQuery
      if (!output || !output[modelName]) {
        throw new UnprocessableEntityError(`El campo '${modelName}' especificado en la query, no es parte de esta ruta.`)
      }
      if (true) {
        obj[modelName] = obj[modelName] || {}
        this._insertar(obj[modelName], cnt + 1, level, modelsQuery, fieldName, output[modelName], rootModel)
      } else {
        obj[modelName] = obj[modelName] || {}
        if (!Array.isArray(obj[modelName])) {
          obj[modelName] = [obj[modelName]]
        }
        this._insertar(obj[modelName][0], cnt + 1, level, modelsQuery, fieldName, output[modelName][0], rootModel)
      }
    }
  }

  /**
  * Optimiza la propiedad sequelizeOptions, tomando en cuenta los valores
  * enviados a travéz de la query, esto permite realizar consultas a la base de datos
  * devolviendo únicamente los datos que se necesiten y no asi todos los datos.
  * @param {Object} outputTemplate Objeto que contiene todos los datos válidos
  * a incluir en respuesta final.
  * @param {Object} options Objeto de tipo sequelizeOptions generado anteriormente
  * del que se eliminarán los campos innecesarios.
  * @return {Object} Objeto de tipo sequelizeOptions optimizado.
  * @ignore
  */
  _optimizeOptions(outputTemplate, options) {
    let finalOptions = { attributes: [] }
    if (Array.isArray(outputTemplate)) {
      outputTemplate = outputTemplate[0]
    }
    let include = []
    for(let prop in outputTemplate) {
      if (outputTemplate[prop] instanceof Field) {
        finalOptions.attributes.push(prop)
      } else {
        for (let j in options.include) {
          let as = options.include[j].as
          if (options.include[j].as == prop) {
            let opt = this._optimizeOptions(outputTemplate[prop], options.include[j])
            opt.model = options.include[j].model
            opt.as = options.include[j].as
            if (!opt.attributes.includes('id')) {
              opt.attributes.push('id')
            }
            include.push(opt)
          }
        }
      }
    }
    if (!finalOptions.attributes.includes('id')) {
      finalOptions.attributes.push('id')
    }
    if (include.length > 0) finalOptions.include = include
    return finalOptions
  }

  /**
  * Devuelve el resultado final, a partir de un resultado con todos los datos posibles, la query y el atributo output.
  * Si force == true, si base es un array, no importa si objB es un objeto se lo tratará como un array.
  * Si force == false, si base es un array, obligatoriamente el objB deberá ser un array.
  * @ignore
  */
  _intersect(base, objB, force) {
    let final
    if (typeof objB != 'undefined') {
      if (Array.isArray(base)) {
        final = []
        if (!Array.isArray(objB)) {
          if (force === true) {
            objB = [objB]
          } else {
            throw new Error(`Se esperaba un array de objetos`)
          }
        }
      } else {
        final = {}
        if (Array.isArray(objB)) {
          throw new Error(`Se esperaba un objeto`)
        }
      }
      this._copy(base, objB, final, force)
    }
    return final
  }

  /**
  * Copia los datos de un objeto (objB), en base a las propiedades de un objeto base,
  * creando un objeto final con dichas propiedades, ademas incluye la opción force
  * que permite realizar copias desde un objeto cuyo destino no necesariemente
  * tenga que ser un objeto, puede ser un array.
  * @ignore
  */
  _copy(base, objB, final, force) {
    if (Array.isArray(base)) {
      if (!Array.isArray(objB)) {
        if (force === true) {
          objB = [objB]
        } else {
          throw new Error(`Se esperaba un array de objetos`)
        }
      }
    }
    if (Array.isArray(base) && (objB.length > 0)) {
      for (let i in objB) {
        let x = this._intersect(base[0], objB[i], force)
        if (typeof x != 'undefined') {
          final.push(x)
        }
      }
    } else {
      for (let prop in base) {
        if (!(base[prop] instanceof Field)) {
          if ((typeof objB == 'undefined') || (typeof objB[prop] == 'undefined')) {
            continue
          }
          if(Array.isArray(base[prop])) {
            final[prop] = final[prop] || []
            if (!Array.isArray(final[prop])) {
              final[prop] = [final[prop]]
            }
            this._copy(base[prop], objB[prop], final[prop], force)
          } else {
            final[prop] = {}
            this._copy(base[prop], objB[prop], final[prop], force)
          }
        } else {
          if (objB && (typeof objB[prop] != 'undefined')) {
            if (Array.isArray(final[prop])) {
              final[prop] = objB[prop]
            } else {
              final[prop] = objB[prop]
            }
          }
        }
      }
    }
  }

}

module.exports = OutputManager
