const viewport = {
    viewportWidth: document.documentElement.clientWidth,
    viewportHeight: document.documentElement.clientHeight
};


function reachedEdge() { //checks if the image is still in viewport during pet movement
    const rect = img.getBoundingClientRect();
    
    const maxLeft = 5;
    const maxRight = viewport.viewportWidth - 40;
    const maxTop = 20;
    const maxBottom = viewport.viewportHeight - 20;

    return (rect.left < maxLeft || rect.left > maxRight || rect.top < maxTop || rect.top > maxBottom);
}


function checkPosition(event) { //checks if the image is still in viewport during dragend
    const maxLeft = 20;
    const maxRight = viewport.viewportWidth - 40;
    const maxTop = 20;
    const maxBottom = viewport.viewportHeight - 20;

    return !(event.clientX < maxLeft || event.clientX > maxRight || event.clientY < maxTop || event.clientY > maxBottom);
}

