const viewport = {
    viewportWidth: document.documentElement.clientWidth,
    viewportHeight: document.documentElement.clientHeight
}


function checkPosition(event) { //checks if image is still in viewport during user drag
    const maxLeft = 20;
    const maxRight = viewport.viewportWidth - 20;
    const maxTop = 20;
    const maxBottom = viewport.viewportHeight - 20;
    return !(event.clientX < maxLeft || event.clientX > maxRight || event.clientY < maxTop || event.clientY > maxBottom);
}


function reachedEdge() { //checks if image is still in viewport during pet movement
    const maxLeft = 5;
    const maxRight = viewport.viewportWidth - 40;
    const maxTop = 20;
    const maxBottom = viewport.viewportHeight - 20;

    const rect = img.getBoundingClientRect();

    return (rect.left < maxLeft || rect.left > maxRight || rect.top < maxTop || rect.top > maxBottom);
}