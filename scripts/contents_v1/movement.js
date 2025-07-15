function pet_move(distance) {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) { // check if interrupts are detected
            const first_interrupt = check_interrupts()[0]; // get the first active interrupt detected
            //process_interrupts(first_interrupt); // process the interrupt
            reject(`movement.js line 6: Interrupt detected: ${first_interrupt}`);
            return;
        }

        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.8,
            fast: 1.3,
            run: 2
        }

        diagnosticPrint(`movement.js line 18: global_speed: ${global_speed}`);

        let speed = speedSettings[global_speed];

        diagnosticPrint(`movement.js line 22: speed: ${speed}`);

        if (speed === undefined) {
            global_speed = 'idle';
            speed = speedSettings[global_speed];
            diagnosticPrint(`movement.js line 27: Defaulting speed to idle`);
        }

        set_pet_image();

        let current_position = parseInt(img.style.right, 10);

        let counter = 0;

        let my_interval = setInterval(() => {
            if (reached_edge()) {
                global_direction = global_direction === 'left' ? 'right' : 'left';
                set_pet_image();
                diagnosticPrint(`movement.js line 40: Reached edge, changing direction to ${global_direction}`);
            }

            if (check_interrupts().length > 0) {
                const first_interrupt = check_interrupts()[0];
                diagnosticPrint(`movement.js line 45: Interrupt detected: ${first_interrupt}`);
                //process_interrupts(first_interrupt);
                clearInterval(my_interval);
                diagnosticPrint('movement.js cancel movement');
                reject(`movement.js line 48: Interrupt detected: ${first_interrupt}`);
                return;
            } 
            
            diagnosticPrint(`movement.js line 52: Global direction: ${global_direction}`);

            
            if (global_direction === 'left') {
                current_position += speed;
                img.style.right = `${current_position}px`;
            } else if (global_direction === 'right') {
                current_position -= speed;
                img.style.right = `${current_position}px`;
            }

            counter++;
            if (counter >= distance) {
                clearInterval(my_interval);
                resolve(`movement.js line 65: Completed movement`);
            }
        }, 50);
    })
}


function random_movement() {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) {
            const first_interrupt = check_interrupts()[0];
            //process_interrupts(first_interrupt);
            reject(`movement.js line 77: Interrupt detected: ${first_interrupt}`);
            return;
        }

        /*if (global_action) {
            reject(`Action in progress`);
            return;
        }*/

        let random_speed = Math.floor(Math.random() * 100);
        let random_direction = Math.floor(Math.random() * 100);

        const speedSettings = {
            idle: [20, 80, 90, 100],
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

        diagnosticPrint(`movement.js line 102: global_speed: ${global_speed}`);

        direction = (random_direction < 80) ? global_direction : (global_direction === 'left' ? 'right' : 'left');
        global_direction = direction;

        const random_distance = Math.floor(Math.random() * 300) + 100;

        pet_move(random_distance).then((result) => {
            diagnosticPrint(`movement.js line 110: Finished random movement`);
            resolve(result);
        })
        .catch((error) => {
            diagnosticPrint(`movement.js line 114: Error: ${error}`);
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

movement_loop();