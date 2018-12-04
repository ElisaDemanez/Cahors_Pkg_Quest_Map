var socket = io(); 

var DDownIcon = document.getElementById("searchbar-icon")
var List = document.getElementById("search-list")
var Input = document.getElementById("search-input")

var DDownIconState = false 
var quest = null;

socket.on('connection', function(data) {
    quest = data.quest
    populateList()
});

DDownIcon.addEventListener('click', function(){
    DDownIconState = !DDownIconState
    handleDropDownIcon()
});

Input.addEventListener('input', function(){
    displayList()
    populateList()
    DDownIconState = true
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
   let questIndexes = Object.keys(quest).filter(function(index) {
        var questItem = quest[index];
        // to complexify later
        return questItem.name.toLowerCase().includes(Input.value.toLowerCase()) 
        || questItem.pokemon.toLowerCase().includes(Input.value.toLowerCase())
      });

    questIndexes.forEach(element => {
        generateLi(element)
    });

}

function generateLi( id) {
    // create li 
    var li = document.createElement('li')
    li.id =  `${id}`
    var node = document.createTextNode(quest[id].name);
    var details = document.createTextNode(' : ');

    var pokemon = document.createTextNode(quest[id].pokemon);
    li.appendChild(node)
    li.appendChild(details)

    li.appendChild(pokemon)

    // if click on list, add it in select.
    li.addEventListener('click', function(e){
        Input.value = e.target.textContent
        hideList()
        DDownIconState = false 
    })
    document.getElementById('search-list').appendChild(li)

}

function displayList() {
    List.style.display = "block"
}

function hideList(){
    List.style.display = "none"
}