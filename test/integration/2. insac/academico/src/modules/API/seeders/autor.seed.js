module.exports = (app) => {
  const DATA = [
    {
      id        : 1,
      nombre    : 'John Smith Smith',
      direccion : 'Zona los valles, #267',
      telefono  : [22837563, 78576854],
      tipo      : 'NACIONAL',
      activo    : true
    },
    {
      id        : 2,
      nombre    : 'Edgar Allan Poe',
      direccion : 'Zona las flores, #233',
      telefono  : [223443454],
      tipo      : 'INTERNACIONAL',
      activo    : true
    },
    {
      id        : 3,
      nombre    : 'Anna Holmes',
      direccion : 'Av. Rosales, Nro. 54',
      telefono  : [78347564, 76576442],
      tipo      : 'NACIONAL',
      activo    : false
    }
  ]

  return DATA
}
