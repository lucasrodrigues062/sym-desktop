import * as sql from 'mssql';

export default class CronosService {
  async pool(database: string, server: string) {
    const pool = await this.instance(database, server);
    return pool;
  }

  types = sql.TYPES;

  private async instance(database: string, server: string) {
    const sqlConfig = {
      user: 'sa',
      password: '@nfs32xpt#',
      database,
      server,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: false, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        appName: 'edi-sym',
      },
      requestTimeout: 1000 * 60 * 5,
    };

    const connection = await sql.connect(sqlConfig);

    return connection;
  }
}
