/**
 * Created by Edward on 4/1/2015.
 */

var boundaryJSON;
var regions=[];
function setUpPolygonPaths(){
    var polygonPaths = [];
    for (index = 0; index < boundaryJSON.features[j].geometry.coordinates[0].length; index++) {
        var latlng = boundaryJSON.features[j].geometry.coordinates[0][index];
        var lat = latlng[1];
        var lng = latlng[0];
        polygonPaths[index] = new google.maps.LatLng(lat, lng);
    }
    return polygonPaths;
}

function setUpPolygon(paths, name){
    var aRegion = new google.maps.Polygon({
        paths: paths,
        strokeColor: 'Blue',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: 'Blue',
        fillOpacity: 0.01,
        title: name
    });

    aRegion.setMap(map);
    return aRegion;
}

function getRegionsObject(){
    return regions;
}
function getJSON(){
    $.ajax('./map/boundary').done(function (xml) {

        boundaryJSON = toGeoJSON.kml(xml);

        for (j = 0; j < boundaryJSON.features.length; j++) {

            var  currentRegionName= boundaryJSON.features[j].properties.name;

            regions[j]=setUpPolygon(setUpPolygonPaths(),currentRegionName);

            setUpRegionEvent(regions[j]);

        }
    });
    return boundaryJSON;
}

function setUpRegionEvent(region){
    google.maps.event.addListener(region, 'mouseover', function (event) {
        isWithInVancouver(event.latLng.k, event.latLng.D);
    });
    google.maps.event.addListener(region, 'mouseout', function (event) {
        document.getElementById('info-box').textContent =
            'Not in a regions of Vancouver';
    });
}


function isWithInVancouver(lat, lng) {

    for (i = 0; i < regions.length; i++) {
        var isWithin = regions[i].containsLatLng(lat, lng);
        if (isWithin) {
            document.getElementById('info-box').textContent =
                'Neighbourhood: ' + boundaryJSON.features[i].properties.name;
            return true;
        }
    }
    return false;
}

function getARegionByName(name) {
    for (i = 0; i < regions.length; i++) {
        if (name == boundaryJSON.features[i].properties.name) {
            return regions[i];
        }
    }
}

function getRegions() {
    var regionList = document.getElementById("regionSelect");
    var selectedRegionName = regionList.options[regionList.selectedIndex].value;

    clearCircle();
    if (selectedRegionName != "Select Neighbourhood" && selectedRegionName != "SHOW ALL") {
        clearAllMarkers();
        setRegionMarkersOnMap(map, selectedRegionName);
        changeCentre(map, selectedRegionName);
    }
    else if (selectedRegionName == "SHOW ALL") {
        clearAllMarkers();
        showAllMarkers();
    }
}
