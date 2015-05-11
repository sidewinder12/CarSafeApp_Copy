/**
 * Created by Baber on 3/10/2015.
 */

var Crime = require('../model/crime.js');

function get (req, res){

    Crime.getAll(function( err, crimes){
        if(err){
            req.flash('Error', "Unsuccessful call to Crime.getAll");
            res.render('/');
        }

    res.render('crimeTable.ejs', {
        title: 'Crime Data',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        crimes: crimes
    });

})
}

module.exports = { get: get };