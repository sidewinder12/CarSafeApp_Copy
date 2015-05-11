/**
 * Created by michaelwagler on 2015-03-28.
 */
var appRoot = require('app-root-path');
var tj = require('togeojson'),
    fs = require('fs');
// node doesn't have xml parsing or a dom. use jsdom
    jsdom = require('jsdom-nogyp').jsdom;

var kml = jsdom(fs.readFileSync(appRoot+'/download_data/vancouverLocalBoundary.kml', 'utf8'));

var converted = tj.kml(kml);

function Region(region) {
    this.name = user.name;
}

Region.getAll = function( callback){

    var regions = [];

    for( var i =0; i< converted.features.length;i++)
    {
        var region  = {
            name: converted.features[i].properties.name
        };
        regions.push(region);
    }
    return callback(regions);

};



module.exports = Region;