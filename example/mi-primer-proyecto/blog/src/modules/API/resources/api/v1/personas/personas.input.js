const { Field, THIS } = require('insac')

module.exports = (app) => {
  const INPUT = {}

  INPUT.get = {
    query: {
      fields : Field.FIELDS(),
      order  : Field.ORDER(),
      limit  : Field.LIMIT(),
      page   : Field.PAGE()
    }
  }

  INPUT.getId = {
    query: {
      fields: Field.FIELDS()
    },
    params: Field.group(app.API.models.persona, {
      id_persona: THIS({ allowNull: false })
    })
  }

  INPUT.create = {
    body: Field.group(app.API.models.persona, {
      nombre   : THIS({ allowNull: false }),
      telefono : THIS({ allowNull: false }),
      email    : THIS({ allowNull: false })
    })
  }

  INPUT.update = {
    params: Field.group(app.API.models.persona, {
      id_persona: THIS({ allowNull: false })
    }),
    body: Field.group(app.API.models.persona, {
      nombre   : THIS({ allowNull: true }),
      telefono : THIS({ allowNull: true }),
      email    : THIS({ allowNull: true })
    })
  }

  INPUT.destroy = {
    params: Field.group(app.API.models.persona, {
      id_persona: THIS({ allowNull: false })
    })
  }

  INPUT.restore = {
    params: Field.group(app.API.models.persona, {
      id_persona: THIS({ allowNull: false })
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return INPUT
}
