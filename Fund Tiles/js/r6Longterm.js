const r6LongtermTestData = [
    { name: 'a', value: 3340340 },
    { name: 'b', value: 1234030 },
    { name: 'c', value: 883330 },
]

// ******************************* ******************************* //
// MAKES BAR CHART FOR SECTION TWO OF R6 //
// ******************************* ******************************* //

class R6LongtermSection {
    constructor(data) {

        const vis = this;
        vis.draws = 0;
        vis.data = data.longTermSuccess;
        vis.id = data.id;
        vis.objective = data.objective;

        this.initVis();
    }

    initVis() {
        const vis = this;

        // set header date
        document.getElementById('long-term-success-header-date').innerText = longTermSuccessDate;

        // MAIN SVG
        vis.chartDiv = document.getElementById(`r6-longterm-chart`);
        vis.chartDiv.innerHTML = ''; // removes previous data vis
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `r6-longterm-svg`);

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis');

        // // APPEND LINE FOR X AXIS
        // vis.xLine = vis.g.append('line')

        // APPEND Y AXIS
        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis')
            .style('text-anchor', 'start');

        vis.lab1 = d3.select(vis.chartDiv).append('div').attr('class', `r6-lt-bot-lab`);
        vis.lab2 = d3.select(vis.chartDiv).append('div').attr('class', `r6-lt-bot-lab`);
        vis.lab3 = d3.select(vis.chartDiv).append('div').attr('class', `r6-lt-bot-lab`);
        vis.lab4 = d3.select(vis.chartDiv).append('div').attr('class', `r6-lt-bot-lab`);

        vis.labels = [vis.lab1, vis.lab2, vis.lab3, vis.lab4];

        this.redraw();
    }

    redraw() {
        const vis = this;
        vis.draws++;

        vis.setfootnote();

        const colorsGrowth = ['rgba(1, 45, 114, 1)', 'rgba(73, 65, 59, 1)', 'rgba(127, 127, 127, 1)', 'rgba(213, 208, 202, 1)'];
        const colorsIncome = ['rgba(0, 87, 184, 1)', 'rgba(73, 65, 59, 1)', 'rgba(127, 127, 127, 1)', 'rgba(213, 208, 202, 1)'];
        const colorsEquity = ['rgba(0, 142, 170, 1)', 'rgba(73, 65, 59, 1)', 'rgba(112, 105, 100, 1)'];
        const colorsBal = ['rgb(45, 204, 211)', 'rgba(73, 65, 59, 1)', 'rgba(112, 105, 100, 1)'];

        if (vis.objective === 'Growth') {
            vis.colors = colorsGrowth;
        } else if (vis.objective === 'Growth and income') {
            vis.colors = colorsIncome;
        } else if (vis.objective === 'Balanced') {
            vis.colors = colorsBal;
        } else if (vis.objective === 'Equity income') {
            vis.colors = colorsEquity;
        } else {
            vis.colors = colorsGrowth
        }

        // SET WIDTH FOR CHART SECTIONS
        vis.MARGIN = { top: 30, right: -40, bottom: 55, left: 50 };

        // CHART SVG WITDH //////////////////////////////////
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
        const x = d3.scaleBand()
            .domain(vis.data.map(d => d.name))
            .range([0, vis.gWIDTH])
            .paddingInner(.05)
            .paddingOuter(.12)

        // DOMAIN IT UP, BOYS
        const allValues = vis.data.map(d => d.value);
        const maxVal = d3.max(allValues, d => d);

        const oneMillion = 1000000;
        const oneHundredThou = 100000;
        const tenK = 10000;

        let domMax = 0;
        //  Y SCALE 
        if (maxVal > oneMillion * 100) {
            // GREATER THAN 100 MILLY
            domMax = Math.ceil(d3.max(allValues) / oneMillion / 100) * oneMillion * 100;
        }
        else if (maxVal > oneMillion * 10) {
            // GREATER THAN 10 MILLY
            domMax = Math.ceil(d3.max(allValues) / oneMillion / 10) * oneMillion * 10;

            // for 25 million for example
            if (domMax - maxVal > oneMillion * 5) {
                domMax = domMax - oneMillion * 5
            }
        } else if (maxVal < oneMillion && maxVal > oneHundredThou) {
            // 100,000 to 1,000,000
            domMax = Math.ceil(d3.max(allValues) / oneMillion * 10) * oneMillion / 10;
        } else if (maxVal > oneMillion) {
            // between 1 and 10 milly
            domMax = Math.ceil(d3.max(allValues) / oneMillion) * oneMillion;

            // for 1.5 million for example
            if (domMax - maxVal > 500000) {
                domMax = domMax - 500000
            }
        } else {
            // less than or equal to 100,000
            domMax = oneHundredThou - (Math.floor((oneHundredThou - maxVal) / tenK) * tenK);
        }

        let y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([0, domMax])
            .nice();

        const tickValues = [];
        let outputLabel = ' (Millions)';
        let divisor = oneMillion;

        if (maxVal >= oneMillion * 100) {
            for (let i = 0; i <= domMax / oneMillion / 100; i = i + .5) {
                console.log(i, domMax / oneMillion / 100)
                tickValues.push(i * oneMillion * 100);
            }
        } else if (maxVal > oneMillion * 10) {
            for (let i = 0; i <= domMax / oneMillion / 10; i = i + .5) {
                tickValues.push(i * oneMillion * 10);
            }
        } else if (maxVal > oneMillion) {
            // greater than 1 million, but less than 10 million
            for (let i = 0; i <= domMax / oneMillion; i = i + .5) {
                tickValues.push(i * oneMillion);
            }
        } else if (maxVal < oneMillion && maxVal > oneHundredThou) {
            // less than million and more than 100K
            for (let i = 0; i <= domMax / oneHundredThou; i++) {
                tickValues.push(i * oneHundredThou);
            }
            outputLabel = ' (Thousands)';
            divisor = 1000;
        } else {
            // less than or equal to 100,000
            for (let i = 0; i <= domMax / tenK; i = i + .5) {
                tickValues.push(i * tenK);
            }
            outputLabel = ' (Thousands)';
            divisor = 1000;
        }

        // Y AXIS
        const yAxisCall = d3
            .axisLeft()
            .tickValues(tickValues)
            .tickPadding(0)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat((el, i) => i === tickValues.length - 1 ? '$' + el / divisor + outputLabel : el / divisor)

        const xTrans = -vis.MARGIN.left;
        vis.yAxis
            .attr('transform', `translate(${xTrans}, 0)`)
            .transition()
            .duration(500)
            .call(yAxisCall.scale(y));

        // X AXIS
        // const xAxisCall = d3
        //     .axisBottom()
        //     .tickPadding(25)
        //     .tickSizeInner(0)
        //     .tickSizeOuter(0)

        // const yTrans = 0;
        // vis.xAxis
        //     .attr('transform', `translate(0, ${y(0)})`)
        //     .transition()
        //     .duration(500)
        //     .call(xAxisCall.scale(x));

        let sup = vis.id === 'NPF' ? '<sup>1</sup>' : '';
        const yTranslate = 20;

        vis.data.forEach((d, i) => {
            const el = vis.labels[i];

            el.style('left', x(d.name) + vis.MARGIN.left + x.paddingOuter() + x.bandwidth() / 2 + 'px');
            el.style('top', vis.MARGIN.top + y(0) + yTranslate + 'px')
            el.style('width', x.bandwidth() + 'px')
            el.style('margin-left', -x.bandwidth() / 2 + 'px');

            if (i === 3) {
                if (vis.id === 'WMIF') {
                    el.html(`U.S. Fund Large Value`)
                } else {
                    el.html(`${d.name}${sup}`)
                }
            } else {
                el.html(`${d.name}`)
            }
        })

        // DRAW LINE FOR XAXIS
        // vis.xLine
        //     .attr('x1', 60)
        //     .attr('x2', vis.gWIDTH - 20)
        //     .attr('y1', y(0))
        //     .attr('y2', y(0))
        //     .attr('stroke', 'rgba(211, 211, 211, 1)')
        //     .attr('transform', `translate(0, ${0})`)


        console.warn(vis.data)
        //////////////////////// BARS /////////////////////////////
        // JOIN
        vis.rects = vis.g.selectAll('.bars-data')
            .data(vis.data)

        // EXIT
        vis.rects.exit().remove();
        // UPDATE
        vis.rects
            .transition()
            .duration(500)
            .attr("x", d => x(d.name))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d.value)))
            .attr("height", d => Math.abs(y(d.value) - y(0)));
        // ENTER
        vis.rects
            .enter()
            .append('rect')
            .attr('class', 'bars-data')
            .style("fill", (d, i) => vis.colors[i])
            .attr("x", d => x(d.name))
            .attr('width', x.bandwidth())
            .attr("y", d => y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", d => x(d.name))
            .attr('width', x.bandwidth())
            .attr("y", d => y(Math.max(0, d.value)))
            .attr("height", d => Math.abs(y(d.value) - y(0)));

        //////////////////////// BARS /////////////////////////////
        // JOIN
        vis.numVals = vis.g.selectAll('.num-vals')
            .data(vis.data)

        // EXIT
        vis.numVals.exit().remove();
        // UPDATE
        vis.numVals
            .transition()
            .duration(500)
            .attr("x", d => x(d.name) + x.bandwidth() / 2)
            .attr("y", d => y(d.value))
            .attr("dy", 30)
        // ENTER
        vis.numVals
            .enter()
            .append('text')
            .text(d => dollar(d.value))
            .style("fill", (d, i) => i === 3 ? 'black' : 'white')
            .attr('class', 'num-vals')
            .attr("x", d => x(d.name) + x.bandwidth() / 2)
            .attr("y", d => y(0))
            .attr("dy", 0)
            .attr('height', 0)
            .transition()
            .duration(1000)
            // .delay((d, i) => globalCounter * 200)
            .attr("x", d => x(d.name) + x.bandwidth() / 2)
            .attr("y", d => y(d.value))
            .attr("dy", 30)
    }

    setfootnote() {
        const sup = document.getElementById('lt-sup');
        const vis = this;
        if (vis.id === 'NPF' || vis.id === 'AMBAL' || vis.id === 'GBAL')
            sup.innerText = 3;
        else sup.innerText = 2;
    }
}