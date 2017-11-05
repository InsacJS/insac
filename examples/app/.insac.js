'use strict'

module.exports = {
  database: {
    development: {
      name: 'insac_development',
    },
    test: {
      name: 'insac_test',
    },
    production: {
      name: 'insac_production',
    },
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
      {id:1, nombre:'Administrativo', alias:'admin', peso:10},
      {id:2, nombre:'Docente', alias:'doc', peso:0},
      {id:3, nombre:'Estudiante', alias:'est', peso:0}
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
