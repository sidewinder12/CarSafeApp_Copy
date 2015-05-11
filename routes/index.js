/**
 *  Main routing file. handles requests to '/' and passes other requests to appropriate handlers.
 */

var express = require('express');
var router = express.Router();

var reg = require('./reg');
var login = require('./login');
var admin = require('./admin');
var crimeTable = require('./crime');
var comment = require('./comment');

var User = require('../model/user.js');

var map= require('./map');

router.get('/', function (req, res) {
        res.render('index', {
            title: 'CarSafe',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
});


router.get('/reg', login.checkNotLogin);
router.get('/reg', reg.get);

router.post('/reg', login.checkNotLogin);
router.post('/reg', reg.post);

router.get('/login', login.checkNotLogin);
router.get('/login', login.get);

router.post('/login', login.checkNotLogin);
router.post('/login', login.post);

router.get('/admin', login.checkLoginAdmin);
router.get('/admin', admin.get);

router.post('/download', admin.download);
router.post('/update', admin.update);
router.post('/deleteUser', admin.deleteUser);
router.post('/makeAdmin', admin.becomeAdmin);

router.get('/logout', login.checkLogin);
router.get('/logout', login.logout);

router.get('/crimeTable', crimeTable.get);

router.get('/comment', comment.checkLogin);
router.get('/comment', comment.get);
router.post('/comment', comment.checkLogin);
router.post('/comment', comment.post);


router.get('/map', map.get);
router.get('/map/boundary', map.getBoundary);
router.get('/map/js', map.getJS);
module.exports = router;
