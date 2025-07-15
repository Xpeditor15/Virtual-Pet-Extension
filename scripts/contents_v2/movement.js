let animationFrame;

function petMove(distance) {
    return new Promise((resolve, reject) => {
        const speedSettings = {
            idle: 0,
            swipe: 0,
            walk: 0.8,
            fast: 1.3,
            run: 2
        }
        
        let speed = speedSettings[petState.speed];
        diagnosticPrint(`movement.js line 14: Speed set to ${speed}`);

        if (speed === undefined) {
            petState.speed = 'idle';
            speed = speedSettings[petState.speed];
            diagnosticPrint(`movement.js line 17: Defaulting speed to idle`);
        }

        setImage();

        let currentPosition = parseFloat(img.style.right);

        let movedDistance = 0;

        function animation() {
            if (petState.isAction) {
                return;
            }
            
            diagnosticPrint(`movement.js line 33: Current position: ${currentPosition}`);
            checkDirection();
            
            

            
        }

        
})
}