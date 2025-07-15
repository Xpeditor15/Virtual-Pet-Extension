function pet_swipe() {
    let temp_speed = global_speed;

    global_speed = 'swipe';

    const swipe_duration = pets[user_choice]['swipe_duration'];
    global_interrupts.swipe = false;

    global_action = true;

    set_pet_image();
    setTimeout(() => {
        global_speed = temp_speed;
        global_action = false;
        set_pet_image();
        diagnosticPrint(`interrupts.js line 16: Pet swipe completed, global_speed: ${global_speed}`);
    }, swipe_duration);
}

function pet_drop(event) {
    let temp_speed = global_speed;

    global_speed = 'idle';
    
    global_interrupts.drop = false;
    global_action = true;

    set_pet_image();
    
    const my_interval = setInterval(() => {
        bottom_value = parseFloat(event.style.bottom);
        diagnosticPrint(`interrupts.js line 32: Current bottom value: ${bottom_value}`);
        if (bottom_value < 15) {
            global_speed = temp_speed;
            global_action = false;
            is_dropping = false;
            set_pet_image();
            diagnosticPrint(`interrupts.js line 38: Pet drop completed, global_speed: ${global_speed}`);
            clearInterval(my_interval);
        }
        event.style.bottom = `${bottom_value - 5}px`;
    }, 50);
}