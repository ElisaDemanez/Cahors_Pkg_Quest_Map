var socket = io(); 

var DDownIcon = document.getElementById("searchbar-icon")
var List = document.getElementById("search-list")
var Input = document.getElementById("search-input")

var DDownIconState = false 
var quests = null;

socket.on('connection', function(data) {
    quests = data.quests
    populateList()
    document.getElementById("searchbar-empty-icon").classList.add('display-none')
});

DDownIcon.addEventListener('click', function(){
    DDownIconState = !DDownIconState
    handleDropDownIcon()
});

Input.addEventListener('input', function(){
    displayList()
    populateList()
    DDownIconState = true

    if(Input.value == 0) {
        document.getElementById("searchbar-empty-icon").classList.add('display-none')
    } else{
        document.getElementById("searchbar-empty-icon").classList.remove('display-none')
    }
    // need to update markers here 
})

function handleDropDownIcon(){
     if(DDownIconState){
        displayList()
        DDownIcon.classList.add("selected")
    }
    else {
        hideList()
        DDownIcon.classList.remove("selected")
    }
}

function populateList(){
    document.getElementById('search-list').innerHTML = null

    // Filter on title    
   let questsIndexes = Object.keys(quests).filter(function(index) {
        var questsItem = quests[index];
        // to complexify later
        return questsItem.name.toLowerCase().includes(Input.value.toLowerCase()) 
        || questsItem.pokemon.toLowerCase().includes(Input.value.toLowerCase())
      });

    questsIndexes.forEach(element => {
        generateLi(element)
    });

}

function generateLi(id) {
    // create li 
    var li = document.createElement('li')
    li.id =  `${id}`
    var node = document.createTextNode(quests[id].name);
    var details = document.createTextNode(' : ');
    var pokemon = document.createTextNode(quests[id].pokemon);

    li.appendChild(node)
    li.appendChild(details)
    li.appendChild(pokemon)

    // if click on list, add it in select.
    li.addEventListener('click', function(e){
        Input.value = e.target.textContent
        hideList()
        DDownIconState = false 
        displayPokestopsBySelectedQuest(e.target.id)
    })
    document.getElementById('search-list').appendChild(li)

}
function emptySearchbar() {
    Input.value = ''
    deleteAllMarkers()
	load(jsonFile) 
}

function displayList() {
    List.style.display = "block"
}

function hideList(){
    List.style.display = "none"
}