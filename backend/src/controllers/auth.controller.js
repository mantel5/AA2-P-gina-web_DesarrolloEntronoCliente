const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const AuthController = {
    register: (req, res) => {
        const { username, password } = req.body;
        try {
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            const result = UserModel.create(username, password);
            res.status(201).json({ id: result.lastInsertRowid, username });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    login: (req, res) => {
        const { username, password } = req.body;
        try {
            const user = UserModel.findByUsername(username);
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = AuthController;
