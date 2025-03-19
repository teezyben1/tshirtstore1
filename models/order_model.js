const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
shippingInfo:{
    address:{type:String, required: true},
    city:{type:String, required:true},
    phoneNo:{type:String,required:true},
    state:{type:String, required:true},
    conutry:{type:String,requied:true}
},

user:{type:mongoose.Schema.ObjectId, ref:"User", requied:true},

paymentInfo:{
    id:{type:String}
},
taxAmount:{type:Number,required:true},

shippingAmount:{type:Number,required:true},

totalAmount:{type:Number,required:true},

orderStatus:{type:String, reequired:true, default:"processing"},

deliveredAt:{type:Date},

orderItems:[
    {
        name:{type:String, required:true},
        quantity:{type:Number, required:true},
        image:{type:String},
        price:{type:Number, required:true},
        product:{type:mongoose.Schema.ObjectId,ref:"Product",requied:true}
    }
    
],
createdAt:{type:Date,default:Date.now}

})



module.exports = mongoose.model("order", orderSchema)
