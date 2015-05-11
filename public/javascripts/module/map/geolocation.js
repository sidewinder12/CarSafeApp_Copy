/**
 * Created by Edward on 4/1/2015.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('info-box').textContent = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var radius = inputRadius();
    if(radius)
        displayCrimeInVancouverBySomeRadius(position.coords.latitude, position.coords.longitude,radius);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('info-box').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('info-box').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('info-box').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('info-box').textContent = "An unknown error occurred.";
            break;
    }
}

function searchByAddress(address) {
    var radius = inputRadius();
    if (radius) {
        geocoder.geocode({'address': address + ', Vancouver, BC'}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                displayCrimeInVancouverBySomeRadius(results[0].geometry.location.k, results[0].geometry.location.D, radius);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });

    }
}