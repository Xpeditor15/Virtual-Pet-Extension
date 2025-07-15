function set_pet_image() {
    const pet_images = {
        idle: `images/${pet}/${pet}_idle_8fps.gif`,
        walk: `images/${pet}/${pet}_walk_8fps.gif`,
        run: `images/${pet}/${pet}_run_8fps.gif`,
        fast: `images/${pet}/${pet}_walk_fast_8fps.gif`,
        swipe: `images/${pet}/${pet}_swipe_8fps.gif`,
    };

    let source = pet_images[global_speed];
    if (!source) {
        global_speed = 'idle';
        source = pet_images['idle'];
    }

    img.src = chrome.runtime.getURL(source);

    if (global_direction === 'left') {
        img.style.transform = 'scaleX(-1)'; // flips the image to the left
    } else if (global_direction === 'right') {
        img.style.transform = 'scaleX(1)'; // flips the image to the right
    }
}



function pet_drop() {
    global_interrupts.drop = true;

    const my_interval = setInterval(() => {
        bottom_value = parseInt(img.style.bottom, 10);
        if (bottom_value < 15) {
            global_interrupts.drop = false;
            clearInterval(my_interval);
        }
    }, 50);
}


function pet_swipe() {
    global_interrupts.swipe = true;

    global_speed = 'swipe';
    set_pet_image();
    setTimeout(() => {
        global_speed = 'idle';
        set_pet_image();
        global_interrupts.swipe = false;
    }, 3600);
}