/**
 * Created by michaelwagler on 2015-03-31.
 */
/**
 * tests for the user class
 *
 */

var util = require('./util');
var assert = require('assert');
var request = require('superagent');

var expect = require('chai').expect;

var User = require('../model/user');
var admin = require('../routes/admin');
var Comment = require('../model/comment');


var myUser;

describe("Comment Tests", function() {
    before(function() {
        myUser = new User({
            name: "Edward",
            password: "pass",
            email: "my@email.com",
            type: 'user'
        });

        myUser.save(function(err){});
    });


    describe('Comment.getAll', function() {
        it('should show that there are no comments', function (done) {
            Comment.getAll(function (err, comments) {
                expect(err).to.eql(null);
                expect(comments.length).to.be.equal(0);
                done();
            });
        });

        it('should save Comment properly', function(done) {
            var comment = new Comment({
                title: "myTitle",
                body: "aBody",
                region: "Strathcona",
                creator: myUser._id
            });

            comment.save(function (err, comment) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                expect(comment.title).to.equal("myTitle");
                // NOTE: user.addComment REALLY ought to be part of comment.save....
                User.addComment("Edward", comment._id, function(){done();});
            });
        });

        it('should now have a length of 1', function(done) {
            Comment.getAll(function (err, comments) {
                expect(comments.length).to.be.equal(1);
                done();
            });
        });
    });

    describe("User comment tests", function() {
        it('user should have a comment', function(done) {
            User.get("Edward", function(err, edward) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                expect(edward.comments.length).to.equal(1);
                done();
            });
        });
    });

    describe("Async comment edits", function() {


        it('should remove Comment from the database', function(done) {
            Comment.remove("myTitle", function(err) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                Comment.getAll(function(err, comments) {
                    expect(comments.length).to.equal(0);
                    done();
                });
            });
        });
    });
    after(function() {
        myUser = new User({
            name: "Edward",
            password: "pass",
            email: "my@email.com",
            type: 'user'
        });
        User.remove("Edward", function(err){});
        Comment.removeAll(function(){});
    });
});


