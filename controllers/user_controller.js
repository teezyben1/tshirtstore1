const User = require('../models/users_model');
const cookieToken = require('../utils/cooki_token');
const CustomError = require('../utils/error_handler')
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcryptjs')
const sendEmail = require('../utils/email_helper')





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

            if(result == {})return res.status(400).res.json({message: "unable to save you photo please try again"})

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

exports.login = async(req,res, next) => {
    try {
        const {email, password} = req.body
        if (!(email && password)) {
            return next(new CustomError('All input is required', 400));
        }
        const user = await User.findOne({email}).select('+password');
        if (!user || ! await user.isValidatedPassword(password)) {
            return next(new CustomError('Invalid email or password', 401));
        }
        cookieToken(user, res)
;
    } catch (error) {
        next(error)
        
    }
}

exports.logout = async(req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out'
        })
        res.json({
            success: true,
            message: 'Logged out'
        })
    } catch (error) {
        next(error)
    }
}
// to work on later
exports.forgotPassword = async(req, res, next) => {
    try {
        const {email}= req.body;
        if (!email) {
            return next(new CustomError('Please provide an email', 400));
        }
        const user = await User.findOne({email})
        if (!user) {
            return next(new CustomError('User not register', 404));
        }

        const forgotPasswordToken = user.getResetPasswordToken(); 
        await user.save({validateBeforeSave: false});
        const message = `Your password reset code is as follows: \n\n${forgotPasswordToken}
        \n\nIf you have not requested this email, then ignore it.`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Teezyshirt Password Recovery',
                text: message
            })
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            })
        } catch (error) {
            user.forgotPasswordToken = undefined;
            user.forgotPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            return next(new CustomError(error.message, 500));
        }
        
    } catch (error) {
        next(error)
        
    }
}

exports.userProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user)return res.status(404).json({message:"Please login to view your profile"})
        res.status(200).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.upDatePassword = async(req, res, next) => {
    try {
        const{currentPassword, newPassword, comfirmPassword} = req.body

        if(newPassword != comfirmPassword) return res.status(400).json({message: "new password and comfirm password did not match"})

        const user = await User.findById(req.user.id).select('+password');

        if (!user)return res.status(404).json({message:"Please login to update your password"})

        if ( !await user.isValidatedPassword(currentPassword))return res.status(400).json({message:"current password is wrong"})
            user.password = newPassword

        await user.save()

        cookieToken(user, res)

        res.status(200).json({
            success: true,
            message: "password succefully updated",
            data: user
        }) 
        

        } catch (error) {
            next (error)

        
    }
}

exports.updateUser = async(req, res, next) => {
    try {
        // todo check the req.body

        const newData = {
            name: req.body.name,
            email: req.body.email
        }

        if (req.files){
            const file = req.files.photo
            const user = await User.findById(userId)
            
            const imageId = user.profile_img.public_id;

            // delete photo on cloudinary
            const respond = await cloudinary.uploader.destroy(imageId)

            // upload the new photo
            const newPhoto = await cloudinary.uploader.upload(file.tempFilePath,{
                folder: "users",
                width: 150,
                crop: "scale"
            })

            newData.profile_img = {
                public_id: newPhoto.public_id,
                url: newPhoto.secure_url

            }

            const upDateduser = await User.findByIdAndUpdate(userId, newData, {returnDocument:'after'})
            res.status(200).json({
                success: true,
                data: upDateduser
            })
            
        }else{

            const user = await User.findByIdAndUpdate(userId, newData,{returnDocument:'after'})
            res.status(200).json({
                success: true,
                data: user
            })
        }
        
    } catch (error) {
        next(error)
        
    }
}

exports.allUser = async(req, res, next) =>{
    try {
        const users = await User.find({role: "user"})

        res.status(200).json({
            success: true,
            data: users
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.oneUser = async(req, res, next) =>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        
        res.status(200).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        next(error)
        
    }
}

exports.adminUpDateUser = async(req, res, next) =>{
    try {
        const userId = req.params.id
        
       
        const newData = {
            name: req.body.name,
            email: req.body.email
        }

        if (req.files){
            const file = req.files.photo
            const user = await User.findById(userId)
            
            const imageId = user.profile_img.public_id;

            // delete photo on cloudinary
            const respond = await cloudinary.uploader.destroy(imageId)

            // upload the new photo
            const newPhoto = await cloudinary.uploader.upload(file.tempFilePath,{
                folder: "users",
                width: 150,
                crop: "scale"
            })

            newData.profile_img = {
                public_id: newPhoto.public_id,
                url: newPhoto.secure_url

            }

            const upDateduser = await User.findByIdAndUpdate(userId, newData, {returnDocument:'after'})
            res.status(200).json({
                success: true,
                data: upDateduser
            })
            
        }else{

            const user = await User.findByIdAndUpdate(userId, newData,{returnDocument:'after'})
            res.status(200).json({
                success: true,
                data: user
            })
        }


        
    } catch (error) {
        next(error)
        
    }

}
exports.adminDeleteUser = async(req, res,next) =>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
            
        const imageId = user.profile_img.public_id;

        // delete photo on cloudinary
        const respond = await cloudinary.uploader.destroy(imageId)
        await User.findByIdAndDelete(userId)

        res.status(200).json({
            success: true,
            message: "user deleted ",
            data: user
        })


    } catch (error) {
        next(error)
        
    }
}