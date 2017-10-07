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

    /**
    * Identificador único de la ruta
    * @type {String}
    */
    this.routeId = null
  }

  /**
  * Inicializa la propiedad sequelizeOptions que devuelve un objeto para realizar una
  * consulta con todos los campos especificados en la ruta.
  * @param {!Route} route Ruta para la que se creará la consulta.
  * @param {!Model[]} models Modelos de la aplicación.
  * @param {!Object} db Objeto que contiene todos los modelos sequelize,
  * una instancia y una referencia de la clase Sequelize.
  */
  init(route, models, db) {
    this.routeId = route.ID()
    this.sequelizeOptions = route.model ? route.model.queryOptions(route.output, models, db) : undefined
  }

  /**
  * Devuelve la propiedad sequelizeOptions optimizada en base a la query enviada a través de la URL.
  * @param {!ExpressRequest} req Objeto request de express, que se obtiene del argumento de un callback.
  * @param {!Route} route Ruta para la que se creará la consulta.
  * @return {Object}
  */
  getOptions(req, route) {
    // Antes que nada, se crea el modelo de salida en base a la query especificada en la URL.
    this.outputTemplate = this._createOutputTemplate(req.query.fields, route)
    // Si no existe un modelo, significa que no es parte de un recurso, por lo tanto devuelve undefined.
    if (!route.model) {
      return
    }
    // Optimiza el objeto sequelizeOptions creado con el método init, en base al modelo de salida (outputTemplate).
    let finalOptions = this._optimizeOptions(this.outputTemplate, this.sequelizeOptions, req.query, '')
    // Se incluyen los filtros offset y limit si la ruta es un recurso y el resultado es un array.
    if (route.model && Array.isArray(route.output)) {
      finalOptions.offset = req.query.offset || 0
      finalOptions.limit = req.query.limit || 50
      // Se incluye la opcion sort.
      finalOptions.order = []
      let querySorts = req.query.sort ? req.query.sort.split(',') : ['id asc']
      for (let i in querySorts) {
        let [sortFieldName, orderType] = querySorts[i].split(' ')
        if (!sortFieldName || !orderType) {
          continue
        }
        if ((orderType.toLowerCase() == 'asc') || (orderType.toLowerCase() == 'desc')) {
          for (let prop in route.model.fields) {
            if (sortFieldName == prop) {
              finalOptions.order.push([prop, orderType.toLowerCase()])
              break
            }
          }
        }
      }
    }
    return finalOptions
  }

  /**
  * Devuelve una promesa cuya tarea es crear los metadatos.
  * @param {!ExpressRequest} req Objeto request de express, que se obtiene del argumento de un callback.
  * @param {!Route} route Ruta para la que se creará los metadatos.
  * @param {!Object} db Modelos sequelize.
  * @return {Promise}
  */
  createMetadata(req, route, db) {
    return new Promise((resolve, reject) => {
      async function task() {
        try {
          let total = await db[route.model.name].count()
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
  * @param {String} [queryFields='all'] Valor de la variable req.query.fields.
  * @param {!Route} route Ruta para la que se creará el template.
  * @param {!Model[]} models Colección de modelos.
  * @return {Object}
  */
  _createOutputTemplate(queryFields = 'all', route) {
    if (queryFields.indexOf('ALL') != -1) {
      queryFields = this._createQueryFieldsALL(route.output)
    }
    let queryOutput = this._queryTemplate(queryFields, route)     // queryOutput
    let finalOutput = this._intersect(route.output, queryOutput, true)
    return finalOutput
  }

  /**
  * Devuelve una queryFields con todos los campos descritos en la ruta.
  * @param {!Object} output Propiedad output de una ruta.
  * @return {String}
  */
  _createQueryFieldsALL(output) {
    if (Array.isArray(output)) {
      return this._createQueryFieldsALL(output[0])
    }
    let includes = ''
    for (let prop in output) {
      if (!(output[prop] instanceof Field)) {
        let result = this._createQueryFieldsALL(output[prop])
        includes += `,${prop}(${result})`
      }
    }
    let queryFields = `all`
    if (includes.length > 1) {
      queryFields += `,${includes.substr(1)}`
    }
    return queryFields
  }

  /**
  * Devuelve un template a partir de los filtros para una determinada ruta.
  * Este es un template parcial, un objeto que representa los posibles campos de salida
  * que se crea a partir del campo fields que se envía a través de la query.
  * Este campo fields puede contener la palabra all, que dignifica que se incluirán
  * todos los campos del modelo excluyendo a las referencias y asociaciones.
  * @param {String} [queryFields='all'] Campos que se incluiran en el resultado de la petición.
  * @param {!Route} route Ruta para la que se creará el template.
  * @return {Object}
  */
  _queryTemplate(queryFields = 'all', route) {
    let queryTemplate = { }
    // Si no se especifica los campos a devolver, por defecto devuelve todos los campos del modelo.
    while(queryFields.indexOf('()') != -1) {
      queryFields = queryFields.replace('()','(all)')
    }
    // Reemplaza los espacios en blanco
    while(queryFields.indexOf(' ') != -1) {
      queryFields = queryFields.replace(' ','')
    }
    let iniM = 0, finM = 0, iniF = 0, finF = 0, level = 0, modelsQuery = []
    for (let index in queryFields) {
      let c = queryFields[index]
      if (c == ',') {
        finF = parseInt(index) - iniF
        if (finF > 1) {
          let fieldName = queryFields.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == '(') {
        finM = parseInt(index) - iniM
        let modelName = queryFields.substr(iniM, finM)
        modelsQuery[level] = modelName
        level++
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == ')') {
        finF = parseInt(index) - iniF
        finM = parseInt(index) - iniM
        if (finF > 1) {
          let fieldName = queryFields.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
        level--
      }
      if ((parseInt(index) == (queryFields.length - 1)) && (iniF < queryFields.length)) {
        let fieldName = queryFields.substr(iniF)
        this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
      }
    }
    return queryTemplate
  }

  /**
  * Inserta las propiedades sobre el modelo que le corresponde dentro del objeto queryTemplate.
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
      obj[modelName] = obj[modelName] || {}
      this._insertar(obj[modelName], cnt + 1, level, modelsQuery, fieldName, output[modelName], rootModel)
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
  * @param {String} query Consulta ingresada a traves de la URL. Ej.: query = 'id=1,2&nombre=ana'.
  * @param {String} trace Cadena de texto que almacena el nombre completo del campo.
  * @return {Object} Objeto de tipo sequelizeOptions optimizado.
  * @ignore
  */
  _optimizeOptions(outputTemplate, options, query, trace) {
    let finalOptions = { attributes: [] }
    if (Array.isArray(outputTemplate)) {
      outputTemplate = outputTemplate[0]
    }
    let include = []
    for(let prop in outputTemplate) {
      if (outputTemplate[prop] instanceof Field) {
        finalOptions.attributes.push(prop)
        let finalTrace = (trace == '') ? `${prop}` : `${trace}.${prop}`
        if (query[finalTrace]) {
          if (prop == 'id') {
            // Puede devolver varios registros a la vez, a partir de sus ids.
            let ids = query[finalTrace].split(',').map(Number)
            ids = this._getUniqueValues(ids)
            // Solamente si el valor de los ids son válidos se adiciona la propiedad where.
            for (let i in ids) {
              let { isValid, message } = outputTemplate[prop].validate(ids[i])
              if (!isValid) {
                throw new UnprocessableEntityError(`El valor del campo '${finalTrace}' especificado en la query es inválido, ${message}`)
              }
            }
            if (!finalOptions.where) { finalOptions.where = { } }
            finalOptions.where['id'] = {$in: ids}
          } else {
            // Para cualquier otro campo que no sea un id, la comparación es directa
            let { isValid, value, message } = outputTemplate[prop].validate(query[finalTrace])
            if (!isValid) {
              throw new UnprocessableEntityError(`El valor del campo '${finalTrace}' especificado en la query es inválido, ${message}`)
            }
            if (isValid === true) {
              if (!finalOptions.where) { finalOptions.where = { } }
              finalOptions.where[prop] = value
            }
          }
        }
      } else {
        for (let j in options.include) {
          let as = options.include[j].as
          if (options.include[j].as == prop) {
            let newTrace = (trace == '') ? `${as}` : `${trace}.${as}`
            let opt = this._optimizeOptions(outputTemplate[prop], options.include[j], query, newTrace)
            opt.model = options.include[j].model
            opt.as = options.include[j].as
            include.push(opt)
          }
        }
      }
    }
    // Si o si se deben incluir las claves primarias y foraneas, para realizar una consulta sin problemas.
    // Es por eso que verificamos que se hayan incluido todos los campos que comiencen con 'id'
    for (let i in options.attributes) {
      let prop = options.attributes[i]
      if (prop.startsWith('id')) {
        if (!finalOptions.attributes.includes(prop)) {
          finalOptions.attributes.push(prop)
        }
      }
    }
    if (include.length > 0) finalOptions.include = include
    return finalOptions
  }

  /**
  * Devuelve un array de strings sin duplicados.
  * @param {!String[]} array Array de Strings.
  * @return {String[]}
  */
  _getUniqueValues(array) {
    return array.reduce(function(a, b) {
      if(a.indexOf(b) < 0) {
        a.push(b)
        return a
      }
    }, [])
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
            let msg = `Se esperaba un array de objetos. Ruta: ${this.routeId}`
            throw new Error(msg)
          }
        }
      } else {
        final = {}
        if (Array.isArray(objB)) {
          let msg = `Se esperaba un objeto. Ruta: ${this.routeId}`
          throw new Error(msg)
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
          let msg = `Se esperaba un array de objetos. Ruta: ${this.routeId}`
          throw new Error(msg)
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
          if ((typeof objB == 'undefined') || (typeof objB[prop] == 'undefined') || (objB[prop] == null) ) {
            // Si es null, significa que no existe un registro con esta propiedad.
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
