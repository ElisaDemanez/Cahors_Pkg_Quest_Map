var socket = io(); 

var DDownIcon = document.getElementById("searchbar-icon")
var List = document.getElementById("search-list")
var DDownIconState = false 
var quest = null;

socket.on('connection', function(data) {
    quest = data.quest
    populateList()
});

DDownIcon.addEventListener('click', function(){
    DDownIconState = !DDownIconState
    handleDropDownIcon()
   
})

function handleDropDownIcon(){
     if(DDownIconState){
        displayList()
        DDownIcon.classList.add("selected")
        console.log(DDownIcon.classList)
    }

    else {
        hideList()
        DDownIcon.classList.remove("selected")
        console.log(DDownIcon.classList)
    }

}

function populateList(){
    console.log(typeof quest)
    quest.forEach((element,index) => {
    document.getElementById('search-list').innerHTML += `<li id="${index}"> ${element.name}</li>`

});

}

function displayList() {
    List.style.display = "block"

}
function hideList(){
    List.style.display = "none"


}