const { THIS } = require(global.INSAC)

module.exports = (app) => {
  const INPUT = {}

  INPUT.listar = {
    headers: { authorization: THIS('auth') },
    query: {
      fields: THIS('query'),
      order: THIS('query'),
      limit: THIS('query'),
      page: THIS('query')
    }
  }

  INPUT.obtener = {
    headers: { authorization: THIS('auth') },
    query: {
      fields: THIS('query')
    }
  }

  INPUT.crear = {
    headers: { authorization: THIS('auth') }
  }

  INPUT.actualizar = {
    headers: { authorization: THIS('auth') }
  }

  INPUT.eliminar = {
    headers: { authorization: THIS('auth') }
  }

  return INPUT
}
