function toggleClassText() {
    const aElements = document.querySelectorAll('.a-shares');
    const f2Elements = document.querySelectorAll('.f2-shares');

    if (currentFundClass === 'a') {
        aElements.forEach(el => el.style.opacity = 1)
        f2Elements.forEach(el => el.style.opacity = 0);
    } else if (currentFundClass === 'f2') {
        aElements.forEach(el => el.style.opacity = 0)
        f2Elements.forEach(el => el.style.opacity = 1);
    }
}

const outputTranslate = [];
outputTranslate['S&P 500 Composite Index'] = 'S&P 500 Index'
outputTranslate['S&P 500 Index'] = 'S&P 500 Index'
outputTranslate['MSCI ACWI/MSCI World Index Linked Net'] = 'MSCI ACWI';
outputTranslate['S&P500/Barclays US Aggregate 60%/40% Index for AMBAL'] = 'S&P500/Barclays US Aggregate 60%/40% Index';
outputTranslate['MSCI All Country World Index (ACWI) ex USA'] = 'MSCI All Country World Index (ACWI) ex USA';
outputTranslate['MSCI ACWI ex US/MSCI EAFE Index Linked Net'] = 'MSCI ACWI ex US/MSCI EAFE Index';
outputTranslate['MSCI ACWI/MSCI World Index Linked Net'] = 'MSCI ACWI/MSCI World Index';
outputTranslate['MSCI ACWI Small Cap/S&P Global <$3 Billion Index Linked Net'] = 'MSCI ACWI Small Cap/S&P Global <$3 Billion Index';
outputTranslate['MSCI ACWI/Barclays US Agg 70%/30%_for CIB'] = 'MSCI ACWI/Barclays US Agg 70%/30%'
outputTranslate['S&P500/Barclays Aggregate 65%/35% Index'] = 'S&P500/Barclays Aggregate 65%/35% Index';
outputTranslate['70%/30% MSCI ACWI / Bloomberg US Aggregate'] = '70%/30% MSCI ACWI / Bloomberg US Aggregate';
outputTranslate['65%/35% S&P 500 / Bloomberg US Aggregate Index'] = '65%/35% S&P 500 / Bloomberg US Aggregate Index';
outputTranslate['60%/40% S&P 500 / Bloomberg US Aggregate Index'] = '60%/40% S&P 500 / Bloomberg US Aggregate Index';

// sets all the info on the bottom of LINE CHART
function updateLineChartStats() {
    toggleClassText();

    // CAPTURE RATIO BENCHMARK TEXT
    let timeText = '10';
    if (aShares.id == 'DWGI') {
        timeText = '5';
    }

    updateShareText(aShares, 'a');
    updateShareText(f2Shares, 'f2');

    // here were are checking to see if the lower section (hypos grid, etc) is running off the right side of the page
    textAdjustmentException();

    function textAdjustmentException() {
        // check to see if grid has gone off page
        const bottomSection = document.querySelector('.bottom-section');
        const assumedColGap = 18;
        const numberOfGaps = 2;
        let totalColumnW = 0;

        // elements that will be targeted with CSS below
        const textEls = document.querySelectorAll('.growth-top-box .pr6');
        const topBoxes = document.querySelectorAll('.growth-top-box');
        const bottomBox = document.querySelectorAll('.bottom-box')[2];
        const rowTwos = bottomBox.querySelectorAll('.row-two');
        const rowWidth = window.innerWidth < 1400 ? '39px auto' : '45px auto';

        // reset the size of all the columns and elements (this is needed when toggling between A/F2)
        resetElements();

        const needsHelp = bottomSection.clientWidth + assumedColGap * numberOfGaps <= totalColumnW;

        console.log('bottomSection', bottomSection.clientWidth)
        console.log('totalW', totalColumnW)
        console.log('needsHelp (just for styling)', needsHelp)

        if (needsHelp) {
            shrinkElements();
        }

        function shrinkElements() {
            textEls.forEach(el => {
                el.style.fontSize = '70%';
                el.querySelectorAll('div').forEach(el => el.classList.remove('no-wrap'))
            });

            topBoxes.forEach(el => el.style.height = 'unset');

            bottomBox.style.gridTemplateRows = rowWidth;

            rowTwos.forEach(el => el.style.height = 'unset')
        }

        function resetElements() {
            textEls.forEach(el => {
                el.style.fontSize = '100%';
                el.querySelectorAll('div').forEach(el => el.classList.add('no-wrap'))
            });

            topBoxes.forEach(el => el.removeAttribute('style'));

            bottomBox.removeAttribute('style');

            rowTwos.forEach(el => el.removeAttribute('style'));

            // determine width after resetting (needed for 'needsHelp')
            document.querySelectorAll('.bottom-box').forEach(el => totalColumnW += el.clientWidth);
        }
    }

    // CAPTURE RATIO FOOTNOTE
    // if (aShares.id == 'IVE') {
    //     document.getElementById('capture-ratio-id').innerText = '3'
    // } else {
    //     document.getElementById('capture-ratio-id').innerText = '3'
    // }

    function updateShareText(data, shareClass) {
        document.querySelector(`#overview-date-${shareClass}`).innerHTML = `As of ${data.metricsData.overviewData.asOfDate} (updated quarterly)`;
        document.querySelector(`#fund-assets-${shareClass}`).innerText = dollar(data.metricsData.overviewData.assetsValue);

        console.log('updateLineChartStats(), updateShareText()', data)

        document.querySelector(`#companies-value-${shareClass}`).innerText = data.metricsData.overviewData.companiesValue + '+';

        document.querySelector(`#risk-date-${shareClass}`).innerHTML = `As of ${data.metricsData.riskData.asOfDate} (updated quarterly)`;

        const expRatio = data.metricsData.expensesData.expensesValue;
        document.querySelector(`#exp-ratio-text-${shareClass}`).innerText = valueFormat(expRatio);

        const upside = data.metricsData.riskData.upside;
        const downside = data.metricsData.riskData.downside;
        document.querySelector(`#upside-downside-capture-${shareClass}`).innerText = upside + `/` + downside;

        document.querySelector(`#capture-date-${shareClass}`).innerHTML = `Upside/Downside - American Funds benchmark<sup>4</sup> for the ${timeText} years ending ${data.metricsData.riskData.asOfDate}.`;

        // COLORED BOXES
        if (data.metricsData.accumulationData) {

            // color of bottom
            document.querySelectorAll('.growth-low-box').forEach(box => {
                box.style.backgroundColor = boxColors[data.objective.trim()];
            })

            document.getElementById('output-message').style.opacity = 0;
            document.querySelectorAll('.r2s-h').forEach(el => el.style.opacity = 1) // hides subheaders

            document.getElementById(`accumulation-top-${shareClass}`).innerText = convertText(data.metricsData.accumulationData.index.name);
            document.getElementById(`accumulation-top-num-${shareClass}`).innerText = dollar(data.metricsData.accumulationData.index.value);
            document.getElementById(`accumulation-mid-num-${shareClass}`).innerText = dollar(data.metricsData.accumulationData.peer);
            document.getElementById(`accumulation-bot-num-${shareClass}`).innerText = dollar(data.metricsData.accumulationData.value);
            document.getElementById(`accumulation-bot-${shareClass}`).innerText = data.ticker

            document.getElementById(`hypo-top-${shareClass}`).innerText = convertText(data.metricsData.distData.index.name);
            document.getElementById(`hypo-top-num-${shareClass}`).innerText = dollar(data.metricsData.distData.index.value);
            document.getElementById(`hypo-mid-num-${shareClass}`).innerText = dollar(data.metricsData.distData.peer);
            document.getElementById(`hypo-bot-num-${shareClass}`).innerText = dollar(data.metricsData.distData.value);
            document.getElementById(`hypo-bot-${shareClass}`).innerText = data.ticker
        } else {
            document.getElementById('output-message').style.opacity = 1;
            document.getElementById('output-message').innerText = 'Fund originated in ' + new Date(data.inception).getFullYear() + '. No returns are available for time frame.';
            document.querySelectorAll('.r2s-h').forEach(el => el.style.opacity = 0) // hides subheaders
        }

        function convertText(input) {
            const indexNames = Object.keys(outputTranslate);

            if (!indexNames.includes(input))
                return input

            return outputTranslate[input]
        }
    }

    function valueFormat(num) {
        if (num === 0) {
            return '0%'
        } else if (!num || num === 'N/A' || typeof num === 'string') {
            return 'N/A'
        }
        else if (typeof num === 'number') {
            return num.toFixed(2) + '%'
        }
        console.log('valueFormat: unexpected input')
        return num;
    }
}

// SLIDER FOR LINE CHART (CASH VS REINVESTED)
const toggleSlider = () => {
    const slider = document.getElementById('slider-1');

    if (slider.getAttribute('reinvested') === 'true') {
        document.querySelector('#pill-toggle').style.left = '50%';
        document.getElementById('ft-toggle-left').style.color = 'rgba(127, 127, 127, 1)';
        document.getElementById('ft-toggle-right').style.color = 'rgba(0, 41, 75, 1)';
        isCash = true;
        slider.setAttribute('reinvested', false)
    } else {
        sliderReset();
    }
    lineChart.redraw(currentFundClass, isCash)
}

function sliderReset() {
    const slider = document.getElementById('slider-1');

    document.querySelector('#pill-toggle').style.left = 0;
    document.getElementById('ft-toggle-left').style.color = 'rgba(0, 41, 75, 1)';
    document.getElementById('ft-toggle-right').style.color = 'rgba(127, 127, 127, 1)';
    isCash = false;
    slider.setAttribute('reinvested', true)
}

// ******************************* ******************************* //
// *** MAKES LINE GRAPH FOR SECTION ONE OF GROWTH PAGE *********** //
// ******************************* ******************************* //

class LineChart {
    constructor(el, data, isCash, fundClass) {

        sliderReset();// LATE UPDATE FOR JORGE
        isCash = false; // LATE UPDATE, RESET SLIDER

        // console.log('')
        // console.log('********** LINECHART CONSTRUCTOR ***************')
        // console.log('lineChart():', testMessage)
        // // console.log('el', el)
        // console.error('IMPORTANT: data', data)
        // console.log('isCash:', isCash, ', fundClass:', fundClass)


        const vis = this;
        vis.asOfDate = data.a.lineData.asOfDate;
        vis.inception = data.a.inception;
        vis.tickerA = data.a.ticker;
        vis.tickerF2 = data.f2.ticker;

        if (fundClass === 'a') {
            vis.ticker = vis.tickerA
        } else if (fundClass === 'f2') {
            vis.ticker = vis.tickerF2;
        }

        vis.initialColor = boxColors[data.a.objective.trim()]
        vis.lines = [{ name: vis.ticker, color: vis.initialColor }]; // legend fund id
        if (data.a.indexPrimary) {
            vis.lines.push({ name: data.a.indexPrimary.trim(), color: getColor(data.a.indexPrimary.trim()) });
        }

        if (data.a.indexSecondary) {
            vis.lines.push({ name: data.a.indexSecondary.trim(), color: getColor(data.a.indexSecondary.trim()) });
        }

        if (data.a.indexSecondary2) {
            vis.lines.push({ name: data.a.indexSecondary2.trim(), color: getColor(data.a.indexSecondary2.trim()) });
        }

        if (data.a.indexSecondary3) {
            vis.lines.push({ name: data.a.indexSecondary3.trim(), color: getColor(data.a.indexSecondary3.trim()) });
        }

        function getColor(input) {
            const allColors = Object.keys(colors);

            if (allColors.includes(input))
                return colors[input]

            return 'blue'
        }

        // REMOVE OLD LEGEND
        // console.log('slapping')
        document.getElementById('fund-legend').innerHTML = ''

        // SLAP ON NEW LEGEND
        vis.lines.forEach((line, i) => {
            const newDiv = document.createElement('div');
            newDiv.classList = 'legend-group';
            newDiv.id = `legend-group-${i}`;
            if (i > 0) {
                newDiv.style.cursor = 'pointer';
                newDiv.style.transition = '.3s all ease-in-out';
                newDiv.onclick = toggleLine;
            }

            if (i === 0) {
                newDiv.innerHTML = `
                    <div class='ft-chart-circle' style='background-color: ${line.color}'></div>
                    <div id='legend-ticker-a'>
                        ${vis.tickerA}
                    </div>
                    <div id='legend-ticker-f2'>
                    ${vis.tickerF2}
                </div>
                `;
            } else {
                newDiv.innerHTML = `
                    <div class='ft-chart-circle' style='background-color: ${line.color};'></div>
                    ${line.name}
                `;
            }

            document.querySelector('#fund-legend').append(newDiv);
        });

        function toggleLine() {
            const el = this;

            // FADE LEGEND SECTION
            el.classList.toggle('faded');

            // FADE LINE
            const line = document.getElementById(`growth-line-${el.id.slice(-1)}`);
            line.style.transition = '.3s all ease-in-out';
            line.classList.toggle('hide-line')

            setTimeout(() => {
                line.style.transition = 'none';
            }, 301);
        }

        // console.log(data.a.lineData.cash[0], data.f2.lineData.cash[0]);

        //////////////////////////////////
        vis.draws = 0;
        vis.el = el;
        vis.fundClass = fundClass;
        vis.isCash = isCash;

        // SET DATA FOR OUR VARIOUS CLASSES
        vis.cashA = [];
        vis.reinvestedA = [];
        vis.cashF2 = [];
        vis.reinvestedF2 = [];

        // SET FOOTNOTE
        if (data.a.id === 'IVE' || data.a.id === 'GIF' || data.a.id == 'DWGI') {
            document.getElementById('ind-v-peer-sup').innerText = ''
        } else {
            document.getElementById('ind-v-peer-sup').innerText = '5';
        }

        // CONVERT DATES
        this.reduceDates(data)

        // ORDER line datams BY YEAR
        function compare(a, b) {
            // Use toUpperCase() to ignore character casing
            const yearA = a.date.getFullYear();
            const yearB = b.date.getFullYear();

            let comparison = 0;

            if (yearA > yearB) {
                comparison = 1;
            } else if (yearA < yearB) {
                comparison = -1;
            }

            return comparison;
        }

        vis.cashA.sort(compare);
        vis.reinvestedA.sort(compare);
        vis.cashF2.sort(compare);
        vis.reinvestedF2.sort(compare);

        // SET VIS.DATA ACCORDING TO SLIDERS
        if (vis.isCash) {
            if (vis.fundClass === 'a') {
                vis.data = vis.cashA;
            } else {
                vis.data = vis.cashF2;
            }
        } else {
            if (vis.fundClass === 'a') {
                vis.data = vis.reinvestedA;
            } else {
                vis.data = vis.reinvestedF2;
            }
        }
        // debugger;

        // REMOVE PREVIOUS DATA VIS
        if (document.getElementById(`g-line-top-section`)) document.getElementById('g-line-top-section').remove();

        // // console.log('vis.asOfDate', vis.asOfDate)
        // // console.log('vis.inception ', vis.inception)
        // // console.log(vis.tickerA, vis.tickerF2, vis.ticker)
        // // console.log('vis.initialColor', vis.initialColor)
        // console.log('vis.lines', vis.lines)

        // // console.log('vis.draws', vis.draws)
        // // console.log('vis.el', vis.el)
        // console.log('vis.fundClass:', vis.fundClass, ', vis.isCash:', vis.isCash)
        // console.log('vis.cashA', vis.cashA)
        // console.log('vis.reinvestedA', vis.reinvestedA)
        // console.log('vis.cashF2', vis.cashF2)
        // console.log('vis.reinvestedF2', vis.reinvestedF2)
        // console.log('vis.data', vis.data)
        // console.log('********** END CONSTRUCTOR ***************')
        // console.log('')



        this.setHypoDates();
        this.initVis();
    }

    reduceDates(data) {
        const vis = this;
        // SPECIAL CASES SINCE IGI DATA STARTS IN OCTOBER AND IVE/GIF STARTS IN APRIL
        // DWGI & GBAL STARTS IN FEB
        // this is coming from the "INDEX 10K MTN" PAGE IN THE DATA

        // THE LINE DATA HAS WAY MORE POINTS THAN THE INDEX DATA, SO WE ARE REDUCING THE LINE DATA TO 
        // MATCH THE INDEX DATA LENGTH (FOR THAT INDEX)
        if (data.a.id === 'IGI') {
            // this fund only uses the data points for 12/31 of each year, or when data is in October
            data.a.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 9) {
                    vis.cashA.push(d);
                }
            });
            data.a.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 9) {
                    vis.reinvestedA.push(d);
                }
            });

            data.f2.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 9) {
                    vis.cashF2.push(d);
                }
            });
            data.f2.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 9) {
                    vis.reinvestedF2.push(d);
                }
            });

        } else if (data.a.id === 'IVE' || data.a.id === 'GIF') {
            // these funds only get the data points for 12/31 of each year, or for data points in April
            data.a.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 3) {
                    vis.cashA.push(d);
                }
            });
            data.a.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 3) {
                    vis.reinvestedA.push(d);
                }
            });

            data.f2.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 3) {
                    vis.cashF2.push(d);
                }
            });
            data.f2.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 3) {
                    vis.reinvestedF2.push(d);
                }
            });

        } else if (data.a.id === 'DWGI' || data.a.id === 'GBAL') {
            // these funds get the data point at either 12/31 of each year OR for the data points in Feb
            data.a.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 1) {
                    vis.cashA.push(d);
                }
            });
            data.a.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 1) {
                    vis.reinvestedA.push(d);
                }
            });

            data.f2.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 1) {
                    vis.cashF2.push(d);
                }
            });
            data.f2.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31 || d.date.getMonth() === 1) {
                    vis.reinvestedF2.push(d);
                }
            });

        } else {
            // for all other funds we are only going to use the data point for 12/31 of each year
            data.a.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31) {
                    vis.cashA.push(d);
                }
            });
            data.a.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31) {
                    vis.reinvestedA.push(d);
                }
            });

            data.f2.lineData.cash.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31) {
                    vis.cashF2.push(d);
                }
            });
            data.f2.lineData.reinvested.forEach(d => {
                d.date = nd(d.date);
                if (d.date.getMonth() === 11 && d.date.getDate() === 31) {
                    vis.reinvestedF2.push(d);
                }
            });
        }
    }

    setHypoDates() {
        document.querySelectorAll('.hypo-date-1').forEach(e => e.innerText = hypoDateOne);
        document.querySelectorAll('.hypo-date-2').forEach(e => e.innerText = hypoDateTwo);
    }

    initVis() {
        const vis = this;

        // APPEND ELEMENTS TO THE LEGEND

        // CHART
        vis.chartDiv = document.getElementById(vis.el);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('id', 'g-line-top-section');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis').style('text-anchor', 'start');

        // APPEND Y AXIS
        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis').style('text-anchor', 'end');

        // ADD LINE
        vis.navValue = vis.g
            .append('path')
            .attr('class', 'line-path nav-val')
            .attr('id', 'growth-line-0')
            .attr('fill', 'none')
            .attr('stroke', vis.initialColor)
            .attr('stroke-width', '1.5px');

        // ADD LINE
        vis.indexPrimaryValue = vis.g
            .append('path')
            .attr('class', 'line-path index-pv')
            .attr('id', 'growth-line-1')
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px');

        // ADD LINE
        vis.indexSecondaryValue = vis.g
            .append('path')
            .attr('class', 'line-path index-sv')
            .attr('id', 'growth-line-2')
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px');

        // ADD LINE
        vis.indexSecondary2Value = vis.g
            .append('path')
            .attr('class', 'line-path index-sv-two')
            .attr('id', 'growth-line-3')
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px');

        // ADD LINE
        vis.indexSecondary3Value = vis.g
            .append('path')
            .attr('class', 'line-path index-sv-three')
            .attr('id', 'growth-line-4')
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px');

        // ADD TEXT
        vis.text = vis.g.append('text').attr('class', 'line-chart-text')

        this.redraw();
    }

    redraw(fundClass = this.fundClass, isCash = this.isCash) {
        const vis = this;
        vis.fundClass = fundClass;
        vis.isCash = isCash;
        vis.draws++;


        // console.log('********** LINECHART.REDRAW ***************');
        // console.log('fundclass', fundClass, 'isCash', isCash)
        // console.log('vis.fundclass', vis.fundClass, 'vis.isCash', vis.isCash)
        // // console.log("vis.draws", vis.draws)


        // Extract the width and height that was computed by CSS.
        vis.width = vis.chartDiv.clientWidth;
        vis.height = vis.chartDiv.clientHeight;
        vis.MARGIN = { top: 7, right: window.innerWidth < 1100 ? 30 : 50, bottom: 30, left: 0 };
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // Use the extracted size to set the size of an SVG element.
        vis.svg.attr('width', vis.width).attr('height', vis.height);

        // SET G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // SET DATA ACCORDING TO SLIDERS
        if (vis.isCash) {

            if (vis.fundClass === 'a') {
                vis.data = vis.cashA;
            } else if (vis.fundClass === 'f2') {
                vis.data = vis.cashF2;
            } else {
                console.error('VIS.DATA NOT SET')
            }
        } else {

            if (vis.fundClass === 'a') {
                vis.data = vis.reinvestedA;
            } else if (vis.fundClass === 'f2') {
                vis.data = vis.reinvestedF2;
            } else {
                console.error('VIS.DATA NOT SET')
            }
        }

        // console.log('lineChart.redraw() vis.data:', vis.data);
        // console.log('********** END REDRAW OUTPUT **********')

        // debugger

        // SHOW LEGEND TICKER NAME
        if (vis.fundClass === 'a') {
            document.getElementById('legend-ticker-a').style.opacity = 1;
            document.getElementById('legend-ticker-f2').style.opacity = 0;

        } else if (vis.fundClass === 'f2') {
            document.getElementById('legend-ticker-a').style.opacity = 0;
            document.getElementById('legend-ticker-f2').style.opacity = 1;
        }

        // Y SCALE
        const maxVals = [];
        let tempMax = null;

        // STEPS THROUGH EACH RECORD, AND FINDS THE MAX VALUE FOR EACH RECORD
        for (let i = 0; i < vis.data.length; i++) {
            if (vis.lines.length === 5) {
                tempMax = d3.max([
                    vis.data[i].navValue,
                    vis.data[i].indexPrimaryValue,
                    vis.data[i].indexSecondaryValue,
                    vis.data[i].indexSecondary2Value,
                    vis.data[i].indexSecondary3Value
                ]);
            } else if (vis.lines.length === 4) {
                tempMax = d3.max([
                    vis.data[i].navValue,
                    vis.data[i].indexPrimaryValue,
                    vis.data[i].indexSecondaryValue,
                    vis.data[i].indexSecondary2Value
                ]);
            } else if (vis.lines.length === 3) {
                tempMax = d3.max([
                    vis.data[i].navValue,
                    vis.data[i].indexPrimaryValue,
                    vis.data[i].indexSecondaryValue
                ]);
            } else if (vis.lines.length === 2) {
                tempMax = d3.max([vis.data[i].navValue, vis.data[i].indexPrimaryValue]);
            } else if (vis.lines.length === 1) {
                tempMax = d3.max([vis.data[i].navValue]);
            }
            maxVals.push(tempMax);
        }

        // FINDS THE MAX OF THE MAXES ...and then it adds 5K as a buffer
        const yMax = d3.max(maxVals) + 5000;
        let y = d3.scaleLinear().range([vis.gHEIGHT, 0]).domain([0, yMax]).nice();

        //debugger;
        // ABORT
        if (vis.data.length <= 1) {
            vis.text
                .text('No data available. Please see the fund detail web page.')
                .attr('x', vis.gWIDTH / 2)
                .attr('y', vis.gHEIGHT / 2)
                .transition()
                .duration(500)
                .attr('opacity', 1)

            d3.selectAll('.line-path')
                .transition()
                .duration(500)
                .attr('opacity', 0)

            vis.draws = 0;

            return
        } else {
            vis.text
                .transition()
                .duration(500)
                .attr('opacity', 0)
        }

        // X SCALE
        vis.x = d3.scaleTime().domain(d3.extent(vis.data, d => d.date)).range([0, vis.gWIDTH]);

        // Y AXIS
        const yAxisCall = d3
            .axisRight()
            .ticks(5)
            // .tickValues([-5, 0, 25, 50])
            .tickPadding(45)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat((el, i) => (i === y.ticks(5).length - 1 ? '$' + el / 1000 + ' (Thousands)' : el / 1000));

        const customOffset = window.innerWidth < 1200 ? 50 : 50;
        vis.yAxis
            .attr('transform', `translate(${vis.width - customOffset}, ${vis.MARGIN.top})`)
            .transition()
            .duration(500)
            .call(yAxisCall.scale(y));

        // X AXIS /////////////////////////////////////////
        const years = vis.data.map(d => d.date.getFullYear()) // data is already sorted
        const jump = years.length > 15 ? 2 : 1
        const tickVals = []
        for (let i = 0; i < vis.data.length; i = jump + i) {
            tickVals.push(nd(String(years[0] + i + 1))) // ND is giving one less than the years we are feeding in
        }

        const xAxisCall = d3
            .axisBottom()
            // .ticks(5)
            .tickValues(tickVals)
            // .tickPadding(window.innerWidth < 1200 ? 2 : window.innerHeight < 770 ? 2 : 4)
            .tickFormat(el => {
                return String(el.getFullYear()).slice(-2);
            });

        // POSITION SET ON FIRST DRAW ONLY
        if (vis.draws <= 1) {
            vis.xAxis
                .attr('transform', `translate(0, ${y(0) + vis.MARGIN.top})`)
        }
        vis.xAxis
            .transition()
            .delay(0)
            .duration(500)
            .attr('opacity', 1)
            .attr('transform', `translate(0, ${y(0) + vis.MARGIN.top})`)
            .call(xAxisCall.scale(vis.x).tickSizeOuter([0]));

        // LINE FUNCTION
        const line = d3
            .line()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y(d => y(d.navValue)); // set the y values for the line generator

        // LINE FUNCTION
        const line2 = d3
            .line()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y(d => y(d.indexPrimaryValue)); // set the y values for the line generator
        // LINE FUNCTION
        const line3 = d3
            .line()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y(d => y(d.indexSecondaryValue)); // set the y values for the line generator

        // LINE FUNCTION
        const line4 = d3
            .line()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y(d => y(d.indexSecondary2Value)); // set the y values for the line generator

        // LINE FUNCTION
        const line5 = d3
            .line()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y(d => y(d.indexSecondary3Value)); // set the y values for the line generator

        const flatLine = d3
            .area()
            .x(d => vis.x(d.date)) // set the x values for the line generator
            .y0(y(0))
            .y1(y(0));

        // Redraws Line/update our line path
        if (vis.draws === 1) {
            vis.navValue
                .attr('d', flatLine(vis.data))
                .attr('opacity', 0)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .transition()
                .duration(1200)
                .attr('d', line(vis.data));

            vis.indexPrimaryValue
                .attr('d', flatLine(vis.data))
                .attr('stroke', vis.lines[1].color)
                .attr('opacity', 0)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .transition()
                .duration(1200)
                .attr('d', line2(vis.data));
        } else {
            vis.navValue.transition().duration(500).attr('opacity', 1).attr('d', line(vis.data));
            vis.indexPrimaryValue.transition().duration(500).attr('opacity', 1).attr('d', line2(vis.data));
        }

        // Redraws Line/update our line path
        if (vis.lines.length > 2) {
            if (vis.draws === 1) {
                vis.indexSecondaryValue
                    .attr('d', flatLine(vis.data))
                    .attr('stroke', vis.lines[2].color)
                    .attr('opacity', 0)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .transition()
                    .duration(1200)
                    .attr('d', line3(vis.data));
            } else {
                vis.indexSecondaryValue.transition().duration(500).attr('opacity', 1).attr('d', line3(vis.data));
            }
        }

        // Redraws Line/update our line path
        if (vis.lines.length > 3) {
            if (vis.draws === 1) {
                vis.indexSecondary2Value
                    .attr('d', flatLine(vis.data))
                    .attr('stroke', vis.lines[3].color)
                    .attr('opacity', 0)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .transition()
                    .duration(1200)
                    .attr('d', line4(vis.data));
            } else {
                vis.indexSecondary2Value.transition().duration(500).attr('opacity', 1).attr('d', line4(vis.data));
            }
        }

        // Redraws Line/update our line path
        if (vis.lines.length > 4) {
            if (vis.draws === 1) {
                vis.indexSecondary3Value
                    .attr('d', flatLine(vis.data))
                    .attr('stroke', vis.lines[4].color)
                    .attr('opacity', 0)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .transition()
                    .duration(1200)
                    .attr('d', line5(vis.data));
            } else {
                vis.indexSecondary3Value.transition().duration(500).attr('opacity', 1).attr('d', line5(vis.data));
            }
        }
    } // end redraw
}
