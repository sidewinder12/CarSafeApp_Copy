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


var Crime = require('../model/crime.js');

var appRoot = require('app-root-path');
var csvFileName= appRoot + "/test/testparse.csv";

var converter = require('../util/converter.js');


describe("Parser Tests", function() {
    before(function() {
        var yourCrime = new Crime({
            type: "Speed",
            month: "February",
            address: "456 Boundary Rd"
        });
        yourCrime.save(function(err){});
    })

    describe('Crime.getAll', function() {
        it('should show that there are no crimes at the start', function (done) {
            Crime.getAll(function (err, crimes) {
                expect(err).to.eql(null);
                expect(crimes.length).to.be.equal(1);
                done();
            });
        });
    });

    describe("converter.TestParseDataHelper", function() {
        it('should load the parsed data into the database', function(done) {
            this.timeout(7000);
            converter.parseDataHelper(csvFileName);
            setTimeout(function() {Crime.getAll(function(err, crimes) {
                expect(crimes.length).to.be.equal(7);
                done();
            })}, 6000);

        });
    });

    after(function() {
        Crime.removeAll(function(){});
    });
});


