/////// EMBEDDED SHARKFIN FUNCTIONS... put this at the end of the calling page
// ***************************************************************
// ADD SF IFRAME TO PAGE
// ***************************************************************
let sharkfinOpened = false;

// THIS IS THE IFRAME
const sharkfinPage = document.createElement('iframe');
console.log('embeddedSF', sharkfinPage)

// AFTER PARENT PAGE DOM LOADED
if (websiteTitle.id === 'VRP' || websiteTitle.id === 'WMSC') {
    appendSFelement();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        appendSFelement();
    })
}

checkForSFscript();

function checkForSFscript() {
    let isAppended = false;
    setTimeout(() => {
        document.querySelectorAll('iframe').forEach(frame => {
            if (frame.id) {
                console.log(String(frame.id))
                if (frame.id === 'embedded-sharkfin')
                    isAppended = true;
            }
        })

        if (!isAppended)
            appendSFelement();
    }, 4000);
}


// ***************************************************************
// LAUNCH THE SF PAGE 
// ***************************************************************
function launchSharkfin() {

    const iPadMobile =
        window.orientation >= -90 &&
        window.navigator.vendor.startsWith('Apple') &&
        window.navigator.userAgent.includes('Safari');

    // UNSCROLLABLE (this is already the parent)
    document.body.style.overflow = 'hidden';

    sharkfinOpened = true;

    sharkfinPage.contentWindow.postMessage('openSharkfin', '*');

    try {
        clearAnnotation();
    } catch (error) {
        console.warn(error)
    }

    setTimeout(() => {
        sharkfinPage.style.top = iPadMobile ? '21px' : '0px';
        sharkfinPage.style.opacity = 1;
        sharkfinPage.style.pointerEvents = 'all';

        document.querySelector('#embedded-sharkfin').focus()
    }, 0);
}

// ***************************************************************
// GET INCOMING MESSAGE to OPEN/CLOSE sharkfin iframe
// ***************************************************************
function receiveMessageSF(event) {
    const URL = 'https://h';

    if (event.origin.startsWith(URL) || event.origin.startsWith('http://127.0.0.1') || event.origin === 'null' || event.origin.startsWith('file://capgr') || event.origin.startsWith('http://local')) {
        if (event.data === 'sharkfinReady') {

            fadeUpSFButton();

            // try {
            //     if (websiteTitle.id === 'DCFF')
            //         DCFFadeMenuLaunch();
            // } catch (error) {

            // }

        } else if (event.data === 'closeSharkfin') {
            getFocus();
            closeSF();
        }

    } else {
        console.log('message received, but bad origin. event.origin =', event.origin)
    }
}

// ***************************************************************
// LISTEN FOR INCOMING MESSAGE
// ***************************************************************

if (window.addEventListener) {
    window.addEventListener("message", receiveMessageSF, false);
}
else {
    window.attachEvent("onmessage", receiveMessageSF);
}

// ***************************************************************
// RESIZE EVENT
// ***************************************************************

function doResizeSF() {
    getFocus();
    positionSharkfin();
}

window.addEventListener('resize', doResizeSF);

// ***************************************************************
// HELPERS
// ***************************************************************
function fadeUpSFButton() {
    const sf = document.getElementById('sharkfin-btn')
    if (sf) {
        setTimeout(() => {
            sf.style.opacity = 1;
            sf.style.cursor = 'pointer';
            sf.addEventListener('click', launchSharkfin)
        }, 100);
    }
}

function closeSF() {
    sharkfinPage.style.top = window.innerHeight + 20 + 'px';

    try {
        clearAnnotation();
    } catch (error) {
        console.warn(error)
    }

    setTimeout(() => {
        document.body.style.overflow = 'unset';
        sharkfinOpened = false;
        sharkfinPage.style.opacity = 0;
        sharkfinPage.style.pointerEvents = 'none';

    }, 700);
}

//FOCUS BACK TO THE PARENT
function getFocus() {

    setTimeout(() => {
        window.focus()

        if (document.querySelector('.p-title-wrapper'))
            document.querySelector('.p-title-wrapper').click()
        else {
            document.querySelector('body').click()
        }

    }, 1000);
}

function positionSharkfin() {
    if (!sharkfinOpened) {
        sharkfinPage.style.top = window.innerHeight + 20 + 'px';
        sharkfinPage.style.opacity = 0;
        sharkfinPage.style.pointerEvents = 'none';
    }
}

// function DCFFadeMenuLaunch() {
//     const headerItems = document.querySelectorAll('.nav-link-section > button')

//     if (headerItems) {
//         headerItems.forEach((item, i) => {
//             if (i === 2) {
//                 item.removeAttribute('onClick');
//                 item.addEventListener('click', launchSharkfin);
//             }
//         })
//     } else {
//         console.error('timeline item missing')
//     }
// }

function appendSFelement() {
    console.log('appending SF')
    // SET SF IFRAME PROPERTIES
    sharkfinPage.id = 'embedded-sharkfin'
    sharkfinPage.style.top = window.innerHeight + 'px'; // ANIMATES UP FROM BOTTOM OF SCREEN

    // APPEND
    document.body.append(sharkfinPage);

    getFocus();

    // SET SOURCE AFTER APPEND
    setTimeout(() => {
        try {
            if (websiteTitle.id === 'FT') {
                sharkfinPage.src = './js/sharkfin/zindex.html';
            } else {
                sharkfinPage.src = './Fund Tiles/js/sharkfin/zindex.html';
            }
        } catch (error) {
            sharkfinPage.src = './Fund Tiles/js/sharkfin/zindex.html';
        }
    }, 100);
}