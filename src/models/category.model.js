const Joi = require('joi');
const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    image:{
        type: String,
        trim:true,
        default:null
    },
    imageAlt:{
        type:String,
        trim:true,
        default:null
    } 
},{ _id : false });
const categorySchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
        validate: {
            validator: async function(name) {
                const user = await this.constructor.findOne({ name });
                if(user) {
                    if(this.id === user.id) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            message: props => 'Category is already in use.'
        } 
    },
    slug:{
        type:String,
        unique:true,
    },
    serialNo:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        trim:true,
        default : null
    },
    metaDescription:{
        type:String,
        trim:true,
        default : null
    },
    metaTitle:{
        type:String,
        trimg:true,
        default : null
    },
    categoryImage:imageSchema,
    parentId:{
        type:String,
        trimg:true,
        default : null
    },
    status:{
        type:Number,
        enum: [1, 0],
        required:true,
        default:1
    },
    schemaCode:{
        type:String,
        trim:true,
        default:null
    }
    
},{timestamps:true});
const Category = mongoose.model('Category', categorySchema);

//Category validator
function validateCategory(cat)
{
    const JoiSchema = Joi.object({
        name: Joi.string().min(3).max(30).trim(true).required().label('Category name'),
        serialNo: Joi.string().trim(true).empty('').label('Serial No.'),
        description: Joi.string().trim(true).empty('').label('Description'),
        metaDescription: Joi.string().trim(true).empty('').label('Meta description'),
        metaTitle: Joi.string().trim(true).empty('').label('Meta title'),
        image: Joi.string().trim(true).empty('').label('Image'),
        imageAlt: Joi.string().trim(true).empty('').label('Alt tag'),
        parentId: Joi.string().empty('').label('Parent id'),
        status: Joi.number().default(1).label('Status'),
        schemaCode: Joi.string().trim(true).empty('').label('Schema code'),
    }).options({ abortEarly: false });
    return JoiSchema.validate(cat)
}
exports.Category = Category;
exports.validateCategory = validateCategory;