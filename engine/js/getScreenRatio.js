getScreenRatio();

function getScreenRatio() {
    const ratio = window.innerHeight / window.innerWidth;

    const iPadMobile =
        window.orientation >= -90 &&
        window.navigator.vendor.startsWith('Apple') &&
        window.navigator.userAgent.includes('Safari');

    // const isPad = Math.round(window.innerWidth / window.innerHeight * 1000) / 1000 === 1.333 && iPadMobile;
    console.log('screen ratio:', Math.round(window.innerWidth / window.innerHeight * 1000) / 1000, iPadMobile)

    if (Math.round(ratio * 100) === 56 || isFullScreen()) {
        // hideGrayBG();
    } else {
        // showGrayBG();
    }

    // if (iPadMobile) {
    //     document.getElementById('content-padding').style.paddingBottom = '72.5%'
    // } else 

    if (ratio * 100 < 55) {
        document.getElementById('content-padding').style.paddingBottom = ratio * 100 + '%'
    } else if (ratio * 100 < 51) {
        document.getElementById('content-padding').style.paddingBottom = '51%'
    } else {
        document.getElementById('content-padding').removeAttribute('style')
    }
}

function hideGrayBG() {
    const mfEl = document.getElementById('master-float');
    // mfEl.style.backgroundColor = 'red';
    mfEl.style.padding = '0px';
}

function showGrayBG() {
    const mfEl = document.getElementById('master-float');
    // mfEl.style.backgroundColor = '#CCC';
    mfEl.style.padding = '0 1%';
}

function isFullScreen() {
    const isFullScreen = Math.abs(window.innerWidth - screen.width) <= 1 && Math.abs(window.innerHeight - screen.height) <= 1;

    if (isFullScreen) console.log('fullscreen')
    else console.log('not fullscreen')

    return isFullScreen;
}

window.addEventListener('resize', () => {
    getScreenRatio();
});