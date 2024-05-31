// ******************************* ******************************* //
// SLIDER //
// ******************************* ******************************* //
let isMop = false;
function toggleSliderGbar() {
    const slider = document.getElementById('slider-gbar');
    const titleNav = document.getElementById('mop-title-1-nav')
    const titleMop = document.getElementById('mop-title-1-mop')

    if (!slider.getAttribute('mop') || slider.getAttribute('mop') === 'false') {
        document.querySelector('#pill-toggle-gbar').style.left = '50%';
        document.getElementById('ft-toggle-left-g').style.color = 'rgba(127, 127, 127, 1)';
        document.getElementById('ft-toggle-right-g').style.color = 'rgba(0, 41, 75, 1)';
        isMop = true;
        slider.setAttribute('mop', true)
        titleMop.style.opacity = 1;
        titleNav.style.opacity = 0;
    } else {
        sliderResetgbar();
    }
    barChart.redraw();
}

function sliderResetgbar() {
    const slider = document.getElementById('slider-gbar');
    const titleNav = document.getElementById('mop-title-1-nav')
    const titleMop = document.getElementById('mop-title-1-mop')
    titleMop.style.opacity = 0;
    titleNav.style.opacity = 1;
    document.querySelector('#pill-toggle-gbar').style.left = 0;
    document.getElementById('ft-toggle-left-g').style.color = 'rgba(0, 41, 75, 1)';
    document.getElementById('ft-toggle-right-g').style.color = 'rgba(127, 127, 127, 1)';
    isMop = false;
    slider.setAttribute('mop', false)
}

// ******************************* ******************************* //
// MAKES BAR CHART FOR SECTION TWO OF GROWTH PAGE //
// ******************************* ******************************* //

class BarChart {
    constructor(data, fundClass, objective = 'Growth') {
        sliderResetgbar()
        const vis = this;
        vis.draws = 0;
        vis.shareData = data;
        vis.id = data.a.id;
        vis.objective = objective;
        vis.el = `bar-chart-growth`;
        vis.fundClass = fundClass;
        vis.isMop = isMop;
        vis.section = 'growth';

        //  FADE AND REMOVE PREVIOUS DATA VIS
        vis.gID = 'bar-chart-svg-ggi';
        if (document.querySelector(`.${vis.gID}`)) document.querySelectorAll(`.${vis.gID}`).forEach(el => {
            el.style.transition = '.15s all ease-in-out';
            setTimeout(() => {
                el.style.opacity = 0
            }, 0);
            setTimeout(() => {
                el.remove();
            }, 200);
        });

        // FADE DOWN OUTPUT TEXT FROM PREVIOUS CLASS IF IT EXISTS
        document.querySelectorAll('.bar-chart-output-text').forEach(el => el.style.opacity = 0);

        this.initVis();
    }

    initVis() {
        const vis = this;

        // MAIN SVG
        vis.chartDiv = document.getElementById(`${vis.el}-main`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis');

        // APPEND LINE FOR X AXIS
        vis.xLine = vis.g.append('line')

        // APPEND Y AXIS

        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis').attr('id', `${vis.section}-bar-chart-margin`)
            .style('text-anchor', 'start');

        // CHART SVG
        vis.chartDiv1 = document.getElementById(`${vis.el}-1`);
        vis.svg1 = d3.select(vis.chartDiv1).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g1 = vis.svg1.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv2 = document.getElementById(`${vis.el}-2`);
        vis.svg2 = d3.select(vis.chartDiv2).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g2 = vis.svg2.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv3 = document.getElementById(`${vis.el}-3`);
        vis.svg3 = d3.select(vis.chartDiv3).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g3 = vis.svg3.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv4 = document.getElementById(`${vis.el}-4`);
        vis.svg4 = d3.select(vis.chartDiv4).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g4 = vis.svg4.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv5 = document.getElementById(`${vis.el}-5`);
        vis.svg5 = d3.select(vis.chartDiv5).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g5 = vis.svg5.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv6 = document.getElementById(`${vis.el}-6`);
        vis.svg6 = d3.select(vis.chartDiv6).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g6 = vis.svg6.append('g').attr('class', 'g-class');
        // CHART SVG
        vis.chartDiv7 = document.getElementById(`${vis.el}-7`);
        vis.svg7 = d3.select(vis.chartDiv7).append('svg').attr('class', `${vis.gID} bar-chart-svg`);
        vis.g7 = vis.svg7.append('g').attr('class', 'g-class');

        this.redraw();
    }

    async redraw(fundClass = this.fundClass, objective = this.objective) {
        const vis = this;
        vis.objective = objective;
        vis.fundClass = fundClass;
        vis.draws++;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.shareData.a;
            vis.expense = vis.shareData.a.metricsData.expensesData.expensesValue;
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.shareData.f2;
            vis.expense = vis.shareData.f2.metricsData.expensesData.expensesValue;
        } else if (vis.fundClass === 'r6') {
            console.error('wtf')
            vis.data = vis.shareData.r6;
            vis.expense = vis.shareData.a.metricsData.expensesData.expensesValue;
        }

        // TOGGLE VALUE
        let data;
        if (!isMop) {
            data = vis.data.barData.data;
        } else {
            data = vis.data.barData.mopData;
        }

        vis.barColor = boxColors[vis.objective.trim()]

        // UUUUGH, this is gross
        let promise = new Promise((resolve, reject) => {
            vis.setText();
            setTimeout(() => {
                resolve('text set')
            }, vis.draws === 1 ? 450 : 100);
        });
        await promise;

        // SET WIDTH FOR CHART SECTIONS
        vis.MARGIN = { top: 25, right: 0, bottom: 15, left: 0 };
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

        vis.width7 = vis.chartDiv7.clientWidth;
        vis.height7 = vis.chartDiv7.clientHeight;
        vis.gWIDTH7 = vis.width7 - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT7 = vis.height7 - (vis.MARGIN.top + vis.MARGIN.bottom);
        vis.svg7.attr('width', vis.width7).attr('height', vis.height7);
        vis.g7
            .attr('width', vis.gWIDTH7)
            .attr('height', vis.gHEIGHT7)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // BIG SVG WITDH ////////////////////////////////
        vis.width = vis.chartDiv.clientWidth + vis.width1 + vis.width2 + vis.width3 + vis.width4 + vis.width5 + vis.width6 + vis.width7;

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
            .domain(['value', 'indexValue'])
            .range([0, vis.gWIDTH1])
            .paddingInner(.05)
            .paddingOuter(.33)

        // DOMAIN IT UP, BOYS
        const allNumbers = [];
        vis.data.barData.data.forEach(el => {
            allNumbers.push(Number(el.value))
            allNumbers.push(Number(el.indexValue))
        })

        const min = Math.floor(d3.min(allNumbers) / 10) * 10;
        const max = Math.ceil(d3.max(allNumbers) / 10) * 10;

        let yMax = 20;
        if (yMax < max) {
            yMax = max;
        }

        let yMin = 0;
        if (yMin > min) {
            yMin = min;
        }

        //  Y SCALE 
        let y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([yMin, yMax])
            .nice();

        const tickValues = [];
        for (let i = yMin; i <= yMax; i = i + 10) {
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

        const xTrans = seismicApp ? 30 : window.innerHeight < 800 ? 30 : iPad ? 30 : 30;
        vis.yAxis
            .attr('transform', `translate(${xTrans}, 0)`)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${xTrans}, 0)`)
            .call(yAxisCall.scale(y));

        // DRAW LINE FOR XAXIS
        vis.xLine
            .attr('x1', 60)
            .attr('x2', vis.gWIDTH - 20)
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('stroke', 'rgba(211, 211, 211, 1)')
            .attr('transform', `translate(0, ${0})`)
            .attr('opacity', vis.draws === 1 ? 0 : 1)
            .transition()
            .duration(500)
            .attr('opacity', 1)

        // chart 1

        //////////////////////// BARS /////////////////////////////
        // JOIN
        vis.rects1 = vis.g1.selectAll('.bars-data')
            .data([data[0].value, data[0].indexValue])
        // EXIT
        vis.rects1.exit().remove();
        // UPDATE
        vis.rects1
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects1
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));

        // JOIN
        vis.rects2 = vis.g2.selectAll('.bars-data')
            .data([data[1].value, data[1].indexValue])
        // EXIT
        vis.rects2.exit().remove();
        // UPDATE
        vis.rects2
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects2
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // JOIN

        vis.rects3 = vis.g3.selectAll('.bars-data')
            .data([data[2].value, data[2].indexValue])
        // EXIT
        vis.rects3.exit().remove();
        // UPDATE
        vis.rects3
            .transition()
            .duration(1000)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));
        // ENTER
        vis.rects3
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d)))
            .attr("height", d => Math.abs(y(d) - y(0)));

        if (data[3].value && data[3].indexValue) {
            if (document.getElementById(`bc-output-text-${vis.section}-1`)) {
                document.getElementById(`bc-output-text-${vis.section}-1`).remove();
            }

            // JOIN
            vis.rects4 = vis.g4.selectAll('.bars-data')
                .data([data[3].value, data[3].indexValue])
            // EXIT
            vis.rects4.exit().remove();
            // UPDATE
            vis.rects4
                .transition()
                .duration(1000)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
            // ENTER
            vis.rects4
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .attr('height', 0)
                .transition()
                .duration(1000)
                // .delay((d, i) => globalCounter * 200)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
        } else {
            const output = `Fund originated in ${new Date(vis.data.inception).getFullYear()}. No returns are available for time frame.`;
            vis.g5.append('text').text(output);
            const opacitySetting = vis.draws === 1 ? 0 : 1;

            document.getElementById(`${vis.el}-4`).innerHTML = ` 
                <div class='bar-chart-output-text' id='bc-output-text-${vis.section}-1' style='opacity: ${opacitySetting}'>
                    ${output}
                </div
            `;
            document.getElementById(`bc-output-text-${vis.section}-1`).style.top = y(0) - document.getElementById(`bc-output-text-${vis.section}-1`).clientHeight + 10 + 'px';
            document.getElementById(`bc-output-text-${vis.section}-1`).style.opacity = 1;
        }

        // chart 5
        if (data[4].value && data[4].indexValue) {
            if (document.getElementById(`bc-output-text-${vis.section}`)) {
                document.getElementById(`bc-output-text-${vis.section}`).remove();
            }

            // JOIN
            vis.rects5 = vis.g5.selectAll('.bars-data')
                .data([data[4].value, data[4].indexValue])
            // EXIT
            vis.rects5.exit().remove();
            // UPDATE
            vis.rects5
                .transition()
                .duration(1000)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
            // ENTER
            vis.rects5
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .attr('height', 0)
                .transition()
                .duration(1000)
                // .delay((d, i) => globalCounter * 200)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
        } else {
            const output = `Fund originated in ${new Date(vis.data.inception).getFullYear()}. No returns are available for time frame.`;
            const opacitySetting = vis.draws === 1 ? 0 : 1;

            vis.g5.append('text').text(output);
            document.getElementById(`${vis.el}-5`).innerHTML = ` 
                <div class='bar-chart-output-text' id='bc-output-text-${vis.section}' style='opacity: ${opacitySetting}'>
                    ${output}
                </div
            `;
            document.getElementById(`bc-output-text-${vis.section}`).style.top = y(0) - document.getElementById(`bc-output-text-${vis.section}`).clientHeight + 10 + 'px';
            document.getElementById(`bc-output-text-${vis.section}`).style.opacity = 1;
        }
        // chart 6
        if (data[5].value && data[5].indexValue) {
            // JOIN
            vis.rects6 = vis.g6.selectAll('.bars-data')
                .data([data[5].value, data[5].indexValue])
            // EXIT
            vis.rects6.exit().remove();
            // UPDATE
            vis.rects6
                .transition()
                .duration(1000)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
            // ENTER
            vis.rects6
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .attr('height', 0)
                .transition()
                .duration(1000)
                // .delay((d, i) => globalCounter * 200)
                .attr("x", (d, i) => i === 0 ? x('value') : x('indexValue'))
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
        }
        else if (data[5].value) {
            //SINGLE BAR FOR 'SINCE FUND INCEPTION'
            // JOIN
            vis.rects6 = vis.g6.selectAll('.bars-data')
                .data([data[5].value])
            // EXIT
            vis.rects6.exit().remove();
            // UPDATE
            vis.rects6
                .transition()
                .duration(1000)
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
            // ENTER
            vis.rects6
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .attr('height', 0)
                .transition()
                .duration(1000)
                // .delay((d, i) => globalCounter * 200)
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
        }

        // chart 7 (expense)
        if (vis.expense) {
            // JOIN
            vis.rects7 = vis.g7.selectAll('.bars-data')
                .data([vis.expense])
            // EXIT
            vis.rects7.exit().remove();
            // UPDATE
            vis.rects7
                .transition()
                .duration(1000)
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
            // ENTER
            vis.rects7
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .style("fill", (d, i) => i === 0 ? vis.barColor : 'rgba(178, 178, 178, 1)')
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .attr('height', 0)
                .transition()
                .duration(1000)
                // .delay((d, i) => globalCounter * 200)
                .attr("x", (d) => x('value') + x.bandwidth() / 2)
                .attr('width', x.bandwidth())
                .attr("y", d => y(Math.max(0, d)))
                .attr("height", d => Math.abs(y(d) - y(0)));
        }
    }

    setText() {
        const vis = this;

        // TOGGLE VALUE
        let data;
        if (!isMop) {
            data = vis.data.barData.data;
        } else {
            data = vis.data.barData.mopData;
        }

        // SET ALT ELEMENTS
        setElements('-alt');

        // DOT COLOR
        document.getElementById(`bar-chart-fund-dot-${vis.section}`).style.backgroundColor = vis.barColor;

        // CROSS FADE (ALT ELS ON, REG ELS OFF)
        document.querySelectorAll('.bar-chart-alt').forEach(el => el.style.opacity = 1);
        document.querySelectorAll('.bar-chart-reg').forEach(el => el.style.opacity = 0);

        // SET REG ELEMENTS AFTER ELEMENTS HAVE TRANSITIONED
        setTimeout(() => {
            setElements();
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
            // FOOTNOTE FOR GROWTH
            const note = document.getElementById(`growth-q-end-footnote${group}`); // BECAUSE WE ARE DOING ID, IT DOESN'T CHANGE THE SAME ID IN THE BOND SECTION LOL
            const sup = document.getElementById(`growth-bar-chart-ytd${group}`);

            if (vis.fundClass === 'a') {
                if (vis.id === 'IVE' || vis.id === 'DWGI' || vis.id === 'GBAL') {
                    note.innerText = '1';
                    sup.innerText = '5';
                } else if (vis.id === 'GFA') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'NPF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'NWF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'WMIF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMCAP') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMBAL') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'EUPAC') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'GIF') {
                    note.innerText = '1';
                    sup.innerText = '5';
                }
                else if (vis.id === 'NEF' || vis.id === 'SCWF' || vis.id === 'WGI' || vis.id === 'IGI' || vis.id === 'CIB' || vis.id === 'IFA'
                    || vis.id === 'ICA' || vis.id === 'FI') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else {
                    note.innerText = '';
                    sup.innerText = '';
                }
            } else {
                if (vis.id === 'IVE' || vis.id === 'DWGI' || vis.id === 'GBAL') {
                    note.innerText = '1';
                    sup.innerText = '5';
                } else if (vis.id === 'GFA') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'NPF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'NWF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'WMIF') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMBAL') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'AMCAP') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'EUPAC') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else if (vis.id === 'GIF') {
                    note.innerText = '1';
                    sup.innerText = '5';
                } else if (vis.id === 'NEF' || vis.id === 'SCWF' || vis.id === 'WGI' || vis.id === 'IGI' || vis.id === 'CIB' || vis.id === 'IFA'
                    || vis.id === 'ICA' || vis.id === 'FI') {
                    note.innerText = '1';
                    sup.innerText = '6';
                } else {
                    note.innerText = '';
                    sup.innerText = '';
                }
            }

            // INDEX NAME
            if (vis.data.indexPrimary) {
                document.getElementById(`bar-chart-index-name-${vis.section}${group}`).innerText = vis.data.indexPrimary;
            } else {
                document.getElementById(`bar-chart-index-name-${vis.section}${group}`).innerText = '';
            }

            // DATE
            if (vis.data.barData.date) {
                document.getElementById(`bar-chart-date-${vis.section}${group}`).innerText = 'As of ' + vis.data.barData.date + ' (updated quarterly)';
            } else {
                document.getElementById(`bar-chart-date-${vis.section}${group}`).innerText = '';
            }

            // TICKER (FUND NAME)
            if (vis.data.ticker) {
                document.getElementById(`bar-chart-fund-name-${vis.section}${group}`).innerText = vis.data.ticker;
            } else {
                document.getElementById(`bar-chart-fund-name-${vis.section}${group}`).innerText = '';
            }

            // UPDATE VALUES
            data.forEach((d, i) => {
                const num = i + 1;

                // ROW 1 (LIGHT BLUE)
                if (document.getElementById(`bar-chart-val-${num}-${vis.section}${group}`)) {
                    if (d.value) {
                        document.getElementById(`bar-chart-val-${num}-${vis.section}${group}`).innerText = enDash(d.value.toFixed(2)) + '%';
                    } else {
                        document.getElementById(`bar-chart-val-${num}-${vis.section}${group}`).innerText = 'N/A';
                    }
                }

                // ROW 2 (BOTTOM)
                if (document.getElementById(`bar-chart-index-val-${num}-${vis.section}${group}`)) {
                    if (d.indexValue) {
                        document.getElementById(`bar-chart-index-val-${num}-${vis.section}${group}`).innerText = enDash(d.indexValue.toFixed(2)) + '%';
                    } else {
                        if (i === data.length - 1 || i === 5) {
                            document.getElementById(`bar-chart-index-val-${num}-${vis.section}${group}`).innerText = '—';
                        } else {
                            document.getElementById(`bar-chart-index-val-${num}-${vis.section}${group}`).innerText = 'N/A';
                        }
                    }
                }
            })

            // EXPENSE RATIOS
            if (document.getElementById(`bar-chart-val-7-${vis.section}${group}`)) {
                document.getElementById(`bar-chart-val-7-${vis.section}${group}`).innerText = enDash(vis.expense.toFixed(2)) + '%';
            }
        }
    }
}