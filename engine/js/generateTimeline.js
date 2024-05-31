
// ****************************************************************************************************************************** //
// Generates top timeline navigation
// ****************************************************************************************************************************** //

let timelineContent =
    currentPageUrl === 'index.html'
        ? null
        : `
            ${iPadMobile ? `<div id='seismic-x'></div>` : ''}

            <!-- menu icon & close button-->
            <div id="menu-button" class="header-menu-icon" onclick="toggleMainMenu()">
                <div id="menu-icon-ani" class="menu-icon">
                    <div id="line-a" class="icon-line line-straight"></div>
                    <div id="line-b" class="icon-line line-straight"></div>
                    <div id="line-c" class="icon-line line-straight"></div>
                </div>
            </div>
            <!-- end icon & close button -->

            <!-- header title -->
            <div class="header-title" id='header-title'>
                ${globalCatTitle ? globalCatTitle : currentCatTitle}
            </div>
            <!-- end header title -->

            <!-- header timeline -->
            <div id="header-timeline">
                <div id="header-timeline-bar-container">
                    <div id="timeline-colored-bar">
                </div>
          `;

const timelineButtons = [];
const timelineLines = [];
if (currentPageUrl !== 'index.html') {
    currentPages.forEach((page, i) => {
        const circleClass = page.link.match(/([^.]+)/)[0];

        // SET ACTIVE DOT IN TL
        // const activeTl = i < Number(currentPageNumber);
        const activeTl = false;
        const isCurrentPage = i === Number(currentPageNumber) - 1;
        let activeTlStyles = '';
        if (isCurrentPage) {
            activeTlStyles = `style='
                fill: ${DENIM};
                overflow: unset;
                stroke-width: 7px;
                animation: pulse 3s 0s linear infinite;'
                `;
        } else if (activeTl) {
            activeTlStyles = `style='
                fill: ${DENIM};
                stroke: ${DENIM30};
                stroke-width: 0px;'`;
        }
        timelineButtons.push(
            `<button class='tl-button' onclick='timelineClick("${page.link}")'>
                    <defs>
                      <style>
                        .${circleClass} {
                          stroke: ${BONE};
                        }
                        .${circleClass}:hover > .timeline-dot > circle {
                          fill: ${isCurrentPage ? DENIM : activeTl ? DENIM : BONE} !important;
                          ${isCurrentPage
                ? ''
                : activeTl ? 'stroke-width: 9 !important' : 'stroke-width: 1 !important'} ;
                        }
                      </style>
                    </defs>
                    <div class="timeline-item ${circleClass}" id="tl-${circleClass}">
                      <svg height="19" width="19" class="timeline-dot" style='overflow: unset;'>
                        <circle cx="9.5" cy="9.5" r="4.5" ${activeTlStyles}"/>
                      </svg>
                      <div>${page.timelineText}</div>
                    </div>
                  </button>`
        );
        timelineLines.push(
            `<div class='timeline-grey-line' ${i >= +currentPageNumber ? '' : `style='opacity: 0;'`}></div>`
        );
    });
}

timelineContent +=
    currentPageUrl === 'index.html'
        ? null
        : `<div id="timeline-btn-holder" ${timelineButtons.length === 1 ? `style='justify-content:center;'` : ''}>
                
               ${timelineButtons.join(' ')}
                
              </div>

              <div id="timeline-grey-lines-container">
                ${timelineLines.join(' ')}
                <div class='timeline-grey-line timeline-end-cover' style=' ${+currentPageNumber === currentPages.length
            ? `display: none;`
            : ''} 
                    position: absolute; background-color: rgba(213, 208, 202, 1); border-radius:100px; right: -1px; 
                    width: 21px;'
                ></div>
             </div>
            </div> <!-- end timeline wrapper -->

          </div>
          <!-- end header timeline -->

          `;

if (currentPageUrl !== 'index.html') {
    const timelineElement = document.createElement('header');
    timelineElement.classList = 'header-wrapper-a';
    timelineElement.innerHTML = timelineContent;
    document.getElementById('nav-container').prepend(timelineElement)

    //ADD TOUCH LISTENER TO EACH DOT IN TIMELINE
    document.querySelectorAll(`tl-item`).forEach(el =>
        el.addEventListener(
            'touchstart',
            () => {
                window.open(`./${page.link}`, '_self');
            },
            false
        )
    );

    timelineBuild();
    window.addEventListener('resize', timelineBuild);

    function timelineBuild() {
        // document.querySelector('.timeline-end-cover').style.top = window.innerWidth < 1100 ? '7px' : '5px';

        if (currentPages.length === 1) {
            const line = document.querySelector('.timeline-grey-line');
            line.style.width = '100%';
        } else {
            const timelineItems = document.querySelectorAll('.timeline-item');
            const numberOfItems = timelineItems.length;

            let eachWidth = [];
            timelineItems.forEach(e => {
                eachWidth.push(e.clientWidth);
            });

            const lengthOfTimeline = document.querySelector('#timeline-btn-holder').clientWidth;
            const combinedLength = eachWidth.reduce((el, acc) => (el += acc), 0);
            const leftOverSpace = lengthOfTimeline - combinedLength;
            const numberOfGaps = numberOfItems - 1 < 1 ? 1 : numberOfItems - 1;
            const gapWidth = leftOverSpace / numberOfGaps;

            const lines = document.querySelectorAll('.timeline-grey-line');
            lines.forEach((line, i) => {
                if (i === 0) {
                    line.style.width = eachWidth[i] / 2 + 'px';
                } else if (i === numberOfItems - 1) {
                    line.style.width = eachWidth[i - 1] / 2 + gapWidth + eachWidth[i] + 'px';
                } else {
                    line.style.width = eachWidth[i - 1] / 2 + gapWidth + eachWidth[i] / 2 + 'px';
                }
            });
        }
    }
}
