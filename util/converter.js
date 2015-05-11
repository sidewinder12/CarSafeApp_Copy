/**
 * Created by haihoang on 2015-03-08.
 *
 *
 * Converter class to parse .csv file and convert to JSON.
 * Parser selects for only 'Theft Of Auto Under $5000' and 'Theft Of Auto Over $5000'
 * and only displays TYPE and HUNDRED_BLOCK
 *
 * Parser source code: https://github.com/Keyang/node-csvtojson
 * Help for filter: http://stackoverflow.com/questions/25514876/how-to-filter-json-data-in-node-js
 */

var _ = require("underscore");
var Crime = require('../model/crime');

//Converter Class
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var gm = require("googlemaps");
var async = require('async');

var appRoot = require('app-root-path');

var csvFileName= appRoot + "/download_data/temp/crime_data.csv";



function filtr(jArray){
    for (var i = 0; i< jArray.length; i++){
        delete jArray[i].YEAR;
        //delete jArray[i].MONTH; //comment out to keep MONTH element
        jArray[i].HUNDRED_BLOCK = jArray[i].HUNDRED_BLOCK.replace("XX", "00");
        jArray[i].HUNDRED_BLOCK = jArray[i].HUNDRED_BLOCK.replace("/", "AND");
    }
}

var months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function saveOneCrime(jArray, i) {
    var type = jArray[i].TYPE,
        month = parseInt(jArray[i].MONTH),
        address = jArray[i].HUNDRED_BLOCK;

    gm.geocode(address + ", Vancouver, BC, Canada", function(err, result) {
        if(err) {
            console.log("error in gm.geocode for address" + address + ": error:" + err);
        }

        console.log('result: ', result);
        var lat = result.results[0].geometry.location.lat;
        var long = result.results[0].geometry.location.lng;
        var newCrime = new Crime({
            type: type,
            month: months[month],
            address: address,
            lat: lat,
            long: long
        });
        newCrime.save(function (err, crime) {
            if (err) {
                req.flash('error', 'Error when trying to save a crime into the database!');
            }

        });
    });
}

function saveCrimes(jArray) {
    Crime.removeAll(function (err) {
        if (err) {
            console.error(err);
        }
    });

        var i = 0;
        async.whilst(
            function () {
                return i < jArray.length;
            },
            function (callback) {
                saveOneCrime(jArray, i);
                i++;
                setTimeout(callback, 300);
            },
            function (err) {
                console.log('execution finished');
            }
        );
};


//read from file
function parseData(){
    parseDataHelper(csvFileName);
}

function parseDataHelper(fileName){

//new Converter instance
    var param={};
    var csvConverter=new Converter(param);
    var fileStream=fs.createReadStream(fileName);

    //end_parsed will be emitted once parsing finished

    csvConverter.on("end_parsed",function(jsonObj){
        var filtered = _.filter(jsonObj, function(item){
            return (item.TYPE == "Theft Of Auto Under $5000" || item.TYPE == "Theft Of Auto Over $5000");
        });
        filtr(filtered);
        saveCrimes(filtered);
        csvConverter.end();
    });
    fileStream.pipe(csvConverter);


}



module.exports = {parseData: parseData, parseDataHelper: parseDataHelper};