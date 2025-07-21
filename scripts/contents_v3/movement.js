let movementAnimationId;

function petMove(distance) {
    return new Promise((resolve, reject) => {
        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.2,
            fast: 0.3, 
            run: 0.45
        }

        let speedValue = speedSettings[petState.speed];

        if (speedValue === undefined) {
            diagnosticPrint(`movement.js line 16: Error speed: ${petState.speed}`);
            petState.speed = 'idle';
            speedValue = speedSettings['idle'];
            diagnosticPrint(`movement.js line 18: Reset petState.speed to idle`);
        }

        setImage(petState.speed, petState.direction);

        let offset = 0, counter = 0;
        
        function movementAnimation() {
            if (petState.isAction) {
                autoUpdatePosition();
                movementAnimationId = requestAnimationFrame(movementAnimation);
                return;
            }

            if (reachedEdge()) {
                if (petState.direction === 'right') petState.direction = 'left';
                else if (petState.direction === 'left') petState.direction = 'right';
                else {
                    diagnosticPrint(`movement.js line 36: Invalid direction`);
                    reject(`Invalid direction`);
                    return;
                }

                autoUpdatePosition();
                setImage(petState.speed, petState.direction);
                diagnosticPrint(`movement.js line 42: Reached edge, changed direction to ${petState.direction}`);
            }

            if (petState.direction === 'left') offset -= speedValue;
            else if (petState.direction === 'right') offset += speedValue;
            
            img.style.transform = `translateX(${offset}px)`;
            counter++;

            if (counter >= distance) {
                autoUpdatePosition();
                resolve(`movement.js line 53: Movement completed`);
                return;
            } else {
                movementAnimationId = requestAnimationFrame(movementAnimation);
            }
        }

        movementAnimationId = requestAnimationFrame(movementAnimation);
    })
}


function randomPetMovement() {
    return new Promise((resolve, reject) => {
        if (petState.isAction) {
            diagnosticPrint(`movement.js line 69: isAction is active`);
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
        if (speedIndex === -1) speedIndex = 0;
        const speeds = ['idle', 'walk', 'fast', 'run'];

        const speed = speeds[speedIndex];
        petState.speed = speed;

        diagnosticPrint(`movement.js line 90: petState.speed: ${petState.speed}`);

        let direction = (randomDirection < 80) ? petState.direction : (petState.direction === 'left' ? 'right' : 'left');
        petState.direction = direction;
        diagnosticPrint(`movement.js line 94: petState.direction: ${petState.direction}, petState.speed: ${petState.speed}`);

        const randomDistance = Math.floor(Math.random() * 150) + 250;

        petMove(randomDistance).then((result) => {
            diagnosticPrint(`movement.js line 98: Completed petMovement in randomPetMovement`);
            resolve(result);
        })
        .catch((error) => {
            diagnosticPrint(`movement.js line 102: Error in random movement`);
            reject(error);
        })
    })
}


async function movementLoop() {
    while (true) {
        try {
            const result = await randomPetMovement();
            diagnosticPrint(result);
        } catch (error) {
            diagnosticPrint(error);
        }
    }
}