/**
* Configuración por defecto de la base de datos.
* @type {Object}
* @property {Boolean} setup=false          - Habilita la instalación de la base de datos cuando se ejecuta la aplicación.
* @property {Boolean} sqlLog=false         - Habilita los logs de las consultas SQL.
* @property {String}  username='postgres'  - Nombre de usuario.
* @property {String}  password='postgres'  - Contraseña del usuario.
* @property {String}  database='_exampple' - Nombre de la base de datos.
* @property {Object}  params]              - Parametros de configuración de la base de datos.
* @property {Object}  onSetup]             - Parametros de configuración que se utilizan cuando se instala la aplicación.
*/
const DATABASE = {
  setup  : false,
  sqlLog : false,

  username : 'postgres',
  password : 'postgres',
  database : '_example',

  // http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
  params: {
    dialect          : 'postgres', // postgres, mysql, mssql, sqlite
    host             : '127.0.0.1',
    port             : 5432, // postgres: 5432, mysql: 3306, mssql: 1433
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

  // Para controlar la instalación de la base de datos
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
