const User = require('../models/users_model');
const cookieToken = require('../utils/cooki_token');
const CustomError = require('../utils/error_handler')
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary').v2




exports.signup = async (req, res, next) =>{
    try {
        const {name, email, password} = req.body;

        if (!(name && email && password)) {
            
            return next(new CustomError('All input is required', 400));
        }

        // image or file
        // let result;
        if (req.files){
            let file = req.files.photo
         result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "users",
                width: 150,
                crop: "scale"

            })

            const user = await User.create({
                name,
                email,
                password,
                profile_img:{
                    public_id:result.public_id,
                    url: result.secure_url
                }
            })
            cookieToken(user, res)

        }


       else{
        const user = await User.create({
            name,
            email,
            password
            // profile_img:{
            //     public_id:result.public_id,
            //     url: result.secure_url
            // }
        })

        cookieToken(user, res)
    }

    } catch (error) {
        next(error);
    }
}