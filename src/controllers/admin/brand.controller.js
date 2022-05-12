const {Brand,validateBrand} = require('../../models/brand.model');
// view brand list 
const viewBrandList = async function(req,res,next){
    try {
        const brand = await Brand.find();
        res.render("backend/brand",{
            title:'Brand list',
            layout:'layouts/backend',
            data:brand
        });
    }catch(error){
        req.flash('error_msg',error);
        res.redirect('/brand');
    }
}
module.exports = {viewBrandList};