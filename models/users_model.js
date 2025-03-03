const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
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
            requires: true
        },
        url: {
            type: String,
            required: true}
    },
    forgotPasswordToken: String,

    forgotPasswordExpire: Date,

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
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash and set to resetPasswordToken
    this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token expire time
    this.forgotPasswordExpire = Date.now() + 20 * 60 * 1000;

    return resetToken;
}




module.exports = mongoose.model('User', userSchema);