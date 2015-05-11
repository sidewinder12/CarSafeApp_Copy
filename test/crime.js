/**
 * Created by haihoang on 2015-03-11.
 *
 * Tests for accessing and manipulating crime data.
 */
var util = require('./util');
var assert = require('assert');
var request = require('superagent');

var expect = require('chai').expect;
var crimeData = require('../model/crime.js');



describe("Crime tests", function() {
    before(function() {
        var myCrime = new crimeData({
            type: "Death Of A Salesman",
            month: "January",
            address: "123 Alma St"
        });
        var yourCrime = new crimeData({
            type: "Speed",
            month: "February",
            address: "456 Boundary Rd"
        });
        myCrime.save(function(err){});
        yourCrime.save(function(err){});

    });
    describe('Crime.getAll', function () {

        it('should not return an error and have a length of 2', function (done) {
            crimeData.getAll(function (err, crimes) {
                expect(err).to.equal(null);
                expect(crimes.length).to.be.equal(2);
                done();
            });
        })
    });

    describe('Crime.get', function () {
        it('should not return an error and find crime by address', function (done) {
            crimeData.get("123 Alma St", function (err, crime) {
                expect(err).to.equal(null);
                expect(crime.address).to.equal("123 Alma St");
                expect(crime.type).to.equal("Death Of A Salesman");
                expect(crime.month).to.equal('January');
                done();
            });
        })
    });

    after(function() {
        crimeData.removeAll(function(err){});
    });

});