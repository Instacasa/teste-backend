import config from '@config';
import { DataSource } from 'typeorm';

export default (async () => {
  try {
    const databaseConfig = config.db;
    databaseConfig.entities = [__dirname.replace('lib', '') + 'src/infra/database/models/**/*.{js,ts}'];
    const connection = new DataSource(databaseConfig);    
    await connection.initialize();
    if (process.env.NODE_ENV !== 'production') {
      await connection.synchronize(true);
      await connection.query('PRAGMA foreign_keys=OFF');
      await connection.query('PRAGMA case_sensitive_like=true');
    }
    return connection;
  } catch (error) {
    console.error(error);
  }
})();