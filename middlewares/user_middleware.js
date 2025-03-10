const User = require('../models/users_model');
const CustomError = require('../utils/error_handler')
const jwt = require('jsonwebtoken');


exports.isLoggedIn = async (req, res, next) => {
    if(!req.headers.authorization && !req.cookies.token) {
        return next(new CustomError("Please login to access this page", 401));
    }


    const token  = req.cookies.token || req.header('Authorization').replace('Bearer', '');
    

   
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) {
                return next(new CustomError("Please login to access this page", 401));
            }

            req.user = await User.findById(decoded.id);
            next();
        });


}

exports.isAdmin = async (req, res, next)=>{
    if(req.user.role != "admin")return res.status(400).json({message: "unauthorized route"})
        next()
}

