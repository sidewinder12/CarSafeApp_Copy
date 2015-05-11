/**
 * Created by Edward on 4/1/2015.
 */
function hideAllComments(){
    jQuery('document').ready(function () {
        jQuery('.comment').hide();
    });

}

//Display the comments for the selected regions on regions selection click
function getRegionComments() {
    var regionList = document.getElementById("regionSelect");
    var selectedRegionName = regionList.options[regionList.selectedIndex].value;
    if (selectedRegionName != "Select Neighbourhood" && selectedRegionName != "SHOW ALL") {
        jQuery('.comment').hide();

        // hack to deal with regions that have 2 words
        var rname = selectedRegionName.substr(0, selectedRegionName.indexOf(' '));
        if (rname.length == 0) {
            rname = selectedRegionName;
        }
        var cname = '.comment.' + rname;
        jQuery(cname).show();

        setRegionMarkersOnMap(map, selectedRegionName);
        changeCentre(map, selectedRegionName);
    }
}
