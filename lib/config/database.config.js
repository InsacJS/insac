/**
* Configuración de la base de datos.
* Mas información en:
* http://docs.sequelizejs.com/manual/installation/getting-started.html#setting-up-a-connection
* @type {Object}
* @param {Boolean} [setup]    - Habilita la instalación de la base de datos cuando se ejecuta la aplicación.
* @param {Boolean} [sqlLog]   - Habilita los logs de las consultas SQL.
* @param {String}  [username] - Nombre de usuario.
* @param {String}  [password] - Contraseña del usuario.
* @param {String}  [database] - Nombre de la base de datos.
* @param {Object}  [params]   - Parametros de configuración de la base de datos.
* @param {Object}  [onSetup]  - Parametros de configuración que se utilizan cuando se instala la aplicación.
*/
const DATABASE = {
  setup  : false,
  sqlLog : false,

  username : 'postgres',
  password : 'postgres',
  database : '_example',

  params: {
    dialect          : 'postgres',
    host             : '127.0.0.1',
    port             : 5432,
    timezone         : '+00:00',
    lang             : 'es',
    logging          : false,
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
