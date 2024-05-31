// PARENT FUNCTIONS FOR THE PAGE THAT IS INSERTING THE FUND TILE IFRAME
// THIS CODE LIVES IN THE PAGE THAT IS LAUNCHING THE FUND TILES
let fundTilesLoaded = false;

// ADD FUND TILE CSS
const FTSTYLES = document.createElement('link');
FTSTYLES.href = './Fund Tiles/css/fundTile.css';
FTSTYLES.type = 'text/css';
FTSTYLES.rel = 'stylesheet';
document.head.appendChild(FTSTYLES);

// DEFAULT CLASS TO LAUNCH FT 
const fundTileLaunchEl = '.fund-launcher';

// LAUNCH A FUND FROM THE MENU (WHEN YA PRESS M)
const MENU_TILES_LAUNCHER = '.menu-fund-box.active';

///////////////////////////////////////////////////////
window.fundPageOpened = false;

// THIS IS THE IFRAME
const fundPage = document.createElement('iframe');

// AFTER PARENT PAGE BUILT
// document.addEventListener('DOMContentLoaded', () => {

// THIS IS THE IFRAME
fundPage.id = 'fund-page'
fundPage.style.top = window.innerHeight + 'px'; // ANIMATES UP FROM BOTTOM OF SCREEN

document.body.append(fundPage);

setTimeout(() => {
    fundPage.src =
        './Fund Tiles/fund-page-template.html';
}, 100);
//})

////////////////////////
// LAUNCHING THE FUND TILE from the fullscreen menu
function launchFundTile(info = null) {
    // UNSCROLLABLE (this is already the parent)
    // document.body.style.overflow = 'hidden';

    window.fundPageOpened = true;

    fundPage.style.display = 'block';

    if (info.id && info.fundClass) {
        fundPage.contentWindow.postMessage({ id: info.id, fundClass: info.fundClass }, '*');
    } else if (info.id) {
        fundPage.contentWindow.postMessage({ id: info.id }, '*');
    } else {
        fundPage.contentWindow.postMessage({ id: this.innerText.split('\n')[0] }, '*');
    }
}

function revealFundTile() {
    const iPadMobile =
        window.orientation >= -90 &&
        window.navigator.vendor.startsWith('Apple') &&
        window.navigator.userAgent.includes('Safari');

    fundPage.style.top = iPadMobile ? '21px' : '0px';
    // document.querySelector('#fund-page').focus()
}

/////////////////////////////////////////////////////////

// GET INCOMING MESSAGE to close iframe
function receiveMessage(event) {
    const URL = 'https://h';

    if (event.origin.startsWith(URL) || event.origin.startsWith('http://127.0.0.1') || event.origin === 'null' || event.origin.startsWith('file://capgr') || event.origin.startsWith('http://localhost')) {
        if (event.data === 'ready') {
            // LISTENERS FOR EACH BOX ADDED AFTER PAGE BUILDER IS LOADED AND READY
            document.querySelectorAll(fundTileLaunchEl).forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.cursor = 'pointer';
                    el.style.pointerEvents = 'all';

                }, i * 70 + 100);
            });

            // LAUNCH A FUND FROM THE MENU (WHEN YA PRESS M)
            document.querySelectorAll(MENU_TILES_LAUNCHER).forEach(fund => {
                fund.style.opacity = 1;
                fund.style.pointerEvents = 'all';
                fund.style.cursor = 'pointer';
                fund.addEventListener('click', launchFundTile)
            })

            fundTilesLoaded = true;

        } else if (event.data === 'close') {
            // CLOSE THE FUND PAGE
            fundPage.style.top = window.innerHeight + 'px';
            setTimeout(() => {
                // document.body.style.removeProperty('overflow');
                window.fundPageOpened = false;
                fundPage.style.display = 'none';
            }, 700);
        } else if (event.data === 'open') {
            revealFundTile();
        }

    } else {
        console.error('message received, but bad origin. event.origin =', event.origin)
    }
}

// LISTEN FOR INCOMING MESSAGE
if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", receiveMessage, false);
}
else {
    window.attachEvent("onmessage", receiveMessage);
}





// WHAT ABOUT SHARKFIN BOYS?
const addSFscript = document.createElement('script');
addSFscript.type = 'text/javascript';
addSFscript.defer = true;
addSFscript.async = false;
addSFscript.src = './Fund Tiles/js/sharkfin/embeddedSFforReact.js';
document.head.appendChild(addSFscript);

// ADD SF STYLES
const SFSTYLES = document.createElement('link');
SFSTYLES.href = './Fund Tiles/js/sharkfin/embeddedSF.css';
SFSTYLES.type = 'text/css';
SFSTYLES.rel = 'stylesheet';
document.head.appendChild(SFSTYLES);