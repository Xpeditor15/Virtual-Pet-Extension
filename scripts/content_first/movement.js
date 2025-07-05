function pet_move(distance) {
    return new Promise((resolve, reject) => {
        if (check_interrupts().length > 0) { // check if interrupts are detected
            const first_interrupt = check_interrupts()[0]; // get the first active interrupt detected
            process_interrupts(first_interrupt); // process the interrupt
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

        if (!speed) {
            global_speed = 'idle';
            speed = speedSettings.global_speed;
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
                process_interrupts(first_interrupt);
                clearInterval(my_interval);
                reject(`movement.js line 47: Interrupt detected: ${first_interrupt}`);
                return;
            }

            diagnosticPrint(`movement.js line 51: Global direction: ${global_direction}`);

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
                resolve(`movement.js line 64: Completed movement`);
            }
        }, 50);
    })
}