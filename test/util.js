/**
 * Created by michaelwagler on 2015-03-12.
 *
 * testing util module that starts the app, connects to mongo,
 * and makes sure that the testing database is empty before running
 * the tests. Also it disconnects from teh database when tests are all done.
 */
var config = require('../config');
var mongoose = require('mongoose');
var www = require('../bin/www');


before(function (done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.uri, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

after(function (done) {
    mongoose.disconnect();
    return done();
});