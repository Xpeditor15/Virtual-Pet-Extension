const container = document.createElement("div"); 
container.id = 'virtual-pet-container';
const shadow = container.attachShadow({mode: "open"}); //create the shadow container that the pet will stay in


let pet = 'deno';


const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('popup/petstyle.css');
shadow.appendChild(link); //link the petstyle.css to the shadow DOM


const img = document.createElement('img');
img.alt = 'Pet';
img.src = chrome.runtime.getURL('images/deno/deno_idle_8fps.gif');
img.id = 'virtual-pet-image';
img.draggable = true;
shadow.appendChild(img); //add the pet into the container


document.body.appendChild(container); //this creates the container


img.addEventListener('dragend', drag_pet);


let from_right;
let from_bottom;
let bottom_value;
let dropping = 0; //this ensures that the pet will always fall at the same speed


function drag_pet(event) {
    from_right = document.documentElement.clientWidth - event.clientX - img.width / 2.5;
    from_bottom = document.documentElement.clientHeight - event.clientY - img.height / 2.5;
    event.target.style.right = `${from_right}px`;
    event.target.style.bottom = `${from_bottom}px`;

    if (dropping == 0) {
        pet_drop(event.target);
        dropping = 1;
    }
}


function pet_drop(image) {
    const my_interval = setInterval(() => {
        bottom_value = parseInt(image.style.bottom, 10);
        if (bottom_value < 15) clearInterval(my_interval);
        image.style.bottom = `${bottom_value - 5}px`;
    }, 50);
    dropping = 0;
}


function pet_move() {
    
}


function pet_move(direction, speed) {
    
}