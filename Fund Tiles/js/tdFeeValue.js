
// ................................
// CHART 1 (ASSET CLASS)
// ...............................
class VALUECHART {
    constructor() {
        this.draws = 0;
        // const magenta = '#EDC5DF';
        // const bblue = '#B8E2FF';
        // this.data = [
        //     { color: bblue, name: 'avg', min: 45, max: 181, avg: 111 },
        //     { color: bblue, name: 2060, min: 54, max: 303, avg: 144 },
        //     { color: bblue, name: 2055, min: 60, max: 261, avg: 138 },
        //     { color: bblue, name: 2050, min: 54, max: 181, avg: 130 },
        //     { color: bblue, name: 2045, min: 54, max: 184, avg: 131 },
        //     { color: bblue, name: 2040, min: 63, max: 195, avg: 138 },
        //     { color: bblue, name: 2035, min: 67, max: 198, avg: 137 },
        //     { color: bblue, name: 2030, min: 1, max: 186, avg: 113 },
        //     { color: bblue, name: 2025, min: -22, max: 152, avg: 79 },
        //     { color: bblue, name: 2020, min: -8, max: 127, avg: 32 },
        //     { color: bblue, name: 2015, min: -4, max: 110, avg: 29 },
        //     { color: bblue, name: 2010, min: -17, max: 111, avg: 21 },
        // ];
        // this.data1 = [
        //     { color: magenta, name: 'avg', min: 21, max: 29, avg: 25 },
        //     { color: magenta, name: 2060, min: 24, max: 32, avg: 29 },
        //     { color: magenta, name: 2055, min: 24, max: 31, avg: 28 },
        //     { color: magenta, name: 2050, min: 24, max: 31, avg: 28 },
        //     { color: magenta, name: 2045, min: 23, max: 31, avg: 28 },
        //     { color: magenta, name: 2040, min: 22, max: 30, avg: 27 },
        //     { color: magenta, name: 2035, min: 20, max: 29, avg: 26 },
        //     { color: magenta, name: 2030, min: 18, max: 27, avg: 24 },
        //     { color: magenta, name: 2025, min: 16, max: 25, avg: 22 },
        //     { color: magenta, name: 2020, min: 14, max: 23, avg: 20 },
        //     { color: magenta, name: 2015, min: 16, max: 22, avg: 20 },
        //     { color: magenta, name: 2010, min: 16, max: 22, avg: 20 },
        // ];

        this.data = dataTD.feeValue.blue;
        this.data1 = dataTD.feeValue.red;

        this.data = this.data.filter(d => d.name !== 2060)
        this.data1 = this.data1.filter(d => d.name !== 2060)

        this.initVis();
    }

    initVis() {
        const vis = this;

        console.warn(vis.data)

        // CHART
        vis.chartDiv = document.getElementById("td-value-chart");
        vis.chartDiv.innerHTML = '' // clear this out, because dang it iPad! WHY?! WHY?! SERIOUSLY?!

        vis.svg = d3.select(vis.chartDiv).append("svg");

        // APPEND G
        vis.g = vis.svg
            .append('g')
            .attr('class', 'main-g');

        // APPEND X AXIS 
        vis.xAxis = vis.g
            .append('g')
            .attr('class', 'axis x-axis p-18 demi');

        // APPEND X AXIS 
        vis.xAxis2 = vis.g
            .append('g')
            .attr('class', ' noticks');

        // APPEND Y AXIS 
        vis.yAxis = vis.svg
            .append('g')
            .attr('class', 'axis y-axis p-14 demi')
            .style('text-anchor', 'start');

        // APPEND Y AXIS 
        vis.yAxis2 = vis.svg
            .append('g')
            .attr('class', 'axis y-axis p-14 demi')
            .style('text-anchor', 'start');

        vis.dashedLine = vis.g
            .append('line').attr('class', 'dashed-line')

        vis.bigBlue = vis.g.append('rect').attr('class', 'bblue');
        vis.bigRed = vis.g.append('rect').attr('class', 'bred');

        vis.bars = vis.g.append('g').attr('class', 'bars');
        vis.dots = vis.g.append('g').attr('class', 'dots');
        vis.texts = vis.g.append('g').attr('class', 'texts');

        vis.titleText = d3.select(vis.chartDiv).append("div").html('Average of<br> all vintages').attr('class', 'demi p-18 sfd')

        vis.redText = d3.select(vis.chartDiv).append("div").html('10-year Additional<br>annual expense (bps)').attr('class', 'demi p-16').style('color', '#762157').style('opacity', '.8').style('line-height', 1.2)
        vis.blueText = d3.select(vis.chartDiv).append("div").html('10-year<br>Annualized<br> excess<br> returns (bps)').attr('class', 'demi p-16').style('color', '#019BDA').style('opacity', '.8').style('line-height', 1.2)

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
        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: width * .08 };
        vis.gWIDTH = width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = height - (vis.MARGIN.top + vis.MARGIN.bottom);

        if (height <= 0) setTimeout(() => {
            vis.redraw();
            console.warn('hit me with a redraw, FEE VAL CHART')
        }, 999);

        // Use the extracted size to set the size of an SVG element.
        vis.svg
            .attr("width", width)
            .attr("height", height);

        // SET G
        vis.g.attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        ///////////////////////////////////////////////////////
        // X SCALE
        const x = d3
            .scaleBand()
            .domain(vis.data.map(d => d.name))
            .range([0, vis.gWIDTH])
            .paddingInner(.6)
            .paddingOuter(.2);

        // Y SCALE
        const y = d3
            .scaleLinear()
            .range([vis.gHEIGHT, vis.gHEIGHT / 2])
            .domain([-190, 300]);

        const y2 = d3
            .scaleLinear()
            .range([0, vis.gHEIGHT / 2])
            .domain([0, 40]);

        ///////////////////////////////////////////////////////////////////////////////
        const barWidth = x.bandwidth();
        const bars = vis.bars
            .selectAll('.bars')
            .data(vis.data)

        bars.exit().remove();

        bars
            .transition()
            .style("fill", d => d.color)
            .duration(500)
            .attr('width', barWidth)
            .attr('x', d => x(d.name))
            .attr('y', d => y(d.max))
            .attr('height', d => y(d.min) - y(d.max))

        // ENTER
        let count = 0;
        bars
            .enter()
            .append('rect')
            .attr('class', 'bars')
            .style("fill", d => d.color)
            .attr('x', d => x(d.name))
            .attr('y', d => y(0))
            .attr('width', barWidth)
            .attr('height', d => y(d.min) - y(d.max))
            .transition()
            .duration(1100)
            .delay((d, i) => i * 18 + 100)
            .attr('height', d => y(d.min) - y(d.max))
            .attr('y', d => y(d.max))

        ///////////////////////////////////////////////////////////////////////////////
        const bars1 = vis.bars
            .selectAll('.bars1')
            .data(vis.data1)

        bars1.exit().remove();

        bars1
            .transition()
            .style("fill", d => d.color)
            .duration(500)
            .attr('width', barWidth)
            .attr('height', d => y2(d.max) - y2(d.min))
            .attr('x', d => x(d.name))
            .attr('y', d => y2(d.min))

        // ENTER
        bars1
            .enter()
            .append('rect')
            .attr('class', 'bars1')
            .style("fill", d => d.color)
            .attr('x', d => x(d.name))
            .attr('y', d => y2(d.min))
            .attr('width', barWidth)
            .attr('height', d => y2(d.max) - y2(d.min))

        ///////////////////////////////////////////////////////////////////////////////
        const dots = vis.dots
            .selectAll('.dot')
            .data(vis.data)

        dots.exit().remove();

        dots
            .transition()
            .duration(500)
            .attr('r', barWidth * .45)
            .attr('cx', d => x(d.name) + barWidth / 2)
            .attr('cy', d => y(d.avg))

        // ENTER
        dots
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .style("fill", d => '#019BDA')
            .attr('cx', d => x(d.name) + barWidth / 2)
            .attr('cy', d => y(d.avg))
            .attr('r', barWidth * .45)

        ///////////////////////////////////////////////////////////////////////////////
        const dots1 = vis.dots
            .selectAll('.dot1')
            .data(vis.data1)

        dots1.exit().remove();

        dots1
            .transition()
            .duration(500)
            .attr('r', barWidth * .45)
            .attr('cx', d => x(d.name) + barWidth / 2)
            .attr('cy', d => y2(d.avg))

        // ENTER
        dots1
            .enter()
            .append('circle')
            .attr('class', 'dot1')
            .style("fill", d => '#762157')
            .attr('cx', d => x(d.name) + barWidth / 2)
            .attr('cy', d => y2(d.avg))
            .attr('r', barWidth * .45)

        ///////////////////////////////////////////////////////////////////////////////
        const text = vis.texts
            .selectAll('.text')
            .data(vis.data1)

        text.exit().remove();

        text
            .transition()
            .duration(500)
            .attr('x', d => x(d.name) + barWidth / 2)
            .attr('y', d => y2(d.avg))
            .attr('dy', barWidth * .13)

        // ENTER
        text
            .enter()
            .append('text')
            .attr('class', 'text p-white demi p-22')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text(d => Math.round(Math.round(d.avg * 100) / 100))
            .attr('x', d => x(d.name) + barWidth / 2)
            .attr('y', d => y2(d.avg))
            .attr('dy', barWidth * .13)

        ///////////////////////////////////////////////////////////////////////////////
        const text0 = vis.texts
            .selectAll('.text0')
            .data(vis.data)

        text0.exit().remove();

        text0
            .transition()
            .duration(500)
            .attr('x', d => x(d.name) + barWidth / 2)
            .attr('y', d => y(d.avg))
            .attr('dy', barWidth * .13)

        // ENTER
        text0
            .enter()
            .append('text')
            .attr('class', 'text0 p-white demi p-22')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text(d => Math.round(d.avg))
            .attr('x', d => x(d.name) + barWidth / 2)
            .attr('y', d => y(d.avg))
            .attr('dy', barWidth * .13)

        //////////////////////////////// X AXIS
        const xAxisCall = d3.axisBottom()
            .tickPadding(5)
            .tickSize(0)
            .tickFormat(e => {
                return e
            })

        // POSITION SET ON FIRST DRAW ONLY
        const yPos = -80;

        if (vis.draws <= 1) {
            vis.xAxis
                .call(xAxisCall.scale(x))
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
                .call(xAxisCall.scale(x))
                .attr('transform', `translate(0, ${y(yPos)})`)
        }

        //////////////////////////////// X AXIS
        const xAxisCall2 = d3.axisBottom()
            .tickPadding(5)
            .tickSize(0)
            .tickFormat(e => {
                return e
            })

        // POSITION SET ON FIRST DRAW ONLY
        const yPos2 = 34;

        if (vis.draws <= 1) {
            vis.xAxis2
                .call(xAxisCall2.scale(x))
                .attr('transform', `translate(-${vis.MARGIN.left}, ${y2(yPos2)})`)
                .transition()
                .duration(2500)
                .delay(100)
                .attr('transform', `translate(-${vis.MARGIN.left}, ${y2(yPos2)})`)
        } else {
            vis.xAxis2
                .transition()
                .delay(0)
                .duration(500)
                .call(xAxisCall2.scale(x))
                .attr('transform', `translate(-${vis.MARGIN.left}, ${y2(yPos2)})`)
        }

        //////////////////////////////// Y AXIS
        const yAxisCall = d3.axisLeft()
            .tickSize(0)
            .tickPadding(-5)
            .tickValues([-25, 25, 75, 125, 175, 225, 275, 325])
            .tickFormat(e => {
                return e
            });

        if (vis.draws <= 1) {
            vis.yAxis
                .call(yAxisCall.scale(y))

        } else {
            vis.yAxis
                .transition()
                .delay(0)
                .duration(500)
                .call(yAxisCall.scale(y))
        }

        //////////////////////////////// Y AXIS
        const yAxisCall2 = d3.axisLeft()
            .tickSize(0)
            .tickValues([10, 15, 20, 25, 30])
            .tickPadding(2)
            .tickFormat(e => {
                return e
            });

        if (vis.draws <= 1) {
            vis.yAxis2
                .call(yAxisCall2.scale(y2))
                .attr('transform', `translate(${6},0)`)

        } else {
            vis.yAxis2
                .transition()
                .delay(0)
                .duration(500)
                .call(yAxisCall2.scale(y2))
                .attr('transform', `translate(${6},0)`)
        }

        vis.titleText
            .style('position', 'absolute')
            .style('white-space', 'nowrap')
            .style('left', x('avg') + vis.MARGIN.left + 'px')
            .style('top', y(-83) + 'px')
            .style('width', barWidth * 2 + 'px')
            .style('margin-left', -barWidth / 2 + 'px')

        vis.redText
            .style('position', 'absolute')
            .style('top', y2(1) + 'px')

        vis.blueText
            .style('position', 'absolute')
            .style('top', y(-60) + 'px')

        vis.dashedLine
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('x1', 0 - vis.MARGIN.left / 2)
            .attr('x2', vis.gWIDTH)

        vis.bigBlue
            .attr('y', y(325))
            .attr('x', x('avgg'))
            .attr('height', y(-50) - y(335))
            .attr('width', barWidth * 2)
            .attr('fill', '#019BDA10')

        vis.bigRed
            .attr('y', y2(10))
            .attr('x', x('avgg'))
            .attr('height', y2(30) - y2(7))
            .attr('width', barWidth * 2)
            .attr('fill', '#76215710')

    } // end redraw

} //end class



