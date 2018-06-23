exports.DATABASE = {
  username : process.env.DB_USER || '_custom',
  password : process.env.DB_PASS || '_custom',
  database : process.env.DB_NAME || '_custom',
  params   : {
    dialect          : 'mysql',
    storage          : '_example.sqlite', // Solo para sqlite
    host             : process.env.DB_HOST_NAME || '127.0.0.3',
    port             : process.env.DB_HOST_PORT || 3306,
    timezone         : '-04:00',
    lang             : 'es',
    operatorsAliases : true,
    define           : {
      underscored     : false,
      freezeTableName : false,
      timestamps      : false,
      paranoid        : false,
      createdAt       : '_fecha_creacion_custom',
      updatedAt       : '_fecha_modificacion_custom',
      deletedAt       : '_fecha_eliminacion_custom'
    }
  }
}

exports.SERVER = {
  port : process.env.PORT     || 6000,
  env  : process.env.NODE_ENV || 'test',
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  options: {
    key  : undefined,
    cert : undefined
  },
  https: false
}
