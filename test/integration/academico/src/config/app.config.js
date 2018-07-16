exports.DATABASE = {
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || '12345678',
  database : process.env.DB_NAME || '_example',
  params   : {
    dialect          : 'postgres',
    host             : process.env.DB_HOST_NAME || '127.0.0.1',
    port             : process.env.DB_HOST_PORT || 5432,
    timezone         : '+00:00',
    lang             : 'es',
    operatorsAliases : false,
    define           : {
      underscored     : true,
      freezeTableName : true,
      timestamps      : true,
      paranoid        : true,
      createdAt       : '_fecha_creacion',
      updatedAt       : '_fecha_modificacion',
      deletedAt       : '_fecha_eliminacion'
    }
  }
}

exports.SERVER = {
  port : process.env.PORT     || 4004,
  env  : process.env.NODE_ENV || 'development',
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
