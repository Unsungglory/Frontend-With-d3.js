document.addEventListener('DOMContentLoaded', function () {

    // INCLUDE jquery
    const jquery = document.createElement('script');
    jquery.src = './engine/js/jquery-3.4.1.min.js';
    document.head.appendChild(jquery);

    // INCLUDE WEBSITE INFO FILE
    const websiteInfo = document.createElement('script');
    websiteInfo.src = './websiteInfo.js';
    document.head.appendChild(websiteInfo);

    // INITS
    const init = document.createElement('script');
    init.src = './engine/js/init.js';
    document.head.appendChild(init);

    // while (!initDone) {
    //     console.log('not yet')
    // }

    // setTimeout(() => {
    //     // GET SCREEN WIDTH/HEIGHT RATIO
    //     const getScreenRatio = document.createElement('script');
    //     getScreenRatio.src = './engine/js/getScreenRatio.js';
    //     document.head.appendChild(getScreenRatio);

    //     // MENU OPEN AND CLOSE FUNCTIONALITY
    //     const menuOpenClose = document.createElement('script');
    //     menuOpenClose.src = './engine/js/menuOpenClose.js';
    //     document.head.appendChild(menuOpenClose);

    //     // MOBILE BAR FOR SEISMIC
    //     const mobileBlackBar = document.createElement('script');
    //     mobileBlackBar.src = './engine/js/mobileBlackBar.js';
    //     document.head.appendChild(mobileBlackBar);

    //     // GENERATE TOP TIMELINE
    //     const generateTimeline = document.createElement('script');
    //     generateTimeline.src = './engine/js/generateTimeline.js';
    //     document.head.appendChild(generateTimeline);

    //     // GENERATE FULL SCREEN MENU/NAV
    //     const generateFullscreenMenu = document.createElement('script');
    //     generateFullscreenMenu.src = './engine/js/generateFullscreenMenu.js';
    //     document.head.appendChild(generateFullscreenMenu);

    //     // GENERATE PAGINATION
    //     const generatePagination = document.createElement('script');
    //     generatePagination.src = './engine/js/generatePagination.js';
    //     document.head.appendChild(generatePagination);

    //     // INFORMATION DISPLAY THAT SHOWS KEYBOARD SHORTCUTS AND STUFF
    //     const generateInfoMenu = document.createElement('script');
    //     generateInfoMenu.src = './engine/js/generateInfoMenu.js';
    //     document.head.appendChild(generateInfoMenu);

    //     // ANNOTATIONS
    //     const annoUI = document.createElement('script');
    //     annoUI.src = './engine/annotations/annoUI.js';
    //     // loadEngine.defer = true;
    //     document.head.appendChild(annoUI);

    //     // ADD PAGE FUNCTIONS 
    //     const pageFunctions = document.createElement('script');
    //     pageFunctions.src = './engine/js/pageFunctions.js';
    //     // pageFunctions.defer = true;
    //     document.head.appendChild(pageFunctions);

    // }, 10);
})