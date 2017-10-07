'use strict'

module.exports = {
  database: {
    name: 'insac_test',
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
  },
  apidoc: {
    name: "Aplicación INSAC",
    version: "1.0.0",
    description: "Ejemplo de creación de un servicio web con INSAC",
    title: "Apidoc · INSAC",
    url: "http://localhost:7000"
  }
}
