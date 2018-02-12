module.exports = (router) => {
  router.GET('/api/v1/usuarios/', 'listar', {
    description: 'Devuelve una lista de todos los usuarios.'
  })
  router.GET('/api/v1/usuarios/:id_usuario', 'obtener', {
    description: 'Devuelve los datos de un usuario a partir de su ID.'
  })
  router.POST('/api/v1/usuarios/', 'crear', {
    description: 'Crea un nuevo usuario.'
  })
  router.PUT('/api/v1/usuarios/:id_usuario', 'actualizar', {
    description: 'Actualiza los datos de un usuario a partir de su ID.'
  })
  router.DELETE('/api/v1/usuarios/:id_usuario', 'eliminar', {
    description: 'Elimina un usuario a partir de su ID.'
  })
}
