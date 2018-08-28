module.exports = (app) => {
  const ROUTE = {}

  ROUTE.hello = {
    path   : '/welcome/hello/:name',
    method : 'get'
  }

  return ROUTE
}
