const ProductModel = require('../models/product.model');

const ProductController = {
    getAll: (req, res) => {
        try {
            const products = ProductModel.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getOne: (req, res) => {
        try {
            const product = ProductModel.findById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: (req, res) => {
        const { name, description, price, stock, image, categoryId } = req.body;
        try {
            if (!name || !price) return res.status(400).json({ error: 'Name and Price are required' });
            const result = ProductModel.create(name, description, price, stock, image, categoryId);
            res.status(201).json({ id: result.lastInsertRowid, ...req.body });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: (req, res) => {
        const { name, description, price, stock, image, categoryId } = req.body;
        try {
            const result = ProductModel.update(req.params.id, name, description, price, stock, image, categoryId);
            if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ id: req.params.id, ...req.body });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: (req, res) => {
        try {
            const result = ProductModel.delete(req.params.id);
            if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductController;
