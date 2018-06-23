const { Field, THIS } = require(global.INSAC)

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.get = Field.group(app.API.models.libro, [
    {
      id          : THIS(),
      titulo      : THIS(),
      nro_paginas : THIS(),
      precio      : THIS(),
      resumen     : THIS(),
      fid_autor   : THIS(),
      autor       : {
        id        : THIS(),
        nombre    : THIS(),
        direccion : THIS(),
        telefono  : THIS(),
        tipo      : THIS(),
        activo    : THIS()
      }
    }
  ])

  OUTPUT.getId = Field.group(app.API.models.libro, {
    id          : THIS(),
    titulo      : THIS(),
    nro_paginas : THIS(),
    precio      : THIS(),
    resumen     : THIS(),
    fid_autor   : THIS(),
    autor       : {
      id        : THIS(),
      nombre    : THIS(),
      direccion : THIS(),
      telefono  : THIS(),
      tipo      : THIS(),
      activo    : THIS()
    }
  })

  OUTPUT.create = Field.group(app.API.models.libro, {
    id          : THIS(),
    titulo      : THIS(),
    nro_paginas : THIS(),
    precio      : THIS(),
    resumen     : THIS(),
    fid_autor   : THIS()
  })

  OUTPUT.update = null

  OUTPUT.destroy = null

  OUTPUT.restore = null

  // <!-- [CLI] - [COMPONENT] --!> //

  return OUTPUT
}
