const router = require('express').Router()
const { createOrder, getOrderById, getOrders, modifyOrderById, deleteOrder } = require('../controllers/order_controller')
const {isLoggedIn, isAdmin}  = require('../middlewares/user_middleware')




router.post('/order', isLoggedIn, createOrder)
router.get('/order/:id', isLoggedIn,getOrderById)
router.get('/orders', isLoggedIn, getOrders)
router.patch('/order/:id', isLoggedIn, isAdmin, modifyOrderById)
router.delete('/order/:id', isLoggedIn, isAdmin, deleteOrder)


module.exports = router