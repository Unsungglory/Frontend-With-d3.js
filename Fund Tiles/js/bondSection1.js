let bondChart1 = null;
let bondChart2 = null;
let bondChart3 = null;
let bondChart4 = null;

function bondSection1(data, currentFundClass, objective) {
    if (currentFundClass === 'a') {
        document.getElementById('bond-section-1-date').innerText = `As of ${data.a.heroData.date} (updated quarterly)`;
    } else if (currentFundClass === 'f2') {
        document.getElementById('bond-section-1-date').innerText = `As of ${data.f2.heroData.date} (updated quarterly)`;
    } else if (currentFundClass === 'r6') {
        document.getElementById('bond-section-1-date').innerText = `As of ${data.r6.heroData.date} (updated quarterly)`;
    }

    bondChart1 = new BondChart1(data, currentFundClass);
    bondChart2 = new BondChart2(data, currentFundClass, objective);
    bondChart3 = new BondChart3(data, currentFundClass, objective);
    bondChart4 = new BondChart4(data, currentFundClass);

    updateTopDisc(data, currentFundClass);
}

function bondSection1Update(data, currentFundClass) {

    if (data.length) {
        if (currentFundClass === 'a') {
            document.getElementById('bond-section-1-date').innerText = `As of ${data.a.heroData.date} (updated quarterly)`;
        } else if (currentFundClass === 'f2') {
            document.getElementById('bond-section-1-date').innerText = `As of ${data.f2.heroData.date} (updated quarterly)`;
        } else if (currentFundClass === 'r6') {
            document.getElementById('bond-section-1-date').innerText = `As of ${data.r6.heroData.date} (updated quarterly)`;
        }
    }

    if (bondChart1) bondChart1.redraw(currentFundClass);
    if (bondChart2) bondChart2.redraw(currentFundClass);
    if (bondChart3) bondChart3.redraw(currentFundClass);
    if (bondChart4) bondChart4.redraw(currentFundClass);

    updateTopDisc(data, currentFundClass);
}

function updateTopDisc(data, currentFundClass) {
    const text = document.getElementById('bond-disc-a');
    if (data.a.id === 'SBF' || data.a.id === 'TEBF' || data.a.id === 'BFA' || data.a.id === 'AHIM' || data.a.id === 'MSI') {
        text.innerHTML = `Figures shown are past results and are not predictive of results in future periods. Current and future results may be lower or higher than those shown. Prices and returns will vary, so investors may lose money. Investing for short periods makes losses more likely. Returns shown at net asset value (NAV) have all distributions reinvested and do not reflect a sales charge. Results at maximum offering price (MOP) are lower because they reflect deduction of the maximum sales charge (3.75%). 
        For current information and month-end results visit <span onclick="goWeb('https://capitalgroup.com')" style="text-decoration: underline; cursor:pointer;">capitalgroup.com.</span>`
    } else if (data.a.id === 'IBFA' || data.a.id === 'LTEX') {
        text.innerHTML = `Figures shown are past results and are not predictive of results in future periods. Current and future results may be lower or higher than those shown. Prices and returns will vary, so investors may lose money. Investing for short periods makes losses more likely. Returns shown at net asset value (NAV) have all distributions reinvested and do not reflect a sales charge. Results at maximum offering price (MOP) are lower because they reflect deduction of the maximum sales charge (2.50%). 
        For current information and month-end results visit <span onclick="goWeb('https://capitalgroup.com')" style="text-decoration: underline; cursor:pointer;">capitalgroup.com.</span>`
    } else {
        text.innerHTML = `Figures shown are past results and are not predictive of results in future periods. Current and future results may be lower or higher than those shown. Prices and returns will vary, so investors may lose money. Investing for short periods makes losses more likely. Returns shown at net asset value (NAV) have all distributions reinvested and do not reflect a sales charge. Results at maximum offering price (MOP) are lower because they reflect deduction of the maximum sales charge (3.75%). 
        For current information and month-end results visit <span onclick="goWeb('https://capitalgroup.com')" style="text-decoration: underline; cursor:pointer;">capitalgroup.com.</span>`
    }
}

///// CHART 1
class BondChart1 {
    constructor(data, currentFundClass) {
        const vis = this;
        vis.dataA = data.a.heroData.diversification;
        vis.dataF2 = data.f2.heroData.diversification;
        if (data.r6)
            vis.dataR6 = data.r6.heroData.diversification;
        else
            vis.dataR6 = null;

        vis.fundClass = currentFundClass;

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-1-svg'))
            document.getElementById('bond-section-1-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-section-1-chart-1`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-section-1-svg`).attr("id", 'bond-section-1-svg');
        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.line = vis.g.append('line').attr('class', 'bond-line');
        vis.line2 = vis.g.append('line').attr('class', 'bond-line')
        vis.dashed = vis.g.append('line').attr('class', 'bond-dashed-line')

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-slider-box'))
            document.getElementById('bond-slider-box').remove();
        vis.slider = d3.select(vis.chartDiv).append('div').attr('class', 'bond-slider-box').attr('id', 'bond-slider-box');
        vis.minText = d3.select('#bond-min-text');
        vis.maxText = d3.select('#bond-max-text');

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {
        const vis = this;
        vis.fundClass = currentFundClass

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
        } else {
            vis.data = vis.dataR6;
        }

        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

        vis.width = vis.chartDiv.clientWidth;
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
        const x = d3.scaleLinear()
            .domain([vis.data.min, vis.data.max])
            .range([0, vis.gWIDTH])

        //  Y SCALE 
        let y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([0, 1])
            .nice();

        vis.line
            .attr('x1', 1)
            .attr('x2', 1)
            .attr('y1', 0)
            .attr('y2', vis.gHEIGHT)

        vis.line2
            .attr('x1', vis.gWIDTH - 1)
            .attr('x2', vis.gWIDTH - 1)
            .attr('y1', 0)
            .attr('y2', vis.gHEIGHT)

        vis.dashed
            .attr("x1", 0)
            .attr('x2', vis.gWIDTH)
            .attr("y1", y(.5))
            .attr('y2', y(.5))

        vis.slider
            .style('left', x(vis.data.fund) + 'px')
            .html(enDash((vis.data.fund).toFixed(2)));

        vis.minText
            .style('opacity', 1)
            .text(enDash((vis.data.min).toFixed(2)));

        vis.maxText
            .style('opacity', 1)
            .text(enDash((vis.data.max).toFixed(2)));
    }
}

///// CHART 2
class BondChart2 {
    constructor(data, currentFundClass, objective) {
        const vis = this;
        vis.dataA = data.a.heroData.inflProt;
        vis.dataF2 = data.f2.heroData.inflProt;
        if (data.r6)
            vis.dataR6 = data.r6.heroData.inflProt;
        else
            vis.dataR6 = null;

        vis.name = data.a.name;
        vis.tickerA = data.a.ticker;
        vis.tickerF2 = data.f2.ticker;
        if (data.r6)
            vis.tickerR6 = data.r6.ticker;
        else
            vis.tickerR6 = null;

        vis.trademark = data.a.trademark;
        vis.inceptionA = new Date(data.a.inception).getFullYear();
        vis.inceptionF2 = new Date(data.f2.inception).getFullYear();
        if (data.r6)
            vis.inceptionR6 = new Date(data.r6.inception).getFullYear();
        else
            vis.inceptionR6 = null;

        vis.asOfDate = data.asOfDate;

        vis.fundClass = currentFundClass;

        vis.objective = objective;
        vis.draws = 0;

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-2-svg'))
            document.getElementById('bond-section-2-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-section-1-chart-2`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-section-2-svg`).attr("id", 'bond-section-2-svg');
        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND LINE FOR X AXIS
        vis.xLine = vis.g.append('line').attr('class', 'bond-line')

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-lowerText'))
            document.getElementById('bond-section-lowerText').remove();
        vis.lowerText = d3.select(vis.chartDiv).append('div').attr('id', 'bond-section-lowerText')

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-outputText'))
            document.getElementById('bond-section-outputText').remove();
        vis.outputText = d3.select(vis.chartDiv).append('div').attr('id', 'bond-section-outputText')

        vis.redraw();
    }

    redraw(fundClass = this.fundClass) {
        const vis = this;

        vis.fundClass = fundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
            vis.inception = vis.inceptionA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
            vis.inception = vis.inceptionF2
        } else if (vis.fundClass === 'r6') {
            vis.data = vis.dataR6
            vis.inception = vis.inceptionR6
        }

        vis.draws++;

        vis.barColor = vis.objective === 'Growth' ? 'rgba(1, 45, 114, 1)' : vis.objective === 'Growth and income' ? 'rgba(0, 87, 184, 1)' :
            vis.objective.toLowerCase() === 'taxable bond' ? 'rgba(3, 150, 94, 1)' : 'rgba(0, 108, 91, 1)';

        vis.MARGIN = { top: 0, right: 0, bottom: 20, left: 0 };

        // BIG SVG WITDH ////////////////////////////////
        vis.width = vis.chartDiv.clientWidth;
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

        // ABORT            
        if (vis.inception > new Date().getFullYear() - 10 || !vis.data.fund) {

            vis.outputText
                .attr('class', 'bond-section-output-text')
                .style('width', `${vis.gWIDTH}px`)
                .style('top', `${vis.gHEIGHT / 2}px`)
                .html(`
                    Fund originated in ${vis.inception}. <br>No returns available for timeframe.
                `)
            return
        } else {
            console.log('no abort...', vis.inception, new Date().getFullYear() - 10)
        }

        // X SCALE
        const x = d3.scaleBand()
            .domain(['value', 'indexValue'])
            .range([0, vis.gWIDTH])
            .paddingInner(.38)
            .paddingOuter(.42)

        const data = { value: vis.data.CPI, indexValue: vis.data.fund }

        //  Y SCALE 
        let y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([0, d3.max([d3.max([data.value * 2, data.indexValue * 2]), 100])])
            .nice();

        // DRAW LINE FOR XAXIS
        vis.xLine
            .attr('x1', 0)
            .attr('x2', vis.gWIDTH)
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('stroke', GREY)
            .attr('transform', `translate(0, ${0})`)

        //////////////////////// BARS /////////////////////////////
        // JOIN
        vis.bars = vis.g.selectAll('.bond-bars-data')
            .data([data.value, data.indexValue])
        // EXIT
        vis.bars.exit().remove();
        // UPDATE
        vis.bars
            .transition()
            .duration(500)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)))
        // ENTER
        vis.bars
            .enter()
            .append('rect')
            .attr('class', 'bond-bars-data')
            .style("fill", (d, i) => i === 1 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            .delay((d, i) => 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));

        //////////////////////// NUMBERS /////////////////////////////
        // JOIN
        vis.nums = vis.g.selectAll('.bond-nums-data')
            .data([data.value, data.indexValue])
        // EXIT
        vis.nums.exit().remove();
        // UPDATE
        vis.nums
            .transition()
            .duration(500)
            .text(d => d.toFixed(2) + "%")
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('indexValue') + x.bandwidth() / 2)
            .attr("y", d => y(Math.max(0, d)))
        // ENTER
        vis.nums
            .enter()
            .append('text')
            .attr('class', 'bond-nums-data')
            .style('font-weight', (d, i) => i === 0 ? 400 : 700)
            .text(d => d.toFixed(2) + "%")
            .attr("x", (d, i) => i === 0 ? x('value') + x.bandwidth() / 2 : x('indexValue') + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr('dy', -15)
            .transition()
            .duration(1000)
            .delay((d, i) => 200)
            .attr("y", d => y(Math.max(0, d)))

        //////////////////////
        vis.lowerText.html(`
            <div style='display: flex; position: relative;'>
                <div class='bond-section-1-label' style='width: ${x.bandwidth() + 10}px; margin-left: -5px; left: ${x('value')}px;'>Consumer price index</div>
                <div id='bond-section-1-ticker-a' class='bond-section-1-label' style='width: ${x.bandwidth() + 10}px; margin-left: -5px; left: ${x('indexValue')}px; opacity: ${vis.prevClass === 'a' ? 1 : 0}'>
                    ${vis.tickerA}
                </div>
                <div id='bond-section-1-ticker-f2' class='bond-section-1-label' style='width: ${x.bandwidth() + 10}px; margin-left: -5px; left: ${x('indexValue')}px; opacity: ${vis.prevClass === 'f2' ? 1 : 0}''>
                    ${vis.tickerF2}
                </div>
                <div id='bond-section-1-ticker-r6' class='bond-section-1-label' style='width: ${x.bandwidth() + 10}px; margin-left: -5px; left: ${x('indexValue')}px; opacity: ${vis.prevClass === 'r6' ? 1 : 0}''>
                    ${vis.tickerR6}
                </div>
            </div>
        `)

        setTimeout(() => {
            if (vis.fundClass === 'a') {
                document.getElementById('bond-section-1-ticker-a').style.opacity = 1;
                document.getElementById('bond-section-1-ticker-f2').style.opacity = 0;
                document.getElementById('bond-section-1-ticker-r6').style.opacity = 0;
            } else if (vis.fundClass === 'f2') {
                document.getElementById('bond-section-1-ticker-f2').style.opacity = 1;
                document.getElementById('bond-section-1-ticker-a').style.opacity = 0;
                document.getElementById('bond-section-1-ticker-r6').style.opacity = 0;
            } else if (vis.fundClass === 'r6') {
                document.getElementById('bond-section-1-ticker-a').style.opacity = 0;
                document.getElementById('bond-section-1-ticker-f2').style.opacity = 0;
                document.getElementById('bond-section-1-ticker-r6').style.opacity = 1;
            }

            vis.prevClass = vis.fundClass;
        }, 0);


    }
}

///// SECTION 3 (CAPITAL PRESERVATION)
class BondChart3 {
    constructor(data, currentFundClass, objective) {
        const vis = this;

        vis.id = data.a.id;
        vis.dataA = data.a.heroData.capitalPreservation;
        vis.dataF2 = data.f2.heroData.capitalPreservation;
        if (data.r6) {
            vis.dataR6 = data.r6.heroData.capitalPreservation;
        } else {
            vis.dataR6 = null;
        }

        vis.inceptionA = new Date(data.a.inception);
        vis.inceptionF2 = new Date(data.f2.inception);
        if (data.r6)
            vis.inceptionR6 = new Date(data.r6.inception);
        else
            vis.inceptionR6 = null;

        vis.fundClass = currentFundClass;

        vis.objective = objective;
        vis.draws = 0;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = { name: 1, value: vis.dataA };
        } else if (vis.fundClass === 'f2') {
            vis.data = { name: 1, value: vis.dataF2 };
        } else {
            vis.data = { name: 1, value: vis.dataR6 };
        }

        this.init();
    }

    init() {
        const vis = this;
        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-3-svg'))
            document.getElementById('bond-section-3-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-section-1-chart-3`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-section-3-svg`).attr("id", 'bond-section-3-svg');
        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND TEXT
        vis.text = vis.g.append('text').attr('class', 'bond-pi-big');
        vis.text2 = vis.g.append('text').attr('class', 'bond-pi-sm');

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-3-section-outputText'))
            document.getElementById('bond-3-section-outputText').remove();
        vis.outputText = d3.select(vis.chartDiv).append('div').attr('id', 'bond-3-section-outputText')

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {
        const vis = this;
        vis.fundClass = currentFundClass;
        vis.draws++;

        // UPDATE FOOTNOTE
        if (vis.id === 'BFA') {
            document.getElementById('bond-topsection-span').innerText = '1/1/2009'
        } else {
            document.getElementById('bond-topsection-span').innerText = 'fund inception'
        }

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = { name: 1, value: vis.dataA };
            vis.inception = vis.inceptionA
        } else if (vis.fundClass === 'f2') {
            vis.data = { name: 1, value: vis.dataF2 };
            vis.inception = vis.inceptionF2
        } else {
            vis.data = { name: 1, value: vis.dataR6 };
            vis.inception = vis.inceptionR6
        }

        // UPDATE SMALL TEXT IN HEADER OF THIS (3RD) SECTION
        document.getElementById('bond-top-section-percent').innerHTML = vis.data.value + '%';

        vis.color = vis.objective === 'Growth' ? 'rgba(1, 45, 114, 1)' : vis.objective === 'Growth and income' ? 'rgba(0, 87, 184, 1)' :
            vis.objective.toLowerCase() === 'taxable bond' ? 'rgba(3, 150, 94, 1)' : 'rgba(0, 108, 91, 1)';

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;
        const RADIUS = d3.min([width, height]);

        // DEFINE SVG
        vis.svg.attr('width', width).attr('height', height);

        // MARGINS
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.gWIDTH = width - (margin.left + margin.right);
        vis.gHEIGHT = height - (margin.top + margin.bottom);

        // ABORT
        // if no value (MSI for example), then likely the fund is too young to display this info
        // we will display a text message, and not draw the donut

        const oneYear = 1000 * 60 * 60 * 24 * 365;
        const threeYears = 3 * oneYear;

        // console.warn(vis.id)
        // console.warn(vis.inception)
        // console.warn(new Date())
        // console.warn(new Date(new Date().getTime() - threeYears))
        // console.warn(vis.inception.getTime())
        // console.warn(new Date().getTime() - threeYears)
        // console.warn(vis.inception.getTime() > new Date().getTime() - threeYears, 'hope false')
        // console.warn('vis.data.value:', vis.data, vis.data.value)

        // this is where we abort and display message
        if (vis.inception.getTime() > (new Date().getTime() - threeYears) || !vis.data.value) {
            document.querySelectorAll('.bond-sub-sm')[2].style.opacity = 0;

            const outputMsg = !vis.data.value ? 'No returns available.' :
                `Fund originated in ${vis.inception.getFullYear()}. <br>No returns available for timeframe.`

            vis.outputText
                .attr('class', 'bond-section-output-text')
                .style('width', `${vis.gWIDTH}px`)
                .style('top', document.getElementById('bond-section-outputText').style.top)
                .html(outputMsg)
            return
        } else {
            document.querySelectorAll('.bond-sub-sm')[2].style.opacity = 1;
        }

        // G
        vis.g
            .attr('height', vis.gHEIGHT)
            .attr('width', vis.gWIDTH)
            .attr(
                'transform',
                `translate(${width * .5 - margin.right}, ${height * .5 + margin.top})`
            );

        // SETUP PIE
        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .startAngle(0 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                return null;
            });

        const outerWidth = .49; // for donut wedges
        const innerWidth = .21; // for donut wedges

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        // const arcData = pieGenerator(vis.data.filter(d => d.value !== 0)); // dont include wedges that are zero
        const arcData = pieGenerator([vis.data, { name: 2, value: 100 - vis.data.value }]);

        const transition = window.navigator.userAgent.includes('Edge') ? 0 : 1000

        // JOIN DONUT SLICES
        let donutVis = vis.slices.selectAll('path')
            .data(arcData);
        // EXIT
        donutVis.exit()
            .style('opacity', 1)
            .transition()
            .duration(500)
            .attrTween('d', arcTweenClose)
            .style('opacity', 0)
            .remove();
        // UPDATE
        donutVis
            .transition()
            .duration(500)
            .style('opacity', 1)
            .attrTween('d', arcTween)

        // ENTER
        donutVis
            .enter()
            .append('path')
            .attr('id', (d, i) => `b-slice-${i}`)
            .attr('fill', (d, i) => i === 0 ? vis.color : 'transparent')
            .transition()
            .delay(400)
            .duration(transition)
            .attrTween('d', d => {
                let i = d3.interpolate(d.startAngle, d.endAngle);
                return t => {
                    d.endAngle = i(t);
                    return arc(d)
                }
            })
            .style('opacity', 1)
            .transition()
            .delay(810)
            .attrTween('d', arcTween) // THIS GETS READY FOR THE UPDATE TWEEN

        setTimeout(() => {

            document.getElementById('bond-section-3-svg').addEventListener('mouseover', () => {
                document.getElementById('b-slice-0').classList = 'bond-donut';
                document.getElementById('b-slice-0').style.transform = 'scale(1.05)'
            })

            document.getElementById('bond-section-3-svg').addEventListener('mouseout', () => {
                document.getElementById('b-slice-0').classList = 'bond-donut';
                document.getElementById('b-slice-0').style.transform = 'scale(1)'
            })

        }, 1000);

        function arcTweenClose(d) {
            let i = d3.interpolate(this._current, { startAngle: this._current.endAngle, endAngle: this._current.endAngle + .5 });
            return t => {
                return arc(i(t));
            };
        }

        function arcTween(d) {
            let i = d3.interpolate(this._current, d);
            this._current = i(0);
            return t => {
                return arc(i(t));
            };
        }

        /// TEXT
        vis.text
            .text(vis.data.value + "%")
            .attr('x', 0)
            .attr('y', 9)
    }
}

///// CHART 1
class BondChart4 {
    constructor(data, currentFundClass) {
        const vis = this;

        vis.dataA = data.a.barData.data.find(d => d.time === '30 day SEC Yield');
        vis.dataF2 = data.f2.barData.data.find(d => d.time === '30 day SEC Yield');
        if (data.r6)
            vis.dataR6 = data.r6.barData.data.find(d => d.time === '30 day SEC Yield');
        else vis.dataR6 = null;

        vis.fundClass = currentFundClass;

        vis.draws = 0;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = { name: 1, value: vis.dataA.value, asOfDate: vis.dataA.asOfDate };
        } else if (vis.fundClass === 'f2') {
            vis.data = { name: 1, value: vis.dataF2.value, asOfDate: vis.dataF2.asOfDate };
        } else {
            vis.data = { name: 1, value: vis.dataR6.value, asOfDate: vis.dataR6.asOfDate }
        }

        this.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-section-4-svg'))
            document.getElementById('bond-section-4-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-section-1-chart-4`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-section-4-svg`).attr("id", 'bond-section-4-svg');
        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND TEXT
        vis.text = vis.g.append('text').attr('class', 'bond-pi-big');
        vis.text2 = vis.g.append('text').attr('class', 'bond-pi-sm');
        vis.text3 = vis.g.append('text').attr('class', 'bond-pi-sm');

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {
        const vis = this;
        vis.fundClass = currentFundClass;
        vis.draws++;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = { name: 1, value: vis.dataA.value, asOfDate: vis.dataA.asOfDate };
        } else if (vis.fundClass === 'f2') {
            vis.data = { name: 1, value: vis.dataF2.value, asOfDate: vis.dataF2.asOfDate };
        } else {
            vis.data = { name: 1, value: vis.dataR6.value, asOfDate: vis.dataR6.asOfDate }
        }

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;
        const RADIUS = d3.min([width, height]);

        // DEFINE SVG
        vis.svg.attr('width', width).attr('height', height);

        // MARGINS
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.gWIDTH = width - (margin.left + margin.right);
        vis.gHEIGHT = height - (margin.top + margin.bottom);

        // G
        vis.g
            .attr('height', vis.gHEIGHT)
            .attr('width', vis.gWIDTH)
            .attr(
                'transform',
                `translate(${width * .5 - margin.right}, ${height * .5 + margin.top})`
            );

        // SETUP PIE
        const pieGenerator = d3
            .pie()
            .padAngle(0.04)
            .startAngle(0 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                return null;
            });

        const outerWidth = .49; // for donut wedges
        const innerWidth = 0; // for donut wedges

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        const arcData = pieGenerator([vis.data]);

        const transition = window.navigator.userAgent.includes('Edge') || window.navigator.userAgent.includes('Edg') ? 0 : 1100

        // JOIN DONUT SLICES
        let donutVis = vis.slices.selectAll('path')
            .data(arcData);
        // EXIT
        donutVis.exit()
            .style('opacity', 1)
            .transition()
            .duration(500)
            .attrTween('d', arcTweenClose)
            .style('opacity', 0)
            .remove();
        // UPDATE
        donutVis
            .transition()
            .duration(500)
            .style('opacity', 1)
            .attrTween('d', arcTween)

        // ENTER
        donutVis
            .enter()
            .append('path')
            .attr('id', (d, i) => `bond-slice-${i}`)
            .attr('fill', 'rgba(227, 227, 227, 1)')
            .transition()
            .delay(400)
            .duration(transition)
            .attrTween('d', d => {
                let i = d3.interpolate(d.startAngle, d.endAngle);
                return t => {
                    d.endAngle = i(t);
                    return arc(d)
                }
            })
            .style('opacity', 1)
            .transition()
            .delay(810)
            .attrTween('d', arcTween) // THIS GETS READY FOR THE UPDATE TWEEN

        // APPLY CLASS AFTER ANIMATION
        setTimeout(() => {
            document.getElementById('bond-section-4-svg').addEventListener('mouseover', () => {
                document.getElementById('bond-slice-0').classList = 'bond-circle';
            })
        }, 1700);

        function arcTweenClose(d) {
            let i = d3.interpolate(this._current, { startAngle: this._current.endAngle, endAngle: this._current.endAngle + .5 });
            return t => {
                return arc(i(t));
            };
        }

        function arcTween(d) {
            let i = d3.interpolate(this._current, d);
            this._current = i(0);
            return t => {
                return arc(i(t));
            };
        }

        console.warn(vis.data)

        /// TEXT
        vis.text
            .style('fill', 'rgba(0, 41, 75, 1)')
            .text(vis.data.value.toFixed(2) + "%")
            .attr('x', 0)
            .attr('y', 9)
            .attr('dy', -10)

        /// TEXT
        vis.text2
            .style('fill', 'rgba(0, 41, 75, 1)')
            .text('30 day SEC yield')
            .attr('x', 0)
            .attr('y', 9)
            .attr('dy', 13)

        /// TEXT
        vis.text3
            .style('fill', 'rgba(0, 41, 75, 1)')
            .text(`(as of ${vis.data.asOfDate})`)
            .attr('x', 0)
            .attr('y', 9)
            .attr('dy', 35)
    }
}