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
    params: Field.group(app.API.models.post, {
      id_post: THIS({ allowNull: false })
    })
  }

  INPUT.create = {
    body: Field.group(app.API.models.post, {
      titulo      : THIS({ allowNull: false }),
      fecha       : THIS({ allowNull: false }),
      descripcion : THIS({ allowNull: false }),
      fid_autor   : THIS({ allowNull: false })
    })
  }

  INPUT.update = {
    params: Field.group(app.API.models.post, {
      id_post: THIS({ allowNull: false })
    }),
    body: Field.group(app.API.models.post, {
      titulo      : THIS({ allowNull: true }),
      fecha       : THIS({ allowNull: true }),
      descripcion : THIS({ allowNull: true }),
      fid_autor   : THIS({ allowNull: true })
    })
  }

  INPUT.destroy = {
    params: Field.group(app.API.models.post, {
      id_post: THIS({ allowNull: false })
    })
  }

  INPUT.restore = {
    params: Field.group(app.API.models.post, {
      id_post: THIS({ allowNull: false })
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return INPUT
}
