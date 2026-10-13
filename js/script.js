/*only 3 so far waiting for rest of pictures*/
const frames = [
    {id: "04", title:"Coffee Break", img: "images/04.png", cells:[5], hint: "Take a look at the cup.", clue: "The barista wrote Kotaro on the cup.", fact: "His name is Kotaro."},
    {id: "09", title:"Ready to go", img: "images/09.png", cells:[4, 8], hint: "There is something tied to the suitcase.", clue: "Luggage tag: K. Miyake, Toronto to Osaka.", fact: "His full name is Kotaro Miyake, flying home to Osaka."},
    {id: "15", title:"Study", img: "images/15.png", cells:[8,9], hint: "One of the notes has something paculiar written on it.", clue: "There is a number on the note.", fact: "His name is Kotaro."},
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

    const trayImg = document.getElementById("trayImg");
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
        cell.onclick = function(){checkCell(frame, i);};
        grid.appendChild(cell);
    }
    if (state.found.includes(frame.id)) showClue(frame);
}

function checkCell(frame, i){
    if (frame.cells.includes(i)){
        showClue(frame);
    } else {
        document.getElementById("viewerStatus").textContent = "That's not a clue. Hint: " + frame.hint;
    }
}

function showClue(frame){
    if(!state.found.includes(frame.id)) state.found.push(frame.id);

    document.getElementById("viewerStatus").textContent = "You found a clue!";
    const clue = document.getElementById("viewerClue");
    clue.textContent=frame.clue;
    clue.hidden=false;

    drawPrints();
    updateLighttableButton();
}

function updateLighttableButton() {
    const allFound = state.found.length === frames.length;
    document.getElementById("toClueboard").disabled = !allFound;
}

function showClueboard(){
    for (const frame of frames){
        if (!state.found.includes(frame.id)) continue;

        const card = document.createElement("div");
        card.className = "pin-card";
        card.innerHTML ='<img src="' + frame.img + '" alt="' + frame.title + '">' + '<p class="clue-text">' + frame.clue + '</p>' + '<p class="fact">' + frame.fact + '</p>';        
        board.appendChild(card);
    }
    document.getElementById("toFinalFrame").disabled = !state.solved;
}

function answer(isRight){
    const status = document.getElementById("boardStatus");

    if(isRight){
        state.solved = true;
        status.textContent = "That fits everything on the board. There's one frame left on the roll.";
        document.getElementById("toFinalFrame").disabled = false;
    } else {
        status.textContent = "That doesn't fit with the other clues. Look at the pictures again";
    }
}
showScene("darkroom");