const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please provide product name"],
        trim: true,
        maxlength: [120, "Product name should not be more than 120 characters"]
    },

    price:{
        type: Number,
        required: [true, "please provide product price"],
        maxlength: [5, "Product price should not be more than 5 digits"]
   
    },

    description:{
        type: String,
        required: [true, "please provide product descirption"],
   
    },

    photos:[
        {
            id: {
                type: String,
                require: true
            },
            secure_url:{
                type: String,
                required: true
            }
        }
    ],

    category:{
        type: String,
        require: [true, "Please select category from short-sleeves, long-sleeves, sweat-shirts, hoodies"],
        enum:{ 
           values: ["short-sleeves","long-sleeves","sweat-shirts","hoodies"],
           message: "Please select category from short-sleeves, long-sleeves, sweat-shirts, hoodies"
        }
    },

    stock:{
        type:Number,
        required: [true, "Please enter the product stock"]
    },
    

    brand:{
        type: String,
        required: [true, 'Please add a brand for clothing']
    },

    rating:{
        type: Number,
        default: 0
    },

    numOfReviews:{
        type: Number,
        default: 0
    },

    reviews:[
        {
            user:{type: mongoose.Schema.ObjectId, ref: "User", required: true},
            name:{type: String,required: true},
            rating:{type: Number, required: true,},
            comment:{type: String, required: true}
        },
    ],
    
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createAt:{
        type: Date,
        default: Date.now
    }


})








module.exports = mongoose.model('product', productSchema)