const express = require('express');
const router = express.Router();
const { addTeam, getTeams } = require('../controllers/teamController');
router.post('/add', addTeam);
router.get('/', getTeams);
module.exports = router;