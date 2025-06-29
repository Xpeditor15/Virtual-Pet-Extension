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


let diagnosticMode = false; //diagnostic mode; prints information if set to true

//add event listener for when the user clicks on the image
//add event listener for when the user tries to drag the pet
img.addEventListener('dragend', drag_pet); 

let from_right;
let from_bottom;
let bottom_value;
let dropping = 0; //checks if the pet is dropping
let action = false; //checks if the user is performing any actions
let is_moving = false; //checks if the pet is performing any action (idle, walk, run, etc.)
let direction; //global variable for direction of pet
let speed = 'idle'; //global variable for speed of pet

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


function pet_drop(image) { //function called when the user releases the pet after picking it
    const my_interval = setInterval(() => {
        bottom_value = parseInt(image.style.bottom, 10);
        if (bottom_value < 15) {
            dropping = 0;
            action = false;
            clearInterval(my_interval);
        }
        image.style.bottom = `${bottom_value - 5}px`;
    }, 50);
}


function pet_image_src(speed, direction) { //function used to change the pet image based on speed and direction
    let source;
    
    switch (speed) {
        case 'idle':
            source = `images/${pet}/${pet}_idle_8fps.gif`;
            diagnosticPrint('idle');
            break;
        case 'walk':
            source = `images/${pet}/${pet}_walk_8fps.gif`;
            diagnosticPrint('walk');
            break;
        case 'run':
            source = `images/${pet}/${pet}_run_8fps.gif`;
            diagnosticPrint('run');
            break;
        case 'fast':
            source = `images/${pet}/${pet}_walk_fast_8fps.gif`;
            diagnosticPrint('fast');
            break;
        case 'swipe':
            source = `images/${pet}/${pet}_swipe_8fps.gif`;
            diagnosticPrint('swipe');
            break;
        default:
            console.log("Returning to default!");
    }

    img.src = chrome.runtime.getURL(source);
    
    if (direction == 'left') {
        img.style.transform = 'scaleX(-1)';
        diagnosticPrint('left');
    }
    else if (direction == 'right') {
        img.style.transform = 'scaleX(1)';
        diagnosticPrint('right');
    }
}


function pet_image_move(speed, direction) { //function used to move the pet image
    if (action === true) {
        return;
    }

    let movement_speed;

    switch (speed) {
        case 'walk':
            movement_speed = 0.8;
            break;
        case 'fast':
            movement_speed = 1.5;
            break;
        case 'run':
            movement_speed = 2.5;
            break;
    }

    pet_image_src(speed, direction); //changes the image based on the speed and direction

    let current_position = parseInt(img.style.right, 10);

    const random = Math.floor(Math.random() * 300) + 100; //sets a random distance for the image to move

    let counter = 0;

    let my_interval = setInterval(() => {
        if (direction == 'left') {
            current_position += movement_speed;
            diagnosticPrint(`The initial right: ${img.style.right}`);
            img.style.right = `${current_position}px`;
            diagnosticPrint(`The final right: ${img.style.right}`);
        } else if (direction == 'right') {
            current_position -= movement_speed;
            img.style.right = `${current_position}px`;
        }

        if (reached_edge()) {
            if (direction == 'left') {
                direction = 'right';
                diagnosticPrint('Reached left edge, changing direction to right');
            } else if (direction == 'right') {
                direction = 'left';
                diagnosticPrint('Reached right edge, changing direction to left');
            }
            pet_image_src(speed, direction);
        }
    }) //work in progress
}


function diagnosticPrint(content) {
    if (diagnosticMode) {
        console.log(content);
    }
}