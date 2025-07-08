function pet_move(distance) {
    return new Promise((resolve, reject) => {
        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.8,
            fast: 1.3,
            run: 2
        }

        diagnosticPrint(`movement.js line 11: global_speed: ${global_speed}`);

        let speed = speedSettings[global_speed];
        diagnosticPrint(`movement.js line 14: Speed set to ${speed}`);

        if (speed === undefined) {
            global_speed = 'idle';
            speed = speedSettings[global_speed];
            diagnosticPrint(`movement.js line 18: Defaulting speed to idle`);
        }

        set_pet_image();

        let current_position = parseFloat(img.style.right);

        let counter = 0;

        let my_interval = setInterval(() => {
            current_position = parseFloat(img.style.right);
            diagnosticPrint(`movement.js line 30: Current position: ${current_position}`);
            if (reached_edge()) {
                global_direction = global_direction === 'left' ? 'right' : 'left';
                set_pet_image();
                diagnosticPrint(`movement.js line 31: Reached edge, changing direction to ${global_direction}`);
            }
            
            if (check_interrupts().length > 0) {
                const first_interrupt = check_interrupts()[0];
                diagnosticPrint(`movement.js line 53: Interrupt detected: ${first_interrupt}`);
            }

            if (!global_action) {
                //current_position = parseInt(img.style.right, 10);
                if (global_direction === 'left') {
                    current_position += speed;
                    img.style.right = `${current_position}px`;
                } else {
                    current_position -= speed;
                    img.style.right = `${current_position}px`;
                }

                counter++;
            }

            if (counter >= distance) {
                clearInterval(my_interval);
                resolve(`movement.js line 47: Completed movement`);
            }
        }, 50);
    })
}


function random_movement() {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) {
            const first_interrupt = check_interrupts()[0];
            diagnosticPrint(`movement.js line 64: Interrupt detected: ${first_interrupt}`);
        }

        let random_speed = Math.floor(Math.random() * 100);
        let random_direction = Math.floor(Math.random() * 100);

        const speedSettings = {
            idle: [20, 80, 90, 100], // Adjusted for more running, default is 60 instead of 20
            walk: [40, 80, 90, 100],
            fast: [20, 70, 85, 100],
            run: [10, 70, 85, 100]
        }

        const speedArray = speedSettings[global_speed] || speedSettings['idle'];
        let speedIndex = speedArray.findIndex((s) => random_speed < s);
        const speeds = ['idle', 'walk', 'fast', 'run'];

        if (speedIndex === -1) {
            speedIndex = 0; // Default to idle if no match found
        }

        let speed = speeds[speedIndex];
        global_speed = speed;

        diagnosticPrint(`movement.js line 88: global_speed: ${global_speed}`);

        let direction = (random_direction < 80) ? global_direction : (global_direction === 'left' ? 'right' : 'left');
        global_direction = direction;

        const random_distance = Math.floor(Math.random() * 300) + 100;

        pet_move(random_distance).then((result) => {
            diagnosticPrint(`movement.js line 94: Finished random movement`);
            resolve(result);
        })
        .catch((error) => {
            diagnosticPrint(`movement.js line 100: Error: ${error}`);
            reject(error);
        })
    })
}


async function movement_loop() {
    while (true) {
        try {
            const result = await random_movement();
            diagnosticPrint(result);
        } catch (error) {
            diagnosticPrint(error);
        }
    }
}

pet_drop(img);

const my_interval = setInterval(() => {
    bottom_value = parseFloat(img.style.bottom);
    if (bottom_value < 15) {
        setTimeout(() => {
            movement_loop();
        }, 1000);
        clearInterval(my_interval);
    }
}, 50);