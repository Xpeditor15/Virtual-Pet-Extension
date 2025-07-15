let movementAnimationId;

function petMove(distance) {
    return new Promise((resolve, reject) => {
        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.1,
            fast: 0.3,
            run: 0.45
        }

        let speedValue = speedSettings[petState.speed];
        
        if (!speedValue) {
            petState.speed = 'idle';
            speedValue = speedSettings['idle'];
            diagnosticPrint(`movement.js line 18: Reset the petState.speed to idle`);
        }

        setImage(petState.speed, petState.direction);

        let offset = 0, counter = 0;

        function animation() {
            if (petState.isAction) {
                movementAnimationId = requestAnimationFrame(animation);
                return;
            }

            if (reachedEdge()) {
                if (petState.direction === 'right') petState.direction = 'left';
                else if (petState.direction === 'left') petState.direction = 'right';
                else {
                    diagnosticPrint(`movement.js line 35: Invalid direction`);
                    reject(`Invalid direction`);
                    return;
                }

                setImage(petState.speed, petState.direction);
                diagnosticPrint(`movement.js line 41: Reached edge`);
            }

            if (petState.direction === 'left') offset -= speedValue;
            else if (petState.direction === 'right') offset += speedValue;

            img.style.transform = `translateX(${offset}px)`;
            counter++;

            if (counter >= distance) {
                resolve(`movement.js line 51: Movement completed`);
                return;
            } else {
                movementAnimationId = requestAnimationFrame(animation);
            }
        }

        movementAnimationId = requestAnimationFrame(animation);
    })
}


function randomPetMovement() {
    return new Promise((resolve, reject) => {
        if (petState.isAction) {
            diagnosticPrint(`movement.js line 66: isAction is active`);
            reject(`isAction is active, movement cancelled`);
            return;
        }

        let randomSpeed = Math.floor(Math.random() * 100);
        let randomDirection = Math.floor(Math.random() * 100);

        const speedSettings = {
            idle: [20, 80, 90, 100],
            walk: [40, 80, 90, 100],
            fast: [20, 70, 85, 100],
            run: [10, 70, 85, 100]
        }

        const speedArray = speedSettings[petState.speed] || speedSettings['idle'];
        let speedIndex = speedArray.findIndex((s) => randomSpeed < s);
        const speeds = ['idle', 'walk', 'fast', 'run'];
    })
}