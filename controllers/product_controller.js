const Product = require("../models/product_model")
const cloudinary = require('cloudinary')
const CustomError = require('../utils/error_handler.js')
const whereClause = require('../utils/where_clause')


exports.addProduct = async(req, res, next)=>{
    try {
        let images = []

        if (!req.files)return next(CustomError("Please provide your product images"))
        // upload images to the cloudinary
        
        for (let image = 0; image < req.files.photos.length; image++){
            let result = await cloudinary.v2.uploader.upload(req.files.photos[image].tempFilePath, {folder: "products"})
            // console.log(result)

            images.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        
    }
        req.body.photos = images 
        req.body.user = req.user.id

        const product = await Product.create(req.body)

        res.status(201).json({
            message:"success",
            data: product
        })


        
    } catch (error) {
        next(error)
    }
}

exports.getProducts = async(req,res,next)=> {
    try {
        const resultPerPage = 2

        const productsObj = new whereClause (Product.find(),req.query).search().filter()

        let products = await productsObj.base
        const filterProductNumber = products.length

        productsObj.pager(resultPerPage)
        products  = await productsObj.base.clone()

        res.status(200).json({
            message: "success",
            products,
            filterProductNumber
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.getProduct = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json({
            message: "success",
            product
        })

    } catch (error) {
        next(error)
        
    }
}

exports.modifyProduct =async(req, res, next) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)
        const newImage = []

        if (!req.files){
            const modifiedProduct = await Product.findByIdAndUpdate(productId, req.body, {returnDocument:'after'})
            res.status(200).json({
                message: "success",
                data: modifiedProduct
            })

        } 
            // if there is new image for the product then delete the old ones
            for (let image = 0; image < product.photos.length; image++){
                 await cloudinary.v2.uploader.destroy(product.photos[image].id)
            }
        
        // upload the new images
        for (let image = 0; image < req.files.photos.length; image++){
            const images = await cloudinary.v2.uploader.upload(req.files.photos[image].tempFilePath,{folder: "products"})
            
            newImage.push({
                id: images.public_id,
                secure_url: images.secure_url
            })
        }

            req.body.photos = newImage

            const modifiedProduct = await Product.findByIdAndUpdate(productId, req.body, {returnDocument:'after'})
    
            res.status(200).json({
                message: "success",
                data: modifiedProduct
            })
            
    }catch (error) {
        next(error)
    }
}


exports.deleteProduct = async(req, res, next) =>{
    try { 
        const productId = req.params.id
        const product = await Product.findById(productId)

        // loop through the product image and delete in cloudinary
        for (let image = 0 ; image < product.photos.length; image++){
            await cloudinary.v2.uploader.destroy(product.photos[image].id)
        }

        await Product.findByIdAndDelete(productId)

        res.status(200).json({
            message: "success"
        })

    } catch (error) {
        next(error)
    }
}

exports.addReview = async(req,res,next) =>{
    try {
        // console.log(req.user)
        const {rating, comment,productId} = req.body
        req.body.user = req.user._id
        req.body.name = req.user.name

        // find the product with the product Id
        const product = await Product.findById(productId)
        if(!product)return next(new CustomError('Product not found', 404));

        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())


        if(alreadyReviewed){
            product.reviews.forEach((review)=>{
                if (review.user.toString() === req.user._id.toString()){
                    review.rating = rating
                    review.comment = comment
                }
                
            })


        }else{
            product.reviews.push(req.body)
            
            // add to numbers of reviews
            product.numOfReviews = product.reviews.length
            
        }

        // add the average ratings
        product.rating = product.reviews.reduce((acum, item)=> item.rating + acum, 0 )/ product.reviews.length
        console.log( product.rating = product.reviews.reduce((acum, item)=> item.rating + acum, 0 )/ product.reviews.length
    )
        await product.save()
         

        res.status(200).json({
            message: "success"
        })




    } catch (error) {
        next(error)
        
    }
}

exports.deleteReview = async(req, res, next) => {
    try {
        const productId = req.params.productId
        
        const product = await Product.findById(productId)
        if(!product)return next(new CustomError("Product not found"))

            product.reviews = product.reviews.filter((item) => item.user.toString() != req.user._id.toString())

            // update the numbers of reviews
           product.numOfReviews = product.reviews.length

            // update the ratings
            // returning NaN when there is no rating
          product.rating = product.reviews.reduce((acum, item)=> item.rating + acum, 0 )/ product.reviews.length
          
    
        
            // update the product
            await Product.findByIdAndUpdate(productId,{
                reviews: product.reviews,
                numOfReviews: product.numOfReviews,
                rating: product.rating
            }, {new: true})

            res.status(200).json({
                message: "success",
                product
            })

        
    } catch (error) {
        next(error)
        
    }
}