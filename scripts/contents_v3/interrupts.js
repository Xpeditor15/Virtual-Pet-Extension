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

    //petState.fromRight = document.documentElement.clientWidth - event.clientX - img.width / 2.5;
    //petState.fromBottom = document.documentElement.clientHeight - event.clientY - img.height / 2.5;

    let rect = img.getBoundingClientRect();

    const newRight = document.documentElement.clientWidth - rect.right;
    const newBottom = document.documentElement.clientHeight - rect.bottom;
    updatePosition(newBottom, newRight);

    event.target.style.right = `${petState.fromRight}px`; //sets the position of the image
    event.target.style.bottom = `${petState.fromBottom}px`;

    diagnosticPrint(`interrupt.js line 38: fromRight: ${petState.fromRight}, fromBottom: ${petState.fromBottom}`);

    if (!globalInterrupts.drop) {
        globalInterrupts.drop = true; //user dragged the image for the first time
        setTimeout(() => {
            petDrop(event);
        }, 30); //wait for 30ms before calling petDrop
    } else {
        if (dropAnimationId === undefined) {
            diagnosticPrint(`interrupt.js line 47: logic error`);
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
    const currentBottom = petState.fromBottom;
    

    function dropAnimation(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const delta = timestamp - lastTime;
        lastTime = timestamp;

        rect = img.getBoundingClientRect();

        newRight = document.documentElement.clientWidth - rect.right;
        newBottom = document.documentElement.clientHeight - rect.bottom;

        if (rect.bottom > document.documentElement.clientHeight - limit) {
            terminateMovement(tempSpeed);
            globalInterrupts.drop = false;
            img.style.bottom = `${newBottom}px`, img.style.right = `${newRight}px`;
            updatePosition(newBottom, newRight);
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