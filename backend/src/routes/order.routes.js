const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const OrderController = require('../controllers/order.controller');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Auth middleware: verifies the JWT and injects userId + userRole into req
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
};

// User routes (require authentication)
router.post('/', authenticate, OrderController.create);
router.get('/my', authenticate, OrderController.getMyOrders);

// Admin routes (require authentication + admin role)
router.get('/', authenticate, requireAdmin, OrderController.getAll);
router.put('/:id/status', authenticate, requireAdmin, OrderController.updateStatus);

module.exports = router;
