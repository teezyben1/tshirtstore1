const express = require('express');
const router = express.Router()


// Importing the controller
const {signup} = require('../controllers/user_controller')

// Routes
router.post('/signup', signup)










module.exports = router;