module.exports = (app) => {
  const ROUTE = {}

  ROUTE.hello = {
    path   : '/hello/:name',
    method : 'get'
  }

  return ROUTE
}
