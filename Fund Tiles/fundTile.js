// PARENT FUNCTIONS FOR THE PAGE THAT IS INSERTING THE FUND TILE IFRAME
// THIS CODE LIVES IN THE PAGE THAT IS LAUNCHING THE FUND TILES
// FOR EXAMPLE, IT COULD BE ADDED TO index.html (if the full screen menu there has FTs to click on)

// fundTile.js appends the FT page as an iframe to the page that runs the fundTile.js script
// the fund tile iframe can be thought of as a child to the parent page to which it is appended
// the parent page will be a normal page in our project (index.html, one-01.html, one-02.thml, etc)

// it's important that the fund tiles box (that the user clicks on to lauch the fund tiles)...
// IS NOT CLICKABLE (it SHOULD be faded out) UNTIL AFTER THE FUND TILES PAGE IS APPENDED TO THE DOM
// AND THE SRC OF THE APPENDED FUND TILES PAGE (IFRAME) IS SET, AND THAT PAGE IS LOADED AND READY.
// IT SHOULD NOT BE CLICKABLE BY DEFAULT!!!
// OTHERWISE THE USER MAY TRY TO LAUNCH THE FUND TILES BY CLICKING ON A PAGE ELEMENT AND NOTHING WILL HAPPEN. THAT'S NOT A GOOD UX.
// fundTile.js will make these FT launcher elements full opacity and clickable when the FT iframe is ready
// fudTile.js will also add the function to launch FT to these elements (as needed)
// and fundTile.js also controls closing the FT iframe

// there is a parent/child relationship between the FT iframe and its "embeddor"
// these two pages need to talk to each other
// this is done using the postMessage JS function to send messages:
//      fundPage.contentWindow.postMessage({ id: info.id }, '*');
// and listening for these messages with the JS listener "message":    
//      window.addEventListener("message", receiveMessage, false);


// *******************************************************************
// *******************************************************************
// THIS FILE fundTile.js can be added to the index.html page (or whatever page) by adding a variable to the head tag of that HTML page...
// this script tag looks like this...
// <script>
//     const addFundTiles = true;
// </script>
// IMO this is easier than a standard <script src='./locationOfMyScript.fundTiles.js'></script>, but that would also work

// so the head would look like this...
// *******************************************************************
// <head>
//    <meta charset="UTF-8">
//    <meta name="viewport" content="initial-scale = 1, user-scalable = no" />
//
//    <link href="./engine/css/normalize.css" rel="stylesheet" type="text/css" />
//    <link href="./engine/css/master.css" rel="stylesheet" type="text/css">
//
//    <!-- websiteInfo -->
//    <script src="./websiteInfo.js" type="text/javascript"></script>
//
//    <!-- ADD FUND TILES -->
//    <script>
//        const addFundTiles = true;
//    </script>
//
//    <!-- Add Scripts -->
//    <script defer src="./engine/js/init.js"></script> 
// *******************************************************************
// *******************************************************************
// *******************************************************************



let fundTilesLoaded = false;

// ADD FUND TILE CSS
const FTSTYLES = document.createElement('link');
FTSTYLES.href = './Fund Tiles/css/fundTile.css';
FTSTYLES.type = 'text/css';
FTSTYLES.rel = 'stylesheet';
document.head.appendChild(FTSTYLES);

// DEFAULT CLASS TO LAUNCH FT IS:'.fund-component';
// YOU CAN ADD THE fund-component CLASS TO ELEMENTS ON YOUR PAGE, AND THIS SCRIPT WILL MAKE THOSE ELEMENTS FULL OPACITY
// AND ADD pointer-events: all; TO THOSE TO MAKE THEM CLICKABLE.

// THERE IS AN EXCEPTION FOR THE DF FOCUS FUNDS PAGE
// DCFF LAUNCHERS
// THIS SETS UP THE CLICKED CLASS FOR THE ELEMENT THAT WILL LAUCNCH OUR TILE
const urlPage = window.location.href.split('/').slice(-1)[0];
const DCFFstyleBoxPage = window.VC_infoID === 'DCFF' && urlPage === "three-04.html" || window.VC_infoID === 'DCFF' && urlPage === "two-04.html";
const DCFFfundTilePage = window.VC_infoID === 'DCFF' && urlPage === "three-07.html";
const DCFFlaunchElement = DCFFstyleBoxPage ? '.dc-launch' : DCFFfundTilePage ? '.dc-col-fund-box' : '.dc-col-fund-box';

// SET LAUNCH ELEMENT DEPENDING ON WHAT PROJECT WE ARE USING
const launchElement = window.VC_infoID === 'DCFF' ? DCFFlaunchElement : '.fund-component';

///////////////////////////////////////////////////////
// THIS IS THE FUND TILES IFRAME, WE ARE APPENDING IT TO THE PAGE HERE
// AND WE SET THE SRC
// AFTER SRC IS SET THE DOM IS BUILT FOR THIS PAGE/IFRAME
// AFTER IT'S BUILT IT SENDS A MESSAGE BACK TO THIS PAGE (index.html for example)
// AND WE WILL LISTEN FOR THAT MESSAGE IN THIS CODE BELOW
///////////////////////////////////////////////////////

let fundPageOpened = false;

// THIS IS THE IFRAME
const fundPage = document.createElement('iframe');

// AFTER PARENT PAGE BUILT
// document.addEventListener('DOMContentLoaded', () => {

// THIS IS THE IFRAME
fundPage.id = 'fund-page'
fundPage.style.top = window.innerHeight + 'px'; // ANIMATES UP FROM BOTTOM OF SCREEN

document.body.append(fundPage);

// SET SRC, NOW WE WAIT FOR THIS PAGE TO SEND A MESSAGE THAT IT'S DOM IS BUILT AND READY
setTimeout(() => {
    fundPage.src =
        './Fund Tiles/fund-page-template.html';
}, 100);
//})

////////////////////////
// LAUNCHING THE FUND TILE
function launchFundTile(info = null) {

    fundPageOpened = true;
    fundPage.style.display = 'block';

    // here we are going to send a message down to our fund page (iframe)
    // this will trigger it to open the page, for a given fund (and given share class if we want)
    if (info.id && info.fundClass) {
        // in this case this function has bee called like so: 
        // launchFundTile({id: 'AMCAP', fundClass: 'F2'})
        // as you can open specific share classes with this method
        fundPage.contentWindow.postMessage({ id: info.id, fundClass: info.fundClass }, '*');
    } else if (info.id) {
        // in this case this function has bee called like so: 
        // launchFundTile({id: 'AMCAP'})
        // so you can pass in a specific fund id to launch that fund
        fundPage.contentWindow.postMessage({ id: info.id }, '*');
    } else {
        // CHECK THIS OUT, IT'S IMPORTANT
        // IF launchFundTile is called like this: launchFundTile()
        // then we simply get the inner text of the first child from the html element which called it...
        // this text MUST BE the id of the fund for that fund tile (ex: AMCAP, GBAL, etc)
        // meaning, you can (and may often need to add) an invisible & non-clickable span to be the first tag of the element
        // that has this function attached as an event listenter
        // this is the most recent way of launching the FT
        fundPage.contentWindow.postMessage({ id: this.innerText.split('\n')[0] }, '*');
    }

    // if we launched the FT from the menu, we will close the menu after the FT is open
    // there used to be a legacy method (pretty sure it's closeSidebar, not closeMenu)
    setTimeout(() => {
        try {
            closeSidebar();
        } catch (error) {
            console.warn(error)
        }

        try {
            closeMenu();
        } catch (error) {
            console.warn(error)
        }
    }, 4000);
}

// THIS IS FOR DCFF
function DCFFstyleBoxLaunch() {
    // UNSCROLLABLE (this is already the parent)
    // document.body.style.overflow = 'hidden';

    fundPageOpened = true;

    fundPage.style.display = 'block';
    const fundId = this.id.split('-').slice(-1)[0];
    fundPage.contentWindow.postMessage({ id: fundId }, '*');
}

// THE launchFundTile() FUNCTION ABOVE SENDS A MESSAGE TO THE FT PAGE,
// THE FT PAGE (iframe/child) THEN FINDS THE DATA FOR THAT FUND, AND IS THEN READY TO BUILD AND DISPLAY THAT PAGE
// AT THAT POINT THE FT PAGE SENDS A MESSAGE BACK TO THE PARENT (which would be index.html or whatever.html)
// AND WE RECEIVE THAT MESSAGE BELOW IN THE ELSE IF STATMENT: else if (event.data === 'open') 
// AND THEN WE BRING UP THE FUND TILE FROM THE BOTTOM OF THE SCREEN WITH THIS FUNCTION
function rollUpTheFundTile() {
    const iPadMobile =
        window.orientation >= -90 &&
        window.navigator.vendor.startsWith('Apple') &&
        window.navigator.userAgent.includes('Safari');

    fundPage.style.top = iPadMobile ? '21px' : '0px';

    try {
        clearAnnotation()
    } catch (error) {
        console.warn(error)
    }

}

/////////////////////////////////////////////////////////

// GET INCOMING MESSAGE from the "fund tiles page"
// 
function receiveMessage(event) {
    // IT'S CONSIDERED "BAD PRACTICE" LET ANY URL HAVE ACCESS TO MESSAGING YOUR PAGE, but I don't think we need to worry about that 
    // since we are in the seismic wall-garden, and we don't have super sensitive data on our page anyway. Right?
    // const URL = 'https://h';

    // if (event.origin.startsWith(URL) || event.origin.startsWith('http://127.0.0.1') || event.origin === 'null' || event.origin.startsWith('file://capgr') || event.origin.startsWith('http://local')) {

    // this is the message from FT after the SRC for the iframe is set, and then the DOM for that page is loaded
    // at that point we make the FT launch elements fully opaque and clickable
    // and in most cases we add the launchFundTile function as CLICK listener
    if (event.data === 'ready') {
        // LISTENERS FOR EACH BOX ADDED AFTER PAGE BUILDER IS LOADED AND READY
        document.querySelectorAll(launchElement).forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = 1;
                el.style.cursor = 'pointer';
                el.style.pointerEvents = 'all';

                if (window.VC_infoID === 'DCFF')
                    el.addEventListener('click', DCFFstyleBoxPage ? DCFFstyleBoxLaunch : launchFundTile);
                else if (window.VC_infoID !== 'WM') {
                    // WM page already has the launchfunction added as onclick in the html
                    // so we aren't adding it here
                    // WM also can launch a specific fund with a click
                    el.addEventListener('click', launchFundTile);
                }

            }, i * 70 + 100);
        });

        // LAUNCH A FUND FROM THE MENU (WHEN YA PRESS M)
        document.querySelectorAll('.menu-fund-box').forEach(fund => {
            fund.style.opacity = 1;
            fund.style.pointerEvents = 'all';
            fund.style.cursor = 'pointer';
            fund.addEventListener('click', launchFundTile)
        })

        fundTilesLoaded = true;

    } else if (event.data === 'close') {
        // in this case the FT page sends us "close" so we animate the FT page off the screen and make other adjustments

        // CLOSE THE FUND PAGE
        fundPage.style.top = window.innerHeight + 'px';
        setTimeout(() => {
            // document.body.style.overflow = 'unset';
            fundPageOpened = false;
            fundPage.style.display = 'none';
        }, 700);

    } else if (event.data === 'open') {
        // here the FT page has filtered data for a given fund, and the page is ready to be drawn
        // so FT page tells us to show FT (a longer explanation is found above)
        rollUpTheFundTile();
    }

    // } else {
    //     console.warn('message received, but bad origin. event.origin =', event.origin)
    // }
}

// LISTEN FOR INCOMING MESSAGE
if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", receiveMessage, false);
}
else {
    window.attachEvent("onmessage", receiveMessage);
}
