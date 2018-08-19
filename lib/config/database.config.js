/** @ignore */ const SQL_LOG_ENABLED = process.env.SQL_LOG && process.env.SQL_LOG === 'true'

/** @ignore */ const DB_HOSTNAME = process.env.DB_HOSTNAME = process.env.DB_HOSTNAME || '127.0.0.1'
/** @ignore */ const DB_NAME     = process.env.DB_NAME     = process.env.DB_NAME     || '_example'

/** @ignore */ const DIALECT     = process.env.DIALECT     = process.env.DIALECT     || 'postgres'
/** @ignore */ const DB_USER     = process.env.DB_USER     = process.env.DB_USER     || 'postgres'
/** @ignore */ const DB_PASS     = process.env.DB_PASS     = process.env.DB_PASS     || 'postgres'
/** @ignore */ const DB_PORT     = process.env.DB_PORT     = process.env.DB_PORT     || 5432

/**
* Configuración de la base de datos.
* Mas información en:
* http://docs.sequelizejs.com/manual/installation/getting-started.html#setting-up-a-connection
* @type {Object}
* @param {String} [username] - Nombre de usuario.
* @param {String} [password] - Contraseña del usuario.
* @param {String} [database] - Nombre de la base de datos.
* @param {Object} [params]   - Parametros de configuración de la base de datos.
* @param {Object} [onSetup]  - Parametros de configuración que se utilizan cuando se instala la aplicación.
*/
const DATABASE = {
  username : DB_USER,
  password : DB_PASS,
  database : DB_NAME,

  params: {
    dialect          : DIALECT,
    host             : DB_HOSTNAME,
    port             : DB_PORT,
    timezone         : '+00:00',
    lang             : 'es',
    logging          : SQL_LOG_ENABLED ? sql => console.log(`\x1b[2m\n${sql}\x1b[0m\n`) : false,
    operatorsAliases : false,

    define: {
      underscored     : true,
      freezeTableName : true,
      timestamps      : true,
      paranoid        : true,
      createdAt       : '_fecha_creacion',
      updatedAt       : '_fecha_modificacion',
      deletedAt       : '_fecha_eliminacion'
    }
  },

  onSetup: {
    modules: [],

    dropDatabase   : false,
    createDatabase : true,

    dropSchemas   : false,
    createSchemas : true,

    dropTables   : true,
    createTables : true,

    createSeeders: true
  }
}

module.exports = DATABASE
