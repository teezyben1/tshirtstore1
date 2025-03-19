const router = require('express').Router()
const { sendPublicKey, stripePayment } = require('../controllers/payment_controller')




router.get('/getstripekey',sendPublicKey)
router.post("/payment",stripePayment)

module.exports =router