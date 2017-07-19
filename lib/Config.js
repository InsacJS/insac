let Config = {
  response: {
    all200: false,
    sendStatus: true,
    sendCode: true
  },
  server: {
    publicFolder: null,
    port: 3200
  },
  database: {
    dbname: 'insac_app',
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgres',
    timezone: '+00:00',
    host: 'localhost',
    port: 5432
  }
};

module.exports = Config;
