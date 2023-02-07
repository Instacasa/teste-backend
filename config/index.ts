import web from './web';
import database from './database';

const ENV = process.env.NODE_ENV || 'development';
const db = database[ENV];

const config = {
  web,
  db
};

export default config;