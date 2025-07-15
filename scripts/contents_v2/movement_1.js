let animationId;

function petMove(distance) {
    return new Promise((resolve, reject) => {
        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.8,
            fast: 1.3,
            run: 2
        }

        let speedValue = speedSettings[petState.speed];
        diagnosticPrint(`movement.js line 14: Speed: ${speedValue}`);

        if (speedValue === undefined) {
            petState.speed = 'idle';
            speedValue = speedSettings['idle'];
            diagnosticPrint(`movement.js line 19: Reset the petState.speed to idle`);
        }

        setImage(petState.speed, petState.direction);

        let offset = 0, counter = 0;

        function animation() {
            if (petState.isAction) {
                animationId = requestAnimationFrame(animation);
                return; //checks if isAction is true
            }

            if (reachedEdge()) {
                if (petState.direction === 'right') petState.direction = 'left';
                else if (petState.direction === 'left') petState.direction = 'right';
                else {
                    diagnosticPrint(`movement.js line 36: Invalid direction`);
                    reject(`Invalid direction`);
                    return
                }
                
                setImage(petState.speed, petState.direction);
                diagnosticPrint(`movement.js line 42: Reached `)
            }

            if (petState.direction === 'left') offset += speedValue;
            else if (petState.direction === 'right') offset -= speedValue;
            
            img.style.transform = `translateX(${offset}px)`;
            counter++;

            if (counter >= distance) {
                resolve(`movement.js line 52: Movement completed`);
                return;
            } else {
                animationId = requestAnimationFrame(animation);
            }
            
        }
        
        animationId = requestAnimationFrame(animation);
    })

}


function randomPetMovement() {
    return new Promise((resolve, reject) => {
        if (petState.isAction) {
            diagnosticPrint(`movement.js line 69: isAction is active, cancelling movement`);
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

        if (speedIndex === -1) speedIndex = 0;

        const speed = speeds[speedIndex]; //obtaining the new speed
        petState.speed = speed;

        diagnosticPrint(`movement.js line 91: petState.speed: ${petState.speed}`);
        
        let direction = (randomDirection < 80) ? petState.direction : (petState.direction === 'left' ? 'right' : 'left');
        petState.direction = direction; //obtaining the new direction

        const randomDistance = Math.floor(Math.random() * 150) + 250; //minimum distance of 300px

        petMove(randomDistance).then((result) => {
            diagnosticPrint(`movement.js line 99: Finished random movement`);
            resolve(result);
        })
        .catch((error) => {
            diagnosticPrint(`movement.js line 103: Error: ${error}`);
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

setTimeout(() => {
    petState.isAction = true;
    petDrop(img);
    
    const my_interval = setInterval(() => {
        if (!petState.isAction) {
            movementLoop();
            clearInterval(my_interval);
        }
    }, 50);
}, 550);

