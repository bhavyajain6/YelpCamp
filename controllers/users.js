const User = require('../models/user');

module.exports.newUserForm = (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}


module.exports.loginForm = (req,res)=>{
    res.render('users/login');
}


module.exports.login= (req,res)=>{
    req.flash('success','Logged in Successfully');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout = (req,res)=>{
    req.logOut();
    req.flash('success','Byee!');
    res.redirect('/campgrounds');
}