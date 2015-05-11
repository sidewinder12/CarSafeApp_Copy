/**
 * Created by michaelwagler on 2015-03-26.
 */
/**
 *
 * Comment class and mongoose model. Provides a mongoose schema, defines Comment properties
 * and database CRUD operations.
 *
 */
var config = require('../config');
var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
        title: String,
        body: String,
        region: String,
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    },
    { collection: 'Comments' });
var commentModel = mongoose.model('Comment', CommentSchema);
function Comment(Comment) {
    this.title = Comment.title;
    this.body = Comment.body;
    this.region = Comment.region;
    this.creator = Comment.creator;
}
Comment.prototype.save = function(callback) {
    var Comment = {
        title: this.title,
        body: this.body,
        region: this.region,
        creator: this.creator
    };
    var newComment = new commentModel(Comment);
    newComment.save(function (err, Comment) {
        if (err) {
            console.log('error in newComment.save:', err);
            return callback(err);
        }
        callback(null, Comment);
    });
};
Comment.get = function(title, callback) {
    commentModel.findOne({title: title},
        function (err, Comment) {
            if (err) {
                return callback(err);
            }
            callback(null, Comment);
        });
};
Comment.getByRegion = function(region, callback) {
    commentModel.find({region: region},
        function (err, comments) {
            if (err) {
                return callback(err);
            }
            callback(null, comments);
        });
};
Comment.removeAll = function(callback){
    commentModel.collection.drop(function(err){
        if (err){
            return callback(err);
        }
        callback(null);
    });
};
Comment.getAll = function( callback){
    commentModel.find({})
        .populate('creator')
        .exec(function(err, docs) {
        if (!err){
            callback(null, docs);
        } else {
            return callback(err);}
    });
};

Comment.remove = function(title, callback) {
    commentModel.remove({title: title}, function(err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

Comment.removeAll = function(callback){
    commentModel.collection.drop(function(err){
        //console.log('called crime.removeAll()');
        if (err){
            return callback(err);
        }
        callback(null);
    });
};


module.exports = Comment;