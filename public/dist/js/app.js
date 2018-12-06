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


var questsBDD;
async function load(data){

		//get quests from database
		await $.get('http://localhost:8000/quest', (quests) => { questsBDD = quests.quests })
	
		//select for quests
		var selectOptions ="";
		data.quest.forEach((element,index) => {
			selectOptions += `<option value="${index}">"${element.name}"</option>`
		});

	// display pokestops
		data.coordinates.pokestops.forEach((element, index) => {
			////
			var temp = [];
			questsBDD.forEach( (el) =>{
				if ( index === el.pokestopID ){
					temp.push(element)
					data.quest.forEach((quest,i) => {
						if(el.questID === i ){
							temp.push(quest)
						}
					});
				}
			})
			if (temp.length > 0){
				// si le pokestop a déja une quete dans la bdd 

				var content = `
				<b> ${temp[0].name}  </b> 
				<p>${temp[1].name}</p>
				<p>${temp[1].pokemon}</p>
				<button onclick="modifyQuest()"> Modifier </button>` // temp[0] = données du pokestop , temp[1] = données de la quete 

				var marker = L.marker([element.coordinates[1],element.coordinates[0]], {icon: pokestopIcon2})
				marker.addTo(map)
				marker.bindPopup(content)
			} else {
				// si le pokestop n'a pas de quete dans la bdd 
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
			}
			
		});
		
}

///// START PAGE ///////
var jsonFile; // variable pour stocker les données des JSON quetes/pokestops

socket.on('connection', function(data) {
	load(data)
	jsonFile = data
} )


function validateQuest() {
	var q = document.getElementById('selectedQuest')
	// console.log("quest id : ",q.value)
	// console.log("pokestop id : ",q.dataset.pokestopId)
	socket.emit('quest selected', {questID: q.value, pokestopID: q.dataset.pokestopId});


		load(jsonFile) // recharge les pokestops avec une quete dans la bdd
		document.getElementsByClassName('leaflet-popup')[0].style.opacity = 0 // cache le popup du pokestop selectionné
	
}

function modifyQuest(){
	
	 document.getElementsByClassName('leaflet-popup-content')[0].innerHTML =	'a venir'
}

