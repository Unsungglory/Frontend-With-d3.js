function toggleSliderTdHero(num) {
    const slider = document.getElementById('pill-toggle-td-1');

    const text0 = document.getElementById('ft-toggle-td-0');
    const text1 = document.getElementById('ft-toggle-td-1');
    const text2 = document.getElementById('ft-toggle-td-2');
    const text3 = document.getElementById('ft-toggle-td-3');

    const chart1 = document.getElementById('td-hero-chart-1');
    const chart2 = document.getElementById('td-hero-chart-2');
    const chart3 = document.getElementById('td-hero-chart-3');
    const chart4 = document.getElementById('td-hero-chart-4');

    const legend1 = document.getElementById('r6-td-legend-1');
    const legend2 = document.getElementById('r6-td-legend-2');
    const legend3 = document.getElementById('r6-td-legend-3');

    const title1 = document.getElementById('tdHero-title-1');
    const title2 = document.getElementById('tdHero-title-2');

    switch (num) {
        case 0:
            slider.style.left = 0;
            slider.style.width = '17.33%';

            title1.style.opacity = 1;
            title2.style.opacity = 0;

            text0.style.color = 'rgba(0, 41, 75, 1)';
            text1.style.color = 'rgba(127, 127, 127, 1)';
            text2.style.color = 'rgba(127, 127, 127, 1)';
            text3.style.color = 'rgba(127, 127, 127, 1)';

            chart1.style.opacity = 1;
            chart1.style.zIndex = 1;

            chart2.style.opacity = 0;
            chart2.style.zIndex = 0;

            chart3.style.opacity = 0;
            chart3.style.zIndex = 0;

            chart4.style.opacity = 0;
            chart4.style.zIndex = 0;

            legend1.style.opacity = 1;
            legend2.style.opacity = 0;
            legend3.style.opacity = 0;

            break;
        case 1:
            slider.style.left = '18%';
            slider.style.width = '26%';

            title1.style.opacity = 1;
            title2.style.opacity = 0;

            text0.style.color = 'rgba(127, 127, 127, 1)';
            text1.style.color = 'rgba(0, 41, 75, 1)';
            text2.style.color = 'rgba(127, 127, 127, 1)';
            text3.style.color = 'rgba(127, 127, 127, 1)';

            chart1.style.opacity = 0;
            chart1.style.zIndex = 0;

            chart2.style.opacity = 1;
            chart2.style.zIndex = 1;

            chart3.style.opacity = 0;
            chart3.style.zIndex = 0;

            chart4.style.opacity = 0;
            chart4.style.zIndex = 0;

            legend1.style.opacity = 0;
            legend2.style.opacity = 1;
            legend3.style.opacity = 0;

            break;
        case 2:
            slider.style.left = '45%';
            slider.style.width = '30%';

            title1.style.opacity = 1;
            title2.style.opacity = 0;

            text0.style.color = 'rgba(127, 127, 127, 1)';
            text1.style.color = 'rgba(127, 127, 127, 1)';
            text2.style.color = 'rgba(0, 41, 75, 1)';
            text3.style.color = 'rgba(127, 127, 127, 1)';

            chart1.style.opacity = 0;
            chart1.style.zIndex = 0;

            chart2.style.opacity = 0;
            chart2.style.zIndex = 0;

            chart3.style.opacity = 1;
            chart3.style.zIndex = 1;

            chart4.style.opacity = 0;
            chart4.style.zIndex = 0;

            legend1.style.opacity = 0;
            legend2.style.opacity = 0;
            legend3.style.opacity = 1;

            break;
        case 3:
            slider.style.left = '75%';
            slider.style.width = '25%';

            title1.style.opacity = 0;
            title2.style.opacity = 1;

            text0.style.color = 'rgba(127, 127, 127, 1)';
            text1.style.color = 'rgba(127, 127, 127, 1)';
            text2.style.color = 'rgba(127, 127, 127, 1)';
            text3.style.color = 'rgba(0, 41, 75, 1)';

            chart1.style.opacity = 0;
            chart1.style.zIndex = 0;

            chart2.style.opacity = 0;
            chart2.style.zIndex = 0;

            chart3.style.opacity = 0;
            chart3.style.zIndex = 0;

            chart4.style.opacity = 1;
            chart4.style.zIndex = 1;

            legend1.style.opacity = 0;
            legend2.style.opacity = 0;
            legend3.style.opacity = 0;

            document.getElementById('r6-tooltip').style.opacity = 0;

            break;

        default:
            break;
    }
}

// ................................
// STACKED AREA CHART
// ...............................

class GlidePath {
    constructor(el) {
        const vis = this;
        vis.el = el;
        vis.draws = 0;
        vis.notFirstTime = false;
        vis.doneLoading = false;

        this.init();
    }

    init() {
        const vis = this;

        // MAIN SVG
        vis.chartDiv = document.getElementById(vis.el);

        // REMOVE PREVIOUS ELEMENTS (IF NEEDED)
        document.querySelector(`#${vis.el}`).innerHTML = ''

        vis.svg = d3.select(vis.chartDiv).append('svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'glide-class');

        // APPEND TWO BOXES FOR THE BOTTOM
        vis.box1 = vis.g.append('rect').attr('class', 'r6-bot-box');
        vis.box2 = vis.g.append('rect').attr('class', 'r6-bot-box');
        vis.coverBox = vis.g.append('rect').attr('class', 'r6-cover-box');
        vis.text1 = vis.g.append('text').attr('class', 'r6-td-gry-text').text('AGE 20')
        vis.text2 = vis.g.append('text').attr('class', 'r6-td-gry-text').text('AGE 50')
        vis.text3 = vis.g.append('text').attr('class', 'r6-td-gry-text').text('AGE 65')
        vis.text4 = vis.g.append('text').attr('class', 'r6-td-gry-text').text('AGE 95')
        vis.text5 = vis.g.append('text').attr('class', 'r6-td-bot-text').text('Years to retirement')
        vis.text6 = vis.g.append('text').attr('class', 'r6-td-bot-text').text('Years from retirement')

        vis.areas = vis.g.append("g").attr("class", "areas");

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis').style('text-anchor', 'start');

        // APPEND Y AXIS
        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis').style('text-anchor', 'end');

        // ASSIGN TOOLTIP
        vis.tooltip = d3.select('#r6-tooltip');
        vis.toolTitle = d3.select('#r6-tt-header');
        vis.toolSection = d3.select('#r6-tt-name');
        vis.toolNumber = d3.select('#r6-tt-number');

        // set data, colors, keys depeding on vis.el
        vis.setData();

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
        const left = window.innerWidth < 1100 ? 30 : window.innerWidth < 1400 ? 60 : 60;
        const margin = { top: 10, right: 30, bottom: 120, left: left };
        vis.gWIDTH = width - (margin.left + margin.right);
        vis.gHEIGHT = height - (margin.top + margin.bottom);

        // G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // SCALES
        const x = d3.scaleLinear()
            .domain([-45, 30])
            .range([0, vis.gWIDTH])

        vis.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([vis.gHEIGHT, 0]);

        const tickVals = []
        for (let i = -45; i < 35; i = i + 5) {
            tickVals.push(i)
        }

        // x axis
        const xAxisCall = d3
            .axisBottom()
            .tickValues(tickVals)
            // .tickPadding(window.innerWidth < 1200 ? 2 : window.innerHeight < 770 ? 2 : 4)
            .tickFormat(el => el === 0 ? 'Retire' : el < 0 ? -el : '+' + el);

        // POSITION SET ON FIRST DRAW ONLY
        const minorPos = -2
        const yOffset = window.innerWidth < 1100 ? -10 : 0
        if (vis.draws <= 1) {
            vis.xAxis
                .attr('transform', `translate(${minorPos}, ${vis.yScale(0) + margin.top + yOffset})`)
        }
        vis.xAxis
            .transition()
            .delay(0)
            .duration(500)
            .attr('opacity', 1)
            .attr('transform', `translate(${minorPos}, ${vis.yScale(0) + margin.top + yOffset})`)
            .call(xAxisCall.scale(x).tickSizeOuter([0]));

        // Y AXIS
        const yPad = window.innerWidth < 1200 ? 20 : 45;
        const yAxisCall = d3
            .axisLeft()
            .ticks(10)
            .tickPadding(yPad)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat((el, i) => el * 100 + '%');

        vis.yAxis
            .transition()
            .duration(500)
            .call(yAxisCall.scale(vis.yScale));

        // BOXES ON XAXIS
        const buffer = 5;
        const extraHeight = window.innerWidth < 1200 ? 25 : 45
        const yPos = vis.gHEIGHT + margin.top + extraHeight;
        const boxPos = yPos - 5;
        const coverPos = yPos - 15;
        vis.box1
            .attr('width', x(0) - x(-45) - buffer)
            .attr('height', 20)
            .attr('x', 0)
            .attr('y', boxPos)

        vis.box2
            .attr('width', x(30) - x(0) - buffer)
            .attr('height', 20)
            .attr('x', x(0) + 1)
            .attr('y', boxPos)

        vis.coverBox
            .attr('width', vis.gWIDTH)
            .attr('height', 20)
            .attr('x', -2)
            .attr('y', coverPos)

        vis.text1.attr('y', yPos).attr('x', x(-44));
        vis.text2.attr('y', yPos).attr('x', x(-15));
        vis.text3.attr('y', yPos).attr('x', x(0));
        vis.text4.attr('y', yPos).attr('x', x(29));

        const textPost = yPos + 35;
        vis.text5.attr('y', textPost).attr('x', x(-22.5));
        vis.text6.attr('y', textPost).attr('x', x(15));

        // stacked area
        const areaGenerator = d3.area()
            .x(d => x(d.data.age))
            .y0((d) => vis.yScale(d[0] / 100))
            .y1((d) => vis.yScale(d[1] / 100));

        vis.stack = d3.stack()
            .keys(vis.keys);

        vis.stackedData = vis.stack(vis.data);

        // JOIN
        vis.glidepath = vis.areas
            .selectAll('path')
            .data(vis.stackedData)

        // EXIT
        vis.glidepath.exit().remove();

        // UPDATE
        vis.glidepath
            .attr('id', (d, i) => `area-${vis.keys[i].replace(' ', '-').toLowerCase()}`)
            .attr('fundName', (d, i) => vis.keys[i])
            .style('fill', (d, i) => vis.colors[i])
            .on('mousemove', (d, i) => handleMove(`area-${vis.keys[i].replace(' ', '-').toLowerCase()}`, d))
            .on('mouseout', handleOut)
            .transition()
            .duration(500)
            .attr('d', areaGenerator)

        // ENTER
        vis.glidepath
            .enter()
            .append('path')
            .attr('class', 'gp-section')
            .attr('id', (d, i) => `area-${vis.keys[i].replace(' ', '-').toLowerCase()}`)
            .attr('fundName', (d, i) => vis.keys[i])
            .style('fill', (d, i) => vis.colors[i])
            .attr('d', areaGenerator)
            .style('opacity', 0)
            .on('mousemove', (d, i) => handleMove(`area-${vis.keys[i].replace(' ', '-').toLowerCase()}`, d))
            .on('mouseout', handleOut)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 150 + 300)
            .style('opacity', 1)

        // vis.touchLayer.on("touchmove", handleMove).on("touchend", handleEnd).on("touchcancel", handleEnd)

        setTimeout(() => {
            vis.doneLoading = true;
        }, 1500);

        vis.sections = document.querySelectorAll('.gp-section');

        function dimSections(id) {
            vis.sections.forEach(section => {
                section.style.transition = ".3s opacity ease-in-out";

                if (section.id !== id) {
                    section.style.opacity = 0.75;
                } else {
                    section.style.opacity = 1;
                }
            })
        }

        vis.ttHeight = vis.tooltip.node().getBoundingClientRect().height;

        function handleMove(id, d) {
            if (!vis.doneLoading) return;

            dimSections(id);

            d3.event.preventDefault();

            const self = document.getElementById(id)
            const el = d3.mouse(self);
            const xPos = x.invert(el[0]);

            vis.toolTitle.text(vis.textNum(xPos) + ' Years From Retirement')
            vis.toolSection.text(d.key)
            vis.setNumber(d, vis.roundNum(xPos));
            const leftMove = window.innerWidth < 1100 ? -22 : -17;
            vis.tooltip.style('left', x(vis.roundNum(xPos)) + leftMove + 'px')
            const upMove = window.innerWidth < 1100 ? -1 : -3
            vis.tooltip.style('top', vis.getYvalue(d, vis.roundNum(xPos)) - vis.ttHeight + upMove + 'px')

            if (vis.notFirstTime) {
                vis.tooltip.style('opacity', 1);
                clearTimeout(vis.to);
            } else {
                setTimeout(() => {
                    vis.tooltip.style('opacity', 1);
                    vis.notFirstTime = true;
                }, 300);
            }
        }

        function handleOut() {
            if (!vis.doneLoading) return;

            vis.to = setTimeout(() => {
                vis.tooltip.style('opacity', 0)
                vis.notFirstTime = false;
            }, 50);

            vis.sections.forEach(section => section.style.opacity = 1)
        }
    }


    setNumber(d, xPos) {
        const vis = this;

        d.forEach(dd => {
            if (dd.data.age === xPos) {
                vis.toolNumber.text(dd.data[d.key] + '%')
            }
        })
    }

    getYvalue(d, xPos) {
        const vis = this;

        for (let i = 0; i < d.length; i++) {
            if (d[i].data.age === xPos) {
                return vis.yScale(d[i][1] / 100)
            }
        }
    }

    textNum(num) {
        const vis = this;

        return vis.roundNum(num) > 0 ? "+" + vis.roundNum(num) : Math.abs(vis.roundNum(num))
    }

    roundNum(num) {
        if (num < -42) {
            return -45
        } else if (num < -37) {
            return -40
        } else if (num < -32) {
            return -35
        } else if (num < -27) {
            return -30
        } else if (num < -22) {
            return -25
        } else if (num < -17) {
            return -20
        } else if (num < -12) {
            return -15
        } else if (num < -7) {
            return -10
        } else if (num < -2) {
            return -5
        } else if (num < 2) {
            return 0
        } else if (num < 7) {
            return 5
        } else if (num < 12) {
            return 10
        } else if (num < 17) {
            return 15
        } else if (num < 22) {
            return 20
        } else if (num < 27) {
            return 25
        } else if (num < 32) {
            return 30
        }
    }

    setData() {
        const vis = this;

        if (vis.el === 'td-hero-chart-1') {

            vis.data = dataTD.glidepath;

            vis.keys = ['Growth funds', 'Growth-and-income funds', 'Equity-income funds', 'Balanced funds', 'Fixed income'];

            vis.colors = [
                'rgba(0, 45, 114, 1)',
                'rgba(0, 87, 184, 1)',
                'rgba(0, 142, 170, 1)',
                'rgba(45, 204, 211, 1)',
                'rgba(198, 220, 216, 1)',
            ];

        } else if (vis.el === 'td-hero-chart-2') {

            vis.data = [
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -45 },
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -40 },
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -35 },
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -30 },
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -25 },
                { 'Equity': 95, 'Diversification': 5, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 0, age: -20 },
                { 'Equity': 90, 'Diversification': 8, 'Income': 0, 'Capital preservation': 0, 'Inflation protection': 2, age: -15 },
                { 'Equity': 75, 'Diversification': 12, 'Income': 5, 'Capital preservation': 4, 'Inflation protection': 4, age: -10 },
                { 'Equity': 65, 'Diversification': 11, 'Income': 10, 'Capital preservation': 9, 'Inflation protection': 5, age: -5 },
                { 'Equity': 55, 'Diversification': 11, 'Income': 18, 'Capital preservation': 9, 'Inflation protection': 7, age: 0 },
                { 'Equity': 55, 'Diversification': 11, 'Income': 18, 'Capital preservation': 9, 'Inflation protection': 7, age: 5 },
                { 'Equity': 50, 'Diversification': 6, 'Income': 18, 'Capital preservation': 19, 'Inflation protection': 7, age: 10 },
                { 'Equity': 50, 'Diversification': 7, 'Income': 10, 'Capital preservation': 28, 'Inflation protection': 5, age: 15 },
                { 'Equity': 45, 'Diversification': 7, 'Income': 10, 'Capital preservation': 33, 'Inflation protection': 5, age: 20 },
                { 'Equity': 40, 'Diversification': 13, 'Income': 5, 'Capital preservation': 38, 'Inflation protection': 4, age: 25 },
                { 'Equity': 40, 'Diversification': 13, 'Income': 0, 'Capital preservation': 43, 'Inflation protection': 4, age: 30 }
            ];

            vis.keys = ['Equity', 'Diversification', 'Income', 'Capital preservation', 'Inflation protection'];

            vis.data.forEach(d => {
                let total = 0;
                vis.keys.forEach(key => {
                    total += d[key];
                })
            })

            vis.colors = [
                'rgb(148, 165, 192)',
                'rgb(0, 195, 137)',
                'rgb(0, 147, 93)',
                'rgb(0, 108, 91)',
                'rgb(0, 130, 100)',
            ];
        } else if (vis.el === 'td-hero-chart-3') {

            vis.data = [
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .5, 'High yield': 0.1, 'Emerging markets debt': .6, 'Non-U.S. developed fixed income': .7,
                    'U.S. fixed income': 6.8, 'REITs': 1.3, 'Emerging markets equity': 8.3, 'Non-U.S. developed equity': 19.3, 'U.S. equity': 55.8, age: -45
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .5, 'High yield': 0.1, 'Emerging markets debt': .6, 'Non-U.S. developed fixed income': .7,
                    'U.S. fixed income': 6.8, 'REITs': 1.3, 'Emerging markets equity': 8.3, 'Non-U.S. developed equity': 19.3, 'U.S. equity': 55.8, age: -40
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .5, 'High yield': 0.1, 'Emerging markets debt': .6, 'Non-U.S. developed fixed income': .7,
                    'U.S. fixed income': 6.8, 'REITs': 1.3, 'Emerging markets equity': 8.3, 'Non-U.S. developed equity': 19.3, 'U.S. equity': 55.8, age: -35
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .5, 'High yield': 0.1, 'Emerging markets debt': .6, 'Non-U.S. developed fixed income': .7,
                    'U.S. fixed income': 6.8, 'REITs': 1.3, 'Emerging markets equity': 8.3, 'Non-U.S. developed equity': 19.3, 'U.S. equity': 55.8, age: -30
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .6, 'High yield': .2, 'Emerging markets debt': .6, 'Non-U.S. developed fixed income': .7,
                    'U.S. fixed income': 7.8, 'REITs': 1.4, 'Emerging markets equity': 8.2, 'Non-U.S. developed equity': 19.5, 'U.S. equity': 54.1, age: -25
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': .6, 'High yield': .3, 'Emerging markets debt': .7, 'Non-U.S. developed fixed income': .9,
                    'U.S. fixed income': 8.7, 'REITs': 1.6, 'Emerging markets equity': 8, 'Non-U.S. developed equity': 19.4, 'U.S. equity': 53, age: -20
                },
                {
                    'Cash and equivalents': 6.6, 'Inflation linked': 2.4, 'High yield': .3, 'Emerging markets debt': .7, 'Non-U.S. developed fixed income': .9,
                    'U.S. fixed income': 11.7, 'REITs': 1.5, 'Emerging markets equity': 7.2, 'Non-U.S. developed equity': 18.6, 'U.S. equity': 50.1, age: -15
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': 4.8, 'High yield': .5, 'Emerging markets debt': 2.1, 'Non-U.S. developed fixed income': 2.8,
                    'U.S. fixed income': 19.3, 'REITs': 1.5, 'Emerging markets equity': 5, 'Non-U.S. developed equity': 15.1, 'U.S. equity': 42.1, age: -10
                },
                {
                    'Cash and equivalents': 6.7, 'Inflation linked': 5.9, 'High yield': .6, 'Emerging markets debt': 2.2, 'Non-U.S. developed fixed income': 3.8,
                    'U.S. fixed income': 26.3, 'REITs': 1.5, 'Emerging markets equity': 3.8, 'Non-U.S. developed equity': 12.8, 'U.S. equity': 36.4, age: -5
                },
                {
                    'Cash and equivalents': 6.9, 'Inflation linked': 7.5, 'High yield': 5.1, 'Emerging markets debt': 2.1, 'Non-U.S. developed fixed income': 3.9,
                    'U.S. fixed income': 30.2, 'REITs': 1.8, 'Emerging markets equity': 2.1, 'Non-U.S. developed equity': 9.8, 'U.S. equity': 30.6, age: 0
                },
                {
                    'Cash and equivalents': 7, 'Inflation linked': 7.6, 'High yield': 5.2, 'Emerging markets debt': 2.1, 'Non-U.S. developed fixed income': 3.9,
                    'U.S. fixed income': 31.1, 'REITs': 2, 'Emerging markets equity': 2, 'Non-U.S. developed equity': 10.3, 'U.S. equity': 28.7, age: 5
                },
                {
                    'Cash and equivalents': 6.9, 'Inflation linked': 7.7, 'High yield': 5.2, 'Emerging markets debt': 2.2, 'Non-U.S. developed fixed income': 5.1,
                    'U.S. fixed income': 34.4, 'REITs': 2, 'Emerging markets equity': 1.8, 'Non-U.S. developed equity': 9.3, 'U.S. equity': 25.5, age: 10
                },
                {
                    'Cash and equivalents': 6.9, 'Inflation linked': 6, 'High yield': 1.1, 'Emerging markets debt': .8, 'Non-U.S. developed fixed income': 4.8,
                    'U.S. fixed income': 43.1, 'REITs': 2.3, 'Emerging markets equity': 1.7, 'Non-U.S. developed equity': 9.6, 'U.S. equity': 23.7, age: 15
                },
                {
                    'Cash and equivalents': 6.8, 'Inflation linked': 6.2, 'High yield': 1.1, 'Emerging markets debt': .8, 'Non-U.S. developed fixed income': 5.3,
                    'U.S. fixed income': 47.2, 'REITs': 2.2, 'Emerging markets equity': 1.6, 'Non-U.S. developed equity': 9.1, 'U.S. equity': 19.8, age: 20
                },
                {
                    'Cash and equivalents': 7.2, 'Inflation linked': 5.6, 'High yield': 1, 'Emerging markets debt': .7, 'Non-U.S. developed fixed income': 5.5,
                    'U.S. fixed income': 52, 'REITs': 2.1, 'Emerging markets equity': 1.4, 'Non-U.S. developed equity': 8.4, 'U.S. equity': 16.1, age: 25
                },
                {
                    'Cash and equivalents': 7.2, 'Inflation linked': 5.6, 'High yield': 1.1, 'Emerging markets debt': .5, 'Non-U.S. developed fixed income': 5.7,
                    'U.S. fixed income': 53, 'REITs': 2.3, 'Emerging markets equity': 1.3, 'Non-U.S. developed equity': 8.8, 'U.S. equity': 14.6, age: 30
                }
            ];

            vis.keys = [
                'U.S. equity',
                'Non-U.S. developed equity',
                'Emerging markets equity',
                'REITs',
                'U.S. fixed income',
                'Non-U.S. developed fixed income',
                'Emerging markets debt',
                'High yield',
                'Inflation linked',
                'Cash and equivalents',
            ];

            vis.data.forEach(d => {
                let total = 0;
                vis.keys.forEach(key => {
                    total += d[key];
                })
            })

            vis.colors = [
                '#062C71',
                '#229DDB',
                '#135F9E',
                '#7AD1E1',
                '#22965D',
                '#28AFA9',
                '#0E4C46',
                '#1E8E77',
                '#532A44',
                '#A39E98',
            ];
        }
    }
}

// ------------------------------------------------
// four roles handlers
// ------------------------------------------------

// OPEN HOVER BOX WITH CLICK
function tdHerohandleClick(el) {
    const hoverBox = el.previousElementSibling;
    hoverBox.setAttribute('click', true);
    hoverBox.classList.add('active')
}

// SHOW HOVER BOX WITH HOVER
function tdHerohandleHover(el) {
    const hoverBox = el.previousElementSibling;
    hoverBox.classList.add('active')
}

// HIDE HOVER BOX WHEN LEAVE
function tdHerohandleOut(el) {
    const hoverBox = el.previousElementSibling;
    if (hoverBox.getAttribute('click') === 'true') return;

    hoverBox.classList.remove('active')
}

// CLOSE HOVER BOX WITH X
function tdHerocloseBox(el) {
    const closeX = el;
    const hoverBox = closeX.parentElement
    hoverBox.classList.remove('active')
    hoverBox.setAttribute('click', false);
}
