'user strict'

class DatabaseConfig {

  constructor(username, password, dbname, dialect, timezone, host, port) {
    this.username = username;
    this.password = password;
    this.dbname = dbname;
    this.dialect = dialect;
    this.timezone = timezone;
    this.host = host;
    this.port = port;
  }

  public getParams() {
    let params = {
      dialect: this.dialect,
      timeZone: this.timeZone,
      host: this.host,
      port: this.port
    };
    return params;
  }

}

module.exports DatabaseConfig;
