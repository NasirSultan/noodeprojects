const express = require('express');
const router = express.Router();
const { registerAdmin, login, registerUser } = require('../controllers/authController');

router.post('/admin/register', registerAdmin);
router.post('/register', registerUser); // 👈 new route
router.post('/login', login);


module.exports = router;
