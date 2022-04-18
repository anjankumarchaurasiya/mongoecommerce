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
    title: 'Category list',
    layout: 'layouts/backend',
    data:category
  });
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
    
    const {error} = validateCategory(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });

        res.render('backend/category/add-category', {
            title: 'Add category',
            errors: errors,
            layout: 'layouts/backend',
            data:categoryList
        });
    } else {

        const category = new Category({
            name: name,
            slug:slugify(name),
            serialNo:serialNo,
            description:description,
            metaDescription:metaDescription,
            metaTitle:metaTitle
        });

        (parentId !=="")? category.parentId = parentId:'';
        (req.file)?  category.image = req.file.path:'';
         
        try {
            const result = await category.save();
            if (result) {
                req.flash('success_msg', 'Category saved successfully.');
                res.redirect('/category/add');
            }
        } catch (ex) {
            for (let field in ex.errors) {
                errors.push({
                    text: ex.errors[field].message
                });
            }            
            res.render('backend/category/add-category', {
                title: 'Category list',
                errors: errors,
                layout: 'layouts/backend',
                data:categoryList,
            });
        }   
    }
}
module.exports = { createCategory,addCategoryForm,viewCategoryList };