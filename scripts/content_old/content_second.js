let pet = 'deno'; //allows users to change the pet


const container = document.createElement('div');
container.id = 'virtual-pet-container';
container.style.top = '0px';
container.style.left = '0px';
container.style.height = '100vh';
container.style.width = '100vw';
const shadow = container.attachShadow({mode: "open"}); //creates a container


const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('popup/petstyle.css');
shadow.appendChild(link); //links the petstyle.css to the shadow DOM


const img = document.createElement('img');
img.alt = 'Pet';
img.src = chrome.runtime.getURL(`images/${pet}/${pet}_idle_8fps.gif`);
img.id = 'virtual-pet-image';
img.draggable = true;
img.style.bottom = '10px';
img.style.right = '400px';
shadow.appendChild(img); //add the idle pet into the container


document.body.appendChild(container); //this creates the container into the page


img.addEventListener('click', pet_swipe);
img.addEventListener('dragend', drag_pet)


let from_right;
let from_bottom;
let bottom_value;
let dropping = 0; //checks if the pet is already falling
let action = false; //checks if the user is performing any actions 
let is_moving = false; //checks if the pet is moving at the moment
let direction; //global variable for direction of pet


function check_position(event) { //function checks if the img has went out of the viewport
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    if (event.clientX < max_left || event.clientX > max_right || event.clientY < max_top || event.clientY > max_bottom) return true;
    return false;
}


function reached_edge() { //function returns true if the img reaches the edge of the viewport
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    
    let rect = img.getBoundingClientRect();

    if (rect.right < max_left || rect.right > max_right) return true;
    return false;
}


function drag_pet(event) { //function allows the user to drag the pet around the viewport
    action = true;

    if (check_position(event)) {
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


function pet_drop(image) { //function called when user releases the pet after picking it
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


function pet_image_src(speed, direction) {
    let source;
    
    switch (speed) {
        case 'idle':
            source = `images/${pet}/${pet}_idle_8fps.gif`;
            console.log('idle');
            break;
        case 'walk':
            source = `images/${pet}/${pet}_walk_8fps.gif`;
            console.log('walk');
            break;
        case 'run':
            source = `images/${pet}/${pet}_run_8fps.gif`;
            console.log('run');
            break;
        case 'fast':
            source = `images/${pet}/${pet}_walk_fast_8fps.gif`;
            console.log('fast');
            break;
        case 'swipe':
            source = `images/${pet}/${pet}_swipe_8fps.gif`;
            console.log('swipe');
            break;
        default:
            console.log("Returning to default!");
    }
    
    /*if (speed == 'idle') source = `images/${pet}/${pet}_idle_8fps.gif`;
    else if (speed == 'walk') source = `images/${pet}/${pet}_walk_8fps.gif`;
    else if (speed == 'run') source = `images/${pet}/${pet}_run_8fps.gif`;
    else if (speed == 'swipe') source = `images/${pet}/${pet}_swipe_8fps.gif`;
    else console.log("Returning to default!");*/

    img.src = chrome.runtime.getURL(source);
    
    if (direction == 'left') {
        img.style.transform = 'scaleX(-1)';
        console.log('left');
    }
    else if (direction == 'right') {
        img.style.transform = 'scaleX(1)';
        console.log('right');
    }
}


/*function pet_image_move(speed, direction) {
    if (action === true) {
        return;
    }

    let movement_speed;

    switch (speed) {
        case 'walk':
            movement_speed = 5;
            break;
        case 'run':
            movement_speed = 13;
            break;
        case 'fast':
            movement_speed = 10;
            break;
    }

    pet_image_src(speed, direction);

    let position_value;

    //const random = Math.floor(Math.random() * 20) + 10;

    const random = 40;

    let counter = 0;

    let my_interval = setInterval(() => {
        if (direction == 'left') {
            position_value = parseInt(img.style.left, 10);
            img.style.left = `${position_value - movement_speed}px`;
        } else if (direction == 'right') {
            position_value = parseInt(img.style.right, 10);
            img.style.right = `${position_value - movement_speed}px`;
        }

        if (reached_edge) {
            if (direction == 'left') direction = 'right';
            else if (direction == 'right') direction = 'left';

            pet_image_src(speed, direction);
        }

        counter++;

        if (counter >= random) {
            clearInterval(my_interval);
        }
    }, 500);
}*/



function pet_image_move(speed, direction) {
    if (action === true) {
        return;
    };

    let movement_speed;

    switch (speed) {
        case 'walk':
            movement_speed = 0.8;
            break;
        case 'run':
            movement_speed = 2.5;
            break;
        case 'fast':
            movement_speed = 1.5;
            break;
    }

    pet_image_src(speed, direction);

    let current_position = parseInt(img.style.right, 10); //this keeps the current position of the image

    const random = Math.floor(Math.random() * 300) + 100;

    let counter = 0;

    let my_interval = setInterval(() => {
        if (direction == 'left') {
            current_position += movement_speed;
            console.log(`The initial right: ${img.style.right}`);
            img.style.right = `${current_position}px`;
            console.log(`The final right: ${img.style.right}`);
            
        } else if (direction == 'right') {
            current_position -= movement_speed;
            img.style.right = `${current_position}px`;
        }

        if (reached_edge()) {
            if (direction == 'left') {
                direction = 'right';
                console.log("Reached the edge, changing to right");
            } else if (direction == 'right') {
                direction = 'left';
                console.log("Reached the edge, changing to left");
            }
            pet_image_src(speed, direction);
        }

        counter++;
        console.log('moving')

        if (counter >= random) {
            console.log("counter is 40");
            clearInterval(my_interval);
        };
    }, 50);

    console.log("pet moved!");
}

pet_image_move('run', 'right');


function pet_swipe() {
    action = true;
    const random = Math.floor(Math.random() * 2);
    if (!direction) {
        direction = 'left';
    }
    let direction = 'left';
    if (random == 1) direction = 'right';
    pet_image_src('swipe', direction);
    setTimeout(() => {
        pet_image_src('idle', direction);
        action = false;
    }, 3600); //this delay is only specific for deno
}

function pet_random_movement() {
    is_moving = true;
    const random_int = Math.floor(Math.random() * 16);
    const random_gen = Math.floor(Math.random() * 2)
    let direction;

    if (random_gen == 0) direction = 'left';
    else if (random_gen == 1) direction = 'right';
    
    const walk = [3, 6, 7, 11];
    const idle = [0, 4, 13, 12, 15, 5];
    const fast = [1, 2, 9];
    const run = [10, 14, 8];
    if (walk.includes(random_int)) {
        pet_image_move('walk', direction);
        console.log('is walking');
    }
    else if (idle.includes(random_int)) {
        pet_image_src('idle', direction);
        console.log('is idle');
    }
    else if (fast.includes(random_int)) {
        pet_image_move('fast', direction);
        console.log('is fast walking');
    }
    else if (run.includes(random_int)) {
        pet_image_move('run', direction);
        console.log('is running');
    }
    
    is_moving = false;
}

interval = setInterval(() => {
    if (is_moving === false) {
        pet_random_movement();
        console.log('my nigga');
    }
}, 1000);


function pet_random_movement() {
    is_moving = true;
    const random_movement = Math.random() * 101; //determines if the image would move/run/idle
    const random_direction = 
    
    if (random_movement < 500) {
        pet_image_move('idle')
    } else if (random_movement < 70) {
        pet_image_move('walk')
    } else if (random_movement < 90) {
        pet_image_move('fast')
    } else if (random_movement < 100) {
        pet_image_move('run');
    }
    
}