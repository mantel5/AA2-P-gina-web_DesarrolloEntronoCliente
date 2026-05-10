const OrderModel = require('../models/order.model');

const OrderController = {
    // POST /api/orders — User places an order from their cart
    create: (req, res) => {
        const { items, total } = req.body;
        const userId = req.userId; // Injected by auth middleware

        try {
            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }
            if (!total || total <= 0) {
                return res.status(400).json({ error: 'Invalid total amount' });
            }

            const order = OrderModel.create(userId, items, total);
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/orders/my — User gets their own order history
    getMyOrders: (req, res) => {
        const userId = req.userId;
        try {
            const orders = OrderModel.findByUserId(userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/orders — Admin gets all orders in the system
    getAll: (req, res) => {
        try {
            const orders = OrderModel.findAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/orders/:id/status — Admin updates an order's status
    updateStatus: (req, res) => {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        try {
            if (!status || !validStatuses.includes(status)) {
                return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            }
            const result = OrderModel.updateStatus(req.params.id, status);
            if (result.changes === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json({ message: 'Status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = OrderController;
