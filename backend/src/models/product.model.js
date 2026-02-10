const db = require('../database');

const ProductModel = {
    findAll: () => {
        const stmt = db.prepare(`
      SELECT p.*, c.name as categoryName 
      FROM products p 
      LEFT JOIN categories c ON p.categoryId = c.id
    `);
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
        return stmt.get(id);
    },

    create: (name, description, price, stock, image, categoryId) => {
        const stmt = db.prepare('INSERT INTO products (name, description, price, stock, image, categoryId) VALUES (?, ?, ?, ?, ?, ?)');
        return stmt.run(name, description, price, stock, image, categoryId);
    },

    update: (id, name, description, price, stock, image, categoryId) => {
        const stmt = db.prepare('UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ?, categoryId = ? WHERE id = ?');
        return stmt.run(name, description, price, stock, image, categoryId, id);
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        return stmt.run(id);
    }
};

module.exports = ProductModel;
