/* 
Builds on contents_v2


Changed: 
setImage
terminateMovement
*/


const petList = {
    deno: {
        name: 'deno',
        swipeDuration: 3600
    }
}


let userChoice = 'deno';

let pet = petList[userChoice]['name'] || petList['deno']['name'];


const container = document.createElement('div');
container.id = 'virtual-pet-container';
container.style.top = '0px';
container.style.eft = '0px';
container.style.height = '100vh';
container.style.width = '100vw';
const shadow = container.attachShadow({ mode: "open" });

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('popup/petstyle.css');
shadow.appendChild(link);


const img = document.createElement('img');
img.alt = pet;
img.src = chrome.runtime.getURL(`images/${pet}/${pet}_idle_8fps.gif`);
img.id = 'virtual-pet-image';
img.draggable = true;


const randomHeight = Math.random() * 0.6 + 0.2;
const randomWidth = Math.random() * 0.6 + 0.2;


img.style.bottom = `${document.documentElement.clientHeight * randomHeight}px`;
img.style.right = `${document.documentElement.clientWidth * randomWidth}px`;


//set timeout to add the image after a delay
setTimeout(() => {
    shadow.appendChild(img);
    document.body.appendChild(container);
    img.style.visibility = 'visible';
}, 500);


//add event listeners, dragend, click, resize
img.addEventListener('dragend', (event) => {
    diagnosticPrint(`content.js line 58: Drag ended`);
    petDrag(event);
})


img.addEventListener('click', () => {
    diagnosticPrint(`content.js line 63: Pet clicked`);
    petSwipe();
})


img.addEventListener('resize', () => {
    diagnosticPrint(`content.js line 68: Image resized`);
    updateViewport();
})


const diagnostics = {
    diagnosticMode: true
}


const petState = {
    fromRight: 0,
    fromBottom: 0,
    isAction: false,
    direction: 'right',
    speed: 'idle'
}


const globalInterrupts = {
    swipe: false,
    drop: false
}


function diagnosticPrint(message) {
    if (diagnostics.diagnosticMode) {
        console.log(message);
    }
}


setTimeout(() => {
    petState.isAction = true;
    petDrop(img);
    
    const my_interval = setInterval(() => {
        if (!petState.isAction) {
            diagnosticPrint(`content.js line 109: Finish dropping initially`);
            movementLoop();
            clearInterval(my_interval);
        }
    }, 50);
}, 550);