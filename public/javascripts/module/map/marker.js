/**
 * Created by Edward on 4/1/2015.
 */
function setUpAMarker(address,latLng){

    var marker = new google.maps.Marker({
        position: latLng,
        title: address
    });

    return marker;
}

function setUpInfoWindow(address,type,month){
    var window = new google.maps.InfoWindow({
        content: "<p>" + address + "<br />" + type + "<br />" +month +
            "<br />" + '<a href="/comment">' + "Submit a comment" + '</a>' + "</p>"
    });

    return window;
}

var opened=null;

function setupMarkerListener(marker,window,region){

    google.maps.event.addListener(marker, 'click', function () {
        if (opened != null) {
            opened.close();
        }
        window.open(map, marker);
        opened = window;
    });

    google.maps.event.addListener(marker, 'mouseover', function () {
        var markerLat = marker.position.k;
        var markerLng = marker.position.D;

        for (i = 0; i < region.length; i++) {
            var isWithin = region[i].containsLatLng(markerLat, markerLng);
            if (isWithin) {
                document.getElementById('info-box').textContent =
                    'Neighbourhood: ' + boundaryJSON.features[i].properties.name;
            }
        }

    });

    google.maps.event.addListener(map, "click", function (event) {
        window.close();
    });

    return opened;
}

// Sets the map on all markers in the array.
function setMarkersOnMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    // console.log(markers[0]);
}

function setRegionMarkersOnMap(map, regionName) {
    for (var i = 0; i < markers.length; i++) {
        var markerLat = markers[i].position.k;
        var markerLng = markers[i].position.D;

        var region = getARegionByName(regionName);

        var isWithin = region.containsLatLng(markerLat, markerLng);
        if (isWithin) {
            markers[i].setMap(map);
        }
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearAllMarkers() {
    setMarkersOnMap(null);
}

// Shows any markers currently in the array.
function showAllMarkers() {
    setMarkersOnMap(map);
    map.setZoom(12);
    map.setCenter(new google.maps.LatLng(49.246292, -123.116226));
}