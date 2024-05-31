// ****************************************************************************************************************************** //
// FOCUS PAGE ON LOAD
// ****************************************************************************************************************************** //
pageFocus();

// SETS FOCUS ON APP
function pageFocus() {
    setTimeout(() => {
        document.getElementById('master-float').focus();
    }, 250);
}


// ****************************************************************************************************************************** //
// CREATES UNIQUE SESSION ID
// ****************************************************************************************************************************** //
function createSessionId() {
    let dt = Date.now();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let randNum = ((dt + Math.random() * 16) % 16) | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? randNum : (randNum & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

// CREATE SESSION IF ONE DOESN'T EXIST
if (!JSON.parse(window.sessionStorage.getItem('userSessionID'))) {
    window.sessionStorage.setItem('userSessionID', JSON.stringify(createSessionId()));
}


// ****************************************************************************************************************************** //
// LISTENS FOR KEYBOARD INPUT
// ****************************************************************************************************************************** //
document.addEventListener('keydown', function (event) {

    // OPEN ERROR WINDOW BY SCROLLING DOWN, THEN PRESSING: SHIFT E
    if (document.querySelector('#errorDiv')) {
        console.log(event.shiftKey, event.key)
        if (event.shiftKey === true && event.key === 'E') {
            console.log('erroring')

            if (document.getElementById('disclosure-wrapper') && document.getElementById('content-padding').scrollTop >= document.getElementById('disclosure-wrapper').clientHeight) {
                console.log(document.getElementById('content-padding').scrollTop, document.getElementById('disclosure-wrapper').clientHeight)
                document.getElementById('errorDiv').style.opacity = 1
                errorDiv.style.pointerEvents = 'all'
            }
            else if (!document.getElementById('disclosure-wrapper'))
                document.getElementById('errorDiv').style.opacity = 1
            errorDiv.style.pointerEvents = 'all'
        } else {
            document.getElementById('errorDiv').style.opacity = 0
            errorDiv.style.pointerEvents = 'none'
        }
    }

    // OPEN DEBUG WINDOW BY SCROLLING DOWN, THEN PRESSING Q then R
    if (document.querySelector('#reportDiv')) {
        if (event.key.toLowerCase() === 'r') {
            if (document.querySelector('#reportDiv').style.display === 'none') {
                showDebugWindow();
            } else {
                document.querySelector('#reportDiv').remove();
            }
        } else {
            document.querySelector('#reportDiv').remove();
        }
    } else if (event.key.toLowerCase() === 'q') {
        console.log(document.getElementById('content-padding').scrollTop, document.getElementById('content-padding').clientHeight)

        if (document.getElementById('content-padding').scrollTop >= document.getElementById('disclosure-wrapper').clientHeight)
            addDebugWindowToPage();
    }

    if (event.key.toLowerCase() === 'i') {
        if (document.querySelector('#info-overlay-container').style.display === 'none') {
            openInfoUI();
        } else {
            closeInfoUI();
        }
    }

    // H FOR INDEX
    if (window.location.href.match(/([^/]*)$/)[0] != 'index.html' && event.key.toLowerCase() === 'h') {
        fadeToNextPage('home');
        trackAnalytics('H-key pressed');
    }

    // TOGGLES SIDEBAR MENU WITH 'M'
    if (event.key.toLowerCase() === 'm') {
        toggleMainMenu();
        trackAnalytics('M-key: toggle menu');
    }

    // LISTENS FOR LEFT AND RIGHT ARROW KEYS ***********************8
    // LEFT ARROW
    if (event.key === 'ArrowLeft') {
        trackAnalytics(event.key);

        if (document.getElementById('back-arrow') && document.getElementById('back-arrow').getAttribute('href')) {
            fadeToNextPage('left');
        }
    }

    // RIGHT ARROW
    if (event.key === 'ArrowRight') {
        trackAnalytics(event.key);
        const NEXT = document.getElementById('forward-arrow');

        if (NEXT) {
            const href = NEXT.getAttribute('href');
            if (href && href !== '#') {
                fadeToNextPage('right');
            }
        }
    }

    // JUMP TO PAGE POSITIONS ****************************
    // 'D' OR DOWN-ARROW PRESSED
    if (event.key.toLowerCase() === 'd') {

        // EXCEPTION WHEN FUND PAGE IS OPEN
        if (document.getElementById('fund-page') && fundPageOpened) {
            document.getElementById('fund-page').contentWindow.jumpToDisclosures();
        } else if (document.getElementById('plan-page') && planPageOpened) {
            document.getElementById('plan-page').contentWindow.jumpToDisclosures();
        } else {
            jumpToDisclosures();
        }
        trackAnalytics('d-key');
    }

    // UP-ARROW PRESSED
    if (event.key === 'ArrowUp') {
        event.preventDefault();

        // EXCEPTION WHEN FUND PAGE IS OPEN
        if (document.getElementById('fund-page') && fundPageOpened) {
            document.getElementById('fund-page').contentWindow.scrollToTop();
        } else if (document.getElementById('plan-page') && planPageOpened) {
            document.getElementById('plan-page').contentWindow.scrollToTop();
        } else {
            const PAGE = document.getElementById('content-padding');
            PAGE.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });

            // THIS WORKED
            // document.getElementById('main-page-content').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

            // THIS WORKED WITH JQUERY
            // PAGE.scrollToTop();
            // return
            // $(PAGE).animate({ scrollTop: 0 }, 700, 'swing');
        }

        trackAnalytics(`up-arrow`);
    }
});

// helper
function showDebugWindow() {
    document.querySelector('#reportDiv').style.opacity = 1;
    document.querySelector('#reportDiv').style.display = 'block';
}

// helper
function addDebugWindowToPage() {
    const reportDiv = document.createElement('div');
    reportDiv.id = 'reportDiv';
    reportDiv.style.display = 'none';
    reportDiv.style.zIndex = '21';
    reportDiv.style.top = '0';
    reportDiv.style.position = 'absolute';
    reportDiv.onclick = () => document.querySelector('#reportDiv').remove();

    reportDiv.innerHTML = `
                <div style='width: fit-content; min-width: fit-content; height: 210px; white-space: nowrap; position: absolute; cursor: pointer; 
                    top: ${document.querySelector('body').offsetHeight - 255}px; font-size: 16px; padding: 25px;
                    left: 30px; border: 1px solid grey; background-color: white; '>
                    <div style='display:flex; justify-content:space-between; align-items: center; height: 20px;'>
                        <div style='display: flex;'>
                            <p><span style='font-size: 11px;'>WIDTH:</span> <span style='font-weight:700;'>${window.innerWidth}px</span></p>
                            <p style='margin-left: 15px; font-weight: 700;'><span style='font-size: 11px; font-weight:100;'>HEIGHT:</span> ${window.innerHeight}px</p>
                        </div>
                        <p style='font-size:11px; letter-spacing: .5px;'>CLICK TO CLOSE. OR PRESS ANY KEY.</p>
                    </div>
                    <p><span style='font-size: 11px;'>BROWSER VENDOR:</span> ${window.navigator.vendor}</p>
                    <p><span style='font-size: 11px;'>USER AGENT:</span> ${window.navigator.userAgent}</p>
                    <p><span style='font-size: 11px;'>WINDOW ORIENTATION:</span> ${window.orientation}</p>
                    <p><span style='font-size: 11px;'>PLATFORM:</span> ${window.navigator.platform}</p>
                </div>
            `;

    document.body.appendChild(reportDiv);
}


// ****************************************************************************************************************************** //
// jumpToDisclosures
// ****************************************************************************************************************************** //
function jumpToDisclosures() {
    // const PAGE = document.getElementById('content-padding');
    const DISCLOSURE = document.getElementById('disclosure-wrapper');
    // const MAINPAGE = document.getElementById('main-page-content');
    // const TOPSECTION = document.querySelector('.title-wrapper-a');
    // const TL = document.getElementById('header-timeline');

    // const JUMP = MAINPAGE.clientHeight + TOPSECTION.clientHeight + TL.clientHeight - DISCLOSURE.clientHeight;

    // PAGE.scroll();

    DISCLOSURE.scrollIntoView({ behavior: "smooth", block: "start" });
}


// ****************************************************************************************************************************** //
// TURN ON FADE WHEN LEAVING PAGE
// ****************************************************************************************************************************** //
function fadeToNextPage(key) {
    if (key === 'left') {
        window.location.href = document.querySelector('#back-arrow').getAttribute('href');
    } else if (key === 'right') {
        window.location.href = document.querySelector('#forward-arrow').getAttribute('href');
    } else if (key === 'home') {
        window.location.href = './index.html';
    }
    // }
}

// ****************************************************************************************************************************** //
// ANALYTICS
// ****************************************************************************************************************************** //
function trackAnalytics(event) {
    return;
    const payload = {
        event: event,
        page: window.location.href.match(/([^/]*)$/)[0],
        sesh_id: JSON.parse(window.sessionStorage.getItem('userSessionID')),
        date: new Date()
    };

    //******************************************************************* */
    // let sessionLog = JSON.parse(window.sessionStorage.getItem('sessionLog'));

    // if (sessionLog === null) {
    //   sessionLog = [];
    // }
    // sessionLog.push(payload);
    // window.sessionStorage.setItem('sessionLog', JSON.stringify(sessionLog));
    //******************************************************************* */

    $.post('http://localhost:8000', payload, (res, status) => {
        console.log('res:', res, '! status:', status);
    });
};


// ****************************************************************************************************************************** //
// CLICK HELPERS
// ****************************************************************************************************************************** //

// BACK ARROW CLICKED
function prevBtnClick() {
    // document.getElementById('cover').style.transition = '.3s opacity ease-in-out';
    // document.getElementById('cover').style.opacity = 1;

    setTimeout(() => {
        trackAnalytics(`Clicked Back Arrow`);
        window.location.href = document.querySelector('#back-arrow').getAttribute('href');
    }, 200);
}

// NEXT ARROW CLICKED
function nextBtnClick() {
    // document.getElementById('cover').style.transition = '.3s opacity ease-in-out';
    // document.getElementById('cover').style.opacity = 1;

    setTimeout(() => {
        trackAnalytics(`Clicked Next Arrow`);
        window.location.href = document.querySelector('#forward-arrow').getAttribute('href');
    }, 200);
}

// TIMELINE LINK CLICKED
function timelineClick(link) {
    trackAnalytics(`TL link: '${link}' clicked`);
    window.location.href = link;
}


// TOP SIDEBAR TITLE CLICKED TO RETURN TO LANDING PAGE
function backHome() {
    trackAnalytics('Clicked CG LOGO from menu, back home');
    window.location.href = 'index.html';
}

// SECTION HEADER CLICKED IN SIDEBAR
function sbHeaderClick(link) {
    window.location.href = link;
    trackAnalytics(`Sidedbar header clicked: '${link}'`);
}

// SIDEBAR LI CLICKED
function sbLIclicked(link) {
    window.location.href = link;
    trackAnalytics(`Sidedbar LI clicked: '${link}'`);
}

// TRACK PAGE VIEW CALLED ON EACH PAGE
trackAnalytics('view');



// ****************************************************************************************************************************** //
// CATCH ERRORS
// ****************************************************************************************************************************** //

window.addEventListener('error', (e) => addErrorsWindowToPage(e))
let numberOfErrors = 0;

// helper
function addErrorsWindowToPage(e) {

    if (numberOfErrors > 0) {
        // append
        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
                <p>
                    <span class='bold'>msg:</span> ${e.message}
                    <br>
                    <span class='bold'>src:</span> ${e.filename}
                    <span class='bold'>line num:</span> ${e.lineno}
                    <span class='bold'>col num:</span> ${e.colno}
                    <span class='bold'>err:</span> ${e.error}
                </p>
                `
        document.querySelector('#errorDiv').appendChild(newDiv);
    } else {
        numberOfErrors++

        // add window
        const errorDiv = document.createElement('div');
        errorDiv.id = 'errorDiv';
        errorDiv.style.opacity = 0;
        errorDiv.style.transition = '.3s opacity'
        errorDiv.style.zIndex = '21';
        errorDiv.style.top = '10%';
        errorDiv.style.left = '3%';
        errorDiv.style.position = 'absolute';
        errorDiv.style.backgroundColor = 'rgba(255,255,255,.9';
        errorDiv.style.width = '96%';
        errorDiv.style.paddingLeft = '1%';
        errorDiv.style.pointerEvents = 'none'
        errorDiv.style.border = '1px solid grey'
        errorDiv.onclick = () => {
            document.querySelector('#errorDiv').style.opacity = 0;
            document.querySelector('#errorDiv').style.pointerEvents = 'none'
        }

        errorDiv.innerHTML = `
        <p>
            <span class='bold'>msg:</span> ${e.message}
            <br>
            <span class='bold'>src:</span> ${e.filename}
            <span class='bold'>line num:</span> ${e.lineno}
            <span class='bold'>col num:</span> ${e.colno}
            <span class='bold'>err:</span> ${e.error}
        </p>
            `;

        document.body.appendChild(errorDiv);
    }




}






