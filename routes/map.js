var User = require('../model/user.js');
var Crime = require('../model/crime');
var appRoot = require('app-root-path');
var Region = require('../model/region.js');
var Comment = require('../model/comment.js');


function get(req, res) {

    Comment.getAll(function(err, comments) {
        Region.getAll(function(regs) {
            Crime.getAll(function(err, crimes) {

                res.render('map', {
                    title: 'Car Theft Map',
                    user: req.session.user,
                    crimes: crimes,
                    comments:comments,
                    regions: regs,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()});
            });

        });
    });
};

function getBoundary(req,res){

    res.sendFile(appRoot+'/download_data/vancouverLocalBoundary.kml');

}

function getJS(req,res){

    res.sendfile(appRoot+'/public/javascripts/togeojson.js');
}

module.exports = {
    get: get,
    getBoundary: getBoundary,
    getJS: getJS
};