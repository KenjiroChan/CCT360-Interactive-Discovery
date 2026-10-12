/*only 3 so far waiting for rest of pictures*/
const frames = [
    {id: "04", title:"Coffee Break", img: "images/04.png", cells:[5], hint: "Take a look at the cup.", clue: "The barista wrote Kotaro on the cup.", fact: "His name is Kotaro."},
    {id: "09", title:"Ready to go", img: "images/09.png", cells:[5, 6], hint: "There is something tied to the suitcase.", clue: "Luggage tag: K. Miyake, Toronto to Osaka.", fact: "His full name is Kotaro Miyake, flying home to Osaka."},
    {id: "15", title:"Coffee Break", img: "images/15.png", cells:[5], hint: "Take a look at the cup.", clue: "The barista wrote Kotaro on the cup.", fact: "His name is Kotaro."},
]
const state={
    scene:"camera",
    developed:[],
    found:[],
    developing:false,
    solved:false,
};

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

function showDarkroom(){
    const negatives = document.getElementById("negatives");
    negatives.innerHTML = "";

    for (const frame of frames){
        const btn = document.createElement("button");
        btn.className="negative";
        btn.textContent = frame.id;

        if (state.developed.includes(frame.id))btn.classList.add("done");
        btn.onclick=function(){developedFrame(frame,btn);};
        negatives.appendChild(btn);
    }
    updateDarkroomButton();
}

function developedFrame(frame, btn){
    if (state.developing) return;
    state.developing=true;

    const trayImg = document.getElementById("trayimg");
    const status = document.getElementById("darkroomStatus");

    trayImg.classList.remove("developed");
    trayImg.src = frame.img;
    trayImg.alt = "Print of frame "+frame.id;
    status.textContent = "Developing frame "+frame.id+"...";

    setTimeout(function () {
        trayImg.classList.add("developed");
    }, 50);

   setTimeout(function () {
        if (!state.developed.includes(frame.id)) state.developed.push(frame.id);
        btn.classList.add("done");
        status.textContent = "Frame " + frame.id + " (" + frame.title + ") is ready.";
        state.developing = false;
        updateDarkroomButton();
    }, 3000);
} 

// Only lets the player leave once every frame has been developed.
function updateDarkroomButton() {
    const allDeveloped = state.developed.length === frames.length;
    document.getElementById("toLighttable").disabled = !allDeveloped;
}

function showLighttable(){
    document.getElementById("viewer").hidden = true;
    drawPrints();
    updateLighttableButton();
}

function drawPrints(){
    const prints = document.getElementById("prints");
    prints.innerHTML="";

    for (const frame of frames){
        if (!state.developed.includes(frame.id)) continue;
        const btn = document.createElement("button");
        btn.className = "print";
        btn.innerHTML = '<img src="' + frame.img + '" alt=""><span>' + frame.id + ' · ' + frame.title + '</span>';

        if (state.found.includes(frame.id)) btn.classList.add("solved");

        btn.onclick = function(){openPrint(frame);};
        prints.appendChild(btn);
    }
}

function openPrint(frame){
    document.getElementById("viewer").hidden = false;
    document.getElementById("viewerImg").src = frame.img;
    document.getElementById("viewerImg").alt = frame.title;
    document.getElementById("viewerTitle").textContent = "Frame " + frame.id + ": " + frame.title;
    document.getElementById("viewerStatus").textContent = "Click the part of the photo that you think is a clue.";
    document.getElementById("viewerClue").hidden = true;

    const grid = document.getElementById("photoGrid");
    grid.innerHTML = "";
    for (let i = 0; i<12; i++){
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.setAttribute("aria-label", "Square " +i);
        cell.textContent = i;
        cell.onclick = function(){checkClue(frame, i);};
        grid.appendChild(cell);
    }
    if (state.found.includes(frame.id)) showClue(frame);
}