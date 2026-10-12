/*only 3 so far waiting for rest of pictures*/
const frames = [
    {id: "04", title:"Coffee Break", img: "images/04.jpg", cells:[5], hint: "Take a look at the cup.", clue: "The barista wrote Kotaro on the cup.", fact: "His name is Kotaro."},
    {id: "09", title:"Ready to go", img: "images/09.jpg", cells:[5, 6], hint: "There is something tied to the suitcase.", clue: "Luggage tag: K. Miyake, Toronto to Osaka.", fact: "His full name is Kotaro Miyake, flying home to Osaka."},
    {id: "15", title:"Coffee Break", img: "images/15.jpg", cells:[5], hint: "Take a look at the cup.", clue: "The barista wrote Kotaro on the cup.", fact: "His name is Kotaro."},
]

function showScene(name){
    const scenes = document.querySelectorAll(".scene");
    for (let i =0; i<scenes.length; i++){
        scenes[i].hidden = true;
    }
    document.getElementById(name).hidden = false;
    document.body.dataset.scene = name;

    if (name === "darkroom") showDarkroom();
    if (name === "lighttable") showLighttable();
    if (name === "clueboard") showClueboard();
    /*your scenes would go below here*/
    state.scene = name;
}

showScene("darkroom");