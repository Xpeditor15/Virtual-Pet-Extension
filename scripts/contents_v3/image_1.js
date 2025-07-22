const petImage = {
    idle: `images/${pet}/${pet}_idle_8fps.gif`,
    walk: `images/${pet}/${pet}_walk_8fps.gif`,
    run: `images/${pet}/${pet}_run_8fps.gif`,
    jump: `images/${pet}/${pet}_walk_fast_8fps.gif`,
    swipe: `images/${pet}/${pet}_swipe_8fps.gif`
}


function setImage(speed, direction) {
    let source = petImage[speed] || petImage['idle'];

    img.src = chrome.runtime.getURL(source);

    if (direction === 'left') {
        img.style.transform = 'scaleX(-1)';
    } else if (direction === 'right') {
        img.style.transform = 'scaleX(1)';
    } else {
        diagnosticPrint(`images.js line 20: Invalid direction`);
    }
}