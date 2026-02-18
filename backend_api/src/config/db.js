const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'tadipaar_db',
  password: process.env.DB_PASSWORD, // Set this in your .env file
  port: 5432,
});

module.exports = pool;