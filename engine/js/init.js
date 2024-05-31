// // INCLUDE jquery
// const jquery = document.createElement('script');
// jquery.src = './engine/js/jquery-3.4.1.min.js';
// document.head.appendChild(jquery);

// INCLUDE WEBSITE INFO FILE
// const websiteInfoScript = document.createElement('script');
// websiteInfoScript.src = './websiteInfo.js';
// document.head.appendChild(websiteInfoScript);

// ****************************************************************************************************************************** //
// Set globals
// ****************************************************************************************************************************** //

// GET PAGE ORIENTATION FOR IPAD
const iPadMobile =
    window.orientation >= -90 &&
    window.navigator.vendor.startsWith('Apple') &&
    window.navigator.userAgent.includes('Safari');

// GET CURRENT PAGE URL (example: fi-01.html)
let currentPageUrl = (window.location.href.match(/([^/]*)$/)[0]).split('?')[0];

// IF WE HAVE HIT RIGHT ARROW ON FINAL PAGE URL WILL HAVE A # SIGN AT THE END
if (currentPageUrl.slice(-1) === '#') {
    currentPageUrl = currentPageUrl.slice(0, -1);
}

let categoriesWithLinks;
let currentCatTitle;
let currentCategory;
let currentPages;
let currentUrlText;
let currentPageNumber;

window.onload = () => {

    // GET ALL CATEGORIES AND ALL LINKS FOR EACH CATEGORY
    categoriesWithLinks = websiteInfo.map(obj => {
        return { category: obj.category, links: obj.pages.map(p => p.link) };
    });

    // GET CURRENT CATEGORY TITLE BASED ON PAGE URL
    currentCatTitle =
        currentPageUrl === 'index.html'
            ? null
            : categoriesWithLinks.find(cat => cat.links.includes(currentPageUrl)).category;

    // GET ALL DATA FOR CURRENT CATEGORY FROM FILE
    currentCategory =
        currentPageUrl === 'index.html'
            ? null
            : websiteInfo.find(d => d.category.toLowerCase() === currentCatTitle.toLowerCase());

    // GET CURRENT PAGES FROM WEBSITE INFO
    currentPages = currentPageUrl === 'index.html' ? null : currentCategory.pages;

    // GET CURRENT URL TEXT
    currentUrlText = currentPageUrl.match(/[^.]*/)[0];

    // GET CURRENT PAGE NUMBER
    currentPageNumber = currentPageUrl.match(/[^-]*$/g)[0].match(/[^.]*/)[0];

    function printPageVars() {
        console.log('');
        console.log('***************************');
        console.log('***************************');
        console.log('iPadMobile', iPadMobile);
        console.log('currentPageUrl', currentPageUrl);
        console.log('categoriesWithLinks', categoriesWithLinks);
        console.log('currentCatTitle', currentCatTitle);
        console.log('currentCategory', currentCategory);
        console.log('currentPages', currentPages);
        console.log('currentUrlText', currentUrlText);
        console.log('currentPageNumber', currentPageNumber);
        console.log('***************************');
        console.log('***************************');
        console.log('');
    }

    printPageVars();

    // ****************************************************************************************************************************** //
    // SET TITLE, FAVICON
    // ****************************************************************************************************************************** //

    // SET TITLE
    document.title = `CG - ${websiteTitle.title}`;

    // FAVICON
    const favIconCode = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favIconCode.type = 'image/x-icon';
    favIconCode.rel = 'shortcut icon';
    favIconCode.href = './engine/imgs/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(favIconCode);

    // ****************************************************************************************************************************** //
    // Add SCRIPTS
    // ****************************************************************************************************************************** //

    // GET SCREEN WIDTH/HEIGHT RATIO
    const getScreenRatio = document.createElement('script');
    getScreenRatio.src = './engine/js/getScreenRatio.js';
    document.head.appendChild(getScreenRatio);

    // MENU OPEN AND CLOSE FUNCTIONALITY
    const menuOpenClose = document.createElement('script');
    menuOpenClose.src = './engine/js/menuOpenClose.js';
    document.head.appendChild(menuOpenClose);

    // MOBILE BAR FOR SEISMIC
    // const mobileBlackBar = document.createElement('script');
    // mobileBlackBar.src = './engine/js/mobileBlackBar.js';
    // document.head.appendChild(mobileBlackBar);

    // GENERATE TOP TIMELINE
    const generateTimeline = document.createElement('script');
    generateTimeline.src = './engine/js/generateTimeline.js';
    document.head.appendChild(generateTimeline);

    // GENERATE FULL SCREEN MENU/NAV
    const generateFullscreenMenu = document.createElement('script');
    generateFullscreenMenu.src = './engine/js/generateFullscreenMenu.js';
    document.head.appendChild(generateFullscreenMenu);

    // GENERATE PAGINATION
    const generatePagination = document.createElement('script');
    generatePagination.src = './engine/js/generatePagination.js';
    document.head.appendChild(generatePagination);

    // INFORMATION DISPLAY THAT SHOWS KEYBOARD SHORTCUTS AND STUFF
    const generateInfoMenu = document.createElement('script');
    generateInfoMenu.src = './engine/js/generateInfoMenu.js';
    document.head.appendChild(generateInfoMenu);

    // ANNOTATIONS
    const annoUI = document.createElement('script');
    annoUI.src = './engine/annotations/annoUI.js';
    // loadEngine.defer = true;
    document.head.appendChild(annoUI);

    // ADD PAGE FUNCTIONS 
    const pageFunctions = document.createElement('script');
    pageFunctions.src = './engine/js/pageFunctions.js';
    // pageFunctions.defer = true;
    document.head.appendChild(pageFunctions);

}

// ****************************************************************************************************************************** //
// Add cover element for page transitions
// ****************************************************************************************************************************** //
// pageTransition();

// function pageTransition() {

//     document.addEventListener('DOMContentLoaded', function () {

//         //PAGE TRANSITIONS (fade into new page)
//         const cover = document.createElement('div');
//         cover.id = 'cover';
//         document.getElementById('master-container').appendChild(cover);


//         if (!navigator.vendor.includes('Apple')) {
//             cover.style.transition = 'opacity .3s .2s';
//             setTimeout(() => {
//                 cover.style.opacity = '0';
//             }, 0);
//         } else {
//             cover.style.transition = 'opacity 0';
//             setTimeout(() => {
//                 cover.style.opacity = '0';
//             }, 0);
//         }

//         setTimeout(() => {
//             cover.style.transition = 'opacity .2s ease-in-out';
//         }, 200);

//     })
// }

