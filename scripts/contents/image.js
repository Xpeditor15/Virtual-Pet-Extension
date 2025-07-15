function set_pet_image() {
    const pet_images = {
        idle: `images/${pet}/${pet}_idle_8fps.gif`,
        walk: `images/${pet}/${pet}_walk_8fps.gif`,
        run: `images/${pet}/${pet}_run_8fps.gif`,
        fast: `images/${pet}/${pet}_walk_fast_8fps.gif`,
        swipe: `images/${pet}/${pet}_swipe_8fps.gif`,
    }

    let source = pet_images[global_speed];
    diagnosticPrint(`image.js line 11: Source: ${source}`);
    if (!source) {
        global_speed = 'idle';
        source = pet_images['idle'];
        diagnosticPrint(`image.js line 14: Defaulting to idle`);
    }

    img.src = chrome.runtime.getURL(source);

    if (global_direction === 'left') {
        img.style.transform = 'scaleX(-1)'; // flips the image to the left
    } else if (global_direction === 'right') {
        img.style.transform = 'scaleX(1)'; // flips the image to the right
    }
}


function pet_drag(event) {
    global_action = true;
    diagnosticPrint(`image.js line 30: pet_drag called`);

    if (!check_position(event)) {
        event.preventDefault();
        diagnosticPrint(`image.js line 33: Drag prevented due to position check`);
        global_action = false;
        return;
    }

    from_right = document.documentElement.clientWidth - event.clientX - img.width / 2.5;
    from_bottom = document.documentElement.clientHeight - event.clientY - img.height / 2.5;
    event.target.style.right = `${from_right}px`;
    event.target.style.bottom = `${from_bottom}px`;
    diagnosticPrint(`image.js line 43: from_right is ${from_right}`);

    if (!is_dropping) {
        is_dropping = true;
        pet_drop(event.target);
        diagnosticPrint(`image.js line 45: called pet_drop`);
    } else {
        diagnosticPrint(`image.js line 48: Already dropping, skipping pet_drop call`);
    }
}