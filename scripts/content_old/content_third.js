let pet = 'deno'; //user should be able to change the pets


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


document.body.appendChild(container); //this creates the container into the webpage


let diagnosticMode = true; //diagnostic mode; prints information if set to true

//add event listener for when the user clicks on the image
//add event listener for when the user tries to drag the pet
img.addEventListener('dragend', drag_pet); 
img.addEventListener('click', pet_swipe);


let from_right;
let from_bottom;
let bottom_value;
let dropping = 0; //checks if the pet is dropping
let action = false; //checks if the user is performing any actions
let is_moving = false; //checks if the pet is performing any action (idle, walk, run, etc.)
let global_direction = 'right'; //global variable for direction of pet
let global_speed = 'idle'; //global variable for speed of pet


//Check functions
function check_position(event) { //checks if the img has went out of the viewport when the user drags the pet
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    if (event.clientX < max_left || event.clientX > max_right || event.clientY < max_top || event.clientY > max_bottom) return false;
    return true;
} //function returns true if the pet is still in frame


function reached_edge() { //checks if the img has went out of the viewport when the pet is moving by itself
    let max_left = 40;
    let max_right = document.documentElement.clientWidth - 40;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;

    let rect = img.getBoundingClientRect();

    if (rect.left < max_left || rect.left > max_right || rect.top < max_top || rect.top > max_bottom) return true;
    return false;
} //function returns true if the pet has reached the edge of the viewport


//Functions for setting the pet image
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

        counter++;
        diagnosticPrint(`Moving`);
        global_speed = `${speed}`; //updates the global speed variable
        global_direction = `${direction}`; //updates the global direction variable

        if (counter >= random) {
            diagnosticPrint(`Reached random limit, stopping movement`);
            clearInterval(my_interval);
            pet_image_src('idle', direction);
            diagnosticPrint('Pet moved!');
        };
    }, 50);
}

/*
function async_pet_image_move(speed, direction) {
    return new Promise((resolve, reject) => {
        if (is_moving) {
            diagnosticPrint("Pet is already moving");
            reject('Pet is already moving');
            return;
        } else if (!is_moving) {
            diagnosticPrint("Pet is not moving yet");
        }

        is_moving = true;
        
        is_moving = true;
        pet_image_move(speed, direction);
        
        setTimeout(() => {
            is_moving = false;
            resolve(`Pet moved to ${direction} at speed ${speed}`);
        }, 3000); // Adjust the timeout based on the expected duration of the movement

        if (action === true) {
            reject('Action already in progress');
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

        const random_distance = Math.floor(Math.random() * 300) + 100;

        let counter = 0;

        let my_interval = setInterval(() => {
            if (direction == 'left') {
                current_position += movement_speed;
                diagnosticPrint(`The initial right: ${img.style.right}`);
                img.style.right = `${current_position}px`;
                diagnosticPrint(`The final right: ${img.style.right}`);
            } else if (direction == 'right') {
                current_position -= movement_speed;
                diagnosticPrint(`The initial right: ${img.style.right}`);
                img.style.right = `${current_position}px`;
                diagnosticPrint(`The final right: ${img.style.right}`);
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

            counter++;
            diagnosticPrint(`Moving`);
            global_speed = `${speed}`; //updates the global speed variable
            global_direction = `${direction}`; //updates the global direction variable

            if (counter >= random_distance) {
                diagnosticPrint(`Reached random limit, stopping movement`);
                is_moving = false;
                clearInterval(my_interval);
                resolve(`Pet moved to ${direction} at speed ${speed}`);
            }
        }, 50);
    });
}*/


//User interaction functions
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


function pet_swipe() {
    action = true;
    const random = Math.floor(Math.random() * 2);
    
    if (!global_direction) {
        global_direction = 'left';
    }
    let global_direction = 'left';
    if (random == 1) global_direction = 'right';

    pet_image_src('swipe', global_direction);
    setTimeout(() => {
        pet_image_src('idle', global_direction);
        action = false;
    }, 3600); //this delay is specific for deno
}

//pet_image_move('run', 'right');
/*async_pet_image_move('run', 'right').then((message) => {
    diagnosticPrint("Finished");
    diagnosticPrint(message);
})*/


//Random movement function
function pet_random_movement() {
    is_moving = true;
    
    let random_speed = Math.floor(Math.random() * 100);
    let random_direction = Math.floor(Math.random() * 100);

    let idle, walk, fast, run;
    let direction;
    
    if (global_speed == 'idle') {
        idle = 60;
        walk = 80;
        fast = 90;
        run = 100;
    } else if (global_speed == 'walk') {
        idle = 40;
        walk = 80;
        fast = 90;
        run = 100;
    } else if (global_speed == 'fast') {
        idle = 10;
        walk = 30;
        fast = 80;
        run = 100;
    } else if (global_speed == 'run') {
        idle = 10;
        walk = 20;
        fast = 80;
        run = 100;
    }

    let speed;

    if (random_speed < idle) {
        speed = 'idle';
    } else if (random_speed < walk) {
        speed = 'walk';
    } else if (random_speed < fast) {
        speed = 'fast';
    } else if (random_speed < run) {
        speed = 'run';
    }

    global_speed = speed; //updates the global speed variable

    if (global_direction == 'left') {
        if (random_direction < 80) direction = 'left';
        else direction = 'right';
    } else if (global_direction == 'right') {
        if (random_direction < 80) direction = 'right';
        else direction = 'left';
    }

    global_direction = direction; //updates the global direction variable
    
    pet_image_move(speed, direction);
    diagnosticPrint(`Pet is ${speed} to ${direction}`);

    is_moving = false;
}

/*
function async_pet_random_movement() {
    return new Promise((resolve, reject) => {
        //is_moving = true;
        diagnosticPrint("is_moving set to true");

        let random_speed = Math.floor(Math.random() * 100);
        let random_direction = Math.floor(Math.random() * 100);

        let idle, walk, fast, run;
        let direction;

        const speedSettings = {
            idle: [60, 80, 90, 100],
            walk: [40, 80, 90, 100],
            fast: [10, 30, 80, 100],
            run: [10, 20, 80, 100]
        }

        const speedArray = speedSettings[global_speed] || speedSettings['idle'];
        let speedIndex = speedArray.findIndex((s) => random_speed < s);
        const speeds = ['idle', 'walk', 'fast', 'run'];
        
        if (speedIndex === -1) {
            reject('Invalid speed index');
            return;
        }
        
        let speed = speeds[speedIndex];

        global_speed = speed; 

        direction = (random_direction < 80) ? global_direction : (global_direction === 'left' ? 'right' : 'left');
        global_direction = direction;

        async_pet_image_move(speed, direction).then(() => {
            is_moving = false;
            diagnosticPrint(`is_moving set to false`);
            resolve(`Pet moved to ${direction} at speed ${speed}`);
        })
    })
}

setInterval(() => {
    if (!is_moving) {
        diagnosticPrint("Pet is not moving");
        async_pet_random_movement().then((message) => {
            diagnosticPrint("Finished random movement");
            diagnosticPrint(message);
        })
    } else {
        diagnosticPrint("is_moving is true");
    }
}, 50);*/



//New movement functions
function async_pet_image_move(speed, direction) {
    return new Promise((resolve, reject) => {
        /*
        if (is_moving || action) {
            diagnosticPrint("is_moving or action is true in pet_move");
            reject("is_moving or action is true in pet_move");
            return;
        } else {
            diagnosticPrint("is_moving and action are false in pet_move");
        }
        */

        is_moving = true; //sets is_moving to true to prevent executing it again

        const speedSettings = {
            idle: 0,
            walk: 0.8,
            fast: 1.5,
            run: 2.5
        }

        let movement_speed = speedSettings[speed] || speedSettings['idle']; //sets the default speed to walk, if the speed is not defined

        pet_image_move(speed, direction);

        let current_position = parseInt(img.style.right, 10);

        const random_distance = Math.floor(Math.random() * 300) + 100;

        let counter = 0;
        
        let my_interval = setInterval(() => {
            if (direction == 'left') {
                current_position += movement_speed;
                diagnosticPrint(`The initial right: ${img.style.right}`);
                img.style.right = `${current_position}px`;
                diagnosticPrint(`The final right: ${img.style.right}`);
            } else if (direction == 'right') {
                current_position -= movement_speed;
                diagnosticPrint(`The initial right: ${img.style.right}`);
                img.style.right = `${current_position}px`;
                diagnosticPrint(`The final right: ${img.style.right}`);
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

            counter++;
            diagnosticPrint(`Moving`);
            global_speed = `${speed }`; //updates the global speed variable
            global_direction = `${direction}`; //updates the global direction variable

            if (counter >= random_distance) {
                diagnosticPrint(`Set is_moving to false`);
                is_moving = false;
                clearInterval(my_interval);
                resolve(`Pet moved to ${direction} at speed ${speed}`);
            }
        }, 50);
    })
}


function async_pet_random_movement() {
    return new Promise((resolve, reject) => {
        if (is_moving) {
            diagnosticPrint("Pet is already moving");
            reject("Pet is already moving, is_moving is true");
            return;
        }

        is_moving = true;

        diagnosticPrint("is_moving is false, starting random movement");

        let random_speed = Math.floor(Math.random() * 100);
        let random_direction = Math.floor(Math.random() * 100);

        const speedSettings = {
            idle: [60, 80, 90, 100],
            walk: [40, 80, 90, 100],
            fast: [20, 70, 85, 100],
            run: [10, 70, 85, 100]
        }

        const speedArray = speedSettings[global_speed] || speedSettings['idle'];
        let speedIndex = speedArray.findIndex((s) => random_speed < s);
        const speeds = ['idle', 'walk', 'fast', 'run'];

        if (speedIndex === -1) {
            reject('Invalid speed index');
            return;
        }

        let speed = speeds[speedIndex];

        global_speed = speed;

        direction = (random_direction < 80) ? global_direction : (global_direction === 'left' ? 'right' : 'left');
        global_direction = direction;

        async_pet_image_move(speed, direction).then(() => {
            diagnosticPrint("Finished random movement");
            diagnosticPrint(`is_moving is now set to ${is_moving}`);
            resolve(`Pet moved to ${direction} at speed ${speed}`);
    })
})
}


/*setInterval(() => {
    if (!is_moving) {
        diagnosticPrint("is_moving is false in interval");
        async_pet_random_movement().then(() => {
            diagnosticPrint("Finished random movement in interval");
        })
    } else {
        diagnosticPrint("is_moving is true in interval");
    }
}, 50);

setInterval(() => {
    async_pet_random_movement().then(() => {
        diagnosticPrint("Finished random movement in interval");
    }).catch((error) => {
        diagnosticPrint("Random movement failed: " + error);
    })
}, 5000);*/

function startLoop() {
    async_pet_random_movement().then(() => {
        diagnosticPrint("Started random movement loop");
        startLoop();
    }).catch((error) => {
        diagnosticPrint("Random movement loop failed: " + error);
        setTimeout(() => {
            startLoop();
        }, timeout = 5000); //waits 5 seconds before trying again
    })
}

startLoop();





function diagnosticPrint(content) {
    if (diagnosticMode) {
        console.log(content);
    }
}