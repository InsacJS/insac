const DB_USER     = process.env.DB_USER     = process.env.DB_USER     || 'postgres'
const DB_PASS     = process.env.DB_PASS     = process.env.DB_PASS     || 'postgres'
const DB_NAME     = process.env.DB_NAME     = process.env.DB_NAME     || 'insac_test'
const DB_HOSTNAME = process.env.DB_HOSTNAME = process.env.DB_HOSTNAME || '127.0.0.1'
const DB_PORT     = process.env.DB_PORT     = process.env.DB_PORT     || 54324

const DIALECT     = process.env.DIALECT     = process.env.DIALECT     || 'postgres'

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

    dropDatabase   : true,
    createDatabase : true,

    dropSchemas   : true,
    createSchemas : true,

    dropTables   : true,
    createTables : true,

    createSeeders: true
  }
}

module.exports = DATABASE
