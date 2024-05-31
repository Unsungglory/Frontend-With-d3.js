
// ................................
// TARGET DATE, EXCESS RETURNS SECTION (LINE CHART)
// ...............................

// const BLUE = 'rgba(0, 95, 155, 1)';
const BLUE50 = 'rgba(0, 95, 155, .12)';
const BLUE0 = 'rgba(0, 95, 155, 0)';

// const SKY = 'rgba(0, 174, 169, 1)';
const SKY50 = 'rgba(0, 174, 169, 0.12)';
const SKY0 = 'rgba(0, 174, 169, 0)';

const BLUE_GRADIENT = 'url(#BLUE-grad)';
const SKY_GRADIENT = 'url(#SKY-grad)';


// Gradients
const SAPPH = 'rgba(0, 95, 158, 1)';
const SAPPH50 = 'rgba(0, 95, 158, 0.12)';
const SAPPH0 = 'rgba(0, 95, 158, 0)';

// const OCEAN = 'rgba(0, 156, 220, 1)';
const OCEAN50 = 'rgba(0, 156, 220, 0.12)';
const OCEAN0 = 'rgba(0, 156, 220, 0)';

const DARKTURQ = 'rgba(0, 76, 70, 1)';
const DARKTURQ50 = 'rgba(0, 76, 70, 0.12)';
const DARKTURQ0 = 'rgba(0, 76, 70, 0)';

const TURQ = 'rgba(0, 174, 169, 1)';
const TURQ50 = 'rgba(0, 174, 169, 0.12)';
const TURQ0 = 'rgba(0, 174, 169, 0)';

const DARKRASP = 'rgba(118, 33, 87, 1)';
const DARKRASP50 = 'rgba(118, 33, 87, 0.12)';
const DARKRASP0 = 'rgba(118, 33, 87, 0)';

// const BONE = 'rgba(213, 208, 202, 1)';
const BONE50 = 'rgba(213, 208, 202, 0.12)';
const BONE0 = 'rgba(213, 208, 202, 0)';

const SAPPH_GRADIENT = 'url(#SAPPH-grad)';
const OCEAN_GRADIENT = 'url(#OCEAN-grad)';
const DARKTURQ_GRADIENT = 'url(#DARKTURQ-grad)';
const TURQ_GRADIENT = 'url(#TURQ-grad)';
const DARKRASP_GRADIENT = 'url(#DARKRASP-grad)';
const BONE_GRADIENT = 'url(#BONE-grad)';

// SHARE CLASS
let labelShareClass = 'F2';


const shortScreen = window.innerHeight <= 830;

let zoomed = false;
let filled = false;
let lowDate = null;
let highDate = null;

// const excessReturnsData = [
//     { date: "Sat Oct 31 2020 17:00:00 GMT-0700 (Pacific Daylight Time)", AFTD: "566099.2881724435", TI: 531500.9773777067, CI: 517274.69315829605, SP: 485018.1936906408, },
//     { date: "Mon Nov 30 2020 16:00:00 GMT-0800 (Pacific Standard Time)", AFTD: "613472.6687576362", TI: 574535.5231472703, CI: 558986.8535801662, SP: 526991.694096429, },
//     { date: "Thu Dec 31 2020 16:00:00 GMT-0800 (Pacific Standard Time)", AFTD: "633186.9074350438", TI: 590736.3151959212, CI: 574937.8003015355, SP: 544013.5258157437, },
// ]

const excessReturnsData = dataTD.excessReturn;

excessReturnsData.data.forEach(el => {
    el.date = new Date(el.date)
});

//************************** D3    CHARTS ***************************************************//
//******************************************************************************************//

class TDEXCESSRETURNS {
    constructor() {
        this.draws = 0;
        this.data = excessReturnsData.data;
        this.sourceOfReturns = excessReturnsData.returns;
        this.lastData = this.data[this.data.length - 1];
        this.securitySelectionText = Math.round(this.lastData.AFTD - this.lastData.TI)
        this.flexibilityText = Math.round(this.lastData.TI - this.lastData.CI)
        this.glidePathText = Math.round(this.lastData.CI - this.lastData.SP)
        this.indexText = Math.round(this.lastData.SP)
        this.initVis();
    }
    initVis() {
        const vis = this;

        // CHART
        vis.chartDiv = document.getElementById("td-ex-returns-chart");
        vis.chartDiv.innerHTML = '' // clear this out, because dang it iPad! WHY?! WHY?! SERIOUSLY?!

        vis.svg = d3.select(vis.chartDiv).append("svg").attr('id', 'g-line');

        // APPEND G
        vis.g = vis.svg
            .append('g')
            .attr('class', 'g3')

        vis.getTheWidthOfThisText = vis.g.append('text')
            .text('$700,000$')
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('font-size', 'clamp(8px, 1vw, 15px)')
            .style('font-weight', '700')

        vis.zeroLine = vis.g
            .append('line')
            .attr('class', 'zero-line')

        // APPEND LINE
        vis.tealLine = vis.g
            .append('path')
            .attr('stroke', '#00AEA9')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')
        vis.blueLine = vis.g
            .append('path')
            .attr('stroke', '#005F9E')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')
        vis.redLine = vis.g
            .append('path')
            .attr('stroke', '#762157')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')
        vis.greyLine = vis.g
            .append('path')
            .attr('stroke', '#7D716E')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')

        vis.lineGroup = vis.svg.append('g').attr('class', 'lines');

        // ADD AREA
        vis.tealArea = vis.g.append("path")
            .attr('fill', TURQ_GRADIENT);

        vis.blueArea = vis.g.append("path")
            .attr('fill', SAPPH_GRADIENT);
        vis.redArea = vis.g.append("path")
            .attr('fill', DARKRASP_GRADIENT);
        vis.greyArea = vis.g.append("path")
            .attr('fill', BONE_GRADIENT);

        // APPEND WHITE BOX TO COVER AREA WHEN CHART EXPANDS DURING ZOOM
        vis.whiteBox = vis.svg
            .append('rect')
            .attr('fill', 'white')
            .attr('width', 25)
            .attr('x', 0)
            .attr('y', 0)

        // APPEND X AXIS 
        vis.xAxis = vis.g
            .append('g')
            .attr('class', 'axis x-axis p-12')
            .style('text-anchor', 'start')
            .style("letter-spacing", '-0.06em')

        // APPEND Y AXIS 
        vis.yAxis = vis.g
            .append('g')
            // .style('text-anchor', 'start')
            .attr('class', 'axis y-axis')

        vis.topLabel = d3.select(vis.chartDiv)
            .append("div")
            .attr('id', 'text-label-1')
            .attr('class', 'text-label')
            .html(`<div class=' p-18 p-blue'>
                <div> Fund </div> 
                <div class='demi'> $${d3.format(',')(Math.round(vis.data[vis.data.length - 1].AFTD))} </div>
                </div>
            `)

        vis.label2 = d3.select(vis.chartDiv)
            .append("div")
            .attr('id', 'text-label-3')
            .attr('class', 'text-label')
            .html(`<div class='text-label p-18 p-blue' style='white-space: nowrap;'>
                <div>Security selection</div> 
                <div class='demi'>+$${d3.format(',')(vis.securitySelectionText)} </div>
                </div>
            `)

        vis.label3 = d3.select(vis.chartDiv)
            .append("div")
            .attr('id', 'text-label-4')
            .attr('class', 'text-label')
            .html(`<div class='text-label p-18 p-turq'>
                    <div>Flexibility</div> 
                    <div class='demi'> +$${d3.format(',')(vis.flexibilityText)} </div>
                </div>
            `)

        vis.label4 = d3.select(vis.chartDiv)
            .append("div")
            .attr('id', 'text-label-5')
            .attr('class', 'text-label')
            .html(`<div class='text-label p-18 p-raspberry' style='white-space: nowrap;'>
                <div>Glide path</div> 
                <div class='demi'> +$${d3.format(',')(vis.glidePathText)} </div>
            </div>
            `)

        vis.label5 = d3.select(vis.chartDiv)
            .append("div")
            .attr('id', 'text-label-6')
            .attr('class', 'text-label')
            .html(`<div class='text-label p-18' style='color: #7D716E'>
                        <div>Index</div> 
                        <div class='demi'> $${d3.format(',')(vis.indexText)}</div>
                    </div>
            `)

        // DEFINE LINEAR GRADIENT
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'BONE-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', BONE50);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', BONE0);
        // DEFINE LINEAR GRADIENT
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'SAPPH-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', SAPPH50);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', SAPPH0);

        // DEFINE LINEAR GRADIENT
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'TURQ-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', TURQ50);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', TURQ0);
        // DEFINE LINEAR GRADIENT
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'DARKRASP-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', DARKRASP50);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', DARKRASP0);

        // DEFINE LINEAR GRADIENT
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'BLUE-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', BLUE50);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', BLUE0);

        // FINALLY, APPEND A TOUCH LAYER TO BYPASS ALL OF OUR TEXT AND OTHER DIVS THAT HAVE BEEN APPENDED
        vis.touchLayer = d3.select('#chart').append('div').attr('class', 'touch-layer').style('position', 'absolute');

        // you know, ipad sizes are being weird, so maybe if we let the page load a little bit things will render better
        setTimeout(() => {
            this.wrangle();

        }, 500);
    }

    wrangle(x1 = d3.min(this.data, d => d.date), x2 = d3.max(this.data, d => d.date)) {
        const vis = this;

        // Extract the width and height that was computed by CSS.
        vis.width = vis.chartDiv.clientWidth;
        vis.height = vis.chartDiv.clientHeight;
        vis.bottom = 0;
        vis.top = 0;
        vis.MARGIN = { top: vis.top, right: vis.width * .03, bottom: vis.bottom, left: vis.width * .005 };
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        if (vis.height <= 0) setTimeout(() => {
            vis.wrangle();
            console.warn('hit me with a re-wrangle, FEE Excess returns')
        }, 999);

        // X SCALE
        vis.firstDate = x1;
        vis.lastDate = x2;
        // const lowerBoundX = x1;
        vis.lowerBoundX = new Date('Dec 21 2005 11:11:11 GMT-0700 (Pacific Daylight Time)');

        vis.x = d3
            .scaleTime()
            .domain([vis.lowerBoundX, x2])
            .range([0, vis.gWIDTH * .9])


        vis.redraw()
    }

    redraw(pan = false) {
        const vis = this;

        // const iPad = window.innerWidth < 1400 && window.innerHeight > 1000;
        // const smallLapTop = window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750;
        // const seismicApp = window.innerWidth < 1100;

        vis.draws += 1;

        // Use the extracted size to set the size of an SVG element.
        vis.svg
            .attr("width", vis.width)
            .attr("height", vis.height);

        // SET SIZE FOR TOUCH LAYER
        vis.touchLayer
            .style("width", vis.width + 'px')
            .style("height", vis.height + 'px')
            .style("top", 0)
            .attr("pointer-events", "all")

        // SET G
        vis.g.attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        ///////////////////////////////////////////////////////
        const x = vis.x;

        let yMax = 750000;
        let yMin = -100000;

        const y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([yMin, yMax]);

        // ****************  LINE FUNCTIONS ****************************
        const generateTealLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.TI));

        const generateblueLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.AFTD));

        const generateRedline = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.CI));

        const generategreyLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.SP));
        // **************** END LINE FUNCTIONS ****************************


        // creates a flat starting path to start the animation
        let startLine = vis.data.map(k => {
            return { date: k.date, AFTD: yMin, TI: yMin, CI: yMin, SP: yMin };
        });

        const TOPPOS = 740000;
        const POS2 = 660000;
        const POS3 = 577000;
        const POS4 = 500000;
        const POS5 = 425000;

        ////////////////// LINES 
        const labelXpos = vis.width * .88
        vis.topLabel
            .style('left', labelXpos + vis.MARGIN.left + 'px')
            .style('top', y(TOPPOS) + vis.MARGIN.top + 'px')

        vis.label2
            .style('top', y(POS2) + vis.MARGIN.top + 'px')
            .style('left', labelXpos + vis.MARGIN.left + 'px')

        vis.label3
            .style('top', y(POS3) + vis.MARGIN.top + 'px')
            .style('left', labelXpos + vis.MARGIN.left + 'px')

        vis.label4
            .style('top', y(POS4) + vis.MARGIN.top + 'px')
            .style('left', labelXpos + vis.MARGIN.left + 'px')

        vis.label5
            .style('top', y(POS5) + vis.MARGIN.top + 'px')
            .style('left', labelXpos + vis.MARGIN.left + 'px')


        if (vis.draws <= 1) {
            vis.tealLine
                .attr('d', generateTealLine(startLine))
                .transition()
                .duration(1500)
                .delay(0)
                .attr('d', generateTealLine(vis.data))
            vis.redLine
                .attr('d', generateRedline(startLine))
                .transition()
                .duration(1500)
                .delay(0)
                .attr('d', generateRedline(vis.data))
            vis.blueLine
                .attr('d', generateblueLine(startLine))
                .transition()
                .duration(1500)
                .delay(0)
                .attr('d', generateblueLine(vis.data))
            vis.greyLine
                .attr('d', generategreyLine(startLine))
                .transition()
                .duration(1500)
                .delay(0)
                .attr('d', generategreyLine(vis.data))

        } else {
            if (pan) {
                vis.tealLine
                    .attr('d', generateTealLine(vis.data))
                vis.redLine
                    .attr('d', generateRedline(vis.data))
                vis.blueLine
                    .attr('d', generateblueLine(vis.data))
                vis.greyLine
                    .attr('d', generategreyLine(vis.data))

            } else {

                vis.tealLine
                    .transition()
                    .duration(1000)
                    .delay(0)
                    .attr('d', generateTealLine(vis.data));
                vis.redLine
                    .transition()
                    .duration(1000)
                    .delay(0)
                    .attr('d', generateRedline(vis.data))
                vis.blueLine
                    .transition()
                    .duration(1000)
                    .delay(0)
                    .attr('d', generateblueLine(vis.data))
                vis.greyLine
                    .transition()
                    .duration(1000)
                    .delay(0)
                    .attr('d', generategreyLine(vis.data))
            }
        }



        const tickVals = []
        for (let i = 2007; i < new Date().getFullYear(); i = i + 1) {
            tickVals.push(new Date('Jan 1 ' + String(i) + ' 16:00:21 GMT-0700 (Pacific Daylight Time)'))
        }
        ////////////////////////////// X AXIS
        const xAxisCall = d3.axisBottom()
            .tickValues(tickVals)
            .tickSizeOuter([0])
            .tickPadding(9)
            .tickFormat(e => {
                if (e.getMonth() === 0) {
                    return "Dec " + e.getFullYear();
                }
            });

        const xAxisPosition = 0;

        if (vis.draws <= 1) {
            vis.xAxis
                .call(xAxisCall.scale(x))
                .attr('transform', `translate(${vis.MARGIN.left}, ${y(xAxisPosition)})`)
                .transition()
                .duration(1500)
                .delay(0)
                .attr('transform', `translate(${vis.MARGIN.left}, ${y(xAxisPosition)})`)
        } else {
            if (pan) {
                vis.xAxis
                    .attr('transform', `translate(0, ${y(xAxisPosition)})`)
                    .call(xAxisCall.scale(x))

            } else {
                if (zoomed) {
                    vis.xAxis
                        .transition()
                        .delay(0)
                        .duration(1000)
                        .attr('transform', `translate(${vis.MARGIN.left}, ${y(xAxisPosition)})`)
                        .call(xAxisCall.scale(x))
                } else {
                    vis.xAxis
                        .transition()
                        .delay(0)
                        .duration(1000)
                        .attr('transform', `translate(${vis.MARGIN.left}, ${y(xAxisPosition)})`)
                        .call(xAxisCall.scale(x))
                }
            }
        }

        //////////////////////////////// Y AXIS
        const yAxisCall = d3.axisLeft()
            .tickValues([0, 100000, 200000, 300000, 400000, 500000, 600000, 700000])
            .tickFormat(e => e === 700000 ? '$' + d3.format(',')(e) : d3.format(',')(e))
            .tickPadding(10)

        const offsetBoys = vis.getTheWidthOfThisText.node().getBBox().width * .99;

        if (vis.draws <= 1) {
            vis.yAxis
                .attr('transform', `translate(${offsetBoys},0)`)
                .call(yAxisCall.scale(y).tickSizeOuter([0]))
        } else {
            vis.yAxis
                .transition()
                .delay(0)
                .duration(1000)
                .attr('transform', `translate(${offsetBoys},0)`)
                .call(yAxisCall.scale(y).tickSizeOuter([0]))
        }

        ///////////////// 
        if (vis.draws <= 1) {
            vis.zeroLine
                .attr('x1', x(vis.firstDate))
                .attr('x2', x(vis.lastDate))
                .attr('y1', y(0))
                .attr('y2', y(0))
                .attr('stroke', 'rgba(0,0,0,0.2)')
                .attr('stroke-width', 1)
                .attr('opacity', 0)
                .transition()
                .delay(0)
                .duration(1600)
                .attr('opacity', 1)
        } else {
            vis.zeroLine
                .transition()
                .duration(1000)
                .attr('x1', x(vis.firstDate))
                .attr('x2', x(vis.lastDate))
                .attr('y1', y(0))
                .attr('y2', y(0))
                .attr('opacity', 1)
        }

        if (vis.draws <= 1)
            vis.updateGridText();

    } // end redraw

    updateGridText() {
        const vis = this;

        document.getElementById('td-er-0').innerHTML = `+${vis.sourceOfReturns[0].replace('%', '')}<sup>%</sup>`
        document.getElementById('td-er-1').innerHTML = `+${vis.sourceOfReturns[1].replace('%', '')}<sup>%</sup>`
        document.getElementById('td-er-2').innerHTML = `+${vis.sourceOfReturns[2].replace('%', '')}<sup>%</sup>`
        document.getElementById('td-er-3').innerHTML = `+${vis.sourceOfReturns[3].replace('%', '')}<sup>%</sup>`
        document.getElementById('td-er-4').innerHTML = `+${vis.sourceOfReturns[4].replace('%', '')}<sup>%</sup>`
    } // end function

} //end class
//*************************************************************************************************//
//*************************************************************************************************//

// const chart = new drawChart();

// window.addEventListener("resize", () => redraw());

// function redraw() {
//     chart.wrangle(lowDate, highDate);
// }

function fortmatNumToUSD(val) {
    return val.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })
}




