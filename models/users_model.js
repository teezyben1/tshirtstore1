const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [20, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required:[true, 'please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },

    role: {
        type: String,
        default: 'user'
    },

    profile_img: {
        public_id: {
            type: String,
            default: "none"
            
        },
        url: {
            type: String,
            default: "none"
            }
    },
    otp:{type: String,},
    otpExpiry:{type: Date},

    createdAt: {
        type: Date,
        default: Date.now
    },
})


// encrypting password before saving user (HOOKS)
userSchema.pre('save', async function (next) {
    // if password is not modified then don't encrypt it again 
    if(!this.isModified('password')) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 10); 
})

// compare user password (instance method)
userSchema.methods.isValidatedPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// create JWT token(instance method)
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    // generate token
    const resetToken = String(Math.floor(Math.random()*10000)).padStart(4,"0")


    // set token expire time
    this.otpExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken;
}




module.exports = mongoose.model('User', userSchema);