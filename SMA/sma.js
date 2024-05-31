// PARENT FUNCTIONS FOR THE PAGE THAT IS INSERTING THE SMA IFRAME
// THIS CODE LIVES IN THE PAGE THAT IS LAUNCHING THE SMA

let smaOpened = false;

// THIS IS THE IFRAME
const smaPage = document.createElement('iframe');

// AFTER PARENT PAGE BUILT
document.addEventListener('DOMContentLoaded', () => {

    // THIS IS THE IFRAME
    smaPage.id = 'etf-page';
    smaPage.style.position = 'absolute';
    smaPage.style.width = '100%';
    smaPage.style.height = '100%';
    smaPage.style.overflow = 'hidden';
    smaPage.style.zIndex = 328;
    smaPage.style.transition = '.7s top ease-in-out';
    smaPage.style.pointerEvents = 'none';
    smaPage.style.opacity = 0;
    smaPage.style.border = 'none';
    // smaPage.style.display = 'none';
    smaPage.style.backgroundColor = '#F8F8F8'
    smaPage.style.top = window.innerHeight + 'px'; // ANIMATES UP FROM BOTTOM OF SCREEN


    // document.body.append(smaPage);
    document.getElementById('nav-container').append(smaPage);

    setTimeout(() => {
        smaPage.src =
            './SMA/sma.html';
    }, 200);
})

////////////////////////
// LAUNCHING THE SMA iframe
function launchSMApage() {
    // UNSCROLLABLE (this is already the parent)
    // document.body.style.overflow = 'hidden';

    smaOpened = true;
    window.smaOpened = true;

    smaPage.contentWindow.postMessage(this.innerText, '*');

    setTimeout(() => {

        try {
            closeMenu();
        } catch (error) {
            console.warn(error)
        }
    }, 1700);
}

function revealSMApage() {

    // smaPage.style.display = 'block';
    smaPage.style.opacity = 1;
    smaPage.style.pointerEvents = 'all'

    setTimeout(() => {
        smaPage.style.top = '0px';
        setSMAheight();

    }, 0);
}

function setSMAheight() {
    const container = document.getElementById('master-container');

    // smaPage.style.top = container.getBoundingClientRect().top + 'px';
    smaPage.style.height = container.clientHeight + 'px';
}

/////////////////////////////////////////////////////////

// GET INCOMING MESSAGE to close iframe
function receiveMessage(event) {
    const URL = 'https://h';

    if (event.origin.startsWith(URL) || event.origin.startsWith('http://127.0.0.1') || event.origin === 'null' || event.origin.startsWith('file://capgr') || event.origin.startsWith('http://localhost')) {

        if (event.data === 'SMAready') {

            // LISTENERS FOR EACH BOX ADDED AFTER PAGE BUILDER IS LOADED AND READY
            document.querySelectorAll('.sma').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.cursor = 'pointer';
                    el.style.pointerEvents = 'all'
                    el.addEventListener('click', launchSMApage)

                    try {
                        setTimeout(() => {
                            el.removeEventListener('click', launchFundTile)
                        }, 5000);
                    } catch (error) {
                        console.warn(error)
                    }
                }, i * 70 + 100);
            });


        } else if (event.data === 'closeSMA') {

            // CLOSE THE SMA PAGE
            smaPage.style.top = window.innerHeight + 20;
            setTimeout(() => {
                smaPage.style.top = window.innerHeight + 20 + 'px';
                closeAnnotationUI();
                setTimeout(() => {
                    // document.body.style.overflow = 'unset';
                    smaOpened = false;
                    window.smaOpened = false;

                    // etfPage.style.display = 'none';
                    smaPage.style.opacity = 0;
                    smaPage.style.pointerEvents = 'none'

                    clearAnnotation();
                }, 700);
            }, 10);
        } else if (event.data === 'openSMA') {
            clearAnnotation();
            revealSMApage();
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


window.addEventListener('resize', () => {
    if (!smaOpened)
        smaPage.style.top = window.innerHeight + 20 + 'px';
    else {
        setSMAheight();
    }
});
