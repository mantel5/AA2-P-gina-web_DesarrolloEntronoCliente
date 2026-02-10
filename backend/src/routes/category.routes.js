const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
// Add middleware to protect routes if needed, for simplicity enabling public access or adding auth middleware later
// const authMiddleware = require('../middleware/auth.middleware');

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getOne);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

module.exports = router;
