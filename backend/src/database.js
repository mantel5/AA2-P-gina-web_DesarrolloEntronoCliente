const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

const adminPassword = bcrypt.hashSync('admin', 10);
// Ignore if admin already exists (due to unique constraint)
try {
  const insertAdmin = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
  insertAdmin.run('admin', adminPassword, 'admin');

  // Force update in case the user already existed with a different password
  const updateAdmin = db.prepare('UPDATE users SET password = ?, role = ? WHERE username = ?');
  updateAdmin.run(adminPassword, 'admin', 'admin');
} catch (e) {
  console.log('Error inserting/updating admin user:', e.message);
}

console.log('Database initialized successfully with default admin.');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);

  CREATE TABLE IF NOT EXISTS categories(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

  CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  categoryId INTEGER,
  FOREIGN KEY(categoryId) REFERENCES categories(id)
);
`);

module.exports = db;
