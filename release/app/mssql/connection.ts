const sql = require('mssql');

const sqlConfig = {
  user: 'sa',
  password: '@nfs32xpt#',
  database: 'dbMeirelles',
  server: '127.0.0.1',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const init = async () => {
  console.log('init');
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    console.log('conectou');
    const result = await sql.query`select 1`;
    console.dir(result);
    return result;
  } catch (err) {
    // ... error checks
  }
};

export default init;
