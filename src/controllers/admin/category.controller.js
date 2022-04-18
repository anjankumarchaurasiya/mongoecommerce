const {Category,validateCategory} = require('../../models/category.model'); 
const slugify = require('slugify');
const moment = require('moment');
const multer = require('multer');   
const path = require('path');
const fs = require('fs');
 
// view category list
const viewCategoryList = async function (req, res, next) {
    const perPage = 5;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);
    const cat = await Category.find();
    const childrencategory = getChildrenCategory(cat);
    try {
        const cat = await Category.find();
        const childrencategory = getChildrenCategory(cat);
        //   const category = await Category.find().skip(skip).limit(perPage);
        //   const pages = await Category.find().countDocuments();
      res.render("backend/category", {
        title: 'Category list',
        layout: 'layouts/backend',
        data:childrencategory,
        moment:moment,
        // current: parseInt(page),
        // pages: Math.ceil(pages / perPage)
      });
    } catch (error) {
        req.flash('error_msg', 'Category not found');
        res.redirect('/category');
    }
} 
 // view add category form
const addCategoryForm = async function (req, res, next) {
  const cat = await Category.find();
  const category = getChildrenCategory(cat);
  res.render('backend/category/add-category', 
  { 
    title: 'Add category',
    layout: 'layouts/backend',
    data:category,
    formData:{}
  });
}
function getChildrenCategory(categories , parentId){
  const categoryList = [];
  let category;
  if(parentId === null )
  {
    category = categories.filter(cat => cat.parentId == null);
  }else if(parentId === undefined ){
    category=categories;
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
// create category
const createCategory = async function (req, res, next) {
 
    const cat = await Category.find();
    const categoryList = getChildrenCategory(cat);

    let errors = [];
    let name = req.body.name;
    let serialNo = req.body.serialNo;
    let description = req.body.description;
    let metaDescription = req.body.metaDescription;
    let metaTitle = req.body.metaTitle;
    let parentId = req.body.parentId;
    let schemaCode = req.body.schemaCode;
    let imageAlt = req.body.imageAlt;
    
    const {error} = validateCategory(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });

        res.render('backend/category/add-category', {
            title: 'Add category',
            errors: errors,
            layout: 'layouts/backend',
            data:categoryList,
            formData:req.body
        });
    } else {

        const category = new Category({
            name: name.toUpperCase(),
            slug:slugify(name),
            serialNo:serialNo,
            description:description,
            metaDescription:metaDescription,
            metaTitle:metaTitle,
            schemaCode:schemaCode
        });

        (parentId !=="")? category.parentId = parentId:'';  
        category.categoryImage = {image: (req.file)? req.file.path:'',imageAlt:imageAlt};
         
        try {
            const result = await category.save();
            if (result) {
                req.flash('success_msg', 'Category saved successfully.');
                res.redirect('/category/add');
            }
        } catch (ex) {
          console.log('ex',ex);
            for (let field in ex.errors) {
                errors.push({
                    text: ex.errors[field].message
                });
            }            
            res.render('backend/category/add-category', {
                title: 'Add category',
                errors: errors,
                layout: 'layouts/backend',
                data:categoryList,
                formData:req.body
            });
        }   
    }
}
// delete category
const deleteCategory = async function(req, res, next){
  let catId = req.params.id;
  await Category.findByIdAndRemove(catId,(err,doc)=>
  {
    if(!err)
    {
      req.flash('success_msg', 'Category deleted successfully.');
      res.redirect('/category');
    }else{
      console.log('Failed to Delete Course Details: ' + err);
      req.flash('error_msg', err);
      res.redirect('/category');
    }
  });
}
module.exports = { createCategory,addCategoryForm,viewCategoryList,deleteCategory };