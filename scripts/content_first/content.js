const pets = {
    deno: {
        name: 'deno',
        swipe_duration: 3600
    }
}

let user_choice = 'deno';

let pet = pets[user_choice]['name'] || pets['deno']['name']; //selects deno by default


const container = document.createElement('div');
container.id = 'virtual-pet-container';
container.style.top = '0px';
container.style.left = '0px';
container.style.height = '100vh';
container.style.width = '100vw';
const shadow = container.attachShadow({mode: "open"}); //creates a shadow container for the image


const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('popup/petstyle.css');
shadow.appendChild(link); //links the petstyle.css to the javascript


const img = document.createElement('img');
img.alt = pet;
img.src = chrome.runtime.getURL(`images/${pet}/${pet}_idle_8fps.gif`);
img.id = 'virtual-pet-image';
img.draggable = true;
img.style.bottom = '10px';
img.style.right = '400px';
shadow.appendChild(img); //adds the idle pet into the container


document.body.appendChild(container); //this creates the container into the page


let diagnosticMode = true; //Set to true to enable diagnostic messages


img.addEventListener('dragend', (event) => {
    global_interrupts.drop = true;
})

img.addEventListener('click', (event) => {
    global_interrupts.swipe = true;
})


let from_right;
let from_bottom;
let bottom_value;
let dropping = false; //checks if the pet is dropping;
let action = false; //checks if the user is performing any actions
let global_direction = 'right';
let global_speed = 'idle';

const global_interrupts = {
    swipe: false,
    drop: false
}


function diagnosticPrint(content) {
    if (diagnosticMode) {
        console.log(content);
    }
}