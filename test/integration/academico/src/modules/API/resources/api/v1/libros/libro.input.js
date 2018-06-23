const { Field, THIS } = require(global.INSAC)

module.exports = (app) => {
  const INPUT = {}

  INPUT.get = {
    query: {
      fields : Field.FIELDS,
      order  : Field.ORDER,
      limit  : Field.LIMIT,
      page   : Field.PAGE
    }
  }

  INPUT.getId = {
    query: {
      fields: Field.FIELDS
    },
    params: Field.group(app.API.models.libro, {
      id: THIS({ allowNull: false })
    })
  }

  INPUT.create = {
    body: Field.group(app.API.models.libro, {
      titulo      : THIS({ allowNull: false }),
      nro_paginas : THIS({ allowNull: false }),
      precio      : THIS({ allowNull: false }),
      resumen     : THIS({ allowNull: false }),
      fid_autor   : THIS({ allowNull: false })
    })
  }

  INPUT.update = {
    params: Field.group(app.API.models.libro, {
      id: THIS({ allowNull: false })
    }),
    body: Field.group(app.API.models.libro, {
      titulo      : THIS({ allowNull: true }),
      nro_paginas : THIS({ allowNull: true }),
      precio      : THIS({ allowNull: true }),
      resumen     : THIS({ allowNull: true }),
      fid_autor   : THIS({ allowNull: true })
    })
  }

  INPUT.destroy = {
    params: Field.group(app.API.models.libro, {
      id: THIS({ allowNull: false })
    })
  }

  INPUT.restore = {
    params: Field.group(app.API.models.libro, {
      id: THIS({ allowNull: false })
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return INPUT
}
