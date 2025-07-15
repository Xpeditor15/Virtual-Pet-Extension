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



img.style.bottom = (document.documentElement.clientHeight - 50 - img.height / 2.5) + 'px';
img.style.right = (document.documentElement.clientWidth - 50 - img.width / 2.5) + 'px';
shadow.appendChild(img); //adds the idle pet into the container


document.body.appendChild(container); //this creates the container into the page

let diagnosticMode = true; //Set to true to enable diagnostic messages

//add event listeners
img.addEventListener('dragend', (event) => {
    global_interrupts.drop = true;
    diagnosticPrint(`Drag ended`);
    pet_drag(event);
})
img.addEventListener('click', () => {
    global_interrupts.swipe = true;
    diagnosticPrint(`Pet clicked`);
    pet_swipe();
})


let from_right;
let from_bottom;
let bottom_value;
let is_dropping = false;
let global_action = false; //checks if the pet is performing an interrupt action
let global_direction = 'right';
let global_speed = 'idle';

let global_interrupts = {
    swipe: false,
    drop: false
}


function diagnosticPrint(content) {
    if (diagnosticMode) {
        console.log(content);
    }
}