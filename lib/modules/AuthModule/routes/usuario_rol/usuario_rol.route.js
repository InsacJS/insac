module.exports = (router) => {
  router.GET('/api/v1/usuarios_roles/', 'listar', {
    description: 'Devuelve una lista de todos los registros usuario_rol.'
  })
  router.GET('/api/v1/usuarios_roles/:id', 'obtener', {
    description: 'Devuelve los datos de un usuario_rol a partir de su ID.'
  })
  router.POST('/api/v1/usuarios_roles/', 'crear', {
    description: 'Crea un nuevo usuario_rol.'
  })
  router.PUT('/api/v1/usuarios_roles/:id', 'actualizar', {
    description: 'Actualiza los datos de un usuario_rol a partir de su ID.'
  })
  router.DELETE('/api/v1/usuarios_roles/:id', 'eliminar', {
    description: 'Elimina un usuario_rol a partir de su ID.'
  })
}
