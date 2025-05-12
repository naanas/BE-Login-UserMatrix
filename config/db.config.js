const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'sql201.infinityfree.com',
  user: 'if0_38965303',
  password: 'N4Dn9A1jXIQTS',
  database: 'if0_38965303_PertaminaApps',
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

module.exports = db;