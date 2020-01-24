module.exports = function(app, passport) {
    var session = require('express-session');
    var Recipe = require('./models/recipe.js')
    
    //Home Page with links
    app.get("/", function(req, res) {
        res.render("index");
    });

    //Login form 
    app.get("/login", function(req, res) {
        res.render("login", {message: req.flash('loginMessage')});
    });

    //To handle the post request from login page 
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/recipes', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    //SignUp form
    app.get("/signup", function(req,res){
        res.render("signup",{message: req.flash('signupMessage')});
    });
    
    //Handling post request from signup page
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    //Display recipes
    app.get("/recipes", function(req, res){
        Recipe.find({}, function(err, recipes){
            if(err){
                console.log("Error");
            }
            else {
                res.render("display", {recipes: recipes});
            }
        })
    });
    app.get("/recipes/new", isLoggedIn, function(req, res){
        if(req.user) 
            res.render("new");
        else
            res.redirect("/login");
    });
    app.post("/recipes", function(req, res){
        Recipe.create(req.body.recipe, function(err, newRecipe){
            if(!err){
                res.redirect("/recipes");
            }
        })
    });
    
    //show Route
    app.get("/recipes/:id", function(req, res){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            if(!err){
                res.render("show", {recipe: foundRecipe});
            }
        })
    });
    
    //Edit route
    app.get("/recipes/:id/edit",isLoggedIn, function(req,res){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            if(!err){
                res.render("edit", {recipe: foundRecipe});
            }
        })
    });
    
    //Update route
    app.put("/recipes/:id",isLoggedIn, function(req, res){
        Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err,updatedRecipe){
            if(!err){
                res.redirect("/recipes/"+req.params.id);
            }
        })
    });
    
    //DELETE route
    app.delete("/recipes/:id",isLoggedIn, function(req, res){
        Recipe.findByIdAndRemove(req.params.id, function(err){
            if(!err){
                res.redirect("/recipes");
            }
        })
    });

    app.get('/about', (req,res) =>{
        res.render('about');
    });

    //logout button
    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    //To check if the user is logged in
    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }
}