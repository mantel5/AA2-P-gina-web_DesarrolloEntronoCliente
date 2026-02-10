const CategoryModel = require('../models/category.model');

const CategoryController = {
    getAll: (req, res) => {
        try {
            const categories = CategoryModel.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getOne: (req, res) => {
        try {
            const category = CategoryModel.findById(req.params.id);
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: (req, res) => {
        const { name, description } = req.body;
        try {
            if (!name) return res.status(400).json({ error: 'Name is required' });
            const result = CategoryModel.create(name, description);
            res.status(201).json({ id: result.lastInsertRowid, name, description });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: (req, res) => {
        const { name, description } = req.body;
        try {
            const result = CategoryModel.update(req.params.id, name, description);
            if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
            res.json({ id: req.params.id, name, description });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: (req, res) => {
        try {
            const result = CategoryModel.delete(req.params.id);
            if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CategoryController;
