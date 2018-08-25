const { Field, THIS } = require(global.INSAC)

module.exports = (app) => {
  const INPUT = {}

  INPUT.habilitar = {
    headers: {
      authorization: Field.BEARER_AUTHORIZATION({ allowNull: false })
    },
    body: {
      usuario: Field.group(app.AUTH.models.usuario, {
        id: THIS({ allowNull: false, allowNullObj: false })
      })
    }
  }

  INPUT.deshabilitar = {
    headers: {
      authorization: Field.BEARER_AUTHORIZATION({ allowNull: false })
    },
    body: {
      usuario: Field.group(app.AUTH.models.usuario, {
        id: THIS({ allowNull: false, allowNullObj: false })
      })
    }
  }

  return INPUT
}
