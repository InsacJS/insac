module.exports = (app) => {
  const ROUTE = {}

  ROUTE.get = {
    path        : '/api/v1/libros',
    method      : 'get',
    description : 'Devuelve una lista de libros.'
  }

  return ROUTE
}
