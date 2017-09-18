define({ "api": [
  {
    "type": "PUT",
    "url": "/api/v1/administrativos/:id",
    "title": "[admin] actualizarAdministrativo",
    "name": "_admin__actualizarAdministrativo",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ],
        "Input - body": [
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Input - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Input - body",
            "type": "Number",
            "size": "1-2147483647",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.email",
            "description": "<p>Dirección de correo electrónico</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.direccion",
            "description": "<p>Dirección de domicilio</p>"
          },
          {
            "group": "Input - body",
            "type": "Number",
            "size": "1-2147483647",
            "optional": true,
            "field": "persona.telefono",
            "description": "<p>Número de teléfono o celular</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo Petición: Todos los campos requeridos",
          "content": "{\n  \"persona\": {}\n}",
          "type": "json"
        },
        {
          "title": "Ejemplo Petición: Todos los campos posibles",
          "content": "{\n  \"cargo\": \"text\",\n  \"persona\": {\n    \"nombre\": \"text\",\n    \"paterno\": \"text\",\n    \"materno\": \"text\",\n    \"ci\": 1,\n    \"email\": \"text\",\n    \"direccion\": \"text\",\n    \"telefono\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"cargo\": \"text\",\n    \"id_persona\": 1,\n    \"persona\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"paterno\": \"text\",\n      \"materno\": \"text\",\n      \"ci\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "POST",
    "url": "/api/v1/administrativos/",
    "title": "[admin] crearAdministrativo",
    "name": "_admin__crearAdministrativo",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "description": "<p>El nombre de usuario por defecto es su carnet de identidad <code>ci</code> y el password por defecto es su nro de item <code>item</code>.</p>",
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - body": [
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Input - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Input - body",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": false,
            "field": "persona.email",
            "description": "<p>Dirección de correo electrónico</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "persona.direccion",
            "description": "<p>Dirección de domicilio</p>"
          },
          {
            "group": "Input - body",
            "type": "Number",
            "size": "1-2147483647",
            "optional": true,
            "field": "persona.telefono",
            "description": "<p>Número de teléfono o celular</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo Petición: Todos los campos requeridos",
          "content": "{\n  \"persona\": {\n    \"ci\": 1,\n    \"email\": \"text\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Ejemplo Petición: Todos los campos posibles",
          "content": "{\n  \"cargo\": \"text\",\n  \"persona\": {\n    \"nombre\": \"text\",\n    \"paterno\": \"text\",\n    \"materno\": \"text\",\n    \"ci\": 1,\n    \"email\": \"text\",\n    \"direccion\": \"text\",\n    \"telefono\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 201 Created",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 201,\n  \"data\": {\n    \"id\": 1,\n    \"cargo\": \"text\",\n    \"id_persona\": 1,\n    \"persona\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"paterno\": \"text\",\n      \"materno\": \"text\",\n      \"ci\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "DELETE",
    "url": "/api/v1/administrativos/:id",
    "title": "[admin] eliminarAdministrativo",
    "name": "_admin__eliminarAdministrativo",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"cargo\": \"text\",\n    \"id_persona\": 1,\n    \"persona\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"paterno\": \"text\",\n      \"materno\": \"text\",\n      \"ci\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/api/v1/administrativos/",
    "title": "[admin] listarAdministrativos",
    "name": "_admin__listarAdministrativos",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": [\n    {\n      \"id\": 1,\n      \"cargo\": \"text\",\n      \"id_persona\": 1,\n      \"persona\": {\n        \"id\": 1,\n        \"nombre\": \"text\",\n        \"paterno\": \"text\",\n        \"materno\": \"text\",\n        \"ci\": 1\n      }\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/api/v1/administrativos/:id",
    "title": "[admin] obtenerAdministrativo",
    "name": "_admin__obtenerAdministrativo",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"cargo\": \"text\",\n    \"id_persona\": 1,\n    \"persona\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"paterno\": \"text\",\n      \"materno\": \"text\",\n      \"ci\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/api/v1/administrativos/mi",
    "title": "[admin] obtenerDatosUsuarioActual",
    "name": "_admin__obtenerDatosUsuarioActual",
    "group": "Administrativo",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "cargo",
            "description": "<p>Cargo o puesto administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_persona",
            "description": "<p>Identificador único del registro 'persona'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona",
            "description": "<p>Datos del objeto <strong>persona</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.paterno",
            "description": "<p>Apellido paterno</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.materno",
            "description": "<p>Apellido materno</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.ci",
            "description": "<p>Cédula de identidad</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.email",
            "description": "<p>Dirección de correo electrónico</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.direccion",
            "description": "<p>Dirección de domicilio</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.telefono",
            "description": "<p>Número de teléfono o celular</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.id_usuario",
            "description": "<p>Identificador único del registro 'usuario'</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "persona.usuario",
            "description": "<p>Datos del objeto <strong>persona.usuario</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "persona.usuario.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.usuario.username",
            "description": "<p>Usuario</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.usuario.password",
            "description": "<p>Contraseña</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.usuario.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "persona.usuario.email",
            "description": "<p>Dirección de correo electrónico</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"cargo\": \"text\",\n    \"id_persona\": 1,\n    \"persona\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"paterno\": \"text\",\n      \"materno\": \"text\",\n      \"ci\": 1,\n      \"email\": \"text\",\n      \"direccion\": \"text\",\n      \"telefono\": 1,\n      \"id_usuario\": 1,\n      \"usuario\": {\n        \"id\": 1,\n        \"username\": \"text\",\n        \"password\": \"text\",\n        \"nombre\": \"text\",\n        \"email\": \"text\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Administrativo",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "POST",
    "url": "/auth/login",
    "title": "Login",
    "name": "Login",
    "group": "Auth",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Input - body": [
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": false,
            "field": "username",
            "description": "<p>Usuario</p>"
          },
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": false,
            "field": "password",
            "description": "<p>Contraseña</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo Petición: Todos los campos requeridos",
          "content": "{\n  \"username\": \"text\",\n  \"password\": \"text\"\n}",
          "type": "json"
        },
        {
          "title": "Ejemplo Petición: Todos los campos posibles",
          "content": "{\n  \"username\": \"text\",\n  \"password\": \"text\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>Token de acceso</p>"
          },
          {
            "group": "Output - body",
            "type": "Object",
            "optional": false,
            "field": "usuario",
            "description": "<p>Datos del objeto <strong>usuario</strong></p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "usuario.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "usuario.nombre",
            "description": "<p>Nombre completo</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "usuario.email",
            "description": "<p>Dirección de correo electrónico</p>"
          },
          {
            "group": "Output - body",
            "type": "Object[]",
            "optional": false,
            "field": "usuario.roles",
            "description": "<p>Lista de objetos</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "usuario.roles.id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "usuario.roles.nombre",
            "description": "<p>Nombre</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "usuario.roles.alias",
            "description": "<p>Alias</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_administrativo",
            "description": "<p>Identificador único del administrativo</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_docente",
            "description": "<p>Identificador único del docente</p>"
          },
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id_estudiante",
            "description": "<p>Identificador único del estudiante</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 201 Created",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 201,\n  \"data\": {\n    \"token\": \"text\",\n    \"usuario\": {\n      \"id\": 1,\n      \"nombre\": \"text\",\n      \"email\": \"text\",\n      \"roles\": [\n        {\n          \"id\": 1,\n          \"nombre\": \"text\",\n          \"alias\": \"text\"\n        }\n      ]\n    },\n    \"id_administrativo\": 1,\n    \"id_docente\": 1,\n    \"id_estudiante\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Auth",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "PUT",
    "url": "/api/v1/carreras/:id",
    "title": "[admin] actualizarCarrera",
    "name": "_admin__actualizarCarrera",
    "group": "Carrera",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ],
        "Input - body": [
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo Petición: Todos los campos requeridos",
          "content": "{}",
          "type": "json"
        },
        {
          "title": "Ejemplo Petición: Todos los campos posibles",
          "content": "{\n  \"nombre\": \"text\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"text\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Carrera",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "POST",
    "url": "/api/v1/carreras/",
    "title": "[admin] crearCarrera",
    "name": "_admin__crearCarrera",
    "group": "Carrera",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - body": [
          {
            "group": "Input - body",
            "type": "String",
            "size": "1..255",
            "optional": false,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo Petición: Todos los campos requeridos",
          "content": "{\n  \"nombre\": \"text\"\n}",
          "type": "json"
        },
        {
          "title": "Ejemplo Petición: Todos los campos posibles",
          "content": "{\n  \"nombre\": \"text\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 201 Created",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 201,\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"text\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Carrera",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "DELETE",
    "url": "/api/v1/carreras/:id",
    "title": "[admin] eliminarCarrera",
    "name": "_admin__eliminarCarrera",
    "group": "Carrera",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"text\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Carrera",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/api/v1/carreras/",
    "title": "[admin] listarCarreras",
    "name": "_admin__listarCarreras",
    "group": "Carrera",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": [\n    {\n      \"id\": 1,\n      \"nombre\": \"text\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Carrera",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/api/v1/carreras/:id",
    "title": "[admin] obtenerCarrera",
    "name": "_admin__obtenerCarrera",
    "group": "Carrera",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Input - params": [
          {
            "group": "Input - params",
            "type": "Number",
            "size": "1-2147483647",
            "optional": false,
            "field": "id",
            "description": "<p>Identificador único</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "Number",
            "optional": true,
            "field": "id",
            "description": "<p>Identificador único</p>"
          },
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "nombre",
            "description": "<p>Nombre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"id\": 1,\n    \"nombre\": \"text\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Carrera",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "GET",
    "url": "/hello",
    "title": "[admin] Hello",
    "name": "_admin__Hello",
    "group": "Custom",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Rol: Administrativo",
        "description": "<p>Solo los usuarios que tengan este rol pueden acceder a este recurso.</p>"
      }
    ],
    "header": {
      "fields": {
        "Input - header": [
          {
            "group": "Input - header",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "authorization",
            "description": "<p>Token de acceso</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Output - body": [
          {
            "group": "Output - body",
            "type": "String",
            "optional": true,
            "field": "msg",
            "description": "<p>Mensaje de bienvenida</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta Exitosa: 200 Ok",
          "content": "{\n  \"status\": \"OK\",\n  \"code\": 200,\n  \"data\": {\n    \"msg\": \"text\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "/home/alex/node/insac/apidoc/temp/routes.js",
    "groupTitle": "Custom",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Ocurre cuando existe algún dato inválido.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Ocurre cuando no se tiene la clave de acceso.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Ocurre cuando se intenta acceder a un recurso sin la clave de acceso correcta.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error: 422 Unprocessable Entity",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 422,\n  \"type\": \"Unprocessable Entity\",\n  \"message\": \"Algunos datos no son válidos\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 401 Unauthorized",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 401,\n  \"type\": \"Unauthorized\",\n  \"message\": \"Acceso no autorizado\"\n}",
          "type": "json"
        },
        {
          "title": "Error: 403 Forbidden",
          "content": "{\n  \"status\": \"FAIL\",\n  \"code\": 403,\n  \"type\": \"Forbidden\",\n  \"message\": \"Acceso denegado\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
