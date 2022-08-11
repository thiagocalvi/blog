const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
const session = require('express-session');



app.use(session({
    secret: "ola",
    cookie: {
        maxAge: 30000
    }
}))



app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database
const connection = require('./database/database');
connection.authenticate()
    .then(()=>{
        console.log('Conectado com o database');
    })
    .catch((error)=>{
        console.log(error);
    })


//Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UserController');



//Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./user/User');






app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);


// app.get('/session', (req, res)=>{
//     req.session.treianamento = 'Formação js'
//     req.session.ano = 2022
//     req.session.user = {
//         name: 'thiago',
//         id: 18 
//     }
//     res.send('sessão criada')
// })



// app.get('/leitura', (req, res)=>{

//     res.json({
//         treianamento: req.session.treianamento,
//         ano: req.session.ano,
//         user : req.session.user
//     })

// })






app.get("/", (req, res)=>{
    
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4

    }).then((article)=>{
        Category.findAll().then((category)=>{

            res.render('index', {
                articles:article,
                categories:category
            });
        })
    })
});

app.get("/:slug", (req, res)=>{
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug:slug
        }
    })
    .then((article)=>{
        if(article != undefined){
            Category.findAll().then((category)=>{
                res.render("article", {
                    articles:article,
                    categories:category
                });
            })
        }
        else{
            res.redirect("/")
        }
    })
    .catch((err)=>{
        res.redirect("/")
    })
})

app.get("/category/:slug", (req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        }, 
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index", {
                    articles: category.articles,
                    categories: categories
                })
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})




app.listen(port, (erro)=>{
    erro? console.log("Erro inesperado") : console.log("Servidor rodando\n > localhost:"+port);
});