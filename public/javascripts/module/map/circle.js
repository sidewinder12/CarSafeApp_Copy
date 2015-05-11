/**
 * Created by Edward on 4/1/2015.
 */
function clearCircle() {
    if (cityCircle != null)
        cityCircle.setMap(null);
}

function newCircle(latlng, radius){
    var nearCrimeOptions = {
        strokeColor: 'blue',
        strokeOpacity: 0.3,
        strokeWeight: 1,
        fillColor: 'blue',
        fillOpacity: 0.20,
        map: map,
        center: latlng,
        radius: radius * 1
    };

    cityCircle = new google.maps.Circle(nearCrimeOptions);
}

function markersInsideCircle(){
    var markerIsInsideCircle;
    var countMarkerInsideCircle = 0;
    for (var i = 0; i < markers.length; i++) {
        var markerLatLng = new google.maps.LatLng(markers[i].position.k, markers[i].position.D);
        markerIsInsideCircle = google.maps.geometry.spherical.computeDistanceBetween(cityCircle.getCenter(), markerLatLng) <= cityCircle.getRadius();
        if (markerIsInsideCircle) {
            countMarkerInsideCircle++;
            markers[i].setMap(map);
        }
    }
    return countMarkerInsideCircle;
}

function inputRadius() {
    var radius = prompt("Please enter a metre radius, between 100 and 2000:", "100");

    if (!radius) {
        document.getElementById('info-box').textContent = "CANCELLED!";
    }
    else if (!isNumber(radius))
        document.getElementById('info-box').textContent = "CANCELLED! Radius must be a number.";
    else if (radius < 100 || radius > 2000) {
        document.getElementById('info-box').textContent = "INVALID RADIUS!Must be 100-2000m";
    }
    else {
        return radius;
    }

    return null;
}
