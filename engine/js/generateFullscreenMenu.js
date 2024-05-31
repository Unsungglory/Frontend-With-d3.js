// ****************************************************************************************************************************** //
// Creates the fullscreen menu/navigation
// ****************************************************************************************************************************** //

// const groupWidth = websiteInfo.length ? 100 / websiteInfo.length : 0;
// const widthStyle = groupWidth ? "style='width:" + groupWidth + "%'" : '';
const widthStyle = null;

let topNavLinks = websiteInfo.map(category => {
  return `
        <div class="nav-link-section" ${widthStyle}>
          <div class='menu-category-header'>
            <button onclick='sbHeaderClick("${category.pages[0].link}")'>
                <div style='text-align: left;'>${category.header}</div>
            </button>
            <div class='menu-category-subheader'>${category.subheader}</div>
          </div>

          <div class='menu-page-link-container'>
            ${category.pages.map(li => {
    const id = li.link.match(/[^.]*/)[0];
    const currentLink = id === currentUrlText; // to set active menu link to blue
    return `
                  <button id="${id}" class='menu-subcat-link' onclick='sbLIclicked("${li.link}")' 
                    ${currentLink ? `style='color: #186EA7'` : ''} // highlights active page in nav
                    ${li.sidebarText === '' ? `style='display: none;'` : ''}
                  >
                    ${li.sidebarText}
                  </button>`;
  }).join(' ')}
          </div>
        </div>
          `;
});

// const ipadMob =
//   window.orientation >= -90 &&
//   window.navigator.vendor.startsWith('Apple') &&
//   window.navigator.userAgent.includes('Safari');


const htmlFirstPart = `
<!-- full screen menu -->
  <div class="menu-main-links-wrapper">
    <div class="menu-close"></div>

    <div class="menu-cg-logo" id="menu-logo-ani" onClick='backHome()'>
        <img src="./engine/imgs/cg-menu-logo.svg" />
    </div>

    <!-- menu links -->
    <div class="menu-page-content">
      <!-- top links -->
      <div class="main-menu-items" id="menu-links-ani">
      `
// CHANGED LOOK HERE
const fullMenuInnerHTML = `
            ${htmlFirstPart}
            ${topNavLinks.join(' ')}
          </div>

          ${lowerSection()}
        </div>`;

const fullScreenNavElement = document.createElement('nav');
fullScreenNavElement.id = 'menu-system';
fullScreenNavElement.classList = 'menu-wrapper';
fullScreenNavElement.innerHTML = fullMenuInnerHTML;

// ADDS THE LINKS TO THE TOP
document.getElementById('nav-container').appendChild(fullScreenNavElement);

// SET HEADER TITLE HEIGHT (ON TOP LINKS)
setLinkHeaderHeights();

function setLinkHeaderHeights() {
  const headers = document.querySelectorAll('.menu-category-header');
  headers.forEach(el => el.style.height = 'unset');

  let maxHeight = 0;

  setTimeout(() => {
    headers.forEach(el => {
      if (el.clientHeight >= maxHeight) {
        maxHeight = el.clientHeight;
      }
    })

    headers.forEach(el => el.style.height = maxHeight + "px");
  }, 250);
}

window.addEventListener('resize', setLinkHeaderHeights);

// ADD FUND TILES AFTER FULL SCREEN MENU IS SET
try {
  if (addFundTiles)
    addFundTilesScript();
} catch (error) {
  console.warn('Fund Tiles not included in this page...', error)
}
function addFundTilesScript() {
  //<script defer src="./Fund Tiles/fundTile.js" type="text/javascript"></script>

  // GENERATE FULL SCREEN MENU/NAV
  const fundTilesIncludeScript = document.createElement('script');
  fundTilesIncludeScript.type = 'text/javascript';
  fundTilesIncludeScript.defer = true;
  fundTilesIncludeScript.async = false;
  fundTilesIncludeScript.src = './Fund Tiles/fundTile.js';
  document.head.appendChild(fundTilesIncludeScript);


  // WHAT ABOUT SHARKFIN BOYS?
  const addSFscript = document.createElement('script');
  addSFscript.type = 'text/javascript';
  addSFscript.defer = true;
  addSFscript.async = false;
  addSFscript.src = './Fund Tiles/js/sharkfin/embeddedSF.js';
  document.head.appendChild(addSFscript);

  // ADD SF STYLES
  const SFSTYLES = document.createElement('link');
  SFSTYLES.href = './Fund Tiles/js/sharkfin/embeddedSF.css';
  SFSTYLES.type = 'text/css';
  SFSTYLES.rel = 'stylesheet';
  document.head.appendChild(SFSTYLES);
}
