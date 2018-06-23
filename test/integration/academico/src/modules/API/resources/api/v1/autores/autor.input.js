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
    params: Field.group(app.API.models.autor, {
      id: THIS({ allowNull: false })
    })
  }

  INPUT.create = {
    body: Field.group(app.API.models.autor, {
      nombre    : THIS({ allowNull: false }),
      direccion : THIS({ allowNull: false }),
      telefono  : THIS({ allowNull: false }),
      tipo      : THIS({ allowNull: false }),
      activo    : THIS({ allowNull: false })
    })
  }

  INPUT.update = {
    params: Field.group(app.API.models.autor, {
      id: THIS({ allowNull: false })
    }),
    body: Field.group(app.API.models.autor, {
      nombre    : THIS({ allowNull: true }),
      direccion : THIS({ allowNull: true }),
      telefono  : THIS({ allowNull: true }),
      tipo      : THIS({ allowNull: true }),
      activo    : THIS({ allowNull: true })
    })
  }

  INPUT.destroy = {
    params: Field.group(app.API.models.autor, {
      id: THIS({ allowNull: false })
    })
  }

  INPUT.restore = {
    params: Field.group(app.API.models.autor, {
      id: THIS({ allowNull: false })
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return INPUT
}
