const Order = require('../models/order_model')
const Product = require('../models/product_model')
const CustomError = require('../utils/error_handler')


exports.createOrder = async (req, res, next) =>{
    try {
        const user = req.user._id
        const{shippingInfo,orderItems,paymentInfo,taxAmount,shippingAmount,totalAmount} = req.body

        // TODO: Check the product stock before creating an order

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
            user
        })
        // TODO: Update the product stock after order is being created

        res.status(200).json({
            success: true,
            message: "order created successfuly"
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.getOrderById = async (req, res, next) =>{
    try {
        
    const order = await Order.findById(req.params.id).populate("user", "name")
    
    if (!order)return next(CustomError("invalid order id"))

        res.status(200).json({
            success: "true",
            data: order
        })
    } catch (error) {
        next(error)
        
    }
}

exports.getOrders = async (req, res, next) =>{
    try {
        const orders = await Order.find().populate("user","name")

        res.status(200).json({
            success: "true",
            data: orders
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.modifyOrderById = async (req, res, next) =>{
    try {
        const modifiedOrder = await Order.findByIdAndUpdate(req.params.id,req.body,{new: true})
        
        res.status(200).json({
            success: "true",
            modifiedOrder: modifiedOrder
        })
    } catch (error) {
        next(error)
        
    }
}

exports.deleteOrder = async (req, res, next) =>{
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: "true",
            deletedOrder: deletedOrder
        })
        
    } catch (error) {
        next(error)
        
    }
}