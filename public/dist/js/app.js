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

layer.addTo(map);


socket.on('connection', function(data) {
	var selectOptions ="";
	data.quest.forEach((element,index) => {
		selectOptions += `<option value="${index}">"${element.name}"</option>`
	});

// display pokestops
data.coordinates.pokestops.forEach(element => {
	var content = `<b> ${element.name} </b>
	<br>
	<select name="yolo">
  ${selectOptions}
</select>
`
	var marker = L.marker([element.coordinates[1],element.coordinates[0]])
	marker.addTo(map)
	marker.bindPopup(content)
});

})