function check_position(event) { //checks if image is still in viewport during user drag
    let max_left = 20;
    let max_right = document.documentElement.clientWidth - 20;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;
    if (event.clientX < max_left || event.clientX > max_right || event.clientY < max_top || event.clientY > max_bottom) return false;
    return true;
}


function reached_edge() { //checks if image is still in viewport during pet move
    let max_left = 5;
    let max_right = document.documentElement.clientWidth - 40;
    let max_top = 20;
    let max_bottom = document.documentElement.clientHeight - 20;

    let rect = img.getBoundingClientRect();

    if (rect.left < max_left || rect.left > max_right || rect.top < max_top || rect.top > max_bottom) return true;
    return false;
}


function check_interrupts() { //returns an array of active interrupts
    let active_interrupts = [];
    Object.entries(global_interrupts).forEach(([key, value]) => {
        if (value) {
            active_interrupts.push(key);
        } 
    });
    return active_interrupts;
}


