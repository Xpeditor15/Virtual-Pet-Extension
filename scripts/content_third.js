const pets = {
    deno: 'deno'
}


let pet = pets[deno];


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


let diagnosticMode = true;

//add event listeners for user click, and user drag

let from_right;
let from_bottom;
let bottom_value;
let dropping = 0; //checks if the pet is dropping;
let action = false; //checks if the user is performing any actions
let is_moving = false; //checks if the pet is moving at the moment
let global_direction = 'right';
let global_speed = 'idle';



//Check functions
function check_position(event) { //checks if the img is still in the viewport when the user drags the pet
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    if (event.clientX < max_left || event.clientX > max_right || event.clientY < max_top || event.clientY > max_bottom) return false;
    return true;
}


function reached_edge() {  //checks if the img has went out of the viewport when the pet is moving
    let max_left = 40;
    let max_right = document.documentElement.clientWidth - 40;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;

    let rect = img.getBoundingClientRect();

    if (rect.left < max_left || rect.left > max_right || rect.top < max_top || rect.top > max_bottom) return true;
    return false;
}



//Functions for setting the pet image
function set_pet_image() { //sets the pet image based on global_speed and global_direction
    const pet_images = {
        idle: `images/${pet}/${pet}_idle_8fps.gif`,
        walk: `images/${pet}/${pet}_walk_8fps.gif`,
        run: `images/${pet}/${pet}_run_8fps.gif`,
        fast: `images/${pet}/${pet}_walk_fast_8fps.gif`,
        swipe: `images/${pet}/${pet}_swipe_8fps.gif`,
    }

    let source = pet_images[global_speed];
    if (!source) {
        global_speed = 'idle';
        source = pet_images['idle'];
    }

    img.src = chrome.runtime.getURL(source);

    if (global_direction === 'left') {
        img.style.transform = 'scaleX(-1)'; //flips the image to the left
    } else if (global_direction === 'right') {
        img.style.transform = 'scaleX(1)'; //flips the image to the right
    }
}


