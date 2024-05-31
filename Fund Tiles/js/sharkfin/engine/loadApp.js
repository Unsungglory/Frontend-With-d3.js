// ****************************************************************************************************************************** //
// generatePage.js
// Creates top-of-page navigation, sidebar, and pagination sections
// ****************************************************************************************************************************** //

// ****************************************************************************************************************************** //
// Creates top-of-page navigation
// ****************************************************************************************************************************** //

document.addEventListener('DOMContentLoaded', function() {
    console.log('stla');

    // ****************************************************************************************************************************** //
    // Annotation UI
    // ****************************************************************************************************************************** //
    const openAnnotations = `
      <div class='open-annotation-icon' 
        ${window.innerHeight <= 770 ? `style='top: 333px'` : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="106.609" height="123" viewBox="0 0 106.609 123">
          <g>
              <path class="open-annotation-circle" d="M43.609,0C67.694,0,87.219,17.763,87.219,39.676S67.694,79.352,43.609,79.352,0,61.588,0,39.676,19.525,0,43.609,0Z" transform="translate(19.391 22)"/>
          </g>
        </svg>
      </div>`;
    let openAnnoCircle = document.createElement('div');
    openAnnoCircle.id = 'open-anno-icon';
    openAnnoCircle.innerHTML = openAnnotations;
    document.body.appendChild(openAnnoCircle);

    const annotationPanel = `
                          <div class='annotation-info-boxes'>
                            <div class='anno-info-box arrow-right' id='info-box-1'>INCREASE SIZE</div>
                            <div class='anno-info-box arrow-right' id='info-box-2'>SIZE INDICATOR</div>
                            <div class='anno-info-box arrow-right' id='info-box-3'>DECREASE SIZE</div>
                            <div class='anno-info-box arrow-right' id='info-box-4'>COLOR PICKER</div>
                            <div class='anno-info-box arrow-right' id='info-box-5'>MARKER</div>
                            <div class='anno-info-box arrow-right' id='info-box-6'>HIGHLIGHTER</div>
                            <div class='anno-info-box arrow-right' id='info-box-7'>ERASER / CLEAR+2</div>
                            <div class='anno-info-box arrow-right' id='info-box-8'>UNDO</div>
                            <div class='anno-info-box arrow-right' id='info-box-9'>REDO</div>
                            <div class='anno-info-box arrow-right' id='info-box-10'>REPOSITION</div>
                            <div id='black-screen-bg'></div>
                          </div>
                          <div class='annotation-ui'>
                            <div id='close-annotation-ui'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                <defs><style>.aclose{opacity:0.5;}.bclose{fill-rule:evenodd;}</style></defs>
                                <g class="aclose">
                                    <path class="bclose" d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                </g>
                              </svg>
                            </div>

                            <div class='annotation-tools'>
                              
                              <div id='anno-plus'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                  <defs><style>.a1{fill:none;}.b1{fill-rule:evenodd;}</style></defs>
                                  <rect class="a1" width="22" height="22" style='stroke: none;'/><path class="b1" 
                                    d="M15,10.714H10.714V15H9.286V10.714H5V9.286H9.286V5h1.429V9.286H15Z" 
                                    transform="translate(0.739 1)"/>
                                </svg>
                              </div>

                              <div id='anno-pen-size'>  
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                                  <defs><style>.a,.c{fill:none; stroke:#000;}.a{stroke:#707070;}.b{stroke:none;}</style></defs>
                                  <g class="a"><circle class="b" cx="11" cy="11" r="11"/>
                                    <circle class="c" cx="15" cy="15" r="11"/></g>
                                    <circle id='pen-scale' cx="11" cy="11" r="11"/>
                                </svg>
                              </div>

                              <div id='anno-minus'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                  <defs><style>.apm{fill-rule:evenodd;opacity:1;}</style></defs>
                                  <path class="apm" d="M15,12.429H5V11H15Z" transform="translate(0.739 -1)"/>
                                  <rect style='fill:none;stroke-width:0;' class="bpm" width="22" height="22"/>
                                </svg>
                              </div>

                              <div id='anno-color'>
                                <div id="pen-color"></div>
                              </div>
                          
                              <div id='anno-marker'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
                                  <defs><style>.a-mark{fill:none;}</style></defs>
                                    <g transform="translate(-3030.027 -923.027)">
                                    <g transform="translate(3032 925)">
                                      <path d="M603.942,509.572c-.848-.848,1.387-6.057,2.6-7.267l.555-.555,4.679,4.68-.555.555C609.937,508.266,604.755,510.386,603.942,509.572Z" transform="translate(-603.754 -487.276)"/>
                                      <path d="M614.2,501.577l-5.621-5.623L621.7,482.833l5.621,5.623Zm-3.465-5.623,3.465,3.465,10.959-10.964L621.7,484.99Z" transform="translate(-604.9 -482.833)"/>
                                      <rect width="6.865" height="0.761" transform="translate(13.904 8.056) rotate(-45)"/>
                                    </g>
                                    <rect class="a-mark" width="26" height="26" transform="translate(3030.027 923.027)"/>
                                  </g>
                                </svg>
                              </div>

                              <div id='anno-highlighter'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
                                  <defs>
                                    <style>
                                      .a-highlighter { 
                                        fill: 'black';
                                      }
                                      .b-highlighter {
                                        fill:none;
                                      }
                                    </style>
                                  </defs>
                                  <g transform="translate(-3030 -982)">
                                    <g transform="translate(3032 984)">
                                      <path id='highlighter-tip' class="a-highlighter" d="M628.964,518.978l4.436,3.994-2.692,2.989L624.4,524.05Z" transform="translate(-624.396 -503.971)"/>
                                      <path class="a-highlighter" d="M647.382,506.209c-.007-.007-.018-.009-.026-.015l0,0-9.461-8.564h0a.729.729,0,0,0-1.034.055l-4.611,5.148a.733.733,0,0,0-.061.1.725.725,0,0,0-.084.144l0,.015a.7.7,0,0,0-.059.2,16.322,16.322,0,0,1-3.808,9.156,44.164,44.164,0,0,1-.141.256v0a.735.735,0,0,0,.205.77l4.388,3.972a.693.693,0,0,0,.846.083.714.714,0,0,0,.18-.125,16.156,16.156,0,0,1,8.658-4.765.729.729,0,0,0,.092-.038.706.706,0,0,0,.36-.206l4.611-5.149A.739.739,0,0,0,647.382,506.209Zm-9.92-7,8.4,7.6-3.631,4.054-8.395-7.6Zm-4.131,5.582,7.421,6.719a17.579,17.579,0,0,0-7.591,4.382l-3.371-3.052A17.749,17.749,0,0,0,633.331,504.794Z" transform="translate(-624.827 -497.436)"/>
                                    </g>
                                    <rect class="b-highlighter" width="26" height="26" transform="translate(3030 982)"/>
                                  </g>
                                </svg>
                              </div>

                              <div id='anno-eraser' ondblclick="clearAnnotation()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30">
                                  <g class="eraser-holder" transform="translate(1.788 2)">
                                    <path d="M1275.34,438.2a2.361,2.361,0,0,0-.209.175q-6.863,7.1-13.72,14.21a.7.7,0,0,1-.561.236c-1.615-.01-3.23,0-4.845-.011a.515.515,0,0,1-.34-.121q-3.28-3.378-6.547-6.769a.723.723,0,0,1-.053-.066l16.85-17.412Zm-18.132,2.009,6.668,6.9,8.678-8.984-6.668-6.905Z" transform="translate(-1248.907 -428.442)"/>
                                    <path d="M1246.871,677.371h26.576v1.312h-26.576Z" transform="translate(-1246.871 -651.492)"/>
                                  </g>
                                  <rect style='fill: none;' width="30" height="30"/>
                                </svg>
                              </div>

                              <hr/>

                              <div id='anno-undo'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
                                  <defs><style>.auu{opacity:0.7;}.buu{fill:none;}</style></defs>
                                  <g class="auu" transform="translate(1.77 3)">
                                    <path d="M861,459.088V456.94h.3c1.555,0,3.109.005,4.664.016a6.147,6.147,0,0,0,5.536-3.905,6.5,6.5,0,0,0-2.979-8.228,5.624,5.624,0,0,0-2.554-.635c-3.819,0-7.639.008-11.458.014-.834,0-1.667,0-2.539.066l5.886,5.564-1.368,1.586-8.782-8.311,8.8-8.3,1.369,1.571-6.006,5.681h.381c4.578,0,9.156-.046,13.733.016a7.688,7.688,0,0,1,7.194,4.63,8.384,8.384,0,0,1-1.034,9.371,7.649,7.649,0,0,1-6.125,3c-1.554.029-3.109.005-4.664.005Z" transform="translate(-847.7 -434.811)"/>
                                  </g>
                                  <rect class="buu" width="30" height="30"/>
                                </svg>
                              </div>

                              <div id='anno-redo'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
                                  <defs><style>.annr{opacity:0.7;}.bnnr{fill:none;}</style></defs>
                                  <g class="annr" transform="translate(1.77 3)">
                                    <path d="M860.844,459.088V456.94h-.3c-1.555,0-3.109.005-4.664.016a6.147,6.147,0,0,1-5.536-3.905,6.5,6.5,0,0,1,2.979-8.228,5.624,5.624,0,0,1,2.554-.635c3.819,0,7.639.008,11.458.014.834,0,1.667,0,2.539.066l-5.886,5.564,1.368,1.586,8.782-8.311-8.8-8.3-1.369,1.571,6.006,5.681H869.6c-4.578,0-9.156-.046-13.733.016a7.688,7.688,0,0,0-7.194,4.63,8.384,8.384,0,0,0,1.034,9.371,7.649,7.649,0,0,0,6.125,3c1.554.029,3.109.005,4.664.005Z" transform="translate(-847.7 -434.811)"/>
                                  </g>
                                  <rect class="bnnr" width="30" height="30"/>
                                </svg>
                              </div>

                              <div id='anno-info'>
                                ?
                              </div>

                              <hr/>

                              <div id='anno-move'>
                                <div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              </div>

                              <div class='anno-color-swatches' id='close-swatches'>
                                <div>
                                  <p>Pen Color</p>
                                  <svg id="close-color-swatches" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                    <g>
                                        <path d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z" transform="translate(-5 -5)"/>
                                    </g>
                                  </svg>
                                </div>
                                <hr/>
                                <div>
                                  <div class='anno-color-circle' style='background-color: rgb(52, 227, 0);'></div>
                                  <div class='anno-color-circle' style='background-color: rgb(76, 137, 253);'></div>
                                  <div class='anno-color-circle' style='background-color: rgb(255, 76, 255);'></div>
                                  <div class='anno-color-circle' style='background-color: rgb(255, 76, 76);'></div>
                                  <div class='anno-color-circle' style='background-color: rgb(255, 255, 0);'></div>
                                </div>
                              </div>
                            </div>
                          </div>

                        `;

    let annoUi = document.createElement('div');
    annoUi.id = 'annotation-ui-container';

    if (window.innerHeight > 770) {
        annoUi.style.top = '231px';
    } else {
        annoUi.style.top = '100px';
    }

    annoUi.style.opacity = 0;
    annoUi.style.right = '-45px';
    annoUi.innerHTML = annotationPanel;

    document.body.appendChild(annoUi);

    // add canvas layers (one for pen tool, one for hightlighter)
    let cAnno = document.createElement('canvas');
    cAnno.id = 'c-annotation';
    cAnno.classList = 'c-annotation';

    let cHighlighter = document.createElement('canvas');
    cHighlighter.id = 'c-highlighter';
    cHighlighter.classList = 'c-highlighter';

    let canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    document.body.appendChild(canvasContainer);

    canvasContainer.appendChild(cHighlighter);
    canvasContainer.appendChild(cAnno);

    canvasContainer.style.top = '0px';

    // ****************************************************************************************************************************** //
    // LOADS ENGINE
    // ****************************************************************************************************************************** //

    let loadEngine = document.createElement('script');
    loadEngine.src = './engine/cg-app.js';
    // loadEngine.defer = true;
    document.head.appendChild(loadEngine);
});
