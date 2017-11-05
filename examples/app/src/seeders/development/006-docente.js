'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = [{
    tipo_contratacion: 'INTERINO',
    persona: {
      nombre: 'Rosa',
      ci: 23473434
    }
  }, {
    tipo_contratacion: 'INVITADO',
    persona: {
      nombre: 'ANNA',
      ci: 23434
    }
  }]

  return new Seed('docente', data)
}
