const { TABLE_PERPAGE } = require('../../config/constants');
const {Product,validateProduct} = require('../../models/product.model'); 
const {Category} = require('../../models/category.model'); 
const slugify = require('slugify');
const moment = require('moment');
const multer = require('multer');   
const path = require('path');
const fs = require('fs');
 
const PERPAGE = TABLE_PERPAGE;
// view category list
const viewProductList = async function (req, res, next) {
    const perPage = PERPAGE;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);
    try {
        const product = await Product.aggregate([
            { $lookup:
                {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: "$category" },
        ]).skip(skip).limit(perPage);;
    
        const pages = await Product.find().countDocuments();
        res.render("backend/product", {
        title: 'Product list',
        layout: 'layouts/backend',
        data:product,
        current: parseInt(page),
        pages: Math.ceil(pages / perPage)
      });
    } catch (error) {
        req.flash('error_msg', 'Product not found');
        res.redirect('/product');
    }
} 
 // view add category form
const addProductForm = async function (req, res, next) {
  const cat = await Category.find();
  const childrencategory = getChildrenCategory(cat);
 
  res.render('backend/product/add-product', 
  { 
    title: 'Create product',
    layout: 'layouts/backend',
    data:childrencategory
  });
}

// create category
const createProduct = async function (req, res, next) {
 
    const cat = await Category.find();
    const categoryList = getChildrenCategory(cat);

    let errors = [];

    const {name,price,description,offerValue,offerType,metaDescription,metaTitle,categoryId } = req.body;
    
    const {error} = validateProduct(req.body);
    if (error) {
        errors.push({
            text: error.details[0].message
        });

        res.render('backend/product/add-product', {
            title: 'Add product',
            errors: errors,
            layout: 'layouts/backend',
            data:categoryList
        });
    } else {

        let images = [];
        if(req.files.length > 0)
        {
            images = req.files.map(file => {
                return {image:process.env.PRODUCT_STORAGE+file.filename}
            });
        }
        const product = new Product({
            name: name,
            slug:slugify(name),
            price:price,
            description:description,
            metaDescription:metaDescription,
            metaTitle:metaTitle,
            productImages:images,
            offer:{
                offerType:offerType,
                offerValue:offerValue
            },
            categoryId:categoryId,
            createdBy:req.user._id
        });  
        try {
            const result = await product.save();
            if (result) {
                req.flash('success_msg', 'Product saved successfully.');
                res.redirect('/product/add');
            }
        } catch (ex) {
            for (let field in ex.errors) {
                errors.push({
                    text: ex.errors[field].message
                });
            }            
            res.render('backend/product/add-product', {
                title: 'product list',
                errors: errors,
                layout: 'layouts/backend',
                data:categoryList,
            });
        }   
    }
}
function getChildrenCategory(categories , parentId = null){
  const categoryList = [];
  let category;
  if(parentId == null)
  {
    category = categories.filter(cat => cat.parentId == null);
  }else{
    category = categories.filter(cat => cat.parentId == parentId);
  }
  for(let cate of category){
    categoryList.push({
        _id:cate._id,
        name:cate.name,
        children:getChildrenCategory(categories , cate._id)
    });
  }
  return categoryList;
}
// Change status
const changeStatus = async function(req,res,next){
    let productid = req.params.id;
    let productinfo = await Product.findById(productid);
    let update_status = (productinfo.status == 1)?0:1;
    Product.findOneAndUpdate({_id:productid},{$set:{status:update_status}},{new:true},(err,doc)=> {
        if(!err){
            req.flash('success_msg', 'Product status changed successfully.');
            res.redirect('/product');
        }else{
            req.flash('error_msg', 'Product status changed successfully.');
            res.redirect('/product');
        }
    });
}
module.exports = { createProduct,addProductForm,viewProductList,changeStatus};