const stripe = require("stripe")(process.env.STRIPE_SECRET)


exports.sendPublicKey = (req, res,next)=>{
    res.status(200).json({
        stripeKey: process.env.STRIPE_PUBLIC
    })
}

exports.stripePayment = async(req, res,next)=>{

 try {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: "usd"
    })
    
 } catch (error) {
    next(error)
    
 }





}

