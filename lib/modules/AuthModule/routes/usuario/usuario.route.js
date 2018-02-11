module.exports = (router) => {
  router.GET('/api/v1/usuarios/', 'listar', {
    description: 'Devuelve una lista de todos los usuarios.'
  })
  router.GET('/api/v1/usuarios/:id', 'obtener', {
    description: 'Devuelve los datos de un usuario a partir de su ID.'
  })
  router.POST('/api/v1/usuarios/', 'crear', {
    description: 'Crea un nuevo usuario.'
  })
  router.PUT('/api/v1/usuarios/:id', 'actualizar', {
    description: 'Actualiza los datos de un usuario a partir de su ID.'
  })
  router.DELETE('/api/v1/usuarios/:id', 'eliminar', {
    description: 'Elimina un usuario a partir de su ID.'
  })
}
