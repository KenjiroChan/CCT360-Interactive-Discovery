/* every photo on the roll, in order. cells = which squares of the 4 x 3 grid hold the clue */
const frames = [
    {id: "02", title: "Library", img: "images/02.png"},
    {id: "03", title: "Lecture", img: "images/03.png"},
    {id: "04", title:"Coffee Break", img: "images/04.png", cells:[4], hint: "Take a look at the cup.", clue: "The barista wrote Kota on the cup.", fact: "His name is Kota."},
    {id: "06", title: "Breakfast", img: "images/06.png"},
    {id: "09", title:"Ready to go", img: "images/09.png", cells:[4, 8], hint: "There is something tied to the suitcase.", clue: "Luggage tag: K. Miyake, Toronto to Osaka.", fact: "His full name is Kotaro Miyake, flying home to Osaka."},
    {id: "12", title: "Campus", img: "images/12.png"},
    {id: "15", title:"Study", img: "images/15.png", cells:[8,9], hint: "One of the notes has something peculiar written on it.", clue: "There is a number on the note.", fact: "Keep note of the number 7."},
    {id: "18", title: "Driving dog", img: "images/18.jpg"},
    {id: "21", title: "Lunch", img: "images/21.png", cells: [10, 11], hint: "Something is stuck to the tray.", clue: "Another sticky note: 3.", fact: "The second number is 3."},
    {id: "22", title: "Fun with friends", img: "images/22.jpg"},
    {id: "28", title: "Moving out", img: "images/28.png", cells: [2], hint: "Look inside the locker.", clue: "A sticky note on the back wall: 6.", fact: "The last number is 6."},
]
const state={
    scene:"camera",
    developed:[],
    found:[],
    developing:false,
    solved:false,
    codeTries:0,      // how many times the player has tried the frame 36 code
    ending:"",        // which ending they picked
};

//Any button that leads somewhere calls this with the id of a scene. It hides all the other scenes and shows the one the player is going to.
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

    //remembers the scene we're currently on
    state.scene = name;
}

function showDarkroom(){
    const negatives = document.getElementById("negatives");
    negatives.innerHTML = "";//makes sure there are no prior buttons in the row of negatives before adding them all again

    for (const frame of frames){
        //create a button and label it with the frame number
        const btn = document.createElement("button");
        btn.className="negative";
        btn.textContent = frame.id;

        //fade out any negatives that have already been developed so the user knows they have been developed
        if (state.developed.includes(frame.id))btn.classList.add("done");
        btn.onclick=function(){developedFrame(frame,btn);};
        negatives.appendChild(btn);
    }
    updateDarkroomButton();
}

// when the player clicks a negative, this function shows the print in the tray and starts the developing process
function developedFrame(frame, btn){

    //if another print is still in development, ignore the click. This prevents the player from developing multiple prints at once
    if (state.developing) return;
    state.developing=true;

    const trayImg = document.getElementById("trayImg");
    const status = document.getElementById("darkroomStatus");

    //resets the tray to blank and then shows the new print
    trayImg.classList.remove("developed");
    trayImg.src = frame.img;
    trayImg.alt = "Print of frame "+frame.id;
    status.textContent = "Developing frame "+frame.id+"...";
    
    //wait a moment before showing the print in the tray so the player can see the developing process
    setTimeout(function () {
        trayImg.classList.add("developed");
    }, 50);


    // after 3 seconds the print is finished developing, so we mark it as done and update the status message. We also add it to the list of developed frames if it isn't already there.
    setTimeout(function () {
        if (!state.developed.includes(frame.id)) state.developed.push(frame.id);
        btn.classList.add("done");
        status.textContent = "Frame " + frame.id + " (" + frame.title + ") is ready.";
        state.developing = false;
        updateDarkroomButton();
    }, 3000);
} 

// Lets the player go to the light table once at least one frame is developed.
// They can come back to the darkroom any time, so they choose their own order.
function updateDarkroomButton() {
    const anyDeveloped = state.developed.length > 0;
    document.getElementById("toLighttable").disabled = !anyDeveloped;
}


//light table section

function showLighttable(){
    document.getElementById("viewer").hidden = true;
    drawPrints();
    updateLighttableButton();
}

function drawPrints(){
    const prints = document.getElementById("prints");
    prints.innerHTML="";

    for (const frame of frames){
        //if a photo hasn't been developed yet skip
        if (!state.developed.includes(frame.id)) continue;

        //build a thumbnail with a caption 
        const btn = document.createElement("button");
        btn.className = "print";
        btn.innerHTML = '<img src="' + frame.img + '" alt=""><span>' + frame.id + ' · ' + frame.title + '</span>';

        //if the user found a clue then add a red outline to the thumbnail
        if (state.found.includes(frame.id)) btn.classList.add("solved");

        //gives the user a bigger view if a thumbnail is clicked
        btn.onclick = function(){openPrint(frame);};
        prints.appendChild(btn);
    }
}

//opens thumbnail in big view and builds 12 clickable squares for the user to find the clue
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
        cell.onclick = function(){checkCell(frame, i);};
        grid.appendChild(cell);
    }
    if (state.found.includes(frame.id)) showClue(frame);
}

function checkCell(frame, i){
    if (!frame.clue){
        document.getElementById("viewerStatus").textContent = "There is no clue in this photo.";
        return;
    }
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
    const clueFrames = frames.filter(function(frame){return frame.clue;});
    const allFound = state.found.length === clueFrames.length;
    document.getElementById("toClueboard").disabled = !allFound;

    // tell the player how close they are
    const status = document.getElementById("lighttableStatus");
    if (allFound) {
        status.textContent = "You found all " + clueFrames.length + " clues. Pin them to the board.";
    } else if (state.developed.length < frames.length) {
        status.textContent = "Clues found: " + state.found.length + " of " + clueFrames.length + ". Some frames are still undeveloped in the darkroom.";
    } else {
        status.textContent = "Clues found: " + state.found.length + " of " + clueFrames.length + ".";
    }
}

function showClueboard(){
    const board = document.getElementById("board");
    board.innerHTML = "";   // clear the board first so cards are not added twice
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
// Frame 36 section

// the code is the three sticky-note numbers in roll order: 7 (frame 15), 3 (frame 21), 6 (frame 28)
function checkCode(){
    const guess = document.getElementById("codeInput").value;
    const status = document.getElementById("codeStatus");

    if (guess === "736"){
        status.textContent = "The last frame starts to come through...";
        document.getElementById("finalPrint").hidden = false;
        setTimeout(function () {
            document.getElementById("finalImg").classList.add("developed");
        }, 50);
    } else {
        state.codeTries = state.codeTries + 1;
        if (state.codeTries >= 2){
            status.textContent = "Still blank. Hint: the numbers were on yellow sticky notes. Read them in the order they appear on the roll.";
        } else {
            status.textContent = "Nothing comes through. That isn't the code.";
        }
    }
}

// Ending section

// the ending changes depending on which choice the player made under frame 36
function showEnding(choice){
    state.ending = choice;
    showScene("ending");

    const title = document.getElementById("endingTitle");
    const text = document.getElementById("endingText");
    const img = document.getElementById("endingImg");

    if (choice === "mail"){
        title.textContent = "Prints in the mail";
        img.src = "images/09.png";
        img.alt = "Kota's suitcase with the luggage tag K. Miyake, YYZ to KIX";
        text.textContent = "You print all 36 frames and leave them at the international student office in an envelope marked: for K. Miyake, Osaka. Kota's last day in Toronto is on its way home to him.";
    } else {
        title.textContent = "Back on the shelf";
        img.src = "images/hero.png";
        img.alt = "The film camera back on the lost-and-found shelf";
        text.textContent = "You rewind the roll, close the camera and set it back between the umbrella and the scarf. Maybe Kota will come back for it. Maybe the next person who opens it will find what you found.";
    }

    // remember what the player did along the way
    let tries = state.codeTries + 1;
    document.getElementById("endingStats").textContent = "You developed " + state.developed.length + " frames, pinned " + state.found.length + " clues and cracked the code on try " + tries + ".";
}

// reloading the page clears the state and starts back at the camera
function restart(){
    location.reload();
}

//first scene needs to be the player finding the camera at lost and found
showScene("camera");