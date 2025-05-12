const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kentod!@#2133',
  database: 'PertaminaApps',
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

module.exports = db;