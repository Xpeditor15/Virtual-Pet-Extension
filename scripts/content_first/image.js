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
        global_speed = 'idle'; //sets global_speed to idle if the speed is undefined
        source = pet_images['idle'];
    }

    img.src = chrome.runtime.getURL(source);

    if (global_direction === 'left') {
        img.style.transform = 'scaleX(-1)'; // flips the image to the left
    } else if (global_direction === 'right') {
        img.style.transform = 'scaleX(1)'; // flips the image to the right
    }
}