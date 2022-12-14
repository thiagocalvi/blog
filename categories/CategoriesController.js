const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Article = require('../articles/Article');
const adminAuth = require('../middewares/adminAuth');

//models
const Category = require('./Category');


router.get('/admin/categories/new', adminAuth, (req, res)=>{
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth, (req, res)=>{
    
    let title = req.body.title;
    let slug = slugify(title)
    
    if(title != undefined){
        Category.create({
          title: title, 
          slug: slug 
        })
        .then(()=>{
            res.redirect('/admin/categories');
        })
    }
    else{
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', adminAuth, (req,res)=>{

    Category.findAll({order:[['id', 'DESC']]})
        .then((categories)=>{
            res.render('admin/categories/index', {
                categories:categories
            })
    });
});

router.post("/categories/delete", adminAuth, (req, res)=>{
    
    let id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            
            Category.destroy({
                where:{
                    id: id
                }
            })
            .then(()=>{
                res.redirect('/admin/categories');
            })
        }
        else{
            res.redirect('/admin/categories');
        }
    }
    else{
        res.redirect('/admin/categories');
    };
});

router.get('/admin/categories/edit/:id', adminAuth, (req,res)=>{
   
    let id = req.params.id;
    
    if(isNaN(id)){
        res.redirect('/admin/categories');
    }
    
    Category.findByPk(id)
        .then((category)=>{
            if(category != undefined){
            res.render('admin/categories/edit', {
                category:category
            });
        }
        else{
            res.redirect('/admin/categories');
        }
    })
    .catch((erro) => {
        res.redirect('/admin/categories');
    });
});

router.post('/categories/update', adminAuth, (req,res)=>{
    
    let id = req.body.id;
    let title = req.body.title;
    let slug = slugify(title);
    
    Category.update({title: title, slug:slug}, {
        where: {
            id:id
        }
    })
    .then(()=>{
        res.redirect('/admin/categories');
    })
})

module.exports = router;