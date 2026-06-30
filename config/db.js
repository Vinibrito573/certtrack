// Connecting Database for CertTrack ApplicationDatabase connection configuration for CertTrack
// Vinicius Brito
// Using MySQL2 with connection pool for better performance

const mysql = require('mysql2/promise');

// Creating a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // localhost
  user: process.env.DB_USER, // root
  password: process.env.DB_PASSWORD, // from .env
  database: process.env.DB_NAME, // certtrack
  waitForConnections: true, // wait if no connections available
  connectionLimit: 10, // max 10 simultaneous connections
});

module.exports = pool;