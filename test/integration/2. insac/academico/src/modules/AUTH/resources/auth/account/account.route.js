module.exports = (app) => {
  const ROUTE = {}

  ROUTE.habilitar = {
    path        : '/auth/account/habilitar',
    method      : 'post',
    description : 'Habilita la cuenta de un usuario.'
  }

  ROUTE.deshabilitar = {
    path        : '/auth/account/deshabilitar',
    method      : 'post',
    description : 'Deshabilita la cuenta de un usuario.'
  }

  return ROUTE
}
