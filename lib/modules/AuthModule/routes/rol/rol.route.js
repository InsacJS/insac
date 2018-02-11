module.exports = (router) => {
  router.GET('/api/v1/roles/', 'listar', {
    description: 'Devuelve una lista de todos los roles.'
  })
  router.GET('/api/v1/roles/:id', 'obtener', {
    description: 'Devuelve los datos de un rol a partir de su ID.'
  })
  router.POST('/api/v1/roles/', 'crear', {
    description: 'Crea un nuevo rol.'
  })
  router.PUT('/api/v1/roles/:id', 'actualizar', {
    description: 'Actualiza los datos de un rol a partir de su ID.'
  })
  router.DELETE('/api/v1/roles/:id', 'eliminar', {
    description: 'Elimina un rol a partir de su ID.'
  })
}
