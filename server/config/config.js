require('dotenv').config(); // this is important!

module.exports = {
  "development": {
    "username": process.env.DB_USER,//"nodejs_dev",
    "password": process.env.DB_PASSWORD,//"root",
    "database": process.env.DB_NAME,//"restapidb_v1",
    "host": process.env.DB_HOST,//"127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "nodejs_dev",
    "password": "root",
    "database": "restapidb_v1",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "nodejs_dev",
    "password": "root",
    "database": "restapidb_v1",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};
