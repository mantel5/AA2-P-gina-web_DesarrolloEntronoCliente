const db = require('../database');

const CategoryModel = {
    findAll: () => {
        const stmt = db.prepare('SELECT * FROM categories');
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
        return stmt.get(id);
    },

    create: (name, description) => {
        const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
        return stmt.run(name, description);
    },

    update: (id, name, description) => {
        const stmt = db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?');
        return stmt.run(name, description, id);
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        return stmt.run(id);
    }
};

module.exports = CategoryModel;
