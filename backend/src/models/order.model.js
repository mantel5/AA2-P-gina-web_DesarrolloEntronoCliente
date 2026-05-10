const db = require('../database');

const OrderModel = {
    // Creates a new order with its items in a single transaction
    create: (userId, items, total) => {
        const createOrder = db.transaction(() => {
            const orderStmt = db.prepare(
                'INSERT INTO orders (userId, total, status) VALUES (?, ?, ?)'
            );
            const { lastInsertRowid: orderId } = orderStmt.run(userId, total, 'pending');

            const itemStmt = db.prepare(
                'INSERT INTO order_items (orderId, productId, productName, quantity, unitPrice) VALUES (?, ?, ?, ?, ?)'
            );
            for (const item of items) {
                itemStmt.run(orderId, item.productId, item.productName, item.quantity, item.unitPrice);
            }

            return orderId;
        });

        const orderId = createOrder();
        return OrderModel.findById(orderId);
    },

    // Find a single order with its items
    findById: (orderId) => {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) return null;
        order.items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(orderId);
        return order;
    },

    // Find all orders for a specific user (with their items)
    findByUserId: (userId) => {
        const orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId);
        return orders.map(order => {
            order.items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
            return order;
        });
    },

    // Find all orders in the system (admin view), joining username
    findAll: () => {
        const orders = db.prepare(`
            SELECT o.*, u.username
            FROM orders o
            JOIN users u ON o.userId = u.id
            ORDER BY o.createdAt DESC
        `).all();
        return orders.map(order => {
            order.items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
            return order;
        });
    },

    // Update the status of an order
    updateStatus: (orderId, status) => {
        return db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
    }
};

module.exports = OrderModel;
