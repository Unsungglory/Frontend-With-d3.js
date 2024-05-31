

// STYLESHEET
const stylesInfoPane = document.createElement("link");
stylesInfoPane.href = './engine/css/infoPane.css';
stylesInfoPane.type = "text/css";
stylesInfoPane.rel = "stylesheet";
document.head.appendChild(stylesInfoPane);


// ****************************************************************************************************************************** //
// ****************************************************************************************************************************** //
// ADD INFO OVERLAY (JOB AID)
// ****************************************************************************************************************************** //
// ****************************************************************************************************************************** //
const topText = `
      <div class='sidebar-container'>
        <div class='info-sidebar-header'>UI Controls</div>
        <div class='info-li'>
          <div class='info-num'> 1</div>
          Main Menu
        </div>
        <div class='info-li'>
          <div class='info-num'> 2</div>
          Timeline Navigation
        </div>
        <div class='info-li'>
          <div class='info-num'> 3</div>
          Line Style Toggle
        </div>
        <div class='info-li'>
          <div class='info-num'> 4</div>
          Zoom Toggle
        </div>
        <div class='info-li'>
          <div class='info-num'> 5</div>
          Annotations Tab
        </div>
        <div class='info-li'>
          <div class='info-num'> 6</div>
          Previous Screen
        </div>
        <div class='info-li'>
          <div class='info-num'>7</div>
          Footer Pagination
        </div>
        <div class='info-li'>
          <div class='info-num'>8</div>
          Next Screen
        </div>
    
      </div>`;

const midText = `
      <div class='sidebar-container'>
        <div class='info-sidebar-header'>Annotations</div>
        <div class='info-li'>
          <div class='info-num'> 9</div>
          +/- Pen size
        </div>
        <div class='info-li'>
          <div class='info-num'> 10</div>
          Pen size indicator
        </div>
        <div class='info-li'>
          <div class='info-num'> 11</div>
          color picker
        </div>
        <div class='info-li'>
          <div class='info-num'> 12</div>
          pen/highlighter/eraser
        </div>
        <div class='info-li'>
          <div class='info-num'> 13</div>
          undo/redo
        </div>
        <div class='info-li'>
          <div class='info-num'> 14</div>
          help
        </div>
        <div class='info-li'>
          <div class='info-num'>15</div>
          clear annotations
        </div>
        <div class='info-li'>
          <div class='info-num'>16</div>
          drag handle
        </div>
    
      </div>`;

const KEYBOARDSHORTCUTS = `
      <div class='sidebar-grid'>
          <div class='info-sidebar-header-2' style='grid-column: 1/5'>
            Keyboard Shortcuts
          </div>

          <div class='info-li-key'>
            <div class='info-key'>M</div>
            Toggle Menu
          </div>
          <div class='info-li-key'>
            <div class='info-key'>H</div>
            Return To Home
          </div>

          <div class='info-li-key'>
          <div class='info-key'>I</div>
            Interactive Guide
          </div>
          <div class='info-li-key'>
            <div class='info-key'>D</div>
            View Disclosure
          </div>
          <div class='info-li-key'>
            <div class='info-key'>A</div>
            Annotations
          </div>
          <div class='info-li-key'>
            <div class='info-key key-right'>
              <svg height="15" width="11" transform='translate(.5,0.5) scale(.85)'>
                <polygon points="0,0 11,7.5 0,15" class="triangle" />
              </svg>
            </div>
            Next Screen
          </div>
          <div class='info-li-key'>
            <div class='info-key key-left'>
              <svg height="15" width="11" transform='translate(-2,1) scale(.85)'>
                <polygon points="11,0 0,7.5 11,15" class="triangle" />
              </svg>
            </div>
            Previous Screen
          </div>
      </div>`;


const infoPanel = `
      <div class='info-top-bar'>
        <div id='guide-title'>Interactive Guide</div>
        <div id='info-close-btn' onClick='closeInfoUI()'>
          CLOSE GUIDE
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
            <g>
                <path fill="white" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
            </g>
          </svg>
        </div>
      </div>
      <div class='info-content-container'>
          <div class='info-sidebar-container'>
              ${topText}
              ${midText}
          </div>
          <div class='info-screen-pic'></div>

          ${KEYBOARDSHORTCUTS}
      </div>
    `;

let infoOverlay = document.createElement('div');
infoOverlay.id = 'info-overlay-container';

infoOverlay.style.opacity = 0;
infoOverlay.style.display = 'none';

infoOverlay.innerHTML = infoPanel;

document.body.appendChild(infoOverlay);

if (iPadMobile) {
  infoOverlay.style.top = '20px'; // moves the Interactive Guide down for mobile

  // adjust interactive guide header for mobile
  document.querySelector('#guide-title').style.marginLeft = '8%';
}


// OPEN JOB AID/INFO UI
function openInfoUI() {
  document.querySelector('#info-overlay-container').style.display = 'block';
  setTimeout(() => {
    document.querySelector('#info-overlay-container').style.opacity = 1;
    document.querySelector('body').style.overflow = 'hidden';
  }, 20);
}

function closeInfoUI() {
  document.querySelector('body').style.overflow = 'unset';
  document.querySelector('#info-overlay-container').style.opacity = 0;

  setTimeout(() => {
    document.querySelector('#info-overlay-container').style.display = 'none';
  }, 300);
}

// // CLOSE INFO UI ON CLICK
// if (document.querySelector('#info-close-btn')) {
//     document.querySelector('#info-close-btn').addEventListener('click', () => {
//         closeInfoUI();
//     });
// }
