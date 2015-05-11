function mapInit() {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(49.246292, -123.116226)
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    boundaryJSON= getJSON();
}

function changeCentre(map, regionName) {
    var region = getARegionByName(regionName);
    map.setZoom(14);
    map.setCenter(region.getBounds().getCenter());
}

function setZoomByRadius(radius){
    if (radius < 500)
        map.setZoom(16);
    else if (radius < 1000)
        map.setZoom(15);
    else
        map.setZoom(14);
}