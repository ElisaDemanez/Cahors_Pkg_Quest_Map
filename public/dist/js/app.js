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


var storedQuests;
async function load(data){

		//get quests from database
		await $.get('http://172.20.10.2:8000/quest', (quests) => { storedQuests = quests.quests })
		//select for quests
		var selectOptions ="";
		data.quests.forEach((element,index) => {
			selectOptions += `<option value="${index}">${element.name}</option>`
		});

	// display pokestops
		data.pokestops.forEach((pokestop, index) => {
			////
			var temp = [];
			storedQuests.forEach( (el) =>{
				if ( index === el.pokestopID ){
					temp.push(pokestop)
					data.quests.forEach((quest,i) => {
						if(el.questID === i ){
							temp.push(quest)
							temp.push(el)
						}
					});
				}

				if (temp.length > 0){
					// si le pokestop a déja une quete dans la bdd 
	
					var content = `
					<b> ${temp[0].name}  </b> 
					<p>${temp[1].name}</p>
					<p>${temp[1].pokemon}</p>
					<button onclick='editQuest(${JSON.stringify(temp)})'> Modifier </button>` // temp[0] = données du pokestop , temp[1] = données de la quete 
	
					var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon2})
					marker.addTo(map)
					marker.bindPopup(content)
				} else {
					// si le pokestop n'a pas de quete dans la bdd 
					var content = `<b> ${pokestop.name}  </b>
					<br>
					<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${index}">
					${selectOptions}
					</select>
					<button onclick="storeQuest()"> Valider </button>
				`
					var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon})
					marker.addTo(map)
					/* marker.bindPopup(content) */
					marker.on("click", function (event) {
						togglePokestopInfos()
						document.getElementById('pokestop_name').innerHTML = pokestop.name
						document.getElementById('pokestop_select').innerHTML = `
						<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${index}">
						${selectOptions}
						</select>`
						document.getElementById('pokestop_button').innerHTML = '<button onclick="storeQuest()" class="pokestop-infos-btn"> Valider </button>'
				});
				}
			})
			
			
		});
		
}

///// START PAGE ///////
var jsonFile; // variable pour stocker les données des JSON quetes/pokestops

socket.on('connection', function(data) {
	load(data)
	jsonFile = data
} )


function storeQuest() {
	togglePokestopInfos()
	var q = document.getElementById('selectedQuest')
	// request post => add the pokestopID and questID in database
	$.ajax({
		type: "POST",
		url: 'http://172.20.10.2:8000/quest',
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

	load(jsonFile) // recharge les pokestops avec une quete dans la bdd
	document.getElementsByClassName('leaflet-popup')[0].style.opacity = 0 // cache le popup du pokestop selectionné

	socket.emit('quest selected', {questID: q.value, pokestopID: q.dataset.pokestopId}); 

}

function editQuest(data){
	console.log(data)

	var selectOptions ="";
		jsonFile.quests.forEach((element,index) => {
			if(index !== data[2].questID){
				selectOptions += `<option value="${index}">"${element.name}"</option>`
			}	
		});

	var content = `<b> ${data[0].name}  </b>
					<br>
					<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${data[2].pokestopID}">
					<option value="${data[2].questID}">"${data[1].name}"</option>
					${selectOptions}
					</select>
					<button onclick="updateQuest()"> Enregister </button>
				`

	 document.getElementsByClassName('leaflet-popup-content')[0].innerHTML =	content
}

function updateQuest(){

}





function togglePokestopInfos(){
	/* document.getElementById('pokestop_background').classList.toggle('display-none') */
	document.getElementById('pokestop_background').classList.toggle('transition-right-to-left')
}