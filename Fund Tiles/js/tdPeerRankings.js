function toggleSliderPR(num) {
    const slider = document.getElementById('pill-toggle-pr');
    const text0 = document.getElementById('ft-toggle-pr-0');
    const text1 = document.getElementById('ft-toggle-pr-1');
    const section1 = document.getElementById('pr-section-one');
    const section2 = document.getElementById('pr-section-two');
    const sub1 = document.getElementById('pr-sub-1');
    const sub2 = document.getElementById('pr-sub-2');
    const container = document.getElementById('fp-target-date-6');

    const h = window.innerWidth < 1200 ? '560px' : window.innerHeight < 779 ? '795px' : window.innerWidth < 1400 ? '995px' : '1075px';
    const hAlt = window.innerWidth < 1200 ? '475px' : window.innerHeight < 770 ? '575px' : '775px';

    switch (num) {
        case 0:
            slider.style.left = 0;

            text0.style.color = 'rgba(0, 41, 75, 1)';
            text1.style.color = 'rgba(127, 127, 127, 1)';
            section1.style.opacity = 1;
            section2.style.opacity = 0;
            sub1.style.opacity = 1;
            sub1.style.pointerEvents = 'all';
            sub2.style.opacity = 0;
            sub2.style.pointerEvents = 'none';
            container.style.height = h;

            break;
        case 1:
            slider.style.left = '50%';

            text0.style.color = 'rgba(127, 127, 127, 1)';
            text1.style.color = 'rgba(0, 41, 75, 1)';
            section1.style.opacity = 0;
            section2.style.opacity = 1;
            sub1.style.opacity = 0;
            sub1.style.pointerEvents = 'none';
            sub2.style.opacity = 1;
            sub2.style.pointerEvents = 'all';
            container.style.height = hAlt;

            drawPeerRankingsVsMorningstar();
            break;

        default:
            break;
    }
}

function drawPeerRankingsVsMorningstar() {
    const DARKBLUE = 'rgba(0, 95, 158, 1)'
    const GREY = '#D5D0CA';
    const NAVY = '#00254A';
    const LIGHTBLUE = '#009CDC';
    const MAROON = '#762157';
    const DARKGREY = '#A49E99';
    const TEAL = '#00AEA9';
    const LIGHTEST = 'rgb(204,223,236)'

    const BG_GRADIENT = 'url(#bg-grad)';

    const colors = [DARKBLUE, GREY, NAVY, LIGHTBLUE, MAROON, DARKGREY, TEAL, LIGHTEST];

    let globalCounter = 1;
    const bottom = 60;
    const top = 10;
    class drawBars {
        constructor(element, data, extent, minVal, label) {
            this.data = data
            this.element = element
            this.draws = 0;
            this.extent = extent;
            this.label = label;
            this.minVal = minVal;
            this.initVis();
            globalCounter += 1;
        }
        initVis() {
            const vis = this;

            // CHART
            vis.chartDiv = document.getElementById(vis.element);

            // DESTROY PREVIOUS
            vis.chartDiv.innerText = '';

            vis.svg = d3.select(vis.chartDiv).append("svg");

            // APPEND G
            vis.g = vis.svg
                .append('g')
                .attr('class', 'g-bar-chart')

            // APPEND BACKGROUND
            vis.bg = vis.g.append('rect')
                .attr('class', 'bg-color')

            // ADD LINES
            vis.lines = vis.g.append('g').attr('class', 'pr-lines')
            vis.minLine = vis.g.append('line').attr('class', 'pr-min-line');

            // ADD BARS
            vis.bars = vis.g
                .append('g')

            // ADD LABEL
            vis.title = vis.g.append('text').attr('class', 'pr-bars-labels').text(vis.label)

            // DEFINE LINEAR GRADIENT & APPEND (for the background)
            vis.gradient5 = vis.svg
                .append('linearGradient')
                .attr('id', 'bg-grad')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', 1)
                .attr('gradientUnits', 'objectBoundingBox');
            vis.gradient5
                .append('stop')
                .attr('offset', '0')
                .attr('stop-color', 'white');
            vis.gradient5
                .append('stop')
                .attr('offset', '.8')
                .attr('stop-color', 'rgb(238,238,238)');

            this.redraw();
        }

        redraw() {
            const vis = this;

            vis.draws += 1;

            // Extract the width and height that was computed by CSS.
            // const width = vis.chartDiv.clientWidth;
            const width = (document.getElementById('pr-chart-container').clientWidth - document.getElementById('uf-y-axis').clientWidth) / 11;
            const height = vis.chartDiv.clientHeight;
            const MARGIN = { top: top, right: 0, bottom: bottom, left: 0 };
            const gWIDTH = width - (MARGIN.left + MARGIN.right);
            const gHEIGHT = height - (MARGIN.top + MARGIN.bottom);

            // Use the extracted size to set the size of an SVG element.
            vis.svg
                .attr("width", width)
                .attr("height", height)

            // SET G
            vis.g.attr('width', gWIDTH)
                .attr('height', gHEIGHT)
                .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

            // X SCALE
            const x = d3
                .scaleBand()
                .domain(vis.data.map(d => d.name))
                .range([0, gWIDTH])
                .paddingInner(.1)
                .paddingOuter(1.7)

            // Y SCALE
            const y = d3
                .scaleLinear()
                .range([gHEIGHT, 0])
                .domain(vis.extent)
                .nice();

            //////////////////////// BARS /////////////////////////////
            // JOIN
            vis.rects = vis.bars.selectAll('.bars-data').data(vis.data);
            // EXIT
            vis.rects.exit().remove();
            // UPDATE
            vis.rects
                .transition()
                .duration(1200)
                .attr('width', x.bandwidth())
                .attr('x', d => x(d.name))
                .attr('y', d => y(Math.max(0, d.value)))
                .attr('height', d => Math.abs(y(d.value) - y(0)));
            // ENTER
            vis.rects
                .enter()
                .append('rect')
                .attr('class', 'bars-data')
                .attr('fill', (d, i) => colors[i])
                .attr('height', 0)
                .attr('x', d => x(d.name))
                .attr('width', x.bandwidth())
                .attr("y", d => y(0))
                .transition()
                .duration(1000)
                .delay((d, i) => globalCounter * 100)
                .attr('width', x.bandwidth())
                .attr('x', d => x(d.name))
                .attr('y', d => y(Math.max(0, d.value)))
                .attr('height', d => Math.abs(y(d.value) - y(0)));

            //////////////////////// LABEL /////////////////////////////
            if (vis.draws === 1) {
                // ENTER
                vis.title
                    .attr('x', gWIDTH / 2)
                    .attr("y", gHEIGHT + MARGIN.top)
                    .attr('dy', window.innerWidth < 1200 ? 20 : 20)
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .delay((d, i) => globalCounter * 100)
                    .style('opacity', 1)
            } else {
                vis.title
                    .attr('x', gWIDTH / 2)
                    .attr("y", gHEIGHT + MARGIN.top)
                    .attr('dy', window.innerWidth < 1200 ? 20 : 20)
                    .style('opacity', 1)
            }

            // ALL THE LINES ////////////////////////////////
            const tickValues = [];
            for (let i = vis.extent[0]; i <= vis.extent[1]; i = i + .5) {
                tickValues.push(i);
            }

            // DESTROY OLD
            vis.lines.nodes()[0].innerHTML = '';

            tickValues.forEach((val, j) => {
                const line = vis.lines.append('line');
                line
                    .attr('class', 'pr-horz-line')
                    .attr('x1', 0)
                    .attr('y1', y(val))
                    .attr('x2', gWIDTH)
                    .attr('y2', y(val))
                    .attr('opacity', vis.draws === 1 ? 0 : 1)
                    .transition()
                    .duration(1000)
                    .delay((d, i) => j * 100)
                    .attr('opacity', 1)
            })

            ///////
            vis.minLine
                .attr('x1', 0)
                .attr('x2', gWIDTH)
                .attr('y1', y(vis.minVal))
                .attr('y2', y(vis.minVal))
                .attr('opacity', vis.draws === 1 ? 0 : 1)
                .transition()
                .duration(1800)
                .attr('opacity', 1)


            /////////////////////////////////////////////////
            // BACKGROUND BOX fade up
            if (vis.draws <= 1) {
                vis.bg
                    .attr('width', x.bandwidth() * 7 + (x.paddingInner() * gWIDTH))
                    .attr('height', gHEIGHT)
                    .attr('x', gWIDTH - (x.paddingOuter() * gWIDTH / 2) - x.paddingOuter())
                    .attr('fill', BG_GRADIENT)
                    .attr('opacity', 0)
                    .transition()
                    .duration(1111)
                    .attr('opacity', 1)
            } else {
                vis.bg
                    .attr('width', x.bandwidth() * 7 + (x.paddingInner() * gWIDTH))
                    .attr('height', gHEIGHT)
                    .attr('x', gWIDTH - (x.paddingOuter() * gWIDTH / 2) - x.paddingOuter())
                    .transition()
                    .duration(1100)
                    .delay(100)
                    .attr('opacity', 1)
            }

        }
    }

    class drawMargin {
        constructor(element, data, extent) {
            this.data = data
            this.element = element
            this.draws = 0;
            this.extent = extent;
            this.initVis();
        }
        initVis() {
            const vis = this;

            // CHART
            vis.chartDiv = document.getElementById(vis.element);

            // DESTROY PREVIOUS
            vis.chartDiv.innerText = '';

            vis.svg = d3.select(vis.chartDiv).append("svg");

            // APPEND G
            vis.g = vis.svg
                .append('g')
                .attr('class', 'g-margin')

            // APPEND Y AXIS 
            vis.yAxis = vis.g
                .append('g')
                .attr('class', 'axis y-axis')
                .style('text-anchor', 'end')

            this.redraw();
        }

        redraw() {
            const vis = this;

            vis.draws += 1;

            const iPad = window.innerWidth < 1400 && window.innerHeight > 1000;

            // Extract the width and height that was computed by CSS.
            // const pchartWidth = document.querySelector('.p-chart').clientWidth;

            const width = vis.chartDiv.clientWidth;
            const height = vis.chartDiv.clientHeight;
            const MARGIN = { top: top, right: 0, bottom: bottom, left: 0 };
            const gWIDTH = width - (MARGIN.left + MARGIN.right);
            const gHEIGHT = height - (MARGIN.top + MARGIN.bottom);

            // Use the extracted size to set the size of an SVG element.
            vis.svg
                .attr("width", width)
                .attr("height", height)

            // SET G
            vis.g.attr('width', gWIDTH)
                .attr('height', gHEIGHT)
                .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

            // Y SCALE
            let y = d3
                .scaleLinear()
                .range([gHEIGHT, 0])
                .domain(vis.extent)
                .nice();

            // Y AXIS ///////////////////////////////////////////////////
            const pSize = window.innerWidth < 1200 ? 6 : window.innerHeight < 770 ? 8 : iPad ? 7 : 15;
            const pPad = window.innerWidth < 1200 ? 4 : window.innerHeight < 770 ? 5 : iPad ? 4 : 10;

            const tickValues = [];
            for (let i = vis.extent[0]; i <= vis.extent[1]; i = i + .5) {
                tickValues.push(i);
            }

            const yAxisCall = d3
                .axisLeft()
                .tickValues(tickValues)
                .tickPadding(pPad)
                .tickSize(pSize)
                .tickSizeOuter([0])
                .tickFormat((el, i) => i === tickValues.length - 1 ? el.toFixed(1) + "%" : enDash(el.toFixed(1)))

            const xTrans = window.innerWidth < 1100 ? 30 : window.innerHeight < 770 ? 46 : iPad ? 43 : 55;
            if (vis.draw <= 1) {
                vis.yAxis
                    .attr('transform', `translate(0, 0)`)
                    .transition()
                    .duration(2000)
                    .attr('transform', `translate(${xTrans}, 0)`)
                    .call(yAxisCall.scale(y));
            } else {
                vis.yAxis
                    .transition()
                    .delay(0)
                    .duration(1500)
                    .attr('transform', `translate(${xTrans}, 0)`)
                    .call(yAxisCall.scale(y));
            }
        }
    }

    //*************************************************************************************************//
    //*************************************************************************************************//

    // GET DOMAIN OF ALL VALUES
    const years = [];
    for (let i = 2010; i < 2061; i = i + 5) {
        years.push(i);
    }

    const allVals = [];
    dataTD.peerRankings.vMstar.forEach((el, i) => {
        if (years.includes(i)) {
            el.forEach(val => val.value !== null ? allVals.push(val.value) : null)
        }
    })

    const min = d3.extent(allVals)[0];
    const minVal = min;
    const max = d3.extent(allVals)[1];
    const extent = []

    // THIS SETS DOMAIN AT 1.5 OR 2.0 (IT'S EITHER A WHOLE NMBER OR HALF WAY BETWEEN)
    if (-Math.floor(min) - -min > .5) {
        extent[0] = (Math.round(min * 10) / 10);
    } else {
        extent[0] = Math.floor(min);
    }

    if (Math.ceil(max) - max > .5) {
        extent[1] = (Math.round(max * 10) / 10);
    } else {
        extent[1] = Math.ceil(max);
    }

    const margin = new drawMargin('uf-y-axis', dataTD.peerRankings.vMstar[2060], extent);
    const chart = new drawBars('uf-chart', dataTD.peerRankings.vMstar[2060], extent, minVal, 2060);
    const chart1 = new drawBars('uf-chart1', dataTD.peerRankings.vMstar[2055], extent, minVal, 2055);
    const chart2 = new drawBars('uf-chart2', dataTD.peerRankings.vMstar[2050], extent, minVal, 2050);
    const chart3 = new drawBars('uf-chart3', dataTD.peerRankings.vMstar[2045], extent, minVal, 2045);
    const chart4 = new drawBars('uf-chart4', dataTD.peerRankings.vMstar[2040], extent, minVal, 2040);
    const chart5 = new drawBars('uf-chart5', dataTD.peerRankings.vMstar[2035], extent, minVal, 2035);
    const chart6 = new drawBars('uf-chart6', dataTD.peerRankings.vMstar[2030], extent, minVal, 2030);
    const chart7 = new drawBars('uf-chart7', dataTD.peerRankings.vMstar[2025], extent, minVal, 2025);
    const chart8 = new drawBars('uf-chart8', dataTD.peerRankings.vMstar[2020], extent, minVal, 2020);
    const chart9 = new drawBars('uf-chart9', dataTD.peerRankings.vMstar[2015], extent, minVal, 2015);
    const chart10 = new drawBars('uf-chart10', dataTD.peerRankings.vMstar[2010], extent, minVal, 2010);

    // Redraw based on the new size whenever the browser window is resized.
    window.addEventListener("resize", () => redraw());

    function redraw() {
        chart.redraw();
        chart1.redraw();
        chart2.redraw();
        chart3.redraw();
        chart4.redraw();
        chart5.redraw();
        chart6.redraw();
        chart7.redraw();
        chart8.redraw();
        chart9.redraw();
        chart10.redraw();
        margin.redraw();
    }
}


