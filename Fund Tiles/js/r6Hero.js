///// PIE BUILDER
class R6Donut {
    constructor(el, data, flag, initalDelay = 0) {
        const vis = this;
        vis.el = el;
        vis.flag = flag;

        if (data.objective === 'Balanced') {
            vis.data = data.heroData
        } else {
            console.log(data)
            vis.data = flag === 'index' ? data.heroData.donuts.index : flag === 'peer' ? data.heroData.donuts.peer : data.heroData.donuts.peer2;
        }

        vis.draws = 0;
        vis.color = boxColors[data.objective]
        vis.delay = initalDelay;
        vis.objective = data.objective;
        vis.id = data.id;
        vis.inceptionDate = data.inception;

        this.init();
    }

    init() {
        const vis = this;

        // REMOVE PREVIOUS ELEMENTS (IF NEEDED)
        document.querySelector(`#${vis.el}`).innerHTML = '';

        // MAIN SVG
        vis.chartDiv = document.getElementById(vis.el);

        vis.svg = d3.select(vis.chartDiv).append('svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND TEXT
        vis.text = vis.g.append('text').attr('class', 'r6-pi-big');
        vis.text2 = vis.g.append('text').attr('class', 'r6-pi-text');

        // APPEND A DIV O
        vis.topLine = d3.select(vis.chartDiv).append('div').attr('class', 'r6-pi-text bold');

        // GRAY LINE
        vis.grayLine = vis.g.append('line').style('stroke-width', '1px').style('stroke', 'rgb(127,127,127)')

        vis.setText();
        vis.redraw();
    }

    redraw(data = this.data) {
        const vis = this;
        vis.data = data;

        vis.draws++;

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
            .padAngle(0)
            .startAngle(0 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                return null;
            });

        const outerWidth = .5; // for donut wedges
        const innerWidth = window.innerHeight < 777 ? .34 : .31; // for donut wedges

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        // const arcData = pieGenerator(vis.data.filter(d => d.value !== 0)); // dont include wedges that are zero

        let sliceData = '';
        if (vis.objective === 'Balanced') {
            if (vis.flag === 'index') {
                sliceData = vis.data.captureRatio.downside;
            } else {
                sliceData = vis.data.captureRatio.upside;
            }
        } else {
            console.log('vis.data:', vis.data) // this is heroData.donuts.index or .peer or .peer2
            console.warn('success rate:', vis.data.successRate)
            sliceData = vis.data.successRate
        }
        const arcData = pieGenerator([{ name: 1, value: sliceData }, { name: 2, value: 100 - sliceData }]);

        // const transition = window.navigator.userAgent.includes('Edge') ? 0 : 1000
        const transition = 1000;

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
            .attr('fill', (d, i) => i === 0 ? vis.color : 'rgb(127,127,127)')
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
        let bigNumber = '';
        let yTrans = 0;

        if (vis.objective === 'Balanced') {
            if (vis.flag === 'index') {
                bigNumber = vis.data.captureRatio.downside;
            } else {
                bigNumber = vis.data.captureRatio.upside;
            }
            yTrans = window.innerHeight < 800 ? 15 : window.innerWidth < 1400 ? 20 : 15;
        } else {
            bigNumber = vis.data.successRate;
        }

        vis.text
            .text(bigNumber + "%")
            .attr('x', 0)
            .attr('y', 4)
            .attr('dy', yTrans)
            .style('opacity', vis.draws > 1 ? 1 : 0)
            .transition()
            .duration(888)
            .delay(300 + vis.delay)
            .style('opacity', 1)

        /// TEXT
        let smallestText = '';
        let yTrans2 = 0;

        if (vis.objective === 'Balanced') {
            if (vis.flag === 'index') {
                smallestText = 'Downside';
            } else {
                smallestText = 'Upside';
            }
            yTrans2 = window.innerWidth < 1200 ? -49 : window.innerHeight < 800 ? -52 : window.innerWidth < 1400 ? -60 : -67;
        } else {
            smallestText = `${vis.data.periodsOutpaced} out of ${vis.data.totalPeriods}`
        }

        vis.text2
            .text(smallestText)
            .attr('x', 0)
            .attr('y', 42)
            .attr('dy', yTrans2)
            .style('opacity', vis.draws > 1 ? 1 : 0)
            .transition()
            .duration(888)
            .delay(300 + vis.delay)
            .style('opacity', 1)

        /// TEXT
        const lineOneText = vis.objective === 'Balanced' ? 'Capture Ratio'
            : vis.objective === 'Growth and income' & vis.flag === 'index' ? 'Fund outpaced index'
                : vis.id === 'WMIF' & vis.flag === 'peer' ? 'Fund outpaced Large</br>Blend peers'
                    : vis.id === 'WMIF' & vis.flag === 'peer2' ? 'Fund outpaced</br>Large Value peers'
                        : vis.flag === 'peer' ? 'Fund outpaced peer'
                            : 'Fund outpaced index';

        const topOffset = vis.objective === 'Growth and income' ? -15 : 0;
        vis.topLine
            .html(lineOneText)
            .style('opacity', vis.draws > 1 ? 1 : 0)
            .style('left', vis.gWIDTH / 2 + 'px')
            .style('top', vis.gHEIGHT * .35 + topOffset + 'px')
            .transition()
            .duration(888)
            .delay(300 + vis.delay)
            .style('opacity', 1)

        vis.topLine
            .style('margin-left', -vis.topLine._groups[0][0].clientWidth / 2 + 'px')

        const lineX = window.innerWidth < 1200 ? 48 : window.innerHeight < 777 ? 66 : window.innerWidth < 1400 ? 99 : 115;
        vis.grayLine
            .attr('x1', -lineX)
            .attr('x2', lineX)
            .attr('y1', 18)
            .attr('y2', 18)
            .style('opacity', vis.draws > 1 && vis.objective !== 'Balanced' ? 1 : 0)
            .transition()
            .duration(888)
            .delay(300 + vis.delay)
            .style('opacity', vis.objective === 'Balanced' ? 0 : 1)
    }

    setText() {
        const vis = this;
        // const time = convertTime(vis.inceptionDate);
        // const output = time.split('/')[0] + '/' + time.split('/')[1] + '/' + time.split('/')[2].slice(2)
        document.getElementById('r6-growth-fund-est-reg').innerText = 'Fund inception ' + vis.inceptionDate;
    }
}


///// BAR BUILDER
class R6BarChart {
    constructor(el, data, flag) {
        const vis = this;

        console.log('r6h', data)
        vis.el = el;
        vis.data = data.heroData.bars;
        vis.asOf = data.heroData.expenses.asOfDate;
        vis.id = data.id;
        vis.flag = flag;
        vis.name = data.name;
        vis.peerName = data.heroData.peerName;
        vis.peerName2 = data.heroData.peerName2 && data.heroData.peerName2 !== vis.peerName ? data.heroData.peerName2 : '';
        vis.indexPrimary = data.indexPrimary;

        vis.objective = data.objective;
        vis.barData = flag === 'downside' ? data.heroData.bars
            : flag === 'upside' ? data.heroData.bars
                : flag === 'index' ? data.heroData.bars.index
                    : flag === 'peer' ? data.heroData.bars.peer
                        : flag === 'expense' ? data.heroData.expenses.data
                            : data.heroData.bars.peer2;

        vis.positionSet = false;
        vis.draws = 0;

        // COLORs
        if (data.objective === 'Growth') {
            vis.color = 'rgb(0, 45, 114)';

            if (vis.flag === 'expense')
                vis.color2 = 'rgba(127, 127, 127, .5)';
            else
                vis.color2 = 'rgba(0, 45, 114, .5)';

        } else if (data.objective === 'Equity income') {
            vis.color = 'rgba(0, 142, 170, 1)';
            vis.color2 = 'rgba(0, 142, 170, .5)';
        } else if (data.objective === 'Balanced') {
            vis.color = 'rgb(45, 204, 211)';
            vis.color2 = 'rgba(45, 204, 211, .5)';
        } else {
            vis.color = 'rgba(0, 87, 184, 1)'
            if (vis.flag === 'expense')
                vis.color2 = 'rgba(127, 127, 127, .5)';
            else
                vis.color2 = 'rgba(0, 87, 184, .5)';
        }

        this.init();
    }

    init() {
        const vis = this;

        // MAIN SVG
        vis.chartDiv = document.getElementById(vis.el);

        document.getElementById(vis.el).innerHTML = ''; // remove previous vis's
        vis.svg = d3.select(vis.chartDiv).append('svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND BARS
        vis.bars = vis.g.append('g').attr('class', 'bars');

        // APPEND Y
        vis.yAxis = vis.g.append('line').attr('class', 'vert-axis').attr('stroke', 'rgb(100, 100, 100)')

        // APPEND TEXT
        vis.text = vis.g.append('g').attr('class', 'bar-text');

        vis.text2 = vis.g
            .append('g')
            // .append("foreignObject")
            .attr('class', 'foreign-objects')
        // .attr("width", 135)
        // .attr("height", 95)
        // .attr('y', d => y(0.2) - yMove)
        // .attr('x', x(new Date('Feb 25 1983 11:11:41 GMT-0700 (Pacific Daylight Time)')) - textXoffset)
        // .style('text-align', 'center')
        // .html("<div class='avg-val'> 0.51<sup>%</sup></div> <div class='avg-text'>Average</div> <div class='avg-text'> 1974-1996</div>")

        vis.exponent = vis.g.append('g').attr('class', 'bar-text');

        // APPEND A DIV
        vis.topLine = d3.select(vis.chartDiv).append('div').attr('class', 'dc-pi-text');

        vis.lastVal = d3.select(vis.chartDiv).append('div');

        // GRAY LINE
        // vis.grayLine = vis.g.append('line').style('stroke-width', '2px').style('stroke', 'rgb(127,127,127)')

        vis.redraw();
    }

    redraw() {

        const vis = this;
        vis.draws++;

        if (vis.draws === 1 && vis.flag === 'expense') {
            vis.setTextLine();
        }

        // SCALES
        let allValues = [];

        if (vis.flag === 'expense') {
            allValues = [0, d3.max(vis.barData, d => d.value)];
        } else if (vis.objective !== 'Balanced') {
            if (vis.data.index) {
                vis.data.index.forEach(d => {
                    allValues.push(d.value);
                })
            }

            if (vis.data.peer) {
                vis.data.peer.forEach(d => {
                    allValues.push(d.value);
                })
            }

            if (vis.data.peer2) {
                vis.data.peer2.forEach(d => {
                    allValues.push(d.value);
                })
            }
        } else if (vis.objective === 'Balanced') {
            allValues.push(vis.barData[0].value)
            allValues.push(vis.barData[1].value)
        }

        const xExtent = d3.extent(allValues);

        // SET WIDTH ON .r6-hero-bar
        if (window.innerWidth < 1200) {

            /// set columns & widths
            if (vis.objective === 'Balanced') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '50% 50%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '250px');

            } else if (vis.id === 'WMIF') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '78% 22%';

                document.querySelectorAll('.r6-hero-bar').forEach((el, i) => {
                    if (i === 3) {
                        // last one (expense bars)
                        el.style.width = '120px';
                    } else {
                        el.style.width = '160px'
                    }
                });
            } else {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '63% 37%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '200px');
            }
        } else if (window.innerHeight < 800) {

            /// set columns & widths
            if (vis.objective === 'Balanced') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '50% 50%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '400px');

            } else if (vis.id === 'WMIF') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '75% 25%';

                document.querySelectorAll('.r6-hero-bar').forEach((el, i) => {
                    if (i === 3) {
                        el.style.width = '200px';
                    } else {
                        el.style.width = '240px'
                    }
                });

            } else {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '63% 37%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '240px');
            }
        } else if (window.innerWidth < 1400) {

            /// set columns & widths
            if (vis.objective === 'Balanced') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '50% 50%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '400px');

            } else if (vis.id === 'WMIF') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '75% 25%';

                document.querySelectorAll('.r6-hero-bar').forEach((el, i) => {
                    if (i === 3) {
                        el.style.width = '205px';
                    } else {
                        el.style.width = '260px'
                    }
                });

            } else {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '63% 37%';
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '240px');
            }
        } else {

            /// set columns
            if (vis.objective === 'Balanced') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '50% 50%';
            } else if (vis.id === 'WMIF') {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '68% 32%';
            } else {
                document.querySelector('.r6-hero-bottom').style.gridTemplateColumns = '63% 37%';
            }

            if (vis.objective === 'Balanced') {
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '550px');
            } else if (vis.id === 'WMIF') {
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '265px');
            } else {
                document.querySelectorAll('.r6-hero-bar').forEach(el => el.style.width = '300px');
            }
        }

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;

        // DEFINE SVG
        vis.svg.attr('width', width).attr('height', height);

        // MARGINS
        const margin = { top: 0, right: 55, bottom: 0, left: 0 };
        vis.gWIDTH = width - (margin.left + margin.right);
        vis.gHEIGHT = height - (margin.top + margin.bottom);

        let xOffset = 0;
        // MOVE CHART TO THE LEFT IF THE NEGATIVE VALUE (vis.barData[1].value) IS NOT THE MAX NEGATIVE VAL OF ALL CHARTS IN SECTION
        if (vis.barData[1].value !== xExtent[0] && vis.flag !== 'expense' && vis.id === 'WMIF') {
            const totalExtent = (xExtent[1] - xExtent[0]);
            const biggestNegative = -xExtent[0];
            const currentNegative = -vis.barData[1].value;
            const barWidth = width - margin.right;

            const buffer = 3;
            xOffset = Math.floor((biggestNegative - currentNegative) / totalExtent * barWidth) - buffer;

            // SHIFT THE NEXT COLUMN CLOSER
            vis.chartDiv.parentElement.style.marginRight = -xOffset + 5 + 'px';
        } else {
            vis.chartDiv.parentElement.style.marginRight = '0px';
        }

        // G
        vis.g
            .attr('height', vis.gHEIGHT)
            .attr('width', vis.gWIDTH)
            .attr('transform', `translate(${-xOffset}, ${margin.top})`);

        // SCALES
        const x = d3.scaleLinear()
            .domain(xExtent)
            .rangeRound([0, vis.gWIDTH])

        const yDom = vis.flag === 'expense' ? ['fund', 'peer']
            : vis.objective === 'Growth' ? ['avgOutpacedReturn', 'avgLaggedReturn']
                : vis.objective === 'Equity income' ? ['avgOutpacedReturn', 'avgLaggedReturn'] ///////////this 
                    : vis.objective === 'Balanced' ? ['avgOutpacedReturn', 'avgLaggedReturn']
                        : ['avgOutpacedReturn', 'avgLaggedReturn', 'avgExcess'];

        const y = d3.scaleBand()
            .domain(yDom)
            .rangeRound([0, vis.gHEIGHT])
            .paddingOuter(0.25)
            .paddingInner(0.04)

        // Y AXIS
        vis.yAxis
            .attr('x1', x(0) + 1)
            .attr('y1', 0)
            .attr('y2', vis.gHEIGHT)
            .attr('x2', x(0) + 1)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(500)
            .style('opacity', 1)

        console.log(vis.barData, vis.barData.length, y.bandwidth())

        // JOIN BARS
        const bars = vis.bars
            .selectAll("rect")
            .data(vis.barData)

        // EXIT
        bars.exit().remove();

        // UPDATE
        bars
            .transition()
            .duration(500)
            .attr("x", d => !d.value ? 0 : d.value === 'N/A' || d.value === '-' ? 0 : d.value <= 0 ? x(d.value) - 1 : x(0) + 3)
            .attr("y", d => y(d.name))
            .attr("width", d => !d.value ? 0 : d.value === 'N/A' || d.value === '-' ? 0 : Math.abs(x(d.value) - x(0)))
            .attr("height", y.bandwidth());

        // ENTER
        bars
            .enter()
            .append("rect")
            .attr('id', (d, i) => `rect-${vis.flag}-${i}`)
            .attr("fill", (d, i) => i === 0 ? vis.color : vis.color2)
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("x", d => !d.value ? 0 : d.value === 'N/A' || d.value === '-' ? 0 : d.value <= 0 ? x(0) - 1 : x(0) + 3)
            .attr("width", 0)
            .transition()
            .duration(888)
            .delay((d, i) => 500)
            .attr("x", d => !d.value ? 0 : d.value === 'N/A' || d.value === '-' ? 0 : d.value <= 0 ? x(d.value) - 1 : x(0) + 3)
            .attr("width", d => !d.value ? 0 : d.value === 'N/A' || d.value === '-' ? 0 : Math.abs(x(d.value) - x(0)))

        /// JOIN TEXT ************************************
        const text = vis.text
            .selectAll("text")
            .data(vis.barData)

        // EXIT
        text.exit().remove();

        // UPDATE
        const numMove = window.innerWidth < 1200 ? 0 : window.innerHeight < 800 ? -3 : -7;
        // IVE
        // 'IVE'
        // "IVE"
        // SPECIAL MOVE FOR IVE
        // i === 0 means it's the top bar's text, i === 1 is for bot bar
        text
            .transition()
            .duration(500)
            .style('opacity', (d, i) => vis.flag === 'expense' && i === 1 ? 0 : 1)
            .attr('x', (d, i) => !d.value ? x(0) : d.value === 'N/A' || d.value === '-' ? x(0) : i === 1 ? x(0) : i === 2 && d.value < 0 ? x(0) : x(d.value))
            .attr("y", d => y(d.name))
            .attr("dy", y.bandwidth() / 2 + 5)
            .attr('joeiscool', (d, i, n) => moveTextOutsideOfBar(d, i, n[i])) // yeah so this is a hack to call this with the params I need

        // ENTER
        text
            .enter()
            .append("text")
            .attr('class', (d, i) => i === 0 ? 'r6-hero-bar-text-top-' + vis.flag : 'r6-hero-bar-text-bottom-' + vis.flag)
            .text(d => !d.value ? '' : typeof d.value === 'string' ? 'N/A' : enDash(d.value.toFixed(2)) + '%')
            .attr('fill', (d, i) => i > 0 ? 'black' : d.value === 'N/A' || d.value === '-' ? 'black' : 'white')
            .style('text-anchor', (d, i) => i === 0 ? 'end' : 'start')
            .attr('x', (d, i) => !d.value ? x(0) : d.value === 'N/A' || d.value === '-' ? x(0) : i === 1 ? x(0) : i === 2 && d.value < 0 ? x(0) : x(d.value))
            .attr('dx', (d, i) => i === 0 ? numMove : 10)
            .attr("y", d => y(d.name))
            .attr("dy", y.bandwidth() / 2 + 5)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(1500)
            .style('opacity', (d, i) => vis.flag === 'expense' && i === 1 ? 0 : 1)
            .attr('joeiscool', (d, i, n) => moveTextOutsideOfBar(d, i, n[i])) // yeah so this is a hack to call this with the params I need

        function moveTextOutsideOfBar(d, i, text) {
            const isTopBarText = i === 0 ? true : false;
            const relevantBar = document.getElementById('rect-' + vis.flag + '-' + i);
            const textWidth = text.getBBox().width;

            setTimeout(() => { // we've got to delay it because the bars are growing, so that's a shame
                const barWidth = Number(relevantBar.getAttribute('width'));
                if ((textWidth > barWidth * .88) && isTopBarText) {
                    console.warn('text should be repositioned', d.value);
                    if (vis.id !== 'DWGI')
                        repositionTextRight(text);
                }

            }, vis.draws === 1 ? 1000 : 1900);
        }

        function repositionTextRight(text) {
            text.style.textAnchor = 'start';
            text.setAttribute('dx', 13)
            text.setAttribute('fill', 'black')
        }

        // function repositionTextLeft(text) {
        //     text.style.textAnchor = 'end';
        //     text.setAttribute('dx', -7)
        //     text.setAttribute('fill', 'black')
        // }

        /// JOIN TEXT ************************************
        /// JOIN TEXT ************************************
        /// JOIN TEXT ************************************

        // console.log('here we go', vis.barData)
        // const text2 = vis.text2
        //     .selectAll("foreignObject")
        //     .data(vis.barData)

        // // EXIT
        // text2.exit().remove();

        // // // UPDATE
        // text2
        //     .transition()
        //     .duration(500)
        //     .style('opacity', (d, i) => vis.flag === 'expense' && i === 1 ? 1 : 1)
        //     .attr("y", d => y(d.name))

        // // ENTER
        // const exponentText = vis.flag === 'expense' && (vis.id === 'NPF' || vis.id === 'AMBAL') ? '2' : vis.flag === 'expense' ? '1' : ' ';
        // const arbitaryWidth = 300;
        // text2
        //     .enter()
        //     .append("foreignObject")
        //     .attr('height', y.bandwidth() + 'px')
        //     .attr("y", d => y(d.name))
        //     .attr('width', arbitaryWidth + "px")
        //     .attr('x', 0)
        //     .html((d, i) => `<div class='bar-text' 
        //         style='height: 100%;
        //         position: relative;
        //         left: ${setXpos(d, i)}px;
        //         margin-left: 5px;
        //         display: flex;
        //         align-items: center;
        //         flex-flow: row; 
        //         color: ${i > 0 ? 'black' : 'white'}; 
        //         text-anchor: ${i === 0 ? 'end' : 'start'};'>
        //         ${!d.value ? '' : enDash(d.value.toFixed(2))}
        //         <sup style="top: -0.68em;left: .05em;">%${exponentText}</sup>
        //         </div>`)
        //     .style('opacity', 0)
        //     .transition()
        //     .duration(888)
        //     .delay(500)
        //     .style('opacity', (d, i) => vis.flag === 'expense' && i === 1 ? 1 : 1)

        // function setXpos(d, i) {
        //     console.log("FFFFFFFFFFF", d, vis.barData.length)
        //     let xMover;
        //     if (i === 0) {
        //         xMover = numMove;
        //     } else {
        //         xMover = 10;
        //     }

        //     if (!d.value)
        //         return x(0) + xMover

        //     if (vis.flag === 'expense') {
        //         // this is the final bar chart all the way to the right
        //         if (i === 1) {
        //             // bottom expense bar 
        //             const valMove = window.innerWidth < 1200 ? -20 : window.innerHeight < 800 ? -29 : -55;
        //             return x(d.value) + valMove
        //         } else
        //             // top expense bar
        //             return x(d.value) + xMover
        //     } else {
        //         if (i === 0) {
        //             // top bar in bar charts other than expense
        //             return x(d.value) + xMover

        //         } else if (i === 1) {

        //             if (vis.barData.length === 2) {
        //                 // bottom bar in bar charts other than expense chart
        //                 return x(0) + xMover;
        //             } else {
        //                 // middle bar when three rows
        //                 return x(0) + xMover;
        //             }
        //         } else if (i === 2)
        //             return (x(0) + xMover)
        //     }
        // }





        // EXPENSE IS THE LAST GRAPH CALLED AND WE ONLY NEED TO DO THIS ONCE
        if (vis.flag === 'expense') {
            vis.fadeUpText();
            vis.setTextHolders();

            // SET TEXT ON BOTTOM BAR OF EXPENSES

            const valMove = window.innerWidth < 1200 ? -20 : window.innerHeight < 800 ? -29 : -35;
            const exponentText = vis.id === 'NPF' || vis.id === 'AMBAL' || vis.id === 'GBAL' ? '2' : '1';

            if (vis.barData[1].value) {
                vis.lastVal
                    .style('opacity', vis.draws > 1 ? 1 : 0)
                    .attr('class', 'bar-text r6-bar-text-holder')
                    .style('color', 'black')
                    .attr('id', 'r6-last-val')
                    .style('top', y(vis.barData[1].name) + y.bandwidth() / 2 + 'px')
                    .style('left', x(vis.barData[1].value) + valMove + 'px')
                    .html(`
                        ${enDash(vis.barData[1].value.toFixed(2))}%<sup class='r6-exponent-text'>${exponentText}</sup>
                    `)
                    .transition()
                    .duration(500)
                    .delay(1500)
                    .style('opacity', 1);
            } else {
                vis.lastVal
                    .style('opacity', 0)

                setTimeout(() => {
                    vis.lastVal.html('')
                }, 300);
            }

            // CENTER VERTICALLY... AND HORZ
            const vHeight = vis.lastVal._groups[0][0].clientHeight;
            const hWidth = vis.lastVal._groups[0][0].clientWidth;

            vis.lastVal
                .style('margin-top', -vHeight / 2 + 'px')
                .style('margin-left', -hWidth / 2 + 'px')

            ///SPECIAL EXCEPTION
            if (vis.id === 'DWGI') {
                const textEl = document.querySelector('.bar-text text');
                textEl.style.fill = 'rgb(0, 87, 184)';
                textEl.style.transform = 'translate(-22%, 0px)';

                const textEl2 = document.querySelector('#r6-hero-bar-2 .bar-text text');
                textEl2.style.fill = 'rgb(0, 87, 184)';
                textEl2.style.transform = 'translate(-20%, 0px)';
            }
        }
    }

    setTextLine() {
        const vis = this;

        const mainText = document.getElementById('r6-hero-top-text');
        const text = document.getElementById('r6-hero-text-line');

        if (vis.id === 'AMBAL' || vis.id === 'GBAL') {
            const yearOut = vis.id === 'GBAL' ? '5-year' : '10-year';

            mainText.innerHTML = `
            Looking at an average of rolling ${yearOut} periods, the fund captured less of the index’s downturns while outpacing the blended 
            benchmark<sup>1</sup> by a greater magnitude than it lagged. As of ${vis.asOf}.`
            text.innerText = `Average monthly rolling ${yearOut} periods capture ratio over fund lifetime vs. blended index`
        } else {

            const FOOTNOTE = vis.id === 'NPF' ? '<sup>1</sup>' : ''

            const yearOut = vis.id === 'GIF' || vis.id === 'IVE' || vis.id === 'DWGI' || vis.id === 'GBAL' ? '3-year' : '10-year';
            const FREQUENTLY = vis.id !== 'DWGI' ? 'frequently ' : '';
            const PEER2 = vis.peerName2 ? ', ' + vis.peerName2.trim() : '';
            mainText.innerHTML = `The fund has ${FREQUENTLY}outpaced its primary index (${vis.indexPrimary}) and its peers (${vis.peerName.trim()}${PEER2}${FOOTNOTE}) 
            over rolling monthly ${yearOut} periods from first month-end after fund inception date through ${vis.asOf}. `
            text.innerText = 'Percentage of rolling periods in which:'
        }

        // if (vis.id === 'NPF') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (MSCI All Country World Index) and its peers 
        //     (Morningstar World Large Stock<sup style: font-size: 50%;>1</sup>) over rolling monthly 10-year periods 
        //     from first month-end after fund inception date through ${vis.asOf}.
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else if (vis.id === 'IVE') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (MSCI EAFE (Europe, Australasia, Far East) Index) and 
        //     its peers (Morningstar US Fund Foreign Large Growth) 
        //     over rolling monthly 3-year periods from first month-end after fund inception date through ${vis.asOf}.            
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else if (vis.id === 'GFA') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (Standard & Poor's 500 Index) and its peers (Morningstar U.S. Fund Large Growth) 
        //     over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.            
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else if (vis.id === 'EUPAC') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (MSCI All Country World Index (ACWI) ex USA) and its peers (Morningstar Foreign Large Growth) 
        //     over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.        
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else if (vis.id === 'AMCAP') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (Standard & Poor's 500 Index) and its peers (Morningstar U.S. Fund Large Growth) 
        //     over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.       
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else if (vis.id === 'WMIF') {
        //     mainText.innerHTML = `The fund has frequently outpaced its primary index (Standard & Poor's 500 Index) and its peers (Morningstar 
        //         Large Blend and Morningstar Large Value) over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.`
        //     text.innerText = 'Percentage of rolling periods in which:';
        // }
        // else if (vis.id === 'AMF') {
        //     mainText.innerHTML = `The fund has frequently outpaced its primary index (Standard & Poor's 500 Index) and its peers (Morningstar Large Value) over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.`
        //     text.innerText = 'Percentage of rolling periods in which:';
        // } else if (vis.id === 'AMBAL') {
        //     mainText.innerHTML = `
        //         Looking at an average of rolling 10-year periods, the fund captured less of the index’s downturns while outpacing the blended 
        //         benchmark<sup>1</sup> by a greater magnitude than it lagged. As of ${vis.asOf}.`
        //     text.innerText = 'Average monthly rolling 10-year periods capture ratio over fund lifetime vs. blended index'
        // } else if (vis.id === 'NWF') {
        //     mainText.innerHTML = `
        //     The fund has frequently outpaced its primary index (MSCI All Country World Index (ACWI)) and its peers (Morningstar Diversified Emerging Markets) 
        //     over rolling monthly 10-year periods from first month-end after fund inception date through ${vis.asOf}.   
        //     `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // } else {

        //     const yearOut = vis.id === 'GIF' ? '3-year' : '10-year'
        //     mainText.innerHTML = `The fund has frequently outpaced its primary index (${vis.indexPrimary}) and its peers (${vis.peerName}) 
        //     over rolling monthly ${yearOut} periods from first month-end after fund inception date through ${vis.asOf}. `
        //     text.innerText = 'Percentage of rolling periods in which:'
        // }
    }

    fadeUpText() {
        const vis = this;

        if (vis.draws > 1) return

        const h1 = document.getElementById('r6-hero-bot-label-0');
        const h2 = document.getElementById('r6-hero-bot-label-1');

        h1.innerText = 'Average excess return when:'
        h2.innerText = 'Expense ratio:'

        const headers = document.querySelectorAll('.r6-hero-bot-lab');
        headers.forEach(header => {
            header.style.transition = '.0s opacity ease-in-out';
            header.style.opacity = 0;

            setTimeout(() => {
                header.style.transition = '.4s opacity ease-in-out';
                header.style.opacity = 1;
            }, 400);
        })

        const sideTexts = document.querySelectorAll('.r6-text-holder');
        sideTexts.forEach(sideTexts => {
            sideTexts.style.transition = '.0s opacity ease-in-out';
            sideTexts.style.opacity = 0;

            setTimeout(() => {
                sideTexts.style.transition = '.4s opacity ease-in-out';
                sideTexts.style.opacity = 1;
            }, 400);
        })
    }

    setTextHolders() {
        const vis = this;

        const holder0 = document.getElementById('r6-text-holder-0');
        const holder1 = document.getElementById('r6-text-holder-1');
        const holder2 = document.getElementById('r6-text-holder-2');
        const holder3 = document.getElementById('r6-text-holder-3');

        holder0.innerHTML = '';
        holder1.innerHTML = '';
        holder2.innerHTML = '';
        holder3.innerHTML = '';

        const outText = vis.barData[1].value ? 'Morningstar fee-level peer average' : '';
        if (vis.id === 'WMIF' || vis.id === 'AMF' || vis.id === 'DWGI' || vis.id === 'FI' || vis.id === 'ICA' || vis.id === 'WGI' || vis.id === 'IGI') {
            holder0.innerHTML = `
                <div>Fund outpaced index:</div>
                <div>Fund trailed index:</div>
                <div>Overall vs. index</div>
                `;
            holder1.innerHTML = `
                <div>Fund outpaced Large Blend:</div>
                <div>Fund trailed Large Blend:</div>
                <div>Overall vs. Large Blend:</div>
                `;
            holder2.innerHTML = `
                <div>Fund outpaced Large Value:</div>
                <div>Fund trailed Large Value:</div>
                <div>Overall vs. Large Value:</div>
                `;

            const noWrap = vis.id === 'DWGI' ? 'white-space: unset;' : 'white-space: nowrap;';
            holder3.innerHTML = `
                <div>${vis.name}</div>
                <div>Morningstar fee-level peer average</div>
                `;
        } else {
            holder0.innerHTML = `
            <div>Fund outpaced index:</div>
            <div>Fund trailed index:</div>
            `;
            holder1.innerHTML = `
            <div>Fund outpaced peers:</div>
            <div>Fund trailed peers:</div>
            `;

            holder2.innerHTML = ``;

            holder3.innerHTML = `
            <div>${vis.name}</div>
            <div>${outText}</div>
            `;
        }
    }
}
