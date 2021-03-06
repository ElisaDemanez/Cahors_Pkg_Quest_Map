var socket = io(); 

var jsonFile; //  pour stocker les données des JSON quetes/pokestops
var storedQuests; // Quêtes dans la bdd associées à un pokestop

//var environnement = 'lgdm.ddns.net'
// var environnement = 'localhost'

socket.on('connection', function(data) {
	load(data)
	jsonFile = data
} )

async function load(data){
		//get quests from database
		await $.get(`http://${environnement}:4600/quest`, (quests) => { storedQuests = quests.quests })
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

					var marker = L.marker([pokestop.coordinates[1],pokestop.coordinates[0]], {icon: pokestopIcon})
					marker.addTo(map)

					/* marker.bindPopup(content) */
					marker.on("click", function (event) {
						togglePokestopInfos()
						document.getElementById('pokestop_name').innerHTML = pokestop.name
						document.getElementById('pokestop_select').innerHTML = `
						<p class="labels">Choix Quête</p>
						<select name="selectedQuest" id="selectedQuest" data-pokestop-id="${index}">
						${selectOptions}
						</select>`
						document.getElementById('pokestop_button').innerHTML = '<button onclick="storeQuest()" class="pokestop-infos-btn pokestop-infos-btn-val"> Valider </button>'
				});
				}
			
		});
		
}

function storeQuest() {
	var q = document.getElementById('selectedQuest')
	// request post => add the pokestopID and questID in database
	$.ajax({
		type: "POST",
		url: `http://${environnement}:4600/quest`,
		dataType: 'json',
		headers: {
			"Content-Type":"application/json; charset=utf-8"
	},
		data: JSON.stringify({ 
			"questID": q.value,
			"pokestopID": q.dataset.pokestopId
			}),
		success: function(result){
			// refresh markers 
			togglePokestopInfos()
			deleteAllMarkers()
			load(jsonFile) 
			socket.emit('quest update'); 

		}
		// if fail  : display error message
	});
	toast('Pokéstop mis à jour : Quête ajoutée')
}

function updateQuest(pokestopID) {

	var questID = document.getElementById('selectedQuest').value

	$.ajax({
		type: "PUT",
		url: `http://${environnement}:4600/quest/${pokestopID}`,
		dataType: 'json',
		headers: {
			"Content-Type":"application/json; charset=utf-8"
	},
		data: JSON.stringify({ 
			"questID": questID,
			"pokestopID": pokestopID
			}),
		success: function(result){
			console.log('ici')
			// refresh markers 
			deleteAllMarkers()
			load(jsonFile) 
			togglePokestopInfos()
			socket.emit('quest update'); 
		}
		// if fail  : display error message
		
	});
	toast('Pokéstop mis à jour : Quête modifiée')
}

function editQuest(pokestopID, questID){
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
		<button class="pokestop-infos-btn" onclick="updateQuest(${pokestopID})"> Enregistrer </button>
		<button class="pokestop-infos-btn pokestop-infos-btn-del" onclick="togglePokestopInfos()"> Annuler </button>
		`
}

function deleteQuest (pokestopID) {
	$.ajax({
    url: `http://${environnement}:4600/quest/${pokestopID}`,
    type: 'DELETE',
    success: function(result) {
			togglePokestopInfos()
			deleteAllMarkers()
			load(jsonFile) 
    }
	});
	toast('Pokéstop mis à jour : Quête supprimée')
}

function togglePokestopInfos(){
	/* document.getElementById('pokestop_background').classList.toggle('display-none') */
	document.getElementById('pokestop_background').classList.toggle('transition-right-to-left')
}

async function displayPokestopsBySelectedQuest(id){

	var pokestopsQuests;
	//get questsID and pokestopID by questID
	await $.get(`http://${environnement}:4600/quest/${id}`, (data) => { pokestopsQuests = data})
	deleteAllMarkers()
	 // display markers
	  if(pokestopsQuests) {	
		 pokestopsQuests.forEach(element => {
		var pokestop = jsonFile.pokestops[element.pokestopID]
		displayPokestopWithQuest(element.pokestopID, element.questID)
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
		<div class="div_infos">
		<p class="labels">Quête</p>
		<h4>${jsonFile.quests[questID].name}</h4>
		</div>
		<div class="div_infos">
		<p class="labels">Pokémon(s)</p>
		<h5>${jsonFile.quests[questID].pokemon}</h5>
		</div>
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

function toast(message, pokestopID,) {
	// definition de la liste où faire apparaitre le toast
	var listeMessages = document.getElementById('toasts');
	// definition et creation du toast
	var toast = document.createElement('li')
	toast.setAttribute('class','toast')
	toast.setAttribute('onclick','deleteToast(this)')

	var img = document.createElement('img')
	img.setAttribute('src','/dist/img/pokestops/0.jpg')

	var texte = document.createElement('p')

	toast.appendChild(img)
	toast.appendChild(texte)
	texte.innerHTML = message

	listeMessages.appendChild(toast)

	setTimeout(function(){ deleteToast(toast); }, 3000);
}

function deleteToast(toast) {
	console.log(toast)
	toast.remove()
}


