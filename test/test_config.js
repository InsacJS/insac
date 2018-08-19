exports.SERVER = {
  port: 4001
}

exports.DATABASE = {
  postgres: {
    username : 'postgres',
    password : 'postgres',
    database : 'insac_test',
    params   : {
      dialect          : 'postgres',
      host             : '127.0.0.1',
      port             : 54324,
      timezone         : '+00:00',
      lang             : 'es',
      logging          : false,
      operatorsAliases : false,
      define           : {
        underscored     : true,
        freezeTableName : true,
        timestamps      : false
      }
    }
  },
  mysql: {
    username : 'root',
    password : '12345678',
    database : 'insac_test',
    params   : {
      dialect          : 'mysql',
      host             : '127.0.0.1',
      port             : 33067,
      timezone         : '+00:00',
      lang             : 'es',
      logging          : false,
      operatorsAliases : false,
      define           : {
        underscored     : true,
        freezeTableName : true,
        timestamps      : false
      }
    }
  },
  mssql: {
    username : 'sa',
    password : 'yourStrong(!)Password',
    database : 'insac_test',
    params   : {
      dialect          : 'mssql',
      dialectOptions   : { encrypt: true },
      host             : '127.0.0.1',
      port             : 1433,
      timezone         : '+00:00',
      lang             : 'es',
      logging          : false,
      operatorsAliases : false,
      define           : {
        underscored     : true,
        freezeTableName : true,
        timestamps      : false
      }
    }
  },
  sqlite: {
    username : null,
    password : null,
    database : null,
    params   : {
      dialect          : 'sqlite',
      storage          : 'insac_test.sqlite',
      host             : '127.0.0.1',
      lang             : 'es',
      logging          : false,
      operatorsAliases : false,
      define           : {
        underscored     : true,
        freezeTableName : true,
        timestamps      : false
      }
    }
  }
}
