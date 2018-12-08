 
// initialize the map
var token ="pk.eyJ1IjoieGFuYWVoIiwiYSI6ImNqcGZkams1ZjA5NGszcG96Z29teDFjYWoifQ.RVPN2RKgJ7S8VsgVGSgMqQ"; // replace with your Mapbox API Access token. Create a Mabpox account and find it on https://www.mapbox.com/studio/

var map = L.map('map', {
	scrollWheelZoom: true,
	zoomControl: false
}); 
var gl = L.mapboxGL({
    accessToken: token,
    style: 'mapbox://styles/xanaeh/cjpfdtzy02j8y2rrwfe72ok82'
}).addTo(map);


L.control.zoom({
	position:'bottomleft'
}).addTo(map);
 
// set the position and zoom level of the map
map.setView([44.4490425,1.4384117], 15);
 
// create a tileLayer with the tiles, attribution
/* var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); */

// icons pokestops
var pokestopIcon = L.icon({
    iconUrl: '/dist/img/pokestopIcon2.png',
    shadowUrl: '',
     iconSize:     [50, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [4.3, -45] // point from which the popup should open relative to the iconAnchor
});

var pokestopIcon2 = L.icon({
	iconUrl: '/dist/img/pokestopIcon3.png',
	shadowUrl: '',
	 iconSize:     [50, 50], // size of the icon
	shadowSize:   [50, 64], // size of the shadow
	iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor:  [4.3, -45] // point from which the popup should open relative to the iconAnchor
});

function deleteAllMarkers(){

	var markerLayer = map.getPanes()["markerPane"];
	var shadowLayer = map.getPanes()["shadowPane"];
	while (markerLayer.firstChild)
	  markerLayer.removeChild(markerLayer.firstChild);
	while (shadowLayer.firstChild)
	  shadowLayer.removeChild(shadowLayer.firstChild);
	map.closePopup();

}