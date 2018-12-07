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

var jsonFile; //  pour stocker les données des JSON quetes/pokestops
var storedQuests; // Quêtes dans la bdd associées à un pokestop

socket.on('connection', function(data) {
	load(data)
	jsonFile = data
} )

async function load(data){

		//get quests from database
		await $.get('http://localhost:8000/quest', (quests) => { storedQuests = quests.quests })
		//select for quests
		var selectOptions ="";
		data.quests.forEach((element,index) => {
			selectOptions += `<option value="${index}">"${element.name}"</option>`
		});

	// display pokestops
		data.pokestops.forEach((pokestop, index) => {

			var temp = {};
			// Search if the pokestop has a selected quest
			storedQuests.forEach( (el) =>{
				if ( index === el.pokestopID ){
					temp.quest = el.questID
				}
			})
			// If it has a selected quest
				if (temp.quest){
					displayPokestopWithQuest(pokestop, temp.quest)
					
				} else {
				
					var content = `<b> ${pokestop.name}  </b>
					<br>
					<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${index}">
					${selectOptions}
					</select>
					<button onclick="validateQuest()"> Valider </button>
					`

					var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon})
					marker.addTo(map)
					marker.bindPopup(content)
				}
			
		});
		
}

function validateQuest() {
	var q = document.getElementById('selectedQuest')
	// request post => add the pokestopID and questID in database
	$.ajax({
		type: "POST",
		url: '/quest',
		dataType: 'json',
		headers: {
			"Content-Type":"application/json; charset=utf-8"
	},
		data: JSON.stringify({ 
			"questID": q.value,
			"pokestopID": q.dataset.pokestopId
			}),
		success: function(result){console.log(result)}
		
	});

	// refresh markers 
	deleteAllMarkers()
	load(jsonFile) 

	socket.emit('quest selected', {questID: q.value, pokestopID: q.dataset.pokestopId}); 

}

function updateQuest(pokestopID) {
	console.log(`mettre à jour le pokestop ${pokestopID}, TODO `)
}

function editQuest(pokestop, questID){

	var quest = jsonFile.quests[questID]

	var selectOptions ="";
		jsonFile.quests.forEach((element,index) => {
			if(index !== questID){
				selectOptions += `<option value="${index}">"${element.name}"</option>`
			}	
		});

	var content = `<b> ${pokestop.name}  </b>
					<br>
					<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${pokestop.pokestopID}">
					<option value="${questID}">"${quest.name}"</option>
					${selectOptions}
					</select>
					<button onclick="updateQuest(${pokestop.pokestopID})"> Enregister </button>
				`

	 document.getElementsByClassName('leaflet-popup-content')[0].innerHTML = content
}

async function displayPokestopsBySelectedQuest(id){

	var pokestopsQuests;
	//get questsID and pokestopID by questID
	await $.get(`http://localhost:8000/quest/${id}`, (data) => { pokestopsQuests = data})
	deleteAllMarkers()
     // display markers
	pokestopsQuests.forEach(element => {
		var pokestop = jsonFile.pokestops[element.pokestopID]
		displayPokestopWithQuest(pokestop, element.questID)
	});
}

function displayPokestopWithQuest(pokestop, questID){

	var content = `
	<b> ${pokestop.name}  </b> 
	<p>${jsonFile.quests[questID].name}</p>
	<p>${jsonFile.quests[questID].pokemon}</p>
	<button onclick='editQuest(${JSON.stringify(pokestop)},${questID})'> Modifier </button>`

	var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon2})
	marker.addTo(map)
	marker.bindPopup(content)
}

// function displayPokestopWithoutQuest(pokestop){
// 	console.log(pokestop)
// }

