const DATABASE = {
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || 'insac_test',

  params: {
    dialect  : process.env.DIALECT || 'postgres',
    host     : process.env.DB_HOST || '127.0.0.1',
    port     : process.env.DB_PORT || 5432,
    timezone : process.env.DB_TZ   || '+00:00',
    lang     : 'es',

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
