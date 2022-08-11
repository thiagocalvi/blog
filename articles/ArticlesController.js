const express = require('express');
const router = express.Router();
const slugfy = require('slugify');
const adminAuth = require('../middewares/adminAuth')


const Category = require('../categories/Category');
const Article = require('../articles/Article');


router.get('/admin/articles', adminAuth, (req,res)=>{

    Article.findAll({
        include: [{model: Category}],
        order: [['id', 'DESC']]
    }).then((articles)=>{
        res.render('admin/articles/index', {
            articles:articles
        });
    });

}); 

router.get('/admin/articles/new', adminAuth, (req, res)=>{
    Category.findAll().then((categories)=>{
        res.render('admin/articles/new', {
            categories:categories
        });
    });
});

router.post('/article/save', adminAuth, (req, res)=>{

    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugfy(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles');
    })
})

router.post("/article/delete", adminAuth, (req, res)=>{
    
    let id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            
            Article.destroy({
                where:{
                    id: id
                }
            })
            .then(()=>{
                res.redirect('/admin/articles');
            })
        }
        else{
            res.redirect('/admin/articles');
        }
    }
    else{
        res.redirect('/admin/articles');
    };
});




router.get('/admin/aticles/edit/:id', adminAuth, (req,res)=>{
   
    let id = req.params.id;
    
    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Article.findByPk(id, {include: [{model:Category}]}).then((article)=>{
            if(article != undefined){
                Category.findAll().then(categories => {
                    res.render('admin/articles/edit', {
                        article:article,
                        category: categories
                    });
                })
            }
            else{
                res.redirect('/admin/articles');
        }
    })
    .catch((erro) => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/update', adminAuth,(req,res)=>{
    
    let id = req.body.id;
    let title = req.body.title;
    let categoryId = req.body.categoryId;
    let body = req.body.body;
    let slug = slugfy(title);
    
        Article.update({title: title, slug:slug, body:body, categoryId:categoryId}, {
        where: {
            id:id
        }
    })
    .then(()=>{
        res.redirect('/admin/articles');
    })
})

router.get('/articles/page/:num', (req, res)=>{
    let page = req.params.num
    let offset = 0;

    if(isNaN(page) || page == 0){
        offset = 0
    }else{
        offset = (parseInt(page) -1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[['id', 'DESC']]
    }).then((articles)=>{

        let next;
        if(offset + 4 > articles.count){
            next = false;
        }
        else{
            next = true;
        }

        let result = {
            next : next,
            articles : articles
        }

        Category.findAll().then(categories =>{
            res.render("admin/articles/page", {
                result: result,
                categories: categories
            })

        })
    })
})



module.exports = router;