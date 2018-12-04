var socket = io(); 
 
// initialize the map
var map = L.map('map', {
	scrollWheelZoom: true,
	zoomControl: false
});

L.control.zoom({
	position:'bottomleft'
}).addTo(map);
 
// set the position and zoom level of the map
map.setView([44.4490425,1.4384117], 15);
 
// create a tileLayer with the tiles, attribution
var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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

socket.on('connection', function(data) {
	//select for quests
	var selectOptions ="";
	data.quest.forEach((element,index) => {
		selectOptions += `<option value="${index}">"${element.name}"</option>`
	});

// display pokestops
	data.coordinates.pokestops.forEach((element, index) => {
		var content = `<b> ${element.name}  </b>
		<br>
		<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${index}">
		${selectOptions}
		</select>
		<button onclick="validateQuest()"> Valider </button>
	`
		var marker = L.marker([element.coordinates[1],element.coordinates[0]], {icon: pokestopIcon})
		marker.addTo(map)
		marker.bindPopup(content)
	});

	

})

function validateQuest () {
	// affiche l'id de la quete selectionné  et du pokestop dans la console pour test
	var q = document.getElementById('selectedQuest')
	console.log("quest id : ",q.value)
	console.log("pokestop id : ",q.dataset.pokestopId)
}