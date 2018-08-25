const path = require('path')
const { util, fake } = require(global.INSAC)

module.exports = (app) => {
  const nombres     = util.readFile(path.resolve(__dirname, 'dic/nombres.txt')).split('\n')
  const apellidos   = util.readFile(path.resolve(__dirname, 'dic/apellidos.txt')).split('\n')
  const direcciones = util.readFile(path.resolve(__dirname, 'dic/direcciones.txt')).split('\n')
  const roles       = ['superadmin', 'admin', 'user']

  const DATA = []
  const PASS = app.AUTH.tools.util.md5('123')
  for (let i = 1; i <= 1; i++) {
    DATA.push({
      id                  : i,
      username            : `1000${i}`,
      password            : PASS,
      nombre              : nombres[fake.randomInt(0, nombres.length - 2)],
      primer_apellido     : apellidos[fake.randomInt(0, apellidos.length - 2)],
      segundo_apellido    : apellidos[fake.randomInt(0, apellidos.length - 2)],
      documento_identidad : i,
      email               : `example.${i}@gmail.com`,
      direccion           : direcciones[fake.randomInt(0, direcciones.length - 2)],
      telefono            : fake.randomInt(70000000, 80000000),
      rol                 : roles[fake.randomInt(0, roles.length - 1)]
    })
  }

  return DATA
}
