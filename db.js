const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'finance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('>> Database       : connected successfully.');
    connection.release();
  } catch (error) {
    console.error('>> Database       : connection failed:', error);
  }
}

module.exports = {pool, testConnection};
