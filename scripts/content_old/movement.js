async function pet_image_move(distance) {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) {
            const first_interrupt = check_interrupts()[0];
            process_interrupts(first_interrupt);
            reject(`Interrupt detected: ${first_interrupt}`);
            return;
        }

        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.8,
            fast: 1.5,
            run: 2.5
        }
        diagnosticPrint(`global_speed is: ${global_speed}`);
        let speed = speedSettings[global_speed];
        diagnosticPrint(`the speed is: ${speed}`);
        if (!speed) {
            global_speed = 'idle';
            speed = speedSettings.global_speed;
        }

        set_pet_image();

        let current_position = parseInt(img.style.right, 10);

        let counter = 0;

        let my_interval = setInterval(() => {
            if (reached_edge()) {
                global_direction = global_direction === 'left' ? 'right' : 'left';
                set_pet_image();
                diagnosticPrint(`Reached edge, changing direction to ${global_direction}`);
            }

            if (check_interrupts().length > 0) {
                const first_interrupt = check_interrupts()[0];
                process_interrupts(first_interrupt);
                clearInterval(my_interval);
                reject(`Interrupt detected: ${first_interrupt}`);
                return;
            }
            
            //diagnosticPrint(`The initial right: ${img.style.right}`);
            diagnosticPrint(`Global direction is: ${global_direction}`);
            if (global_direction === 'left') {
                current_position += speed;
                img.style.right = `${current_position}px`;
            } else if (global_direction === 'right') {
                current_position -= speed;
                img.style.right = `${current_position}px`;
            }

            //diagnosticPrint(`The final right: ${img.style.right}`);

            counter++;
            if (counter >= distance) {
                clearInterval(my_interval);
                resolve(`Successfully completed movement`)
            }
        }, 50);
    })
}


async function random_pet_move() {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) {
            const first_interrupt = check_interrupts()[0];
            process_interrupts(first_interrupt);
            reject(`Interrupt detected: ${first_interrupt}`);
            return;
        }

        let random_speed = Math.floor(Math.random() * 100);
        let random_direction = Math.floor(Math.random() * 100);

        /*
        const speedSettings = {
            idle: [60, 80, 90, 100],
            walk: [40, 80, 90, 100],
            fast: [20, 70, 85, 100],
            run: [10, 70, 85, 100]
        }*/

        const speedSettings = {
            idle: [0, 40, 60, 80],
            walk: [0, 40, 60, 80],
            fast: [0, 40, 60, 80],
            run: [0, 40, 60, 80]
        }

        const speedArray = speedSettings[global_speed] || speedSettings['idle'];
        let speedIndex = speedArray.findIndex((s) => random_speed < s);
        const speeds = ['idle', 'walk', 'fast', 'run'];

        if (speedIndex === -1) {
            speedIndex = 0; // Default to 'idle' if no match found
        }

        let speed = speeds[speedIndex];

        global_speed = speed;
        diagnosticPrint(`Speed set to ${global_speed}`);

        direction = (random_direction < 80) ? global_direction : (global_direction === 'left' ? 'right' : 'left');
        global_direction = direction;

        const random_distance = Math.floor(Math.random() * 300) + 100;

        pet_image_move(random_distance).then(result => {
            diagnosticPrint("Finished random movement");
            resolve(`Pet moved to ${global_direction}`);
        })
        .catch(error => {
            diagnosticPrint(`Error during movement: ${error}`);
            reject(error);
        })
    });
}

async function movement_loop() {
    while (true) {
        try {
            const result = await random_pet_move();
            diagnosticPrint(result);
        } catch (error) {
            diagnosticPrint(error);
        }
    }
}

movement_loop();