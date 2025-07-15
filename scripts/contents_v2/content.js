/*
Features a more optimized approach compared to previous versions. Changes made includes:



Features to be implemented:
- Using a centralized state (petState object) to manage global variables
- Replacing setInterval with requestAnimationFrame
- Caching DOM elements to reduce repeated queries
- Implement repeated animations and image-setting code to helpers
- Optimize interrupt functions
- Use CSS transforms for movement instead of updating direct style positions
*/

const petList = {
    deno: {
        name: 'deno',
        swipeDuration: 3600
    }
}

let userChoice = 'deno';

let pet = petList[userChoice]['name'] || petList['deno']['name']; // sets the default pet to deno


const container = document.createElement('div');
container.id = 'virtual-pet-container';
container.style.top = '0px';
container.style.left = '0px';
container.style.height = '100vh';
container.style.width = '100vw';
const shadow = container.attachShadow({ mode: "open" }); // creates a shadow container for the image


const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('popup/petstyle.css');
shadow.appendChild(link); // links the petstyle.css to the javascript


const img = document.createElement('img');
img.alt = pet;
img.src = chrome.runtime.getURL(`images/${pet}/${pet}_idle_8fps.gif`);
img.id = 'virtual-pet-image';
img.draggable = true;


shadow.appendChild(img); // adds the idle pet into the container


document.body.appendChild(container); // this creates the container into the page

let diagnosticMode = true;

//add event listeners
//dragend
//click
//resize


const diagnostics = {
    diagnosticMode: true
}


const petState = {
    fromRight: 0,
    fromBottom: 0,
    bottomValue: 0,
    isAction: false,
    direction: 'right',
    speed: 'idle' 
}


const globalInterrupts = {
    swipe: false,
    drop: false
}


function diagnosticPrint(content) {
    if (diagnostics.diagnosticMode) {
        console.log(content);
    }
}