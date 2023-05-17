module.exports={
    userAuthenticated:function(req,res,next){
        if(req.isAuthenticated()&& res.locals.user.role=="user"){
           return next();
        }
        req.flash("error_message","please login as user")
        res.redirect('/user/login');
    },
    adminAuthenticated:function(req,res,next){
        if(req.isAuthenticated() && res.locals.user.role=="admin"){
           return next();
        }
        req.flash("error_message","please login as Admin")
        res.redirect('/user/login');
    }
}