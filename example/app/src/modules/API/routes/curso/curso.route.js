module.exports = (router) => {
  router.GET('/api/v1/a/cursos/', 'listar', {
    description: 'Devuelve una lista de todos los cursos.'
  })
  router.GET('/api/v1/a/cursos/:id', 'obtener', {
    description: 'Devuelve los datos de un curso a partir de su ID.'
  })
  router.POST('/api/v1/a/cursos/', 'crear', {
    description: 'Crea un nuevo curso.'
  })
  router.PUT('/api/v1/a/cursos/:id', 'actualizar', {
    description: 'Actualiza los datos de un curso a partir de su ID.'
  })
  router.DELETE('/api/v1/a/cursos/:id', 'eliminar', {
    description: 'Elimina un curso a partir de su ID.'
  })
}
