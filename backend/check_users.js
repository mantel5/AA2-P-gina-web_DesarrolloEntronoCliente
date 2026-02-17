const db = require('./src/database');
const stmt = db.prepare('SELECT * FROM users');
const users = stmt.all();
console.log('Users in database:', users);
