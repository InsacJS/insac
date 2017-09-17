'use strict'
const { Config } = require(INSAC)

module.exports = () => {

  return new Config({
    env: 'development',
    database: {
      name: 'insac_sauron_development',
      username: 'postgres',
      password: '12345678'
    },
    server: {
      all200: false
    },
    auth: {
      token: {
        key: 'CLAVE_SECRETA'
      },
      roles: [
        {id:1, nombre:'Administrativo', alias:'admin'},
        {id:2, nombre:'Docente', alias:'doc'},
        {id:3, nombre:'Estudiante', alias:'est'}
      ]
    }
  })

}
