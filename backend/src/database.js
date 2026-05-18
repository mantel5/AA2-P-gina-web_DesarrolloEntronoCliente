const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/database.sqlite');
const db = new Database(dbPath);

const adminPassword = bcrypt.hashSync('admin', 10);
try {
  const insertAdmin = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
  insertAdmin.run('admin', adminPassword, 'admin');

  const updateAdmin = db.prepare('UPDATE users SET password = ?, role = ? WHERE username = ?');
  updateAdmin.run(adminPassword, 'admin', 'admin');
} catch {
}



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

  CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  total REAL NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(userId) REFERENCES users(id)
);

  CREATE TABLE IF NOT EXISTS order_items(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  productName TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unitPrice REAL NOT NULL,
  FOREIGN KEY(orderId) REFERENCES orders(id),
  FOREIGN KEY(productId) REFERENCES products(id)
);
`);

module.exports = db;
