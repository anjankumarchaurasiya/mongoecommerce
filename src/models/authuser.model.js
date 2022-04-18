const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
    },
    created_at: {
        type: String,
        required: true
    },
});

const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().required().label(' Full Name '),
        email: Joi.string().email().required().label(' Email Address '),
        password: Joi.string().required().label(' Password '),
        password2: Joi.string().required().label(' Confirm Password '),
        role: Joi.string().required().label(' User Role '),
    }
    return Joi.validate(user, schema);
}

function confirmPassword(passwd, passwd2) {
    if (passwd != passwd2) {
        return true;
    } else {
        return false;
    }
}

exports.User = User;
exports.validateUser = validateUser;
exports.confirmPassword = confirmPassword;