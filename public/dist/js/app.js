console.log('holà');
var socket = io(); 
 
// initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});
 
// set the position and zoom level of the map
map.setView([44.4490425,1.4384117], 15);
 
// create a tileLayer with the tiles, attribution
var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
 
// add the tile layer to the map
layer.addTo(map);


socket.on('connection', function(data) {
data.coordinates.pokestops.forEach(element => {
	console.log(element)
	var content = `<b> ${element.name} </b>`
	 L.marker([element.coordinates[1],element.coordinates[0]]).addTo(map).bindPopup(content)
});

})