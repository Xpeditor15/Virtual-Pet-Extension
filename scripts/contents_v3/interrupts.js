let dropAnimationId;

function petSwipe() { //called in event listener click
    const tempSpeed = petState.speed;
    petState.speed = 'swipe';

    const swipeDuration = petList[userChoice]['swipeDuration'];
    globalInterrupts.swipe = true;
    petState.isAction = true;

    setImage('swipe', petState.direction);

    setTimeout(() => {
        globalInterrupts.swipe = false;
        terminateMovement(tempSpeed);
        diagnosticPrint(`interrupt.js line 16: Completed petSwipe`);
    }, swipeDuration);
}


function petDrag(event) { //called in event listener dragend
    diagnosticPrint(`interrupt.js line 22: petDrag called`);

    if (!checkPosition(event)) {
        event.preventDefault(); //prevent drag
        diagnosticPrint(`interrupt.js line 26: Drag prevented due to position check`);
        return;
    }

    petState.isAction = true;

    const testRight = document.documentElement.clientWidth - event.clientX - img.width / 2;
    const testBottom = document.documentElement.clientHeight - event.clientY - img.width / 2;
    updatePosition(testBottom, testRight);

    //diagnosticPrint(`interrupt.js line 36: testRight: ${testRight}, testBottom: ${testBottom}`);

    event.target.style.right = `${petState.fromRight}px`; //sets the position of the image
    event.target.style.bottom = `${petState.fromBottom}px`;

    if (!globalInterrupts.drop) {
        globalInterrupts.drop = true; //user dragged the image for the first time
        diagnosticPrint(`interrupt.js 43: First time drag`);
        setTimeout(() => {
            petDrop(event);
        }, 30); //wait for 30ms before calling petDrop
    } else {
        if (dropAnimationId === undefined) {
            diagnosticPrint(`interrupt.js line 49: Logic error`);
        } else {
            cancelAnimationFrame(dropAnimationId); //cancel the initial petDrop animation
            petDrop(event);
        }
    }
}


function petDrop(event) {
    const tempSpeed = petState.speed;
    petState.speed = 'idle';

    setImage(petState.speed, petState.direction);

    let lastTime, rect;
    let offset = 0;
    let newRight, newBottom;
    const dropSpeed = 0.2, limit = 20;
    

    function dropAnimation(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const delta = timestamp - lastTime;
        lastTime = timestamp;

        rect = img.getBoundingClientRect();

        diagnosticPrint(`interrupt.js line 78: rect.bottom: ${rect.bottom}`);
        newRight = document.documentElement.clientWidth - rect.right;
        newBottom = document.documentElement.clientHeight - rect.bottom;

        if (rect.bottom > document.documentElement.clientHeight - limit) {
            terminateMovement(tempSpeed);
            globalInterrupts.drop = false;
            img.style.bottom = `${newBottom}px`, img.style.right = `${newRight}px`;
            updatePosition(newBottom, newRight);
            diagnosticPrint(`interrupt.js line 87: Completed petDrop`);
            return;
        } else {
            offset += dropSpeed * delta;
            img.style.transform = `translateY(${offset}px)`;
            updatePosition(newBottom, newRight);
            dropAnimationId = requestAnimationFrame(dropAnimation);
        }
    }

    dropAnimationId = requestAnimationFrame(dropAnimation);
}


function updateViewport() { //updates the viewport in event listener resize
    viewport.viewportWidth = document.documentElement.clientWidth;
    viewport.viewportHeight = document.documentElement.clientHeight;
}