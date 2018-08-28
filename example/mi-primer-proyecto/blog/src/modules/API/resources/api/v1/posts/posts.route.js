module.exports = (app) => {
  const ROUTE = {}

  ROUTE.get = {
    path        : '/api/v1/posts',
    method      : 'get',
    description : 'Devuelve una lista de registros.',
    version     : 1
  }

  ROUTE.getId = {
    path        : '/api/v1/posts/:id_post',
    method      : 'get',
    description : 'Devuelve un registro por ID.',
    version     : 1
  }

  ROUTE.create = {
    path        : '/api/v1/posts',
    method      : 'post',
    description : 'Crea un nuevo registro.',
    version     : 1
  }

  ROUTE.update = {
    path        : '/api/v1/posts/:id_post',
    method      : 'put',
    description : 'Modifica un registro por ID.',
    version     : 1
  }

  ROUTE.destroy = {
    path        : '/api/v1/posts/:id_post',
    method      : 'delete',
    description : 'Elimina un registro por ID.',
    version     : 1
  }

  ROUTE.restore = {
    path        : '/api/v1/posts/:id_post/restore',
    method      : 'put',
    description : 'Restaura un registro eliminado por ID.',
    version     : 1
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return ROUTE
}
