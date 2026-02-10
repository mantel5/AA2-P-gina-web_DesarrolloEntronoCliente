const db = require('../database');
const bcrypt = require('bcryptjs');

const UserModel = {
    create: (username, password, role = 'user') => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
        return stmt.run(username, hashedPassword, role);
    },

    findByUsername: (username) => {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, username, role FROM users WHERE id = ?');
        return stmt.get(id);
    }
};

module.exports = UserModel;
