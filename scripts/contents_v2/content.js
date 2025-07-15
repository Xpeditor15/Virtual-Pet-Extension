/*
Features a more optimized approach compared to previous versions. Changes made includes:



Features to be implemented:
- Using a centralized state (petState object) to manage global variables (done)
- Replacing setInterval with requestAnimationFrame (done)
- Caching DOM elements to reduce repeated queries 
- Implement repeated animations and image-setting code to helpers (done)
- Optimize interrupt functions (done)
- Use CSS transforms for movement instead of updating direct style positions (done)
*/


const petList = {
    deno: {
        name: 'deno',
        swipeDuration: 3600
    }
}


let userChoice = 'deno';

let pet = petList[userChoice]['name'] || petList['deno']['name']; // sets the default pet to deno if userChoice is undefined


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

const randomHeight = Math.random() * 0.6 + 0.2;
const randomWidth = Math.random() * 0.6 + 0.2;

img.style.bottom = `${document.documentElement.clientHeight * randomHeight}px`;
img.style.right = `${document.documentElement.clientWidth * randomWidth}px`;

setTimeout(() => {
    shadow.appendChild(img);
    document.body.appendChild(container);
    img.style.visibility = 'visible'; // make the image visible after appending
}, 500);

//event listeners
img.addEventListener('dragend', (event) => {
    //globalInterrupts.drop = true;
    diagnosticPrint(`content.js line 65: Drag ended`);
    petDrag(event);
})

img.addEventListener('click', () => {
    globalInterrupts.swipe = true;
    diagnosticPrint(`content.js line 71: Pet clicked`);
    petSwipe();
})

img.addEventListener('resize', () => {
    updateViewport();
    diagnosticPrint(`content.js line 77: Viewport updated`);
})


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