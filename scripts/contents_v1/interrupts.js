function pet_drop() {
    const my_interval = setInterval(() => {
        bottom_value = parseInt(img.style.bottom, 10);
        if (bottom_value < 15) {
            global_interrupts.drop = false;
            clearInterval(my_interval);
        }
    }, 50);
}


function pet_swipe() {
    global_speed = 'swipe';
    
    const swipe_duration = pets[user_choice]['swipe_duration'];
    global_interrupts.swipe = false;

    global_action = true;

    set_pet_image();
    setTimeout(() => {
        global_speed = 'idle';
        global_action = false;
        set_pet_image();
        diagnosticPrint(`Pet swipe completed, global_speed reset to idle`);
    }, 3600);
}