/**
 * Created by michaelwagler on 2015-03-05.
 *
 * Callback functions for handling login requests
 */
var crypto = require('crypto');
var User = require('../model/user.js');


function get(req, res) {
    res.render('login', {
        title: 'Login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
};


function post(req, res) {

    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    User.get(req.body.name, function (err, user) {
        if (!user) {
            req.flash('error', 'There is no user account associated with this name');
            return res.redirect('/login');
        }

        if (user.password != password) {
            req.flash('error', 'Incorrect password');
            return res.redirect('/login');//
        }
        if (user.type=="admin")
        {
            req.flash('success', 'Logged in as admin')
        }
        else
        {
            req.flash('success', 'Logged in');}
        req.session.user = user;
        res.redirect('/');//jump back to main
    });
};

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'Not logged in');
        return res.redirect('/');
    }
    next();
}

function checkLoginAdmin (req, res, next) {
    if (!req.session.user|| req.session.user.type!="admin") {
        req.flash('error', 'Not logged in with an admin account');
        return res.redirect('/');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', 'Already logged in!');
        return res.redirect('back');//back to previous page
    }
    next();
}

function logout(req, res) {
    req.session.user = null;
    req.flash('success', 'Logged out');
    res.redirect('/');//Back to main
}

module.exports = {
    get: get,
    post: post,
    checkLogin: checkLogin,
    checkLoginAdmin: checkLoginAdmin,
    checkNotLogin: checkNotLogin,
    logout: logout};