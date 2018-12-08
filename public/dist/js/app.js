var socket = io(); 

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
			selectOptions += `<option value="${index}">${element.name}</option>`
		});
	// display pokestops
		data.pokestops.forEach((pokestop, index) => {
			
			var temp = {};
			var pID;
			// Search if the pokestop has a selected quest
			storedQuests.forEach( (el) =>{
				if ( index === el.pokestopID ){
					temp.quest = el.questID
					pID = el.pokestopID
				}
			})
			// If it has a selected quest
				if (temp.quest >= 0){
					displayPokestopWithQuest(pID, temp.quest)
				} else {
					
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
			
		});
		
}

function storeQuest() {
	togglePokestopInfos()
	var q = document.getElementById('selectedQuest')
	// request post => add the pokestopID and questID in database
	$.ajax({
		type: "POST",
		url: 'http://localhost:8000/quest',
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

	socket.emit('quest update'); 

}

function updateQuest(pokestopID) {
	console.log(`mettre à jour le pokestop ${pokestopID}, TODO `)
}

function editQuest(pokestopID, questID){
var pokestop = jsonFile.pokestops[pokestopID];
console.log(pokestop, pokestopID)
	var quest = jsonFile.quests[questID]

	var selectOptions ="";
		jsonFile.quests.forEach((element,index) => {
			if(index !== questID){
				selectOptions += `<option value="${index}">"${element.name}"</option>`
			}	
		});

		document.getElementById('pokestop_select').innerHTML = `
					<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${pokestopID}">
					<option value="${questID}">"${quest.name}"</option>
					${selectOptions}
					</select>
					`

		document.getElementById('pokestop_button').innerHTML = `
		<button class="pokestop-infos-btn" onclick="editQuest(${pokestopID},${questID})"> Enregistrer </button>
		<button class="pokestop-infos-btn pokestop-infos-btn-del" onclick="togglePokestopInfos()"> Annuler </button>
		`
}

function deleteQuest (pokestopID) {
	$.ajax({
    url: `http://localhost:8000/quest/${pokestopID}`,
    type: 'DELETE',
    success: function(result) {
			togglePokestopInfos()
			deleteAllMarkers()
			load(jsonFile) 
    }
	});
}

function togglePokestopInfos(){
	/* document.getElementById('pokestop_background').classList.toggle('display-none') */
	document.getElementById('pokestop_background').classList.toggle('transition-right-to-left')
}

async function displayPokestopsBySelectedQuest(id){

	var pokestopsQuests;
	//get questsID and pokestopID by questID
	await $.get(`http://localhost:8000/quest/${id}`, (data) => { pokestopsQuests = data})
	deleteAllMarkers()
	 // display markers
	  if(pokestopsQuests) {	
		 pokestopsQuests.forEach(element => {
		var pokestop = jsonFile.pokestops[element.pokestopID]
		displayPokestopWithQuest(pokestop.pokestopID, element.questID)
		});
	} else{
		//to update 
		alert('pas de quêtes renseignées')
	}

}

function displayPokestopWithQuest(pokestopID, questID ){
var pokestop = jsonFile.pokestops[pokestopID];
	var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon2})
	marker.addTo(map)
	marker.on("click", function (event) {
		togglePokestopInfos()
		document.getElementById('pokestop_name').innerHTML = pokestop.name
		document.getElementById('pokestop_select').innerHTML = `
		<h4>${jsonFile.quests[questID].name}</h4>
		<h5>${jsonFile.quests[questID].pokemon}</h5>
		`
		document.getElementById('pokestop_button').innerHTML = `
		<button class="pokestop-infos-btn" onclick='editQuest(${pokestopID},${questID})'> Modifier </button>
		<button class="pokestop-infos-btn pokestop-infos-btn-del" onclick='deleteQuest(${pokestopID})'> Supprimer </button>
		`
	});
}

// function displayPokestopWithoutQuest(pokestop){
// 	console.log(pokestop)
// }

