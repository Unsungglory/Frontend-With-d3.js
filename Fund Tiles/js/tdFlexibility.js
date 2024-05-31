function toggleSliderTdFlex(num) {
    const slider = document.getElementById('pill-toggle-td-flexibility');

    // SLIDER TEXT
    document.querySelectorAll('#slider-td-flexibility button').forEach((text, i) => {
        if (i === num) {
            text.style.color = 'rgba(0, 41, 75, 1)';
        } else {
            text.style.color = 'rgba(127, 127, 127, 1)';
        }
    })

    // SECTION SUBHEADERS
    document.querySelectorAll('#td-flexibility-toggle div').forEach((el, i) => {
        if (i === num) {
            el.style.opacity = 1;
        } else {
            el.style.opacity = 0;
        }
    })

    // CHARTS
    document.querySelectorAll('.flex-chart').forEach((chart, i) => {
        if (i === num) {
            chart.classList.add('active');
        } else {
            chart.classList.remove('active');
        }
    })

    switch (num) {
        case 0:
            slider.style.left = 0;
            slider.style.width = '24%';
            break;
        case 1:
            slider.style.left = '25%';
            slider.style.width = '24.5%';
            break;
        case 2:
            slider.style.left = '50%';
            slider.style.width = '24.5%';
            break;
        case 3:
            slider.style.left = '75%';
            slider.style.width = '25%';
            break;
        default:
            break;
    }
}

// ................................
// TD FLEXIBILITY LINE CHART
// ...............................

// const lineData1 = [
//     { current: 87.5, average: 83.2, high: 87.5, lastYear: 85.4, low: 76.8, year: -45 },
//     { current: 87.5, average: 83.2, high: 87.5, lastYear: 85.4, low: 76.8, year: -40 },
//     { current: 87.5, average: 83.2, high: 87.5, lastYear: 85.4, low: 76.8, year: -35 },
//     { current: 87.5, average: 83.3, high: 87.5, lastYear: 85.4, low: 77.1, year: -30 },
//     { current: 86.2, average: 81.9, high: 86.2, lastYear: 83.6, low: 76.0, year: -25 },
//     { current: 85.3, average: 80.9, high: 85.3, lastYear: 82.4, low: 75.1, year: -20 },
//     { current: 80.5, average: 76.3, high: 80.5, lastYear: 77.7, low: 71.1, year: -15 },
//     { current: 66.1, average: 62.6, high: 66.1, lastYear: 63.5, low: 58.6, year: -10 },
//     { current: 56.6, average: 53.4, high: 56.6, lastYear: 54.1, low: 50.0, year: -5 },
//     { current: 46.4, average: 43.6, high: 46.4, lastYear: 43.8, low: 40.5, year: 0 },
//     { current: 45.3, average: 42.4, high: 45.3, lastYear: 42.5, low: 39.1, year: 5 },
//     { current: 40.6, average: 37.8, high: 40.6, lastYear: 37.9, low: 34.3, year: 10 },
//     { current: 39.9, average: 36.9, high: 39.9, lastYear: 37.0, low: 32.9, year: 15 },
//     { current: 35.5, average: 32.8, high: 35.5, lastYear: 32.7, low: 28.9, year: 20 },
//     { current: 30.5, average: 27.9, high: 30.5, lastYear: 27.6, low: 24.1, year: 25 },
//     { current: 30.3, average: 27.6, high: 30.3, lastYear: 27.3, low: 23.6, year: 30 },
// ]

// const lineData2 = [
//     { current: 28.1, average: 30.1, high: 34.2, lastYear: 27.4, low: 24.9, year: -45 },
//     { current: 28.1, average: 30.1, high: 34.2, lastYear: 27.4, low: 24.9, year: -40 },
//     { current: 28.1, average: 30.1, high: 34.2, lastYear: 27.4, low: 24.9, year: -35 },
//     { current: 28.2, average: 30.0, high: 33.9, lastYear: 27.4, low: 24.8, year: -30 },
//     { current: 27.5, average: 28.7, high: 31.9, lastYear: 26.6, low: 24.0, year: -25 },
//     { current: 27.5, average: 28.4, high: 31.3, lastYear: 26.4, low: 23.8, year: -20 },
//     { current: 25.6, average: 26.3, high: 28.9, lastYear: 24.5, low: 22.0, year: -15 },
//     { current: 24.1, average: 23.9, high: 26.0, lastYear: 23.0, low: 19.9, year: -10 },
//     { current: 22.3, average: 21.9, high: 23.9, lastYear: 21.3, low: 18.4, year: -5 },
//     { current: 20.3, average: 19.5, high: 21.4, lastYear: 19.1, low: 16.9, year: 0 },
//     { current: 19.7, average: 18.7, high: 20.7, lastYear: 18.3, low: 16.3, year: 5 },
//     { current: 19.3, average: 18.4, high: 20.7, lastYear: 17.9, low: 15.3, year: 10 },
//     { current: 15.9, average: 14.6, high: 17.1, lastYear: 14.2, low: 10.8, year: 15 },
//     { current: 14.7, average: 13.3, high: 16.1, lastYear: 12.9, low: 9.0, year: 20 },
//     { current: 13.5, average: 11.9, high: 15.1, lastYear: 11.5, low: 7.2, year: 25 },
//     { current: 13.6, average: 11.9, high: 15.6, lastYear: 11.5, low: 6.9, year: 30 },
// ]

// const lineData3 = [
//     { current: 43.2, average: 40.7, high: 47.4, lastYear: 41.5, low: 31.3, year: -45 },
//     { current: 43.2, average: 40.7, high: 47.4, lastYear: 41.5, low: 31.3, year: -40 },
//     { current: 43.2, average: 40.7, high: 47.4, lastYear: 41.5, low: 31.3, year: -35 },
//     { current: 42.6, average: 40.3, high: 47.3, lastYear: 40.7, low: 31.4, year: -30 },
//     { current: 40.6, average: 39.2, high: 46.3, lastYear: 38.8, low: 30.6, year: -25 },
//     { current: 39.5, average: 38.3, high: 45.5, lastYear: 37.7, low: 30.2, year: -20 },
//     { current: 38.9, average: 38.0, high: 45.1, lastYear: 36.9, low: 30.2, year: -15 },
//     { current: 35.2, average: 34.7, high: 42.0, lastYear: 32.8, low: 27.9, year: -10 },
//     { current: 33.1, average: 32.7, high: 39.9, lastYear: 30.1, low: 25.6, year: -5 },
//     { current: 25.7, average: 26.7, high: 34.9, lastYear: 22.8, low: 20.9, year: 0 },
//     { current: 22.4, average: 24.0, high: 32.9, lastYear: 20.1, low: 18.3, year: 5 },
//     { current: 20.2, average: 21.8, high: 30.8, lastYear: 18.3, low: 16.3, year: 10 },
//     { current: 17.4, average: 20.0, high: 29.8, lastYear: 16.0, low: 13.7, year: 15 },
//     { current: 15.2, average: 18.7, high: 29.3, lastYear: 14.1, low: 11.6, year: 20 },
//     { current: 12.2, average: 17.0, high: 28.0, lastYear: 11.4, low: 8.8, year: 25 },
//     { current: 11.9, average: 16.7, high: 27.6, lastYear: 11.3, low: 8.6, year: 30 },
// ]

// const lineData4 = [
//     { current: 22.0, average: 19.4, high: 22.5, lastYear: 19.3, low: 16.9, year: -45 },
//     { current: 22.0, average: 19.4, high: 22.5, lastYear: 19.3, low: 16.9, year: -40 },
//     { current: 22.0, average: 19.4, high: 22.5, lastYear: 19.3, low: 16.9, year: -35 },
//     { current: 21.3, average: 18.7, high: 21.8, lastYear: 18.5, low: 16.1, year: -30 },
//     { current: 20.8, average: 17.9, high: 21.2, lastYear: 17.8, low: 15.3, year: -25 },
//     { current: 20.2, average: 17.3, high: 20.6, lastYear: 17.2, low: 14.7, year: -20 },
//     { current: 20.0, average: 17.0, high: 20.3, lastYear: 16.8, low: 14.3, year: -15 },
//     { current: 18.5, average: 15.0, high: 18.8, lastYear: 15.2, low: 12.4, year: -10 },
//     { current: 16.6, average: 13.1, high: 16.9, lastYear: 13.3, low: 10.6, year: -5 },
//     { current: 13.5, average: 9.8, high: 13.6, lastYear: 10.2, low: 7.0, year: 0 },
//     { current: 13.3, average: 9.4, high: 13.3, lastYear: 9.9, low: 6.3, year: 5 },
//     { current: 12.9, average: 9.1, high: 12.9, lastYear: 9.8, low: 5.8, year: 10 },
//     { current: 13.7, average: 9.5, high: 13.7, lastYear: 10.4, low: 6.0, year: 15 },
//     { current: 14.4, average: 9.7, high: 14.4, lastYear: 10.8, low: 6.2, year: 20 },
//     { current: 15.3, average: 10.5, high: 15.3, lastYear: 11.4, low: 6.5, year: 25 },
//     { current: 15.4, average: 10.8, high: 15.4, lastYear: 11.5, low: 6.6, year: 30 },
// ]

//************************** D3    CHARTS ***************************************************//
//******************************************************************************************//

class TDFLEXSECTION {
    constructor(el, data, yMax, yMin, tickVals) {
        this.draws = 0;
        this.data = data;
        this.yMax = yMax;
        this.yMin = yMin;
        this.tickVals = tickVals;
        this.el = el;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // CHART
        vis.chartDiv = document.getElementById(vis.el);
        vis.chartDiv.innerHTML = '' // clear this out, because dang it iPad! WHY?!
        vis.svg = d3.select(vis.chartDiv).append("svg").attr('class', 'idontmakesense');

        // APPEND G
        vis.g = vis.svg
            .append('g')
            .attr('class', 'g3')

        vis.areaPath = vis.g.append('path')
            .attr('fill', 'rgba(224, 225, 227, 1)')
            .attr('stroke', 'none')

        vis.skyLine = vis.g.append('path')
            .attr('stroke', '#009CDC')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')

        // vis.blueLine = vis.g.append('path')
        //     .attr('stroke', 'rgba(0, 95, 155, 1)')
        //     .attr('stroke-width', 2.5)
        //     .attr('fill', 'none')

        vis.terqLine = vis.g.append('path')
            .attr('stroke', '#00AEA9')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')

        vis.redLine = vis.g.append('path')
            .attr('stroke', '#762157')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')

        vis.xLine = vis.g.append('line')
            .attr('stroke', '#6F6F6F60')
            .attr('stroke-width', 1)
            .attr('fill', 'none')

        // APPEND X AXIS 
        vis.xAxis = vis.g
            .append('g')
            .attr('class', 'axis x-axis p-14 demi')

        // APPEND Y AXIS 
        vis.yAxis = vis.g
            .append('g')
            .attr('class', 'axis y-axis p-14 demi')

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
        vis.width = vis.chartDiv.clientWidth;
        vis.height = vis.chartDiv.clientHeight;
        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        if (vis.height <= 0) setTimeout(() => {
            vis.redraw();
            console.warn('hit me with a redraw, FLEX CHART')
        }, 700);

        // Use the extracted size to set the size of an SVG element.
        vis.svg
            .attr("width", vis.width)
            .attr("height", vis.height);

        // SET G
        vis.g.attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        ///////////////////////////////////////////////////////            
        // X SCALE
        vis.x = d3
            .scaleLinear()
            .domain([-49, 32])
            .range([vis.MARGIN.left, vis.gWIDTH])

        ///////////////////////////////////////////////////////            
        // Y SCALE
        const y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([vis.yMin, vis.yMax]);

        const areaPath = d3.area()
            // .curve(d3.curveNatural)
            .x(d => vis.x(d.year))
            .y1(d => y(d.high))
            .y0(d => y(d.low))

        // const blueLineFunction = d3.line()
        //     .x(d => vis.x(d.year))
        //     .y(d => y(d.average));

        const skyLineFunction = d3.line()
            .x(d => vis.x(d.year))
            .y(d => y(d.average));

        const terqLineFunction = d3.line()
            .x(d => vis.x(d.year))
            .y(d => y(d.current));

        const redLineFunction = d3.line()
            .x(d => vis.x(d.year))
            .y(d => y(d.lastYear));

        const flatArea = d3.area()
            .curve(d3.curveStep)
            .x(d => vis.x(d.year))
            .y1(d => y(0))
            .y0(d => y(0))

        // GRAY AREA
        if (vis.draws <= 1) {
            vis.areaPath
                .attr('d', areaPath(vis.data))
                .attr('opacity', 1)
        } else {
            vis.areaPath
                .transition()
                .duration(500)
                .delay(0)
                .attr('d', areaPath(vis.data))
                .attr('opacity', 1)
        }
        ///////////////////////////////////////////////////////////////////////////////
        if (vis.draws <= 1) {
            vis.skyLine
                .attr('d', skyLineFunction(vis.data))
            // vis.blueLine
            //     .attr('d', blueLineFunction(vis.data))
            vis.terqLine
                .attr('d', terqLineFunction(vis.data))
            vis.redLine
                .attr('d', redLineFunction(vis.data))
        } else {
            vis.skyLine
                .transition()
                .duration(500)
                .delay(0)
                .attr('d', skyLineFunction(vis.data))
            // vis.blueLine
            //     .transition()
            //     .duration(500)
            //     .delay(0)
            //     .attr('d', blueLineFunction(vis.data))
            vis.terqLine
                .transition()
                .duration(500)
                .delay(0)
                .attr('d', terqLineFunction(vis.data))
            vis.redLine
                .transition()
                .duration(500)
                .delay(0)
                .attr('d', redLineFunction(vis.data))
        }

        //////////////////////////////// X AXIS
        const xTicks = [];
        for (let i = -45; i < 35; i = i + 5) {
            xTicks.push(i);
        }

        const xTranslate = [
            '45',
            '40',
            '35',
            '30',
            '25',
            '20',
            '15',
            '10',
            '5',
            'Retirement',
            '+5',
            '+10',
            '+15',
            '+20',
            '+25',
            '+30'
        ]

        const xAxisCall = d3.axisBottom()
            .tickPadding(5)
            .tickSize(0)
            .tickValues(xTicks)
            .tickFormat((e, i) => xTranslate[i])

        // POSITION SET ON FIRST DRAW ONLY
        const yPos = vis.tickVals[0] - 4.75;
        if (vis.draws <= 1) {
            vis.xAxis
                .call(xAxisCall.scale(vis.x))
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(0, ${y(yPos)})`)
                .transition()
                .duration(2500)
                .delay(100)
                .attr('transform', `translate(0, ${y(yPos)})`)
        } else {
            vis.xAxis
                .transition()
                .delay(0)
                .duration(500)
                .call(xAxisCall.scale(vis.x))
                .attr('transform', `translate(0, ${y(yPos)})`)
        }

        //////////////////////////////// Y AXIS
        const yAxisCall = d3.axisLeft()
            .tickValues(vis.tickVals)
            .tickPadding(0)
            .tickFormat(e => {
                if (e === vis.tickVals[vis.tickVals.length - 1]) {
                    return e + '%'
                } else {
                    return e
                }
            });

        const xPos = -48;
        if (vis.draws <= 1) {
            vis.yAxis
                .call(yAxisCall.scale(y))
                .attr('text-anchor', 'start')
                .attr('transform', `translate(${vis.x(xPos)},0)`)
                .transition()
                .duration(2500)
                .delay(100)
                .attr('transform', `translate(${vis.x(xPos)},0)`)
        } else {
            vis.yAxis
                .transition()
                .delay(0)
                .duration(500)
                .call(yAxisCall.scale(y))
                .attr('transform', `translate(${vis.x(xPos)},0)`)
        }

        vis.xLine
            .attr('x1', vis.x(-46))
            .attr('x2', vis.x(31))
            .attr('y1', y(vis.tickVals[0] - 4.5))
            .attr('y2', y(vis.tickVals[0] - 4.5))

    } // end redraw
} //end class


