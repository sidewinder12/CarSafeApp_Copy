/**
 * Created by michaelwagler on 2015-03-05.
 *
 * Callback functions for handling registration requests
 */

var crypto = require('crypto');
var User = require('../model/user.js');

var get = function (req, res) {
    res.render('reg', {
        title: 'Register',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};


var post = function (req, res) {
    var name = req.body.name,
        email= req.body.email,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //validator
    if (password_re != password) {
        req.flash('error', 'Password is not the same!');
        return res.redirect('/reg');//back to reg
    }

    if(password==""||name==""||email=="")
    {
        req.flash('error', 'Username, password and email cannot be empty');
        return res.redirect('/reg');
    }
    //create md5 of the password
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email,
        type: 'user'
    });
    //check username is existed in database or not
    User.get(newUser.name, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', 'This username has already been taken');
            return res.redirect('/reg');
        }

        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //save user info to session
            req.session.user = user;
            req.flash('success', 'Registered!');
            res.redirect('/');
        });
    });
};

module.exports = {post: post, get: get};

