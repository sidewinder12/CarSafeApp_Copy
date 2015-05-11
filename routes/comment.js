

var crypto = require('crypto');
var User = require('../model/user.js');
var Comment = require('../model/comment.js');
var Region = require('../model/region.js');


function get(req, res) {

    Region.getAll(function(regions) {
    res.render('comment', {
        title: 'Comment',
        user: req.session.user,
        regions: regions,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
    });
};



function post(req, res) {
    var title = req.body.title;
    var body = req.body.body;
    var region = req.body.region;
    var user = req.session.user;

    if (body.length == 0 || title.length== 0)
    {
        req.flash('error', 'Title and body may not be empty');
        return res.redirect('/comment');
    }

    if (region == "Select Neighbourhood")
    {
        req.flash('error', 'Please select a neighbourhood');
        return res.redirect('/comment');
    }

    Comment.get(req.body.title, function (err, comment) {
        if (comment) {
            req.flash('error', 'There is a comment with this name already, use a different title.');
            return res.redirect('/comment');
        }

        else {
            var newComment = new Comment({
                title: title,
                body: body,
                region: region,
                creator: user._id
            });

            newComment.save(function (err, comment) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/comment');
                }
                //save user info to session

                User.addComment(user.name, comment._id, function(err, comment) {
                    User.get(user.name, function(err, updatedUser) {
                        req.session.user = updatedUser;
                        req.flash('success', 'Your comment has been saved');
                        res.redirect('/comment');
                    });
                });
            });
        }

    });
};


function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'Not logged in. Please login if you wish to leave comments.');
        return res.redirect('/');
    }
    next();
}



module.exports = {
    get: get,
    post:post,
    checkLogin:checkLogin
    //post: post,
    //checkLogin: checkLogin,
    //checkLoginAdmin: checkLoginAdmin,
    //checkNotLogin: checkNotLogin,
    //logout: logout
};