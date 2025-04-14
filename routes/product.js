const express = require('express');
const router = express.Router();
const {
  addProduct, deleteProduct, getMyProducts, getAllProducts
} = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, addProduct);
router.delete('/:id', auth, deleteProduct);
router.get('/my', auth, getMyProducts);
router.get('/all', auth, isAdmin, getAllProducts);

module.exports = router;
