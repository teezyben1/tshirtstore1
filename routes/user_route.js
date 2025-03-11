const express = require('express');
const router = express.Router()
const {isLoggedIn, isAdmin} = require('../middlewares/user_middleware')


// Importing the controller
const {signup, login, logout, forgotPassword,userProfile,
      upDatePassword, updateUser, allUser, oneUser, 
      adminUpDateUser, adminDeleteUser} = require('../controllers/user_controller')

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout)

// /TODO reset password

router.post('/forgotpassword', forgotPassword)
router.get('/user/profile',isLoggedIn, userProfile)
router.post("/updatepassword", isLoggedIn, upDatePassword)
router.patch('/updateuserprofile', isLoggedIn, updateUser)
router.get("/admin/users",isLoggedIn,isAdmin, allUser)
router.get("/admin/users/:id", isLoggedIn,isAdmin, oneUser)
router.patch("/admin/user/:id", isLoggedIn, isAdmin, adminUpDateUser)
router.delete("/admin/user/:id", isLoggedIn, isAdmin, adminDeleteUser)











module.exports = router;