const { Field, THIS } = require('insac')

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.get = Field.group(app.API.models.post, [
    {
      id_post     : THIS(),
      titulo      : THIS(),
      fecha       : THIS(),
      descripcion : THIS(),
      fid_autor   : THIS(),
      autor       : {
        id_persona : THIS(),
        nombre     : THIS(),
        telefono   : THIS(),
        email      : THIS(),
        posts      : [
          {
            id_post     : THIS(),
            titulo      : THIS(),
            fecha       : THIS(),
            descripcion : THIS(),
            fid_autor   : THIS()
          }
        ]
      }
    }
  ])

  OUTPUT.getId = Field.group(app.API.models.post, {
    id_post     : THIS(),
    titulo      : THIS(),
    fecha       : THIS(),
    descripcion : THIS(),
    fid_autor   : THIS(),
    autor       : {
      id_persona : THIS(),
      nombre     : THIS(),
      telefono   : THIS(),
      email      : THIS(),
      posts      : [
        {
          id_post     : THIS(),
          titulo      : THIS(),
          fecha       : THIS(),
          descripcion : THIS(),
          fid_autor   : THIS()
        }
      ]
    }
  })

  OUTPUT.create = Field.group(app.API.models.post, {
    id_post     : THIS(),
    titulo      : THIS(),
    fecha       : THIS(),
    descripcion : THIS(),
    fid_autor   : THIS()
  })

  OUTPUT.update = null

  OUTPUT.destroy = null

  OUTPUT.restore = null

  // <!-- [CLI] - [COMPONENT] --!> //

  return OUTPUT
}
