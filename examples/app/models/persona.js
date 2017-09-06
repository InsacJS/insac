const { Reference } = require(INSAC)

module.exports = (insac, models) => {

  insac.addModel('persona', {
    fields: {
      nombre: {},
      id_usuario: Reference.ONE_TO_ONE(models.usuario)
    }
  })

}
