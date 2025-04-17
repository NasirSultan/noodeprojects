const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, getMyProducts, getAllProducts, getUserProducts ,addProducadmin,getAllUsers,getUserProductsById,deleteProductadmin} = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, addProduct); // User can add product
router.delete('/:id', auth, deleteProduct); // User can delete their own product
router.get('/my', auth, getMyProducts); // User can get their own products
router.get('/all', auth, isAdmin, getAllProducts); // Admin can view all products
router.get('/user/:userId', auth, isAdmin, getUserProducts);
router.post('/admin', auth, addProducadmin); // Admin can see user's products
router.get('/getuser', auth, getAllUsers); // Admin can see user's products
router.get('/getuserproducts/:id', auth, getUserProductsById); 
router.delete('/deleteProductadmin', auth, isAdmin, deleteProductadmin); 
module.exports = router;
