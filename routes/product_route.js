const router = require('express').Router()
const {isLoggedIn, isAdmin} = require('../middlewares/user_middleware')
const {addProduct,getProducts,getProduct, modifyProduct, deleteProduct, addReview, deleteReview} = require('../controllers/product_controller')


router.get('/products',getProducts)
router.get('/product/:id',getProduct)
router.put('/product/review',isLoggedIn, addReview)
router.delete("/product/:productId",isLoggedIn,deleteReview)

// Admin products routes
router.post('/product',isLoggedIn,isAdmin,addProduct)
router.patch('/product/:id',isLoggedIn, isAdmin, modifyProduct)
router.delete('/product/:id',isLoggedIn, isAdmin, deleteProduct)


module.exports = router

