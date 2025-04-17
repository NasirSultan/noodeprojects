const express = require('express');
const router = express.Router();
const { getProductLog, getAddDeleteLog,deleteAllLogs } = require('../controllers/logController');
const { auth } = require('../middleware/auth');

router.get('/product', auth, getProductLog); // User can view their product add/delete logs
router.get('/history', auth, getAddDeleteLog);
router.get('/delete', auth, deleteAllLogs);  // User can view add/delete history

module.exports = router;
