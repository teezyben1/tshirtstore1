const express = require('express');
const router = express.Router()


// Importing the controller
const {home} = require('../controllers/user_controller')

// Routes
router.get('/', home)

module.exports = router;