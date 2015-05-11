/**
 * Created by haihoang on 2015-03-09.
 *
 * Crime class and mongoose model. Provides a mongoose schema, defines crime properties
 * and database CRUD operations. Modeled after 'User' class
 *
 */

var config = require('../config');
var mongoose = require('mongoose');

var crimeSchema = new mongoose.Schema({
        type: String,
        month: String,
        address: String,
        lat: Number,
        long: Number
    },
    { collection: 'crimes' });

var crimeModel = mongoose.model('Crime', crimeSchema);


function Crime(crime) {
    this.type = crime.type;
    this.month = crime.month;
    this.address = crime.address;
    this.lat = crime.lat;
    this.long = crime.long;
}

Crime.prototype.save = function(callback) {
    var crime = {
        type: this.type,
        month: this.month,
        address: this.address,
        lat: this.lat,
        long: this.long
    };
    var newCrime = new crimeModel(crime);
    newCrime.save(function (err, crime) {
        if (err) {
            return callback(err);
        }
        callback(null, crime);
    });
};

Crime.get = function(address, callback) {
    crimeModel.findOne({address: address},
        function (err, crime) {
            if (err) {
                return callback(err);
            }
            callback(null, crime);
        });
};

// Don't know if this works
//Crime.remove = function(crime, callback){
//    crimeModel.remove(crime, function(err){
//        if (err){
//            return callback(err);
//        }
//        callback(null, doc);
//    });
//};

Crime.removeAll = function(callback){
    crimeModel.collection.drop(function(err){
        //console.log('called crime.removeAll()');
        if (err){
            return callback(err);
        }
        callback(null);
    });
};

Crime.getAll = function( callback){
    crimeModel.find({}, 'type month address lat long', function(err, docs) {
        if (!err){
            callback(null, docs);
        } else {
            return callback(err);}
    });

};

Crime.getByRegion = function(region, callback){
    crimeModel.find({region:region}, 'type month address lat long', function(err, docs) {
        if (!err){
            callback(null, docs);
        } else {
            return callback(err);}
    });

};



module.exports = Crime;
