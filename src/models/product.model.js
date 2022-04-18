import Joi from "joi";
import mongoose from "mongoose";
const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        validate:{
            validator: async function(name){
                const product  =  await this.constructor.findOne({name});
                if(product)
                {
                    if(this.id ===  product.id)
                    {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            message:props=>'Product name already in use.'
        },
        trim:true
    },
    price:{
        type:Number,
        trim:true,
        required:true
    },
    slug:{
        type:String,
        unique:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    offer:{
        offerType:{
            type:String,
            required:true,
            enum:['percentage','fixed']
        },
        offerValue:{
            type:Number,
            required:true,
            trim:true
        }
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true, 
    },
    metaDescription:{
        type:String,
        trim:true,
        default:null
    },
    metaTitle:{
        type:String,
        trim:true,
        default:null,
    },
    productImages:[
        {
            image:{
                type: String,
                required:true
            } 
        }
    ],
    reviews:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
            },
            review:{
                type:String
            }
        }
    ],
    isDeleted:{
        type:Number,
        enum: [1, 0],
        required:true,
        default:1
    },
    status:{
        type:Number,
        enum: [1, 0],
        required:true,
        default:1
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
},{timestamps:true});
const Product = mongoose.model('Product', productSchema);

//Category validator
function validateProduct(cat)
{
    const JoiSchema = Joi.object({
        name: Joi.string().min(3).max(30).trim(true).required().label('Product name'),
        price: Joi.number().min(0).required().label('Price'),
        description: Joi.string().trim(true).required(true).label('Description'),
        offerType:Joi.string().trim(true).required(true).label('Offer type'),
        offerValue:Joi.string().trim(true).required(true).label('Offer value'),
        categoryId:Joi.string().trim(true).required(true).label('Category'),
        metaDescription: Joi.string().trim(true).empty('').label('Meta description'),
        metaTitle: Joi.string().trim(true).empty('').label('Meta title'),
        status: Joi.number().default(1).label('Status'),
        isDeleted: Joi.number().default(0).label('Is deleted'),
        productImages: Joi.array().items({
            image: Joi.string().trim(true).required().label('Image'),
        }),
    }).options({ abortEarly: false });
    return JoiSchema.validate(cat)
}
exports.Product = Product;
exports.validateProduct = validateProduct;