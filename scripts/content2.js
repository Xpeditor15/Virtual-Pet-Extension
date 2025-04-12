let pet = 'deno'; //user should be able to change the pets


const container = document.createElement('div');
container.id = 'virtual-pet-container';
container.style.top = '0px';
container.style.left = '0px';
container.style.height = '100vh';
container.style.widows = '100vw';
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


document.body.appendChild(container); //this creates the container into the webpage


//add event listener for when the user clicks on the image
//add event listener for when the user tries to drag the pet 

let from_right;
let from_bottom;
let bottom_value;
let dropping = 0;
let action = false;
let is_moving = false;
let direction;

function check_position(event) { //checks if the img has went out of the viewport when the user drags the pet
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    if (event.clientX < max_left || event.clientX > max_right || event.clientY < max_top || event.clientY > max_bottom) return false;
    return true;
} //function returns true if the pet is still in frame


function reached_edge() { //checks if the img has went out of the viewport when the pet is moving by itself
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;

    let rect = img.getBoundingClientRect();

    if (rect.left < max_left || rect.left > max_right || rect.top < max_top || rect.top > max_bottom) return true;
    return false;
} //function returns true if the pet has reached the edge of the viewport


function drag_pet(event) { //allows the user to drag the pet around the viewport
    action = true;

    if (!check_position(event)) {
        event.preventDefault();
        action = false;
        return;
    }

    from_right = document.documentElement.clientWidth - event.clientX - img.width / 2.5;
    from_bottom = document.documentElement.clientHeight - event.clientY - img.height / 2.5;
    event.target.style.right = `${from_right}px`;
    event.target.style.bottom = `${from_bottom}px`;

    if (dropping == 0) {
        dropping = 1;
        pet_drop(event.target);
    }
}