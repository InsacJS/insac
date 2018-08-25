const { fake } = require(global.INSAC)

module.exports = (app) => {
  const nombres     = ['john', 'alan', 'carlos', 'pedro', 'rosa']
  const apellidos   = ['smith', 'doe', 'mendoza', 'flores']
  const direcciones = ['Los valles, #23']
  const roles       = ['superadmin', 'admin', 'user']

  const DATA = []
  const PASS = app.AUTH.tools.util.md5('123')
  for (let i = 1; i <= 1; i++) {
    DATA.push({
      id                  : i,
      username            : 'john',
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
