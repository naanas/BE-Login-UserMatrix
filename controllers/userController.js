const bcrypt = require('bcrypt');
const db = require('../config/db.config');

// Fungsi untuk menangani login
exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const query = `SELECT userId, password, role FROM users WHERE userId = ?`;

    db.query(query, [userId], async (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
      }

      const user = results[0];
      const hashedPassword = user.password;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        return res.status(200).json({
          message: 'Login berhasil',
          userId: user.userId,
          role: user.role,
        });
      } else {
        return res.status(401).json({ message: 'Password salah.' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Fungsi untuk menangani register
exports.register = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (userId, password) VALUES (?, ?)`;

    db.query(query, [userId, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }

      return res.status(201).json({ message: 'User berhasil dibuat' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Fungsi untuk mendapatkan daftar pengguna
exports.getUsers = async (req, res) => {
  try {
    const query = `SELECT id, userId, role FROM users`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Fungsi untuk menambahkan pengguna baru
exports.createUser = async (req, res) => {
  const { userId, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (userId, password, role) VALUES (?, ?, ?)`;

    db.query(query, [userId, hashedPassword, role], (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
      return res.status(201).json({ message: 'User berhasil dibuat' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Fungsi untuk memperbarui pengguna
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { userId, password, role } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let query = `UPDATE users SET userId = ?, role = ?`;
    let values = [userId, role];

    if (hashedPassword) {
      query += `, password = ?`;
      values.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    values.push(id);

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
      }
      return res.status(200).json({ message: 'User berhasil diperbarui' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Fungsi untuk menghapus pengguna
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM users WHERE id = ?`;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error query:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
      }
      return res.status(200).json({ message: 'User berhasil dihapus' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};