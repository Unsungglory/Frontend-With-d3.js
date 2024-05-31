function setStressDate() {
    document.getElementById('stress-test-date').innerText = stressTestDate;
}

setStressDate();


let stressTestTextUpdate = null;
let stressTestPie = null;
let currentYear = 1;
let stressTestLineChart = null;
let intersectionCounter = 0;


/// OBSERVER
let observer = null;

let options = {
    // root: document.querySelector('#growth-section').contentWindow,
    // root: document.getElementById('growth-section').contentDocument,
    // root: document.querySelector('#fund-page'),
    root: null,
    rootMargin: '0px',
    threshold: 0.7
}

///////
function drawStressTest(data, fundClass) {
    // REDUNDANT REMOVAL
    document.querySelectorAll('.st-info-box').forEach(el => el.remove());
    document.querySelectorAll('.st-pie-grid-row').forEach(el => el.remove())

    setTimeout(() => {
        currentYear = 1;

        stressTestTextUpdate = new InfoBoxes(data, fundClass);
        stressTestPie = new StressTestPie(data, fundClass);
        stressTestLineChart = new StressTestLineChart(data, fundClass);

        observer = new IntersectionObserver(callDraw, options);
        observer.observe(document.getElementById('fp-growth-5'));

        intersectionCounter = 0;
    }, 200);
}

function callDraw(entries, observer) {
    if (intersectionCounter === 0) {
        entries.forEach(e => {
            if (e.intersectionRatio > .5) {
                // REDUNDANT REMOVAL
                document.querySelectorAll('.st-info-box').forEach(el => el.remove());
                document.querySelectorAll('.st-pie-grid-row').forEach(el => el.remove())

                intersectionCounter++;
                setTimeout(() => {
                    console.log('observerer triggering draw')
                    stressTestTextUpdate.draw(currentFundClass);
                    stressTestPie.redraw(currentFundClass);
                    stressTestLineChart.redraw(currentFundClass);
                }, 250);
            }
        })
    }
}

function updateStressTest(data, fundClass) {

    if (stressTestTextUpdate && intersectionCounter > 0)
        stressTestTextUpdate.redraw(data, fundClass);

    if (stressTestPie && intersectionCounter > 0)
        stressTestPie.redraw(fundClass, 'update', currentYear);

    if (stressTestLineChart && intersectionCounter > 0)
        stressTestLineChart.redraw(fundClass, 'redraw')
}

function resizeStressText(data, fundClass) {

    if (stressTestPie && intersectionCounter > 0)
        stressTestPie.redraw(fundClass, 'resize');

    if (stressTestLineChart && intersectionCounter > 0)
        stressTestLineChart.redraw(fundClass)
}

// UPDATES TEXT ROWS
class InfoBoxes {
    constructor(data, fundClass) {
        const vis = this;

        vis.dataA = data.a.stressData;
        vis.dataF2 = data.f2.stressData;
        vis.fundClass = fundClass;
        vis.draws = 0;
        vis.inception = data.a.inception;

        if (vis.fundClass === 'a')
            vis.data = data.a.stressData
        else if (vis.fundClass === 'f2')
            vis.data = data.f2.stressData

        vis.init();
    }

    init() {
        const vis = this;

        // document.querySelectorAll('.st-info-box').forEach(el => {
        //     el.style.transition = 'all .2s ease-in-out';
        //     el.style.opacity = 0
        // });

        // REMOVE OLD BOXES
        document.querySelectorAll('.st-info-box').forEach(el => el.remove());

        // vis.draw();
        // HANDLE CASE WHERE NO DATA FOR THIS FUND
        if (!Object.keys(vis.data).length) {
            const msg = document.getElementById('st-data-missing-1');
            msg.style.opacity = 1;
            msg.innerHTML = `
                        Fund originated in ${new Date(vis.inception).getFullYear()}.<br>
                        No returns are available for time frame.
                    `
        } else {
            document.getElementById('st-data-missing-1').style.opacity = 0;
        }
    }

    draw(fundClass) {
        const vis = this;
        vis.fundClass = fundClass;
        vis.draws++

        if (vis.fundClass === 'a')
            vis.data = vis.dataA
        else if (vis.fundClass === 'f2')
            vis.data = vis.dataF2

        const keys = Object.keys(vis.data);

        // HANDLE CASE WHERE NO DATA FOR THIS FUND
        if (!keys.length) {
            const msg = document.getElementById('st-data-missing-1');
            msg.style.opacity = 1;
            msg.innerHTML = `
                Fund originated in ${new Date(vis.inception).getFullYear()}.<br>
                No returns are available for time frame.
            `
        } else {
            document.getElementById('st-data-missing-1').style.opacity = 0;

            setTimeout(() => {

                // REMOVE PREVIOUS BOXES (YET AGAIN)
                const oldBoxes = document.querySelectorAll('.st-info-box');
                oldBoxes.forEach(el => el.remove());

                // APPEND BOXES
                keys.forEach(key => {

                    if (key > 20) return

                    vis.appendBox(key, vis.data[key])
                })

                // FADE IN BOXES
                document.querySelectorAll('.st-info-box').forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = 1
                    }, 150 * i + 10 + 10);
                })
            }, 0);
        }
    }

    redraw(data, fundClass) {
        let sharedata = null;
        if (fundClass === 'a')
            sharedata = data.a.stressData
        else if (fundClass === 'f2')
            sharedata = data.f2.stressData

        const keys = Object.keys(sharedata);

        if (!keys.length) {
            const msg = document.getElementById('st-data-missing-1');
            msg.style.opacity = 1;
            msg.innerHTML = `
            Fund originated in ${new Date(data.a.inception).getFullYear()}.<br>
            No returns are available for time frame.`
            return
        }
        else {
            document.getElementById('st-data-missing-1').style.opacity = 0;

            const boxes = document.querySelectorAll('.st-info-box')
            const altEls = document.querySelectorAll('.st-overlay');
            const regEls = document.querySelectorAll('.st-box-number');

            keys.forEach((key, i) => {

                if (key > 20) return

                // SET ST-OVERLAY TEXT
                altEls[i].innerText = `${enDash(sharedata[key].diff.toFixed(2))}%`;

                // CHANGE BOX COLORS
                const boxColor = sharedata[key].diff > 0 ? 'rgba(0, 156, 221, 1)' : sharedata[key].diff === 0 ? 'rgba(178, 213, 239, 1)' : 'rgba(132, 205, 203, 1)';
                boxes[i].style.backgroundColor = boxColor;
            })

            // FADE UP ST-OVERLAY TEXT
            altEls.forEach(el => el.style.opacity = 1);

            // FADE DOWN ST-BOX-NUMBER
            regEls.forEach(el => el.style.opacity = 0);

            // UPDATE ST-BOX-NUMBER TEXT after transition
            setTimeout(() => {
                keys.forEach((key, i) => {

                    if (key > 20) return

                    // SET st-box-number TEXT
                    regEls[i].innerText = `${enDash(sharedata[key].diff.toFixed(2))}%`;
                })
            }, 400);

            // SET TRANSITIONS
            setTimeout(() => {
                altEls.forEach((el, i) => {
                    el.style.transition = 'none'
                    regEls[i].style.transition = 'none'

                    // CUT TO ST-BOX-NUMBER TEXT
                    el.style.opacity = 0
                    regEls[i].style.opacity = 1;
                });

            }, 410);

            // RESTORE TRANSITIONS
            setTimeout(() => {
                altEls.forEach((el, i) => {
                    el.style.transition = 'all .4s ease-in-out'
                    regEls[i].style.transition = 'all .4s ease-in-out'
                });

            }, 450);
        }

    }

    appendBox(num, d) {

        const appendTo = document.getElementById('st-info-boxes');

        const newBox = document.createElement('div')
        const value = d.diff;

        newBox.classList = 'st-info-box';
        newBox.style.opacity = 0;
        newBox.style.backgroundColor = value > 0 ? 'rgba(0, 156, 221, 1)' : value === 0 ? 'rgba(178, 213, 239, 1)' : 'rgba(132, 205, 203, 1)';
        newBox.style.transition = 'all .5s ease-in-out';

        newBox.innerHTML = `
                <div class='text-layers'>
                    <div class='st-box-label'>${num} year</div>
                </div>
                <div class='text-layers'>
                    <div class='st-box-number'>${enDash(value.toFixed(2))}%</div>
                    <div class='st-overlay'>${enDash(value.toFixed(2))}%</div>
                </div>
            `
        appendTo.append(newBox);
    }
}

// STRESS PIE CHART
class StressTestPie {
    constructor(data, fundClass) {
        const vis = this;

        vis.dataA = data.a;
        vis.dataF2 = data.f2;
        vis.objective = data.a.objective;
        vis.draws = 0;
        vis.fundClass = fundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a')
            vis.data = vis.dataA
        else if (vis.fundClass === 'f2')
            vis.data = vis.dataF2

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('stress-test-pie')) document.getElementById('stress-test-pie').remove();

        // REMOVE
        document.querySelectorAll('.st-pie-grid-row').forEach(el => el.remove())

        // MAIN SVG
        vis.chartDiv = document.getElementById(`st-pie-chart`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `stress-test-pie`).attr("id", 'stress-test-pie');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND PIE WEDGES
        vis.slices = vis.g.append("g").attr("class", "st-slices");

        // APPEND PI LABLES
        vis.textLables = vis.g.append("g").attr("class", "st-pie-labels");

        // vis.redraw(vis.fundClass, 'init');

        // HANDLE THE CASE WHERE WE DON'T HAVE DATA
        if (Object.keys(vis.data.stressData).length === 0) {
            const msg = document.getElementById('st-data-missing-2');
            msg.style.opacity = 1;
            msg.innerHTML = `Fund originated in ${new Date(vis.data.inception).getFullYear()}.<br>
                    No returns are available for time frame.`
        } else {
            document.getElementById('st-data-missing-2').style.opacity = 0;
        }
    }

    redraw(fundClass = this.fundClass, update = 'init', year = 1) {
        const vis = this;
        vis.draws++;
        vis.fundClass = fundClass;
        vis.year = year;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a')
            vis.data = vis.dataA
        else if (vis.fundClass === 'f2')
            vis.data = vis.dataF2

        // HANDLE THE CASE WHERE WE DON'T HAVE DATA
        if (Object.keys(vis.data.stressData).length === 0) {
            const msg = document.getElementById('st-data-missing-2');
            msg.style.opacity = 1;
            msg.innerHTML = `Fund originated in ${new Date(vis.data.inception).getFullYear()}.<br>
            No returns are available for time frame.`
            return
        }

        document.getElementById('st-data-missing-2').style.opacity = 0;

        // SET COLOR BASED ON OBJECTTIVE
        vis.color = boxColors[vis.objective.trim()]

        if (update === 'init')
            vis.setText();
        else if (update === 'update')
            vis.updateText();

        const outerWidth = .5; // for donut wedges
        const innerWidth = .15; // for donut wedges

        vis.MARGIN = { top: 0, right: window.innerWidth > 1400 ? 60 : 0, bottom: 0, left: 0 };

        vis.width = vis.chartDiv.clientWidth;
        vis.height = vis.chartDiv.clientHeight;
        const RADIUS = d3.min([vis.width, vis.height]);
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // Use the extracted size to set the size of an SVG element.
        vis.svg.attr('width', vis.width).attr('height', vis.height);

        // SET G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', `translate(${vis.gWIDTH * .5 + vis.MARGIN.left}, ${vis.gHEIGHT * .5 + vis.MARGIN.top})`);

        // SETUP PIE
        const pieGenerator = d3
            .pie()
            .padAngle(0.04)
            .startAngle(0 * Math.PI)
            .endAngle(2 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                null
                // console.log(a, b)
                // return a - b;
                // return a.orderVal.localeCompare(b.orderVal)
            });

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        const successRate = Math.round(vis.data.stressData[vis.year].success);

        let dataForPie;
        if (successRate === 0) {
            dataForPie = [
                { name: 0, value: 100 - successRate },
            ]
        } else {
            dataForPie = [
                { name: 0, value: 100 - successRate },
                { name: 1, value: successRate },
            ]

        }

        console.log(vis.data.stressData[vis.year].success, successRate, dataForPie)

        const arcData = pieGenerator(dataForPie);

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
            .attr('fill', (d, i) => i === 1 ? vis.color : 'rgba(124, 135, 142, 1)')
            .attrTween('d', arcTween)

        // ENTER
        if (vis.draws === 1) {
            donutVis
                .enter()
                .append('path')
                .attr('class', 'st-slice')
                .attr('id', (d, i) => `st-slice-${i}`)
                .attr('fill', (d, i) => i === 1 ? vis.color : 'rgba(124, 135, 142, 1)')
                .style('opacity', 0)
                .transition()
                .delay((d, i) => i * 100 + 50)
                .duration(1000)
                .delay(300)
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

        } else {
            donutVis
                .enter()
                .append('path')
                .style('opacity', 0)
                .transition()
                .duration(500)
                .attr('fill', (d, i) => i === 1 ? vis.color : 'rgba(124, 135, 142, 1)')
                .style('opacity', 1)
                .attrTween('d', arcTween)
        }

        function arcTweenClose(d) {
            let i = d3.interpolate(this._current, { startAngle: this._current.endAngle, endAngle: this._current.endAngle + .5 });
            return t => {
                return arc(i(t));
            };
        }

        function arcTween(d) {
            d.startAngle = d.value === 100 ? -.1 : d.startAngle; // CLOSE THE PIE WHEN 100% YEAH!
            let i = d3.interpolate(this._current, d);
            this._current = i(0);
            return t => {
                return arc(i(t));
            };
        }

        // JOIN NUMERICAL LABLES A-SHARES
        const numLabels = vis.g.selectAll('.st-pi-text').data(arcData);

        // EXIT
        numLabels.exit().remove();

        // UPDATE
        numLabels
            .transition()
            .duration(500)
            .text((d, i) => i === 1 ? d.value.toFixed(2) + '%' : '')
            .attr('x', d => setXy(d, 0))
            .attr('y', d => setXy(d, 1))
            .transition()
            .style('opacity', 1)

        // ENTER
        numLabels
            .enter()
            .append('text')
            .style('opacity', 0)
            .attr('class', 'st-pi-text')
            .attr('x', d => setXy(d, 0))
            .attr('y', d => setXy(d, 1))
            .text((d, i) => i === 1 ? d.value.toFixed(2) + '%' : '')
            .transition()
            .transition()
            .duration(1000)
            .delay(100)
            .style('opacity', 1)

        function setXy(d, cord) {
            return arc.centroid(d)[cord]
        }

    } // END REDRAW

    setText() {

        const vis = this;

        // document.querySelectorAll('.st-pie-grid-row').forEach(el => {
        //     el.style.transition = 'all .2s ease-in-out';
        //     el.style.opacity = 0
        // });

        // ADDS THE INFO TO THE SCREEN
        setTimeout(() => {

            // REMOVE AGAIN
            document.querySelectorAll('.st-pie-grid-row').forEach(el => el.remove())

            const keys = Object.keys(vis.data.stressData);

            if (keys.length) {

                // APPEND BOXES
                keys.forEach(key => {

                    if (key > 20)
                        return

                    updateBox(key, vis.data.stressData[`${key}`])
                })

                // FADE IN ROWS
                document.querySelectorAll('.st-pie-grid-row').forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = i === 0 ? 1 : .2;
                    }, 150 * i + 10);
                })
            }
        }, 0);

        function updateBox(num, d) {

            const appendTo = document.getElementById('st-pie-grid-container');

            const newRow = document.createElement('div')
            newRow.classList = 'st-pie-grid-row';
            newRow.style.opacity = 0;
            newRow.onclick = handleClick;
            newRow.id = `st-pie-${num}`;
            newRow.style.transition = 'all .5s ease-in-out';

            newRow.innerHTML = `
                <div class='st-pie-dot' style='background-color: ${vis.color};'></div>
                <div class='st-body-text'>${num} yr</div>
                <div class='text-layers'>
                    <div class='st-body-text right-j bold'>${enDash(Math.round(d.success).toFixed(2))}%</div>
                    <div class='st-overlay-2 bold'>${enDash(Math.round(d.success).toFixed(2))}%</div>
                </div>
            `

            appendTo.append(newRow);
        }
    }

    updateText() {
        const vis = this;
        const keys = Object.keys(vis.data.stressData);

        const altText = document.querySelectorAll('.st-overlay-2');
        const regText = document.querySelectorAll('.right-j');

        // SET ALT TEXT
        if (keys.length) {
            keys.forEach((key, i) => {
                if (key > 20)
                    return

                altText[i].innerText = Math.round(vis.data.stressData[key].success).toFixed(2) + '%';
            })
        }

        // FADE IN ALT
        altText.forEach(el => el.style.opacity = 1);

        // FADE OUT REG
        regText.forEach(el => el.style.opacity = 0);

        // SET REG AFTER FADE OUT
        setTimeout(() => {
            if (keys.length) {
                keys.forEach((key, i) => {
                    if (key > 20)
                        return

                    regText[i].innerText = Math.round(vis.data.stressData[key].success).toFixed(2) + '%';
                })
            }
        }, 400);

        // REMOVE TRANSITIONS
        setTimeout(() => {
            altText.forEach((el, i) => {
                el.style.transition = 'none';
                regText[i].style.transition = 'none';


                // CUT TO REG
                regText[i].style.opacity = 1;
                el.style.opacity = 0
            });

        }, 410);

        // RESTORE TRANSITIONS
        setTimeout(() => {
            altText.forEach((el, i) => {
                el.style.transition = 'all .4s ease-in-out';
                regText[i].style.transition = 'all .4s ease-in-out'
            });
        }, 450);
    }

}

///////
class StressTestLineChart {
    constructor(data, fundClass) {
        const vis = this;
        vis.dataA = data.a;
        vis.dataF2 = data.f2;
        vis.tickerA = data.a.ticker;
        vis.tickerf2 = data.f2.ticker;
        vis.objective = data.a.objective;
        vis.draws = 0;
        vis.fundClass = fundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA;
            document.getElementById('stress-test-fund-name-a').style.opacity = 1;
            document.getElementById('stress-test-fund-name-f2').style.opacity = 0;
        }
        else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2;
            document.getElementById('stress-test-fund-name-a').style.opacity = 0;
            document.getElementById('stress-test-fund-name-f2').style.opacity = 1;
        }

        if (vis.data.id === 'IVE' || vis.data.id === 'GIF' || vis.data.id === 'DWGI' || vis.data.id === 'GBAL') {
            document.getElementById('stress-test-sup').innerText = 8;
        } else {
            document.getElementById('stress-test-sup').innerText = 9;
        }

        vis.init();
    }

    init() {
        const vis = this;

        // SET TEXT
        document.getElementById('stress-test-fund-name-a').innerText = vis.tickerA;
        document.getElementById('stress-test-fund-name-f2').innerText = vis.tickerf2;

        vis.setSTindexName();

        // REMOVE IF NECESSARY
        if (document.getElementById('stress-test-line')) document.getElementById('stress-test-line').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`stress-test-line-chart`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `stress-test-line`).attr("id", 'stress-test-line');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        vis.gridlines = vis.g.append("g").attr("class", "grid");

        // APPEND X AXIS
        vis.xAxis = vis.g.append('g').attr('class', 'axis x-axis');

        // APPEND Y AXIS
        vis.yAxis = vis.g.append('g').attr('class', 'axis y-axis st-y-axis').style('text-anchor', 'end');

        // ADD LINE
        vis.fundLine = vis.g
            .append('path')
            .attr('class', 'st-line-path')
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px');

        // ADD LINE
        vis.indexLine = vis.g
            .append('path')
            .attr('class', 'st-line-path')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(112, 112, 112, 1)')
            .attr('stroke-width', '1.5px');

        // REMOVE IF NECESSARY
        if (document.getElementById('st-output-div'))
            document.getElementById('st-output-div').remove();
        vis.textDiv = d3.select(vis.chartDiv)
            .append('div')
            .attr('class', 'st-output-div')
            .attr('id', 'st-output-div')

        // SET COLOR BASED ON OBJECTTIVE
        vis.color = boxColors[vis.objective.trim()]

        document.getElementById('stress-test-dot-color').style.backgroundColor = vis.color;

        // vis.redraw();

        // HANDLE THE CASE WHERE WE DON'T HAVE DATA
        const keys = Object.keys(vis.data.stressData)
        if (keys.length === 0) {

            vis.width = vis.chartDiv.clientWidth;
            vis.height = vis.chartDiv.clientHeight;
            vis.MARGIN = { top: 7, right: 40, bottom: 27, left: 40 };
            vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
            vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

            // Use the extracted size to set the size of an SVG element.
            vis.svg.attr('width', vis.width).attr('height', vis.height);

            // SET G
            vis.g
                .attr('width', vis.gWIDTH)
                .attr('height', vis.gHEIGHT)
                .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

            // Y SCALE 
            const y = d3.scaleLinear()
                .range([vis.gHEIGHT, 0])
                .domain([0, 20])
                .nice();

            // X SCALE
            vis.x = d3.scaleBand()
                .domain(['1 yr', '3 yrs', '5 yrs', '10 yrs', '20 yrs'])
                .range([0, vis.gWIDTH])
                .paddingInner(0)
                .paddingOuter(-.40);

            // Y AXIS
            const yAxisCall = d3
                .axisLeft()
                .ticks(5)
                .tickValues([0, 5, 10, 15, 20])
                .tickPadding(15)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickFormat(el => el + '%')

            // const customOffset = window.innerWidth < 1200 ? 42 : 48;
            vis.yAxis
                .attr('transform', `translate(0, ${vis.MARGIN.top})`)
                .transition()
                .duration(500)
                .call(yAxisCall.scale(y));

            // X AXIS /////////////////////////////////////////
            const xAxisCall = d3
                .axisBottom()
                .ticks(5)
                // .tickPadding(window.innerWidth < 1200 ? 2 : window.innerHeight < 770 ? 2 : 4)
                .tickFormat(el => el);

            // POSITION SET ON FIRST DRAW ONLY
            if (vis.draws <= 1) {
                vis.xAxis
                    .attr('transform', `translate(0, ${y(0) + vis.MARGIN.top})`)
            }
            vis.xAxis
                .transition()
                .delay(0)
                .duration(500)
                .attr('opacity', 1)
                .attr('transform', `translate(0, ${y(0) + vis.MARGIN.top})`)
                .call(xAxisCall.scale(vis.x).tickSizeOuter([0]));


            vis.textDiv
                .style('width', vis.gWIDTH + 'px')
                .style('height', vis.gHEIGHT + 'px')
                .style('top', vis.MARGIN.top + 'px')
                .style('left', vis.MARGIN.left + 'px')
                .html(`
                            Fund originated in ${new Date(vis.data.inception).getFullYear()}.<br>
                            No returns are available for time frame.
                        `)
            return
        }
    }

    redraw(fundClass = this.fundClass, redraw = '') {
        const vis = this;
        vis.draws++;
        vis.fundClass = fundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA;
            document.getElementById('stress-test-fund-name-a').style.opacity = 1;
            document.getElementById('stress-test-fund-name-f2').style.opacity = 0;
        }
        else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2;
            document.getElementById('stress-test-fund-name-a').style.opacity = 0;
            document.getElementById('stress-test-fund-name-f2').style.opacity = 1;
        }

        // Extract the width and height that was computed by CSS.
        vis.width = vis.chartDiv.clientWidth;
        vis.height = vis.chartDiv.clientHeight;
        vis.MARGIN = { top: 7, right: 40, bottom: 27, left: 40 };
        vis.gWIDTH = vis.width - (vis.MARGIN.left + vis.MARGIN.right);
        vis.gHEIGHT = vis.height - (vis.MARGIN.top + vis.MARGIN.bottom);

        // Use the extracted size to set the size of an SVG element.
        vis.svg.attr('width', vis.width).attr('height', vis.height);

        // SET G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', 'translate(' + vis.MARGIN.left + ',' + vis.MARGIN.top + ')');

        // Y SCALE 
        const y = d3.scaleLinear()
            .range([vis.gHEIGHT, 0])
            .domain([0, 20])
            .nice();

        // X SCALE
        vis.x = d3.scaleBand()
            .domain(['1 yr', '3 yrs', '5 yrs', '10 yrs', '20 yrs'])
            .range([0, vis.gWIDTH])
            .paddingInner(0)
            .paddingOuter(-.40);

        // Y AXIS
        const yAxisCall = d3
            .axisLeft()
            .ticks(5)
            .tickValues([0, 5, 10, 15, 20])
            .tickPadding(15)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat(el => el + '%')

        // const customOffset = window.innerWidth < 1200 ? 42 : 48;
        vis.yAxis
            .transition()
            .duration(500)
            .call(yAxisCall.scale(y));

        // X AXIS /////////////////////////////////////////
        const xAxisCall = d3
            .axisBottom()
            .ticks(5)
            // .tickPadding(window.innerWidth < 1200 ? 2 : window.innerHeight < 770 ? 2 : 4)
            .tickFormat(el => el);

        // POSITION SET ON FIRST DRAW ONLY
        if (vis.draws <= 1) {
            vis.xAxis
                .attr('transform', `translate(0, ${y(0)})`)
        }
        vis.xAxis
            .transition()
            .delay(0)
            .duration(500)
            .attr('opacity', 1)
            .attr('transform', `translate(0, ${y(0)})`)
            .call(xAxisCall.scale(vis.x).tickSizeOuter([0]));

        // HANDLE THE CASE WHERE WE DON'T HAVE DATA
        const keys = Object.keys(vis.data.stressData)
        if (keys.length === 0) {
            vis.textDiv
                .style('width', vis.gWIDTH + 'px')
                .style('height', vis.gHEIGHT + 'px')
                .style('top', vis.MARGIN.top + 'px')
                .style('left', vis.MARGIN.left + 'px')
                .html(`
                    Fund originated in ${new Date(vis.data.inception).getFullYear()}.<br>
                    No returns are available for time frame.
                `)
            return
        }

        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        // FORMAT DATA
        const lineData = [];
        const values = []
        keys.forEach((key, i) => {
            if (key > 20) return
            const suffix = i === 0 ? 'yr' : 'yrs'
            lineData.push({ name: key + " " + suffix, value: vis.data.stressData[key].fundReturn, index: vis.data.stressData[key].index });
            values.push(vis.data.stressData[key].fund)
            values.push(vis.data.stressData[key].index)
        })

        console.log('StressTest', lineData)

        let yMax = 20;
        if (yMax < d3.max(values) + 5)
            yMax = d3.max(values) + 5;

        let tickValues = []
        for (let i = 0; i <= yMax; i += 5) {
            tickValues.push(i)
        }

        y.domain([0, yMax])

        vis.x.domain(lineData.map(d => d.name))

        vis.xAxis
            .transition()
            .delay(0)
            .duration(500)
            .attr('opacity', 1)
            .call(xAxisCall.scale(vis.x).tickSizeOuter([0]));

        const yAxisCall2 = d3
            .axisLeft()
            .ticks(5)
            .tickValues(tickValues)
            .tickPadding(15)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickFormat(el => el + '%')

        vis.yAxis
            .attr('opacity', redraw === 'redraw' ? 1 : 0)
            .transition()
            .duration(redraw === 'redraw' ? 500 : 1500)
            .call(yAxisCall2.scale(y))
            .attr('opacity', 1);

        // LINE FUNCTION
        const line = d3
            .line()
            .x(d => vis.x(d.name)) // set the x values for the line generator
            .y(d => y(d.value)); // set the y values for the line generator

        // LINE FUNCTION
        const line2 = d3
            .line()
            .x(d => vis.x(d.name)) // set the x values for the line generator
            .y(d => y(d.index)); // set the y values for the line generator

        const flatLine = d3
            .area()
            .x(d => vis.x(d.name)) // set the x values for the line generator
            .y(y(0))

        // Redraws Line/update our line path
        if (vis.draws === 1) {
            vis.fundLine
                .attr('transform', `translate(${vis.x.bandwidth() / 2}, 0)`)
                .attr('stroke', vis.color)
                .attr('d', flatLine(lineData))
                .attr('opacity', 0)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .transition()
                .duration(1200)
                .attr('d', line(lineData));

            vis.indexLine
                .attr('transform', `translate(${vis.x.bandwidth() / 2}, 0)`)
                .attr('d', flatLine(lineData))
                .attr('opacity', 0)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .transition()
                .duration(1200)
                .attr('d', line2(lineData));
        } else {
            vis.fundLine
                .attr('opacity', redraw === 'redraw' ? 1 : 0)
                .transition()
                .duration(redraw === 'redraw' ? 0 : 200)
                .attr('opacity', 1)
                .transition()
                .duration(redraw === 'redraw' ? 500 : 1200)
                .attr('d', line(lineData));
            vis.indexLine
                .attr('opacity', redraw === 'redraw' ? 1 : 0)
                .transition()
                .duration(redraw === 'redraw' ? 0 : 200)
                .attr('opacity', 1)
                .transition()
                .duration(redraw === 'redraw' ? 500 : 1200)
                .attr('d', line2(lineData));
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(tickValues.length)
        }

        // add the Y gridlines
        vis.gridlines
            .transition()
            .duration(500)
            .call(make_y_gridlines()
                .tickSize(-vis.gWIDTH)
                .tickFormat("")
            )

        ////////////set index text
        vis.setSTindexName();

    } // END REDRAW

    setSTindexName() {
        const vis = this;
        const indexPrimaryName = document.getElementById('st-index-name');

        if (vis.data.id === 'EUPAC') {
            indexPrimaryName.innerText = 'MSCI ACWI ex US';
        } else if (vis.data.id === 'SCWF') {
            indexPrimaryName.innerText = 'MSCI ACWI Small Cap';
        }
        else if (vis.data.id === 'IGI') {
            indexPrimaryName.innerText = 'MSCI ACWI ex US';
        }
        else if (vis.data.id === 'AMBAL') {
            indexPrimaryName.innerText = '60%/40% S&P 500 BBG US Agg';
        }
        else if (vis.data.id === 'GBAL') {
            indexPrimaryName.innerText = '60%/40% MSCI ACWI BBG Global Agg'
        }
        else if (vis.data.id === 'CIB') {
            indexPrimaryName.innerText = '70%/30% MSCI ACWI BBG U.S. Agg'
        }
        else if (vis.data.id === 'IFA') {
            indexPrimaryName.innerText = '65%/35% S&P 500 BBG US Agg'
        }
        else {

            if (vis.data.indexPrimaryAbbr) {
                indexPrimaryName.innerText = vis.data.indexPrimaryAbbr;
            } else {
                indexPrimaryName.innerText = 'not found'
            }
        }
    }

}

// HANDLES CLICKED PIE ROWS
function handleClick() {
    currentYear = this.id.split('-')[2];
    stressTestPie.redraw(currentFundClass, 'update', currentYear)

    document.querySelectorAll('.st-pie-grid-row').forEach(el => el.style.opacity = .2)
    document.getElementById(this.id).style.opacity = 1;
}