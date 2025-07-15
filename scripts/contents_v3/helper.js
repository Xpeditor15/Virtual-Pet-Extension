function checkDirection() { //checks if the pet has reached edge and changes direction accordingly
    if (reachedEdge()) {
        if (petState.direction === 'right') petState.direction = 'left';
        else if (petState.direction === 'left') petState.direction = 'right';
        setImage(petState.speed, petState.direction);
        diagnosticPrint(`movement.js line 5: Reached edge, change direction to ${petState.direction}`);
    }
}


function terminateMovement(tempSpeed) { //terminates the movement after dropping and swiping
    petState.speed = tempSpeed;
    petState.isAction = false;
    setImage(petState.speed, petState.direction);
}