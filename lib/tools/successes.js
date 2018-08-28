/**
* Objeto para instanciar objetos de tipo 'success'
* @type {Object}
* @property {OkSuccess}         Ok        - Clase OkSuccess
* @property {CreatedSuccess}    Created   - Clase CreatedSuccess
* @property {NoContentSuccess}  NoContent - Clase NoContentSuccess
*/
const successes = {
  Ok        : require('../libs/successes/OkSuccess'),
  Created   : require('../libs/successes/CreatedSuccess'),
  NoContent : require('../libs/successes/NoContentSuccess')
}

module.exports = successes
