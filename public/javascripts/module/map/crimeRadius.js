/**
 * Created by Edward on 4/1/2015.
 */
function displayCrimeByRadius(latlng, radius) {
    clearCircle();
    clearAllMarkers();
    newCircle(latlng,radius);

    isSafeToPark(markersInsideCircle());

    map.setCenter(cityCircle.getCenter());

    setZoomByRadius(radius);

}
function searchCrime() {
    var address = prompt("What's your address in Vancouver, BC?", "500 Broadway Avenue");
    if (address) {
        searchByAddress(address);
    }
    else {
        document.getElementById('info-box').textContent = "CANCELLED!";
    }
}

function isNumber(input) {
    return (input - 0) == input && ('' + input).trim().length > 0;
}

function isSafeToPark(numCrime) {
    var colour = 'Green';

    if (numCrime > 30) {
        document.getElementById('info-box').textContent = "Don't park here!!";
        colour = 'Red';
    } else if (numCrime > 20) {
        document.getElementById('info-box').textContent = "Be careful, crimes in given radius!";
        colour = 'Orange';
    }
    else if (numCrime > 5) {
        document.getElementById('info-box').textContent = "Okay, some crimes in given radius.";
        colour = 'Yellow';
    }
    else if (numCrime > 0) {
        document.getElementById('info-box').textContent = "Safe, few crimes in given radius.";
        colour = '#CCFF00';
    }
    else {
        colour = 'Green';
        document.getElementById('info-box').textContent = "VERY safe, no crime at all in given radius!";
    }

    cityCircle.setOptions({
        strokeColor: colour,
        fillColor: colour
    });
}

function displayCrimeInVancouverBySomeRadius(lat, lng, radius) {

    var isWithinVan = isWithInVancouver(lat, lng);

    if (isWithinVan) {
        displayCrimeByRadius(new google.maps.LatLng(lat, lng), radius);
    }
    else {
        document.getElementById('info-box').textContent = "ADDRESS NOT IN VANCOUVER BC!";
    }
}
