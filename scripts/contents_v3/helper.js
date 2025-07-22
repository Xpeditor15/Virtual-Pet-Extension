function terminateMovement(oriSpeed, movementSpeed) { //resets petState and sets the image and applies the transformation
    petState.speed = oriSpeed;
    petState.isAction = false;
    autoSetImage(oriSpeed, movementSpeed, petState.direction);
}


function calcPosition(event, edge, rect) { //calculates the edge values in event listeners
    let documentValue;
    let side;
    switch (edge) {
        case 'top':
            documentValue = document.documentElement.clientHeight;
            side = rect.top;
            break;
        
    }


}


function updatePosition(bottom, right) { //updates fromRight and fromBottom in petState
    petState.fromBottom = bottom;
    petState.fromRight = right;
}


function autoUpdatePosition() { //updates the position in petState without parameters given
    const rect = img.getBoundingClientRect();
    const right = document.documentElement.clientWidth - rect.right;
    const bottom = document.documentElement.clientHeight - rect.bottom;
    updatePosition(bottom, right);
}


function setTransformation(direction, speed) { //applies transformation onto the image
    let directionStr, speedStr;
    if (direction === 'left') directionStr = 'scaleX(-1)';
    else directionStr = 'scaleX(1)';
    
    speedStr = `translateX(${speed}px)`;
    img.style.transform = `${directionStr} ${speedStr}`;
}


function autoSetImage(imageSpeed, speed, direction) { //sets the image automatically and applies transformation
    setImage(imageSpeed);
    setTransformation(direction, speed);
}