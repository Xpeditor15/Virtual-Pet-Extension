function checkDirection() {
    if (reachedEdge()) {
        petState.direction = petState.direction === 'left' ? 'right' : 'left';
        setImage();
        diagnosticPrint(`helper.js line 5: Reached edge, changing direction to ${petState.direction}`);
    }
}