let dropAnimationId;

function petSwipe() { //called in event listener for 'click', performs the swipe action
    const tempSpeed = petState.speed;
    petState.speed = 'swipe';

    const swipeDuration = petList[userChoice]['swipeDuration'];
    globalInterrupts.swipe = true;
    petState.isAction = true;

    setImage('swipe', petState.direction);
    setTimeout(() => {
        terminateMovement(tempSpeed);
        globalInterrupts.swipe = false;
        diagnosticPrint(`interrupt.js line 13: Completed petSwipe`);
    }, swipeDuration);
}


function petDrag(event) { //called in event listener for 'dragend'
    diagnosticPrint(`interrupt.js: petDrag called`);
    if (!checkPosition(event)) { //check if image is still in viewport
        event.preventDefault();
        diagnosticPrint(`interrupt.js line: Drag prevented due to position check`);
        return;
    }    

    petState.isAction = true;
    
    petState.fromRight = document.documentElement.clientWidth - event.clientX - img.width / 2.5;
    petState.fromBottom = document.documentElement.clientHeight - event.clientY - img.height / 2.5;

    event.target.style.right = `${petState.fromRight}px`; //sets the position of the image
    event.target.style.bottom = `${petState.fromBottom}px`;
    
    diagnosticPrint(`interrupt.js: fromRight: ${petState.fromRight}, fromBottom: ${petState.fromBottom}`);

    if (!globalInterrupts.drop) {
        globalInterrupts.drop = true;
        setTimeout(() => {
            petDrop(event);
        }, 30);
    } else {
        if (dropAnimationId === undefined) {
            diagnosticPrint(`interrupt.js: logic error`);
        } else {
            cancelAnimationFrame(dropAnimationId);
            petDrop(event);
        }
    }
}


function petDrop(event) {
    const tempSpeed = petState.speed;
    petState.speed = 'idle';

    setImage(petState.speed, petState.direction);
    
    let lastTime;
    let offset = 0;
    let rect;
    const dropSpeed = 0.2;

    function dropAnimation(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const delta = timestamp - lastTime;
        lastTime = timestamp;

        rect = img.getBoundingClientRect();

        diagnosticPrint(`interrupt.js: rect.bottom: ${rect.bottom}`);

        if (rect.bottom > document.documentElement.clientHeight - 50) {
            terminateMovement(tempSpeed);
            globalInterrupts.drop = false;
            let newRight = document.documentElement.clientWidth - event.clientX - rect.width / 2.5;
            img.style.bottom = `50px`, img.style.right = `${newRight}px`;
            diagnosticPrint(`interrupt.js: Completed petDrop`);
            return;
        } else {
            offset += dropSpeed * delta;
            img.style.transform = `translateY(${offset}px)`;
            dropAnimationId = requestAnimationFrame(dropAnimation);
        }
    }

    dropAnimationId = requestAnimationFrame(dropAnimation);
}


function updateViewport() { //updates the viewport dimensions
    viewport.viewportWidth = document.documentElement.clientWidth;
    viewport.viewportHeight = document.documentElement.clientHeight;
}