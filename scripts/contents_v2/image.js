const petImages = {
    idle: `images/${pet}/${pet}_idle_8fps.gif`,
    walk: `images/${pet}/${pet}_walk_8fps.gif`,
    run: `images/${pet}/${pet}_run_8fps.gif`,
    fast: `images/${pet}/${pet}_walk_fast_8fps.gif`,
    swipe: `images/${pet}/${pet}_swipe_8fps.gif`,
}


function setImage() {
    let source = petImages[petState.speed];

    if (!source) {
        petState.speed = 'idle';
        source = petImages['idle'];
        diagnosticPrint(`image.js line 16: Defaulting to idle image`);
    } else {
        diagnosticPrint(`image.js line 18: Source: ${source}`);
    }

    img.src = chrome.runtime.getURL(source);

    if (petState.direction === 'left') {
        img.style.transform = 'scaleX(-1)';
    } else if (petState.direction === 'right') {
        img.style.transform = 'scaleX(1)';
    }
}