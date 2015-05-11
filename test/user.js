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


describe("User Tests", function() {
    describe('User.getAll', function() {
        it('should show that there are no users', function (done) {
            User.getAll(function (err, users) {
                expect(err).to.eql(null);
                expect(users.length).to.be.equal(0);
                done();
            });
        });

        it('should save Hai properly', function(done) {
            var user = new User({
                name: "Hai",
                password: "ketchup",
                email: "purple@gmail.com",
                type: "user"
            });
            user.save(function (err, hai) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                expect(hai.type).to.equal("user");
                done();
            });
        });

        it('should now have a length of 1', function(done) {
            User.getAll(function (err, users) {
                expect(users.length).to.be.equal(1);
                done();
            });
        });
    });
    describe("Async user edits", function() {
        it('should set Hai user type to admin', function(done) {
            User.setPrivilege('Hai', "admin", function (err, hai) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                User.get('Hai', function(err, hai) {
                    expect(hai.type).to.equal("admin");
                    done();
                });
            });
        });

        it('should remove Hai from the database', function(done) {
            User.remove("Hai", function(err) {
                if (err) {
                    assert.fail('FAILED', err);
                }
                User.getAll(function(err, users) {
                    expect(users.length).to.equal(0);
                    done();
                });
            });
        });
    });
});


