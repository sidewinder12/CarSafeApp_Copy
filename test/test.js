/**
 * Created by michaelwagler on 2015-03-05.
 *
 * General HTTP request tests
 */

var util = require('./util');
var assert = require('assert');
var request = require('superagent');

var expect = require('chai').expect;
var User = require('../model/user');



describe("Testing http requests", function() {
    it("should return a response with the word 'CarSafe'", function(done) {
        request.get("http://localhost:3000/").end(function(err, res) {
            expect(err).to.eql(null);
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.text).to.contain("CarSafe");
            done();
        });
    });
    it("Going to admin panel when not an admin should redirect to login", function(done) {
        request.get("http://localhost:3000/admin").end(function(err, res) {
            if (err) {
                assert.fail('error in http request', err);
            }
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("CarSafe");
            done();
        });
    });

    // can't figure out how to access the session object through
    // super-agent's request object

});






