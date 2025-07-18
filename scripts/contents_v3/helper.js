function terminateMovement(speed) { //resets petState and sets the image 
    petState.speed = speed;
    petState.isAction = false;
    setImage(petState.speed, petState.direction);
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