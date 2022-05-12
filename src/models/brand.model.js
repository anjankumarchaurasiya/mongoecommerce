const mongoose = require('mongoose');
const Joi = require('joi');

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    serialNo:{
        type:Number,
        required:false,
    }
},{timestamps:true});

const Brand =  mongoose.model('Brand',brandSchema);

function validateBrand(brn)
{
    const BrnJoiSchema = Joi.object({
        name:Joi.string().min(3).max(30).trim(true).required().label('Brand name'),
        serialNo:Joi.number().trim(true).label('Brand name'),
    }).options({abortEarly:false});
    return BrnJoiSchema.validate(brn);
}

exports.Brand = Brand;
exports.validateBrand = validateBrand;