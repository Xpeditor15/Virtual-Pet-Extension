function petSwipe() {
    const tempSpeed = petState.speed;
    petState.speed = 'swipe';

    const swipeDuration = pets[user_choice]['swipe_duration'];
    globalInterrupts.swipe = true;
    petState.isAction = true;

    setImage();
    setTimeout(() => {
        petState.speed = tempSpeed;
        petState.isAction = false;
        setImage();
        diagnosticPrint(`interrupts.js line 14: Completed`);
    }, swipeDuration);
}


function petDrop(event) {
    const tempSpeed = petState.speed;
    petState.speed = 'idle';

    globalInterrupts.drop = true;
    petState.isAction = true;

    setImage();

    petState.bottomValue = parseFloat(event.style.bottom);
    let offset = 0;
    
    function dropAnimation() {
        if (petState.bottomValue < 15) {
            petState.speed = tempSpeed;
            petState.isAction = false;
            globalInterrupts.drop = false;
            setImage();
            diagnosticPrint(`interrupt.js line 39: Completed pet drop`);
        } else {
            offset += 5;
            event.style.transform = `translateY(${offset}px)`;
            petState.bottomValue -= 5;
            requestAnimationFrame(dropAnimation);
        }
    }

    requestAnimationFrame(dropAnimation);
}