/**
 * server/config/db.js
 * MySQL database connection configuration using mysql2 pool with Promises.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅  Connected to MySQL Database: ${process.env.DB_NAME || 'portfolio_db'}`);
        connection.release();
    } catch (error) {
        console.error(`❌  MySQL Database Connection Error: ${error.message}`);
    }
};

testConnection();

module.exports = pool;
