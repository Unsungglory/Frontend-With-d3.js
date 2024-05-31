// THE UNDERLYING FUNDS COLORED TABLE
let arrow1, arrow2, arrow3, arrow4, arrow5;
function underLyingFundsTable(redraw = false) {

    // console.warn('uf', dataTD.underlyingFunds)

    if (!redraw) {
        document.querySelectorAll('.uf-update').forEach((el, i) => {
            const output = dataTD.underlyingFunds[i];

            if (i % 17 === 0) {

                // THIS FOR THE FIRST COLUMNS (NAMES OF FUNDS)
                if (el.firstElementChild)
                    el.firstElementChild.innerHTML = output;
                else
                    el.innerHTML = output;

            } else {
                el.innerHTML = output;
            }
        })

        arrow1 = new DrawUFArrow(7, 'beautiful-arrow-1');
        arrow2 = new DrawUFArrow(5, 'beautiful-arrow-2');
        arrow3 = new DrawUFArrow(1, 'beautiful-arrow-3');
        arrow4 = new DrawUFArrow(1, 'beautiful-arrow-4');
        arrow5 = new DrawUFArrow(8.5, 'beautiful-arrow-5');
    } else {
        arrow1.redraw();
        arrow2.redraw();
        arrow3.redraw();
        arrow4.redraw();
        arrow5.redraw();
    }

}


// ................................
// DRAW THE FORMERLY-MAGENTA DOWNWARD ARROWS ON THE UNDERLYING FUNDS TABLE
// ...............................

class DrawUFArrow {
    constructor(arrowHeightInRow, el) {
        this.arrowHeight = arrowHeightInRow;
        this.el = el;
        this.draws = 0;
        this.ARROW_GRAD = 'url(#ARROW-grad)';
        this.initVis();
    }

    initVis() {
        const vis = this;

        // CHART
        vis.chartDiv = document.getElementById(vis.el);

        vis.svg = d3.select(vis.chartDiv).append("svg");
        vis.svg
            .style('position', 'absolute')
            .style('width', '100%')
            .style('height', '100%')
            .style('z-index', 2)

        // APPEND G
        vis.g = vis.svg
            .append('g')
            .attr('class', 'FUN-g');

        // ADD ARROW
        vis.arrow = vis.g.append('polygon');

        // DEFINE LINEAR GRADIENT
        const DARKRASP = 'rgba(118, 33, 87, .88)';
        const DARKRASP50 = 'rgba(118, 33, 87, 0.12)';
        const DARKRASP0 = 'rgba(118, 33, 87, 0)';
        vis.gradient = vis.svg
            .append('linearGradient')
            .attr('id', 'ARROW-grad')
            .attr('x1', 0)
            .attr('y1', 0.2)
            .attr('x2', 0)
            .attr('y2', 1)
            .attr('gradientUnits', 'objectBoundingBox');
        vis.gradient
            .append('stop')
            .attr('offset', '0')
            .attr('stop-color', DARKRASP);
        vis.gradient
            .append('stop')
            .attr('offset', '1')
            .attr('stop-color', DARKRASP50);

        this.redraw();
    }

    redraw() {
        // const iPad = window.innerWidth < 1400 && window.innerHeight > 1000;
        // const desktop = window.innerWidth > 1400;
        // const smallLapTop = window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750;
        // const seismicApp = window.innerWidth < 1100;

        const vis = this;
        vis.draws += 1;

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;
        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.gWIDTH = width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // Use the extracted size to set the size of an SVG element.
        vis.svg
            .style('overflow', 'visible')
            .attr("width", width)
            .attr("height", height);

        // SET G
        vis.g.attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        ///////////////////////////////////////////////////////////////////////////////
        const ARROWWIDTH = vis.gWIDTH;
        const TIPHEIGHT = vis.gHEIGHT * .55;
        const STARTINGPOINTx = 0;
        const STARTINGPOINTy = Math.round(vis.gHEIGHT / 8);
        const ARROWHEIGHT = (vis.gHEIGHT * 1.02) * vis.arrowHeight;

        //DRAW ARROW (FROM HELL, JK... IT'S A JOKE! HAPPY HALLOWEEN)
        if (vis.draws === 1) {
            vis.arrow
                // this is a totolly flat starting point
                .attr(
                    'points',
                    `
                    0,${vis.gHEIGHT} 
                    ${ARROWWIDTH / 2},${vis.gHEIGHT} 
                    ${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    -${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    -${ARROWWIDTH / 2},${vis.gHEIGHT} 
                    0,${vis.gHEIGHT}
                    `
                )
                // .attr('fill', vis.ARROW_GRAD)
                .attr('fill', '#004C46')
                .style('transform', `translate(${STARTINGPOINTx}px, ${STARTINGPOINTy}px)`)
                .attr('opacity', 0)
                .transition(500)
                .duration(100)
                .attr('opacity', 0.3)
                .transition()
                .duration(2500)
                .attr(
                    'points',
                    `
                    0,0 
                    ${ARROWWIDTH / 2},${0} 
                    ${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    ${0},${ARROWHEIGHT + TIPHEIGHT} 
                    -${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    -${ARROWWIDTH / 2},${0} 
                    0,0
                    `
                )
                .attr('opacity', 1);
        } else {
            // UPDATE
            vis.arrow
                .transition()
                .duration(1000)
                .attr('opacity', 1)
                .style('transform', `translate(${STARTINGPOINTx}px, ${STARTINGPOINTy}px)`)
                .attr(
                    'points',
                    `
                    0,0 
                    ${ARROWWIDTH / 2},${0} 
                    ${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    ${0},${ARROWHEIGHT + TIPHEIGHT} 
                    -${ARROWWIDTH / 2},${ARROWHEIGHT} 
                    -${ARROWWIDTH / 2},${0} 
                    0,0
                    `
                );
        }

    } // end redraw
} //end class



/////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////
// APPEARS TO BE USED FOR TOGGLE SECTIONS THAT ARE NO LONGER DIPSLAYED
/////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////



// NO LONGER DISPLAYED
function toggleSliderUF(num) {
    const slider = document.getElementById('pill-toggle-uf-1');
    const container = document.getElementById('fp-target-date-3');

    const largerSize = window.innerWidth < 1200 ? '650px' : window.innerHeight < 770 ? '1075px' : window.innerWidth < 1400 ? '1056px' : '1056px'
    const smallerSize = window.innerWidth < 1200 ? '480px' : window.innerHeight < 770 ? '575px' : window.innerWidth < 1400 ? '740px' : '800px'

    showUFSection(num);
    switch (num) {
        case 0:
            slider.style.left = 0;
            container.style.height = largerSize;
            calculateLinePos();

            break;
        case 1:
            slider.style.left = '33.33%';
            container.style.height = smallerSize;
            tdBarChart = new TDBarChartSection();

            break;
        case 2:
            slider.style.left = '66.66%';
            container.style.height = smallerSize;

            ufStackedBars = new StackedBarChart();
            break;
    }
};

// NO LONGER DISPLAYED
function showUFSection(num) {
    const texts = document.querySelectorAll('.uf-toggle-text');
    const subs = document.querySelectorAll('.uf-sub-pos');
    const sections = document.querySelectorAll('.uf-section-holder');

    for (let i = 0; i < 3; i++) {
        if (i === num) {
            texts[i].style.color = 'rgba(0, 41, 75, 1)';
            subs[i].style.opacity = 1;
            sections[i].style.opacity = 1;
        } else {
            texts[i].style.color = 'rgba(127, 127, 127, 1)';
            subs[i].style.opacity = 0;
            sections[i].style.opacity = 0;
        }
    }
}

/////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

// NO LONGER USED
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function calculateLinePos() {

    let tdTable = document.querySelector(".td-table");
    let tableContainer = document.querySelector("#uf-section-1");
    let currentLine = document.querySelector('#td-table-line');

    if (currentLine) {
        currentLine.remove();
    }

    let parentPos = tdTable.getBoundingClientRect();

    let starterLinePos = document.getElementById('td-table-line-start').getBoundingClientRect();
    let endLinePos = document.getElementById('td-table-line-end').getBoundingClientRect();

    let relativestartPos = {}
    relativestartPos.top = starterLinePos.top - parentPos.top;
    relativestartPos.right = starterLinePos.right - parentPos.right;
    relativestartPos.bottom = starterLinePos.bottom - parentPos.bottom;
    relativestartPos.left = starterLinePos.left - parentPos.left;

    let relativeEndPos = {}
    relativeEndPos.top = endLinePos.top - parentPos.top;
    relativeEndPos.right = endLinePos.right - parentPos.right;
    relativeEndPos.bottom = endLinePos.bottom - parentPos.bottom;
    relativeEndPos.left = endLinePos.left - parentPos.left;

    let lineX1 = Math.abs(relativestartPos.left + (starterLinePos.width / 2));
    let lineY1 = Math.abs(relativestartPos.top + starterLinePos.height);
    let lineX2 = Math.abs(relativeEndPos.left + (endLinePos.width / 2));
    let lineY2 = Math.abs(relativeEndPos.top + endLinePos.height);

    let height = tdTable.getBoundingClientRect().height;
    let width = tdTable.getBoundingClientRect().width;
    var topOffset = tdTable.getBoundingClientRect().top;

    // console.log(height + "   " + width);

    let scaleAmount = width < 860 ? 0.2 : 0.3;
    let translateAmountX = width < 860 ? 2 : 15;
    let translateAmountY = width < 860 ? 10 : 18;

    tdTable.outerHTML += `<svg xmlns="http://www.w3.org/2000/svg" id="td-table-line" top=${topOffset} width=${width} height=${height}>
    <line class="table-line-dashed" class="int3-dashed" x1=${lineX1} y1=${lineY1} stroke-width="1.4" stroke="#0070C0" x2=${lineX2} y2=${lineY2}></line>
    <polygon id="td-line-arrow-head" points="0,0 100,25 0,50 20,25" fill="#0070C0" transform="translate(${lineX2 - translateAmountX}, ${lineY2 - translateAmountY}) rotate(30) scale(${scaleAmount})"></polygon>
    </svg>`;
}

/////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

// LIFETIME CHART NO LONGER DISPLAYED
const udLifetimeData = [
    { fundName: 'The Investment Company of America', index: 10.95, excess: 1.45 },
    { fundName: 'American Mutual Fund', index: 11.38, excess: 0.54 },
    { fundName: 'Washington Mutual Investors Fund', index: 10.89, excess: 1.30 },
    { fundName: 'AMCAP Fund', index: 10.17, excess: 1.79 },
    { fundName: 'New Perspective Fund', index: 8.72, excess: 3.89 },
    { fundName: 'The Growth Fund of America', index: 11.14, excess: 2.81 },
    { fundName: 'The Income Fund of America', index: 10.03, excess: 1.13 },
    { fundName: 'American Balanced Fund', index: 10.16, excess: 0.79 },
    { fundName: 'Fundamental Investors', index: 11.78, excess: 1.02 },
    { fundName: 'The New Economy Fund', index: 11.20, excess: 0.58 },
    { fundName: 'EuroPacific Growth Fund', index: 8.62, excess: 2.31 },
    { fundName: 'Capital Income Builder', index: 7.16, excess: 2.17 },
    { fundName: 'SMALLCAP World Fund', index: 8.16, excess: 2.05 },
    { fundName: 'Capital World Growth and Income Fund', index: 7.57, excess: 3.23 },
    { fundName: 'New World Fund', index: 5.15, excess: 3.36 },
    { fundName: 'International Growth and Income Fund', index: 5.21, excess: 2.31 },
    { fundName: 'American Funds Global Balanced Fund', index: 5.83, excess: 0.87 }
];

// NO LONGER DISPLAYED
class StackedBarChart {
    constructor() {
        const vis = this;
        vis.el = 'td-stacked-bar';
        vis.draws = 0;
        vis.data = udLifetimeData;

        const keys = Object.keys(vis.data[0]).slice(1)
        vis.keys = [keys[0], keys[1]]

        // console.log(dataTD)
        this.init();
    }

    init() {
        const vis = this;

        // COLOR SCALE
        vis.z = d3.scaleOrdinal()
            .range(['#b2b2b2', '#245f99'])
            .domain(keys);

        // MAIN SVG
        vis.chartDiv = document.getElementById(vis.el);

        // REMOVE PREVIOUS ELEMENTS (IF NEEDED)
        document.querySelector(`#${vis.el}`).innerHTML = ''

        vis.svg = d3.select(vis.chartDiv).append("svg").attr('class', 'uf-stacked-bars')

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'uf-g');
        vis.bars = vis.g.append('g').attr('class', 'uf-bars')
        vis.line = vis.svg.append("line").attr('class', 'uf-grey-line');

        //  TEXT
        vis.vals = vis.g.append('g').attr('class', 'values');
        vis.dates = vis.svg.append('g').attr('class', 'inception-dates');
        vis.botText = vis.svg.append('text').attr('class', 'inception-text');
        vis.names = vis.g.append('g').attr('class', 'fund-names')

        vis.redraw();
    }

    redraw() {
        const vis = this;
        vis.draws++;

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;

        // DEFINE SVG
        vis.svg.attr('width', width).attr('height', height);

        // MARGINS
        vis.MARGIN = { top: window.innerWidth < 1100 ? 10 : window.innerHeight < 770 ? 14 : window.innerWidth < 1400 ? 30 : 30, right: window.innerWidth < 1200 ? 4 : window.innerHeight < 770 ? 10 : 20, bottom: 180, left: window.innerWidth < 1100 ? 65 : window.innerHeight < 770 ? 90 : 110 };
        vis.gWIDTH = width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // X SCALE
        const x = d3.scaleBand()
            .range([0, vis.gWIDTH])
            .paddingInner(0.35)
            .paddingOuter(0)
            .domain(vis.data.map(d => d.fundName));

        const sums = []
        vis.data.forEach(d => {
            sums.push(d.index + d.excess)
        })
        // Y SCALE
        const y = d3.scaleLinear()
            .rangeRound([vis.gHEIGHT, 0])
            .domain([0, d3.max(sums)]);

        // BOTTOM LINE
        vis.line
            .attr("x1", 0)
            .attr("y1", vis.gHEIGHT + vis.MARGIN.top)
            .attr("x2", width + vis.MARGIN.left + vis.MARGIN.right)
            .attr("y2", vis.gHEIGHT + vis.MARGIN.top)
            .attr("stroke-width", 1.4)
            .attr("stroke", "rgb(221, 221, 221)");

        // ADD DATA ////////////////////////////////////////////////
        d3.selectAll('.stack-group').remove()

        vis.stack = vis.bars
            .selectAll("rect")
            .data(d3.stack().keys(vis.keys)(vis.data))
            .enter()
            .append("g")
            .attr('class', d => `stack-group ${d.key}`)
            .attr("fill", d => vis.z(d.key))

        vis.rects = vis.stack
            .selectAll("rect")
            .data(d => d)

        let counter = 0;
        let boxIndex = 0;
        let boxCategory = ['excess', 'index'];

        vis.rects
            .enter()
            .append("rect")
            .attr('class', 'rects')
            .attr('id', (d, i) => {
                const cat = boxIndex;

                if (counter === 16) {
                    counter = 0;
                    boxIndex++;
                } else {
                    counter++;
                }

                return `rect-${d.data.fundName.replace(' ', '-').replace(' ', '-').replace(' ', '-')}-${boxCategory[cat]}`
            })
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.data.fundName))
            .attr("y", d => y(d[1]))
            .attr("height", d => {
                const rectHeight = y(d[0]) - y(d[1]);
                return rectHeight >= 0 ? rectHeight : 0;
            })
            .attr('opacity', vis.draws === 1 ? 0 : 1)
            .transition()
            .duration(1100)
            .delay((d, i) => i * 30 + 30)
            .attr('opacity', 1);

        /// NUMERICAL VALUES for index
        // JOIN
        vis.values = vis.vals
            .selectAll('.uf-ind-vals')
            .data(vis.data)

        // EXIT
        vis.values.exit().remove;

        /// UPDATE
        vis.values
            .transition()
            .duration(500)
            .attr('x', d => x(d.fundName) + x.bandwidth() / 2)
            .attr('y', d => y(d.index) + 25)
            .attr('dy', d => window.innerWidth < 1200 ? -15 : window.innerHeight < 770 ? -12 : 0)

        // ENTER
        vis.values
            .enter()
            .append('text')
            .attr('class', 'uf-ind-vals')
            .text(d => d.index.toFixed(2) + '%')
            .style('fill', 'white')
            .attr('x', d => x(d.fundName) + x.bandwidth() / 2)
            .attr('y', d => y(d.index) + 25)
            .attr('dy', d => window.innerWidth < 1200 ? -15 : window.innerHeight < 770 ? -12 : 0)
            .attr('opacity', vis.draws === 1 ? 0 : 1)
            .transition()
            .duration(1100)
            .delay((d, i) => i * 30 + 30)
            .attr('opacity', 1);
        ///////////////////

        /// NUMERICAL VALUES for excess vals
        vis.valuesEx = vis.vals
            .selectAll('.uf-ex-vals')
            .data(vis.data)

        vis.valuesEx.exit().remove;

        vis.valuesEx
            .transition()
            .duration(500)
            .attr('x', d => x(d.fundName) + x.bandwidth() / 2)
            .attr('y', d => y(d.index + d.excess) - 13)
            .attr('dy', d => window.innerWidth < 1200 ? 11 : window.innerHeight < 770 ? 8 : 0)

        vis.valuesEx
            .enter()
            .append('text')
            .attr('class', 'uf-ex-vals')
            .style('fill', vis.z('excess'))
            .text(d => d.excess.toFixed(2) + '%')
            .attr('x', d => x(d.fundName) + x.bandwidth() / 2)
            .attr('y', d => y(d.index + d.excess) - 13)
            .attr('dy', d => window.innerWidth < 1200 ? 11 : window.innerHeight < 770 ? 8 : 0)
            .attr('opacity', vis.draws === 1 ? 0 : 1)
            .transition()
            .duration(1100)
            .delay((d, i) => i * 30 + 30)
            .attr('opacity', 1);
        ///////////////////

        // ADD BOTTOM LABELS
        const botInfoLine1 = [
            ['1/1/34'],
            ['2/21/50'],
            ['7/31/52'],
            ['5/1/67'],
            ['3/13/73'],
            ['12/1/73'],
            ['12/1/73'],
            ['7/26/75'], // ambal
            ['8/1/78'], // fundamental investors
            ['12/1/83'],
            ['4/16/84'],
            ['7/30/87'],
            ['4/30/90'],
            ['3/26/93'],
            ['6/17/99'],
            ['10/1/08'],
            ['2/1/11'],
        ]

        ////////////////////////
        const yPlace = vis.gHEIGHT + 20;
        const xWidth = x.bandwidth() + 35;
        const xPlace = -xWidth / 2 + x.bandwidth() / 2;
        vis.fundNames = vis.names
            .selectAll('.uf-small-labels')
            .data(vis.data.map(d => d.fundName))

        vis.fundNames.exit().remove();

        vis.fundNames
            .attr('x', d => x(d) + xPlace)
            .attr('y', yPlace)
            .attr('width', xWidth)
            .attr('height', 175)

        vis.fundNames
            .enter()
            .append('foreignObject')
            .attr('class', 'uf-small-labels')
            .attr('x', d => x(d) + xPlace)
            .attr('y', yPlace)
            .attr('width', xWidth)
            .attr('height', 175)
            .append('xhtml:div')
            .style('text-align', 'center')
            .style('font-size', '.8em')
            .attr('text-anchor', 'middle')
            .text(d => d)

        ////////////////////////
        ////////////////////////
        ////////////////////////
        const yPos = vis.gHEIGHT + 150;
        vis.inceptionDates = vis.dates
            .selectAll('.bot-info')
            .data(vis.data.map(d => d.fundName))

        vis.inceptionDates.exit().remove;

        vis.inceptionDates
            .transition()
            .duration(500)
            .attr('x', d => x(d) + vis.MARGIN.left + x.bandwidth() / 2)
            .attr('y', yPos)

        vis.inceptionDates
            .enter()
            .append('text')
            .attr('class', 'bot-info')
            .attr('x', d => x(d) + vis.MARGIN.left + x.bandwidth() / 2)
            .attr('y', yPos)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-weight', 'normal')
            .text((d, i) => botInfoLine1[i])

        // THE WORD 'INCEPTION'
        vis.botText
            .attr('font-weight', 'bold')
            .attr('x', 0)
            .attr('y', yPos)
            .text('Inception')
    }
}

/////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////



// ******************************* ******************************* //
// MAKES BAR CHART FOR SECTION TWO OF R6 //
// ******************************* ******************************* //

// NO LONGER DISPLAYED
class TDBarChartSection {
    constructor() {

        const vis = this;
        vis.draws = 0;
        vis.data = this.getData();
        vis.el = 'bar-chart-td-main';

        vis.gID = 'bar-chart-svg';

        // FADE DOWN OUTPUT TEXT FROM PREVIOUS CLASS IF IT EXISTS
        document.querySelectorAll('.bar-chart-output-text').forEach(el => el.style.opacity = 0);

        this.initVis();
    }

    getData() {
        return [
            { name: '1 Year', value: 58, value2: 45 },
            { name: '3 year', value: 63, value2: 44 },
            { name: '5 year', value: 68, value2: 45 },
            { name: '10 year', value: 77, value2: 45 },
            { name: '20 year', value: 90, value2: 44 },
            { name: '30 year', value: 97, value2: 35 },
        ];
    }

    initVis() {
        const vis = this;

        // MAIN SVG
        vis.chartDiv = document.getElementById(vis.el);

        // CLEAR PREVIOUS
        vis.chartDiv.innerHTML = '';

        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bar-chart-svg`);

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis');

        // APPEND LINE FOR X AXIS
        vis.xLine = vis.g.append('line')

        // APPEND Y AXIS
        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis').attr('id', `${vis.el}-bar-chart-margin`)
            .style('text-anchor', 'start');

        // CHART SVGs
        vis.chartDiv1 = document.getElementById(`bar-chart-td-1`);
        vis.chartDiv1.innerHTML = '';
        vis.svg1 = d3.select(vis.chartDiv1).append('svg').attr('class', `bar-chart-svg`);
        vis.g1 = vis.svg1.append('g').attr('class', 'g-class');
        vis.labels1 = vis.svg1.append('g').attr('class', 'uf-bar-text-labs');
        // CHART SVG
        vis.chartDiv2 = document.getElementById(`bar-chart-td-2`);
        vis.chartDiv2.innerHTML = '';
        vis.svg2 = d3.select(vis.chartDiv2).append('svg').attr('class', `bar-chart-svg`);
        vis.g2 = vis.svg2.append('g').attr('class', 'g-class');
        vis.labels2 = vis.svg2.append('g').attr('class', 'uf-bar-text-labs');
        // CHART SVG
        vis.chartDiv3 = document.getElementById(`bar-chart-td-3`);
        vis.chartDiv3.innerHTML = '';
        vis.svg3 = d3.select(vis.chartDiv3).append('svg').attr('class', `bar-chart-svg`);
        vis.g3 = vis.svg3.append('g').attr('class', 'g-class');
        vis.labels3 = vis.svg3.append('g').attr('class', 'uf-bar-text-labs');
        // CHART SVG
        vis.chartDiv4 = document.getElementById(`bar-chart-td-4`);
        vis.chartDiv4.innerHTML = '';
        vis.svg4 = d3.select(vis.chartDiv4).append('svg').attr('class', `bar-chart-svg`);
        vis.g4 = vis.svg4.append('g').attr('class', 'g-class');
        vis.labels4 = vis.svg4.append('g').attr('class', 'uf-bar-text-labs');
        // CHART SVG
        vis.chartDiv5 = document.getElementById(`bar-chart-td-5`);
        vis.chartDiv5.innerHTML = '';
        vis.svg5 = d3.select(vis.chartDiv5).append('svg').attr('class', `bar-chart-svg`);
        vis.g5 = vis.svg5.append('g').attr('class', 'g-class');
        vis.labels5 = vis.svg5.append('g').attr('class', 'uf-bar-text-labs');
        // CHART SVG
        vis.chartDiv6 = document.getElementById(`bar-chart-td-6`);
        vis.chartDiv6.innerHTML = '';
        vis.svg6 = d3.select(vis.chartDiv6).append('svg').attr('class', `bar-chart-svg`);
        vis.g6 = vis.svg6.append('g').attr('class', 'g-class');
        vis.labels6 = vis.svg6.append('g').attr('class', 'uf-bar-text-labs');

        this.redraw();
    }

    async redraw() {

        const vis = this;
        vis.draws++;

        vis.barColor = 'rgb(36,95,153)';

        // UUUUGH, this is gross
        let promise = new Promise((resolve, reject) => {
            vis.setText();
            setTimeout(() => {
                resolve('text set')
            }, 100);
        });
        await promise;

        // SET WIDTH FOR CHART SECTIONS
        vis.MARGIN = { top: 25, right: 0, bottom: window.innerWidth < 1200 ? 10 : window.innerHeight < 770 ? 15 : 35, left: 0 };
        // CHART SVG WITDH //////////////////////////////////
        vis.width1 = vis.chartDiv1.clientWidth;
        vis.height1 = vis.chartDiv1.clientHeight;
        vis.gWIDTH1 = vis.width1 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT1 = vis.height1 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg1.attr('width', vis.width1).attr('height', vis.height1);
        vis.g1
            .attr('width', vis.gWIDTH1)
            .attr('height', vis.gHEIGHT1)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width2 = vis.chartDiv2.clientWidth;
        vis.height2 = vis.chartDiv2.clientHeight;
        vis.gWIDTH2 = vis.width2 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT2 = vis.height2 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg2.attr('width', vis.width2).attr('height', vis.height2);
        vis.g2
            .attr('width', vis.gWIDTH2)
            .attr('height', vis.gHEIGHT2)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width3 = vis.chartDiv3.clientWidth;
        vis.height3 = vis.chartDiv3.clientHeight;
        vis.gWIDTH3 = vis.width3 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT3 = vis.height3 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg3.attr('width', vis.width3).attr('height', vis.height3);
        vis.g3
            .attr('width', vis.gWIDTH3)
            .attr('height', vis.gHEIGHT3)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width3 = vis.chartDiv3.clientWidth;
        vis.height3 = vis.chartDiv3.clientHeight;
        vis.gWIDTH3 = vis.width3 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT3 = vis.height3 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg3.attr('width', vis.width3).attr('height', vis.height3);
        vis.g3
            .attr('width', vis.gWIDTH3)
            .attr('height', vis.gHEIGHT3)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width4 = vis.chartDiv4.clientWidth;
        vis.height4 = vis.chartDiv4.clientHeight;
        vis.gWIDTH4 = vis.width4 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT4 = vis.height4 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg4.attr('width', vis.width4).attr('height', vis.height4);
        vis.g4
            .attr('width', vis.gWIDTH4)
            .attr('height', vis.gHEIGHT4)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width5 = vis.chartDiv5.clientWidth;
        vis.height5 = vis.chartDiv5.clientHeight;
        vis.gWIDTH5 = vis.width5 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT5 = vis.height5 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg5.attr('width', vis.width5).attr('height', vis.height5);
        vis.g5
            .attr('width', vis.gWIDTH5)
            .attr('height', vis.gHEIGHT5)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');
        vis.width6 = vis.chartDiv6.clientWidth;
        vis.height6 = vis.chartDiv6.clientHeight;
        vis.gWIDTH6 = vis.width6 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT6 = vis.height6 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg6.attr('width', vis.width6).attr('height', vis.height6);
        vis.g6
            .attr('width', vis.gWIDTH6)
            .attr('height', vis.gHEIGHT6)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // BIG SVG WITDH ////////////////////////////////
        vis.width = vis.chartDiv.clientWidth + vis.width1 + vis.width2 + vis.width3 + vis.width4 + vis.width5 + vis.width6;

        vis.height = vis.chartDiv.clientHeight;
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // Use the extracted size to set the size of an SVG element.
        vis.svg.attr('width', vis.width).attr('height', vis.height);

        // SET G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // X SCALE
        const x = d3.scaleBand()
            .domain(['value', 'value2'])
            .range([0, vis.gWIDTH1])
            .paddingInner(.09)
            .paddingOuter(.42)

        // DOMAIN IT UP, BOYS
        const allNumbers = [];

        vis.data.forEach(el => {
            allNumbers.push(Number(el.value))
            allNumbers.push(Number(el.value2))
        })

        const min = Math.floor(d3.min(allNumbers) / 10) * 10 < 0 ? Math.floor(d3.min(allNumbers) / 10) * 10 : 0;
        const max = Math.ceil(d3.max(allNumbers) / 10) * 10;

        let yMax = 20;
        if (yMax < max) {
            yMax = max;
        }

        //  Y SCALE 
        let y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([min, yMax])
            .nice();

        const tickValues = [];
        for (let i = min; i <= yMax; i = i + 20) {
            tickValues.push(i);
        }

        // Y AXIS
        const yAxisCall = d3
            .axisLeft()
            .tickValues(tickValues)
            .tickPadding(0)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat((el, i) => i === tickValues.length - 1 ? el + "%" : el)

        const xTrans = window.innerWidth < 1200 ? 30 : window.innerHeight < 770 ? 30 : window.innerWidth < 1400 ? 30 : 30;
        vis.yAxis
            .attr('transform', `translate(${xTrans}, 0)`)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${xTrans}, 0)`)
            .call(yAxisCall.scale(y));

        // DRAW LINE FOR XAXIS
        vis.xLine
            .attr('x1', xTrans + 30)
            .attr('x2', vis.gWIDTH - 20)
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('stroke', 'rgba(211, 211, 211, 1)')
            .attr('transform', `translate(0, ${0})`)

        //////////////////////// BARS /////////////////////////////
        const textPosition = 50;
        // JOIN
        vis.rects1 = vis.g1.selectAll('.bars-data')
            .data([vis.data[0].value, vis.data[0].value2])
        // EXIT
        vis.rects1.exit().remove();
        // UPDATE
        vis.rects1
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects1
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));

        // JOIN
        vis.labs = vis.labels1.selectAll('.bars-txt')
            .data([vis.data[0].value, vis.data[0].value2])
        // EXIT
        vis.labs.exit().remove();
        // UPDATE
        vis.labs
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))

        // JOIN
        vis.rects2 = vis.g2.selectAll('.bars-data')
            .data([vis.data[1].value, vis.data[1].value2])
        // EXIT
        vis.rects2.exit().remove();
        // UPDATE
        vis.rects2
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects2
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN
        vis.labs2 = vis.labels2.selectAll('.bars-txt')
            .data([vis.data[1].value, vis.data[1].value2])
        // EXIT
        vis.labs2.exit().remove();
        // UPDATE
        vis.labs2
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs2
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))

        // JOIN
        vis.rects3 = vis.g3.selectAll('.bars-data')
            .data([vis.data[2].value, vis.data[2].value2])
        // EXIT
        vis.rects3.exit().remove();
        // UPDATE
        vis.rects3
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects3
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN
        vis.labs3 = vis.labels3.selectAll('.bars-txt')
            .data([vis.data[2].value, vis.data[2].value2])
        // EXIT
        vis.labs3.exit().remove();
        // UPDATE
        vis.labs3
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs3
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))



        // JOIN
        vis.rects4 = vis.g4.selectAll('.bars-data')
            .data([vis.data[3].value, vis.data[3].value2])
        // EXIT
        vis.rects4.exit().remove();
        // UPDATE
        vis.rects4
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects4
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN
        vis.labs4 = vis.labels4.selectAll('.bars-txt')
            .data([vis.data[3].value, vis.data[3].value2])
        // EXIT
        vis.labs4.exit().remove();
        // UPDATE
        vis.labs4
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs4
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))

        // chart 5
        // JOIN
        vis.rects5 = vis.g5.selectAll('.bars-data')
            .data([vis.data[4].value, vis.data[4].value2])
        // EXIT
        vis.rects5.exit().remove();
        // UPDATE
        vis.rects5
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects5
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN
        vis.labs5 = vis.labels5.selectAll('.bars-txt')
            .data([vis.data[4].value, vis.data[4].value2])
        // EXIT
        vis.labs5.exit().remove();
        // UPDATE
        vis.labs5
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs5
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))

        // chart 6
        // JOIN
        vis.rects6 = vis.g6.selectAll('.bars-data')
            .data([vis.data[5].value, vis.data[5].value2])
        // EXIT
        vis.rects6.exit().remove();
        // UPDATE
        vis.rects6
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects6
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('value2'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN
        vis.labs6 = vis.labels6.selectAll('.bars-txt')
            .data([vis.data[5].value, vis.data[5].value2])
        // EXIT
        vis.labs6.exit().remove();
        // UPDATE
        vis.labs6
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
        // ENTER
        vis.labs6
            .enter()
            .append('text')
            .attr('class', 'bars-txt')
            .text(d => d + "%")
            .style("fill", 'white')
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', d => d < 0 ? -textPosition : textPosition)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('value2') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
    }

    setText() {
        const vis = this;
        const data = vis.data;

        // SET ALT ELEMENTS
        // setElements('-alt');
        setElements();
        document.querySelectorAll('.bar-chart-reg').forEach(el => el.style.opacity = 1);
        return

        // CROSS FADE (ALT ELS ON, REG ELS OFF)
        document.querySelectorAll('.bar-chart-alt').forEach(el => el.style.opacity = 1);
        document.querySelectorAll('.bar-chart-reg').forEach(el => el.style.opacity = 0);

        // SET REG ELEMENTS AFTER ELEMENTS HAVE TRANSITIONED
        setTimeout(() => {
        }, 410);

        // CUT TO REG ELEMENTS AFTER TRANSITION AND AFTER SETTING REG TEXT
        setTimeout(() => {
            document.querySelectorAll('.bar-chart-reg').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = 1;

                setTimeout(() => {
                    el.style.transition = 'opacity .4s ease-in-out';
                }, 1);
            });
            document.querySelectorAll('.bar-chart-alt').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = 0;

                setTimeout(() => {
                    el.style.transition = 'opacity .4s ease-in-out';
                }, 1);
            });

        }, 421);

        function setElements(group = '') {
            const textData = [
                { value: 4810, valueB: 171908, value2: 8291, value2B: 378159 },
                { value: 4978, valueB: 147386, value2: 7859, value2B: 331965 },
                { value: 5079, valueB: 130558, value2: 7427, value2B: 289671 },
                { value: 4926, valueB: 92409, value2: 6409, value2B: 205472 },
                { value: 4151, valueB: 39551, value2: 4594, value2B: 89692 },
                { value: 2868, valueB: 11825, value2: 2948, value2B: 33733 },
            ]

            // UPDATE VALUES
            textData.forEach((d, i) => {
                if (i === 6) return;
                const num = i + 1;

                // ROW 1 (LIGHT BLUE)
                if (d.value) {
                    document.getElementById(`bar-chart-val-${num}-td${group}`).innerText = comma(d.value) + ' ' + comma(d.valueB);
                } else {
                    document.getElementById(`bar-chart-val-${num}-td${group}`).innerText = 'N/A';
                }

                // ROW 2 (BOTTOM)
                if (d.value2) {
                    document.getElementById(`bar-chart-index-val-${num}-td${group}`).innerText = comma(d.value2) + ' ' + comma(d.value2B);
                } else {
                    if (i === data.length - 1 || i === 5) {
                        document.getElementById(`bar-chart-index-val-${num}-td${group}`).innerText = '—';
                    } else {
                        document.getElementById(`bar-chart-index-val-${num}-td${group}`).innerText = 'N/A';
                    }
                }
            })
        }
    }
}



