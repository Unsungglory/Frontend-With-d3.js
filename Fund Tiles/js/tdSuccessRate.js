///// PIE BUILDER
class TDDonut {
    constructor(el, data, color, initalDelay = 0) {
        const vis = this;
        vis.el = el;
        vis.draws = 0;
        vis.delay = initalDelay;
        vis.color = 'rgba(0, 95, 158, 1)';
        vis.color2 = color;

        if (el === 'td-pie-0') {
            vis.data = data.successRate.passive.donut;
        } else if (el === 'td-pie-1') {
            vis.data = data.successRate.hybrid.donut;
        } else if (el === 'td-pie-2') {
            vis.data = data.successRate.active.donut;
        }

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
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND TEXT
        vis.text = vis.g.append('text').attr('class', 'td-pi-big');

        vis.redraw();
    }

    redraw(data = this.data) {
        const vis = this;
        vis.data = data;

        vis.draws++;

        if (data !== null) {
            vis.data = data;
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
            .padAngle(0.009)
            .startAngle(0 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(d => d)
            .sort((a, b) => {
                return null;
            });

        const outerWidth = .5; // for donut wedges
        const innerWidth = window.innerHeight < 777 ? .29 : .28; // for donut wedges

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        // const arcData = pieGenerator(vis.data.filter(d => d.value !== 0)); // dont include wedges that are zero
        const arcData = pieGenerator([vis.data, 100 - vis.data]);

        // const transition = window.navigator.userAgent.includes('Edge') ? 0 : 1000
        const transition = 1000;

        console.log(vis.data, arcData)

        // JOIN DONUT SLICES
        vis.donutVis = vis.slices.selectAll('path')
            .data(arcData);

        // EXIT
        vis.donutVis.exit()
            .style('opacity', 1)
            .transition()
            .duration(500)
            .attrTween('d', arcTweenClose)
            .style('opacity', 0)
            .remove();

        // UPDATE
        vis.donutVis
            .transition()
            .delay(0)
            .attr('d', d => arc(d))

        // ENTER
        vis.donutVis
            .enter()
            .append('path')
            .attr('id', (d, i) => `b-slice-${i}`)
            .style('opacity', 0)
            .attr('fill', (d, i) => i === 0 ? vis.color : vis.color2)
            .transition()
            .delay((d, i) => i * 200 + vis.delay + 300)
            .duration(transition)
            .style('opacity', 1)
            .attrTween('d', d => {
                let i = d3.interpolate(d.startAngle, d.endAngle);
                return t => {
                    d.endAngle = i(t);
                    return arc(d)
                }
            })
            .transition()
            .delay(810)
            .attrTween('d', arcTween) // THIS GETS READY FOR THE UPDATE TWEEN

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
            .text(vis.data + "%")
            .attr('x', 0)
            .attr('y', 15)
            .style('opacity', 0)
            .transition()
            .duration(888)
            .delay(300 + vis.delay)
            .style('opacity', 1)
    }
}

/////////////// BAR CHART
/////////////// BAR CHART
/////////////// BAR CHART
/////////////// BAR CHART
/////////////// BAR CHART
/////////////// BAR CHART
/////////////// BAR CHART

///// CHART 2
class TDBars {
    constructor(el, data, setMargin = false) {
        const vis = this;
        vis.el = el;
        vis.draws = 0;
        vis.setMargin = setMargin;

        if (el === 'td-bar-chart-0') {
            vis.data = data.successRate.passive.bars;
        } else if (el === 'td-bar-chart-1') {
            vis.data = data.successRate.hybrid.bars;
        } else if (el === 'td-bar-chart-2') {
            vis.data = data.successRate.active.bars;
        }

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        document.getElementById(`${vis.el}`).innerHTML = '';

        // MAIN SVG
        vis.chartDiv = document.getElementById(`${vis.el}`);
        vis.svg = d3.select(vis.chartDiv).append('svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND LINE FOR X AXIS
        vis.xLine = vis.g.append('line').attr('class', 'td-x-line')

        vis.text = vis.g.append('text').attr('class', 'td-bar-text')

        vis.redraw();
    }

    redraw() {
        const vis = this;
        vis.draws++;
        vis.colors = ['rgba(85, 71, 66, 1)', 'rgba(163, 158, 153, 1)', 'rgba(217, 217, 217, 1)']

        vis.MARGIN = { top: 5, right: 0, bottom: 20, left: 0 };

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

        // X SCALE
        const x = d3.scaleBand()
            .domain([0, 1, 2])
            .range([0, vis.gWIDTH])
            .paddingInner(.2)
            .paddingOuter(.42)

        //  Y SCALE 
        // let domMax = d3.max(vis.data);
        // let domMin = d3.min(vis.data);

        vis.y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([-300, 300])

        // DRAW LINE FOR XAXIS
        vis.xLine
            .attr('x1', 0)
            .attr('x2', vis.gWIDTH)
            .attr('y1', vis.y(0))
            .attr('y2', vis.y(0))
            .attr('stroke', 'rgba(217,217,217,1)')
            .attr('transform', `translate(0, ${0})`)

        //////////////////////// BARS /////////////////////////////
        // JOIN
        vis.bars = vis.g.selectAll('.td-bar')
            .data(vis.data)

        // EXIT
        vis.bars.exit().remove();

        // UPDATE
        vis.bars
            .transition()
            .duration(500)
            .attr("x", (d, i) => x(i))
            .attr('width', x.bandwidth())
            .attr("y", d => vis.y(Math.max(0, d)))
            .attr("height", d => Math.abs(vis.y(d) - vis.y(0)))

        // ENTER
        vis.bars
            .enter()
            .append('rect')
            .attr('class', 'td-bar')
            .style("fill", (d, i) => vis.colors[i])
            .attr("x", (d, i) => x(i))
            .attr('width', x.bandwidth())
            .attr("y", d => vis.y(0))
            .attr('height', 0)
            .transition()
            .duration(1000)
            .delay((d, i) => 200)
            .attr("x", (d, i) => x(i))
            .attr('width', x.bandwidth())
            .attr("y", d => vis.y(Math.max(0, d)))
            .attr("height", d => Math.abs(vis.y(d) - vis.y(0)));

        //////////////////////// NUMBERS /////////////////////////////
        // JOIN
        const moveUp = window.innerWidth < 1200 ? -5 : -15;
        const moveDown = window.innerWidth < 1200 ? 15 : 25;
        vis.nums = vis.g.selectAll('.td-num-text')
            .data(vis.data)

        // EXIT
        vis.nums.exit().remove();
        // UPDATE
        vis.nums
            .transition()
            .duration(500)
            .text(d => d)
            .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
            .attr("y", d => vis.y(d))

        // ENTER
        vis.nums
            .enter()
            .append('text')
            .attr('class', 'td-num-text')
            .text(d => d)
            .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
            .attr("y", vis.y(0))
            .attr('dy', d => d < 0 ? moveDown : moveUp)
            .transition()
            .duration(1000)
            .delay((d, i) => 200)
            .attr("y", d => vis.y(d))

        if (vis.setMargin)
            vis.makeMargin();
    }

    makeMargin() {
        document.getElementById('td-margin').innerHTML = '';
        const vis = this;

        var svg = d3.select("#td-margin")
            .append("svg")
            .attr("width", 200)
            .attr("height", vis.height)

        // SET G
        const g = svg.append('g')
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // APPEND Y AXIS
        const yAxis = g.append('g').style('text-anchor', 'end')

        const tickValues = [];
        for (let i = -300; i <= 300; i = i + 100) {
            tickValues.push(i);
        }

        // Y AXIS
        const yAxisCall = d3
            .axisLeft()
            .tickValues(tickValues)
            .tickPadding(0)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat((el, i) => el)

        const xTrans = seismicApp ? 20 : smallLaptop ? 20 : iPad ? 20 : 20;
        yAxis
            .attr('transform', `translate(${xTrans}, 0)`)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${xTrans}, 0)`)
            .call(yAxisCall.scale(vis.y));
    }
}
