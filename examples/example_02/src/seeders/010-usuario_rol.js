'use strict'

module.exports = (insac) => {

  let data = [{
    estado: 'ACTIVO',
    id_usuario: 1,
    id_rol: 2
  }, {
    estado: 'ACTIVO',
    id_usuario: 2,
    id_rol: 2
  }, {
    estado: 'ACTIVO',
    id_usuario: 3,
    id_rol: 2
  }, {
    estado: 'ACTIVO',
    id_usuario: 4,
    id_rol: 3
  }, {
    estado: 'ACTIVO',
    id_usuario: 5,
    id_rol: 3
  }, {
    estado: 'ACTIVO',
    id_usuario: 6,
    id_rol: 3
  }]

  return insac.createSeed('usuario_rol', data)
}
