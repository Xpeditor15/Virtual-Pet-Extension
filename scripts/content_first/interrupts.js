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

    set_pet_image();
    setTimeout(() => {
        global_speed = 'idle';
        set_pet_image();
        global_interrupts.swipe = false;
    }, swipe_duration);
}