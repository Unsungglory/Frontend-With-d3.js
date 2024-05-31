// SLIDER (currency VS top countries)
const toggleSlider3 = () => {
    const slider = document.getElementById('slider-3');

    if (!slider.getAttribute('currency') || slider.getAttribute('currency') === 'false') {
        showCountriesSection();
    } else {
        showCurrency();
    }
}

function showCurrency() {
    const slider = document.getElementById('slider-3');

    document.querySelector('#pill-toggle3').style.left = 0;
    document.getElementById('ft-toggle-left3').style.color = 'rgba(0, 41, 75, 1)';
    document.getElementById('ft-toggle-right3').style.color = 'rgba(127, 127, 127, 1)';
    isCurrency = true;
    slider.setAttribute('currency', false)

    document.getElementById('bond-geo-currency-section').style.opacity = 1;
    document.getElementById('bond-geo-currency-section').style.pointerEvents = 'all';

    document.getElementById('bond-geo-countries-section').style.opacity = 0;
    document.getElementById('bond-geo-countries-section').style.pointerEvents = 'none';

    // REANIMATE
    bondGeoPie = new BondGeoPie(currentFundData, currentFundClass);
}

function showCountriesSection() {
    const slider = document.getElementById('slider-3');

    document.querySelector('#pill-toggle3').style.left = '50%';
    document.getElementById('ft-toggle-left3').style.color = 'rgba(127, 127, 127, 1)';
    document.getElementById('ft-toggle-right3').style.color = 'rgba(0, 41, 75, 1)';
    isCurrency = false;
    slider.setAttribute('currency', true);

    document.getElementById('bond-geo-countries-section').style.opacity = 1;
    document.getElementById('bond-geo-countries-section').style.pointerEvents = 'all';

    document.getElementById('bond-geo-currency-section').style.opacity = 0;
    document.getElementById('bond-geo-currency-section').style.pointerEvents = 'none';

    // // REANIMATE
    bondGeoMap = new BondGeoMap(currentFundData, currentFundClass);
}

// *************************************************************** //
// ********************** DRAW PIE CHART *********************** //
// *********************************************************** //
const EU = 'rgba(0, 156, 220, 1)';
const YEN = 'rgba(102, 194, 236, 1)';
const POUND = 'rgba(124, 135, 142, 1)';
const PESO = 'rgba(204, 204, 204, 1)';
const OTHER = 'rgba(242, 185, 0, 1)';
const DOLLAR = 'rgba(247, 213, 102, 1)';
const c7 = '#554742';
const c8 = 'rgba(205, 245, 0, 1)';
const c9 = 'rgba(245, 5, 0, 1)';
const c10 = 'rgba(245, 105, 0, 1)';
const c11 = 'rgba(20, 100, 200, 1)';

// ***************** SCALES ******************** //
const BONDGEOCOLORS = [EU, YEN, POUND, PESO, OTHER, DOLLAR, c7, c8, c9, c10, c11];

class BondGeoPie {
    constructor(data, fundClass) {
        const vis = this;
        vis.name = data.a.name;
        vis.id = data.a.id;
        vis.dataA = data.a.geoData;
        vis.dataF2 = data.f2.geoData;
        if (data.r6)
            vis.dataR6 = data.r6.geoData;
        else vis.dataR6 = null;

        vis.objective = data.a.objective;
        vis.draws = 0;
        vis.fundClass = fundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
        } else if (vis.fundClass === 'r6') {
            vis.data = vis.dataR6
        }

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-geo-pie-svg')) document.getElementById('bond-geo-pie-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-geo-pie-chart`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-geo-pie-svg`).attr("id", 'bond-geo-pie-svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND PIE WEDGES
        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND POLYLINES
        vis.lines = vis.g.append("g").attr("class", "lines");

        // APPEND PI LABLES
        vis.textLables = vis.g.append("g").attr("class", "bond-geo-text-labels");

        // DIVS

        // REMOVE DIVS IF NECESSARY
        document.querySelectorAll('.currency-div').forEach(el => el.remove())

        // AND APPEND DIVS
        if (vis.data.currency.data.length) {
            vis.data.currency.data.forEach((d, i) => {
                d3.select(vis.chartDiv).append('div')
                    .attr('id', `currency-div-${i}`)
                    .attr('class', 'currency-div')
                    .style('text-align', 'center')
                    .style('text-anchor', 'middle')
                    .style('position', 'absolute')
            })
        }

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {

        const vis = this;
        vis.centroidsX = [];
        vis.centroidsY = [];
        vis.draws++;
        vis.fundClass = currentFundClass

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
        } else if (vis.fundClass === 'r6') {
            vis.data = vis.dataR6
        }

        // IF CURRENCY DATA NOT AVAILABLE WE DON'T SHOW THAT SECTION
        if (vis.data.currency.data.length === 0) {
            showCountriesSection();

            // HIDE SELECTION SLIDER
            document.getElementById('slider-3').style.opacity = 0;
            document.getElementById('slider-3').style.pointerEvents = 'none';

            return;
        }

        // SHOW SELECTION SLIDER
        document.getElementById('slider-3').style.opacity = 1;
        document.getElementById('slider-3').style.pointerEvents = 'all';

        const outerWidth = window.innerWidth < 1400 ? .31 : .36; // for donut wedges
        const innerWidth = .09; // for donut wedges
        const outerBig = outerWidth * 1.13; // for poly line

        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: window.innerWidth < 1100 ? 60 : window.innerWidth < 1400 && window.innerHeight < 777 ? 40 : window.innerWidth < 1400 ? 20 : 0 };

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
        const rotateVal = vis.name.startsWith('The Bond Fund') ? 1.6 : 1.89;
        const pieGenerator = d3
            .pie()
            .padAngle(0.02)
            .startAngle(0 * Math.PI - rotateVal)
            .endAngle(2 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                return null;
                // console.log(a, b)
                // return a - b;
                // return a.orderVal.localeCompare(b.orderVal)
            });

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)



        const arcDataFiltered = pieGenerator(vis.data.currency.data.filter(d => d.value !== 0)); // dont include wedges that are zero
        const arcData = pieGenerator(vis.data.currency.data);

        const bondGeoKeys = arcData.map(d => d.data.name);
        // color scale
        vis.bondGeoColorScale = d3
            .scaleOrdinal()
            .domain(bondGeoKeys)
            .range(BONDGEOCOLORS);

        vis.updateText();

        // JOIN DONUT SLICES
        let donutVis = vis.slices.selectAll('path')
            .data(arcDataFiltered);
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
            .attr('fill', (d, i) => vis.bondGeoColorScale(d.data.name))
            .attrTween('d', arcTween)

        // ENTER
        if (vis.draws === 1) {
            donutVis
                .enter()
                .append('path')
                .attr('class', 'bond-geo-slice')
                .attr('id', (d, i) => `bond-geo-slice-${bondGeoKeys.indexOf(d.data.name)}`)
                .attr('fill', (d, i) => vis.bondGeoColorScale(d.data.name))
                .style('opacity', 0)
                .transition()
                // .delay((d, i) => i + 50)
                .duration(0)
                .attrTween('d', d => {
                    let i = d3.interpolate(d.startAngle, d.endAngle);
                    return t => {
                        d.endAngle = i(t);
                        return arc(d)
                    }
                })
                .style('opacity', 1)
                // .transition()
                // .delay(810)
                .attrTween('d', arcTween) // THIS GETS READY FOR THE UPDATE TWEEN

        } else {
            donutVis
                .enter()
                .append('path')
                .style('opacity', 0)
                .transition()
                .duration(0)
                .attr('fill', (d, i) => vis.bondGeoColorScale(d.data.name))
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
            let i = d3.interpolate(this._current, d);
            this._current = i(0);
            return t => {
                return arc(i(t));
            };
        }

        // ********************************888
        // MOUSE EVENTS FOR SLICES
        const numberOfSlices = arcData.length;
        let clicked = [0, 0, 0, 0, 0, 0];
        const slices = document.querySelectorAll('.bond-geo-slice')
        slices.forEach(el => {
            el.addEventListener('mouseover', handleHover);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        });

        // APPLY LISTENERS FOR RIGHT GRID ELEMENTS
        document.querySelectorAll(`.bond-geo-row-grid`).forEach(el => {
            el.addEventListener('mouseover', dimSlices);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        })

        // APPLY LISTENERS FOR DONUT LABELS OUTSIDE OF THE DONUT
        document.querySelectorAll('.currency-div').forEach(el => {
            el.addEventListener('mouseover', dimSlices);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        })

        // HOVER OVER PIE SLICE
        function handleHover() {
            if (!clicked.includes(1)) {

                const currentSlice = this.id.slice(-1)
                for (let i = 0; i < numberOfSlices; i++) {

                    if (document.getElementById(`bond-geo-slice-${i}`)) {
                        if (document.getElementById(`bond-geo-slice-${i}`).id.slice(-1) !== currentSlice) {
                            darkenPieSegment(i)
                        } else {
                            brightenPieSegment(i)
                        }
                    } else {
                        darkenPieSegment(i)
                    }
                }
            }
        }

        function darkenPieSegment(i) {

            // TEXT
            if (document.getElementById(`currency-div-${i}`)) {
                document.getElementById(`currency-div-${i}`).classList.add('slice-trans');
                document.getElementById(`currency-div-${i}`).style.opacity = .5; // PIE SLICE
            }

            if (document.getElementById(`bond-geo-slice-${i}`)) {
                document.getElementById(`bond-geo-slice-${i}`).classList.add('slice-trans');
                document.getElementById(`bond-geo-slice-${i}`).style.opacity = .5; // PIE SLICE
            }

            // POLYLINES
            if (document.getElementById(`bond-geo-polyline-${i}`)) {
                if (Number(document.getElementById(`bond-geo-polyline-${i}`).style.opacity) > 0) {
                    document.getElementById(`bond-geo-polyline-${i}`).classList.add('slice-trans'); // lines
                    document.getElementById(`bond-geo-polyline-${i}`).style.opacity = .5; // lines
                }
            }

            // ROWS IN THE GRID/TABLE
            if (document.getElementById(`bond-geo-row-${i}`))
                document.getElementById(`bond-geo-row-${i}`).style.opacity = .5;

        }

        function brightenPieSegment(i) {

            // TEXT
            if (document.getElementById(`currency-div-${i}`)) {
                document.getElementById(`currency-div-${i}`).style.opacity = 1;
            }

            if (document.getElementById(`bond-geo-slice-${i}`)) {
                document.getElementById(`bond-geo-slice-${i}`).style.opacity = 1;
            }

            if (document.getElementById(`bond-geo-polyline-${i}`)) {
                Number(document.getElementById(`bond-geo-polyline-${i}`).style.opacity) > 0 ? document.getElementById(`bond-geo-polyline-${i}`).style.opacity = 1 : null; // lines
            }

            // ROWS IN THE GRID/TABLE
            if (document.getElementById(`bond-geo-row-${i}`))
                document.getElementById(`bond-geo-row-${i}`).style.opacity = 1;
        }

        // LEAVE PIE SLICE, RESOTRE ELEMENTS
        function handleOut() {
            if (!clicked.includes(1)) {
                for (let i = 0; i < numberOfSlices; i++) {
                    brightenPieSegment(i);
                }
            }
        }

        // HANDLE CLICK FOR PIE SLICES AND GRID ELEMENTS
        function handleClick() {
            const currentEl = this;
            let clickedIndex = null;

            // get the ID of whatever was clicked
            clickedIndex = currentEl.id.slice(-1);

            if (clicked.includes(1)) {
                if (clicked[clickedIndex] === 1) {
                    // ALREADY CLICKED ELEMENT CLICKED AGAIN (SO TURN EVERYTHING BACK ON)
                    clicked = [0, 0, 0, 0, 0, 0]
                    handleOut(); // TURN ON PIE ELEMENTS
                } else {
                    // ELEMENTS ALREADY DIMMED, NOW DIFFERENT ELEMENT CLICKED
                    clicked = [0, 0, 0, 0, 0, 0]
                    clicked[clickedIndex] = 1;
                    updateAll(clickedIndex);
                }
            } else {
                // NO ELEMENTS WERE CLICKED IN THE FIRST PLACE
                clicked = [0, 0, 0, 0, 0, 0]
                clicked[clickedIndex] = 1;
                updateAll(clickedIndex);
            }
        }

        // CALLED ON MOUSEOVER GRID ELEMENT
        function dimSlices() {
            const id = this.id.slice(-1)
            if (!clicked.includes(1)) {
                updateAll(id);
            }
        }

        function updateAll(id) {
            for (let i = 0; i < numberOfSlices; i++) {
                if (i == id) {
                    brightenPieSegment(i)
                } else {
                    darkenPieSegment(i)
                };
            }
        }

        // REMOVE TRANSITIONS FROM PIE ELEMENTS
        document.getElementById('subnav').addEventListener('mouseenter', removeClasses)
        function removeClasses() {
            for (let i = 0; i < numberOfSlices; i++) {
                if (document.getElementById(`bond-geo-slice-${i}`)) {
                    document.getElementById(`bond-geo-slice-${i}`).classList.remove('slice-trans') // pie slices
                }
                if (document.getElementById(`bond-geo-country-${i}`)) {
                    document.getElementById(`bond-geo-country-${i}`).classList.remove('slice-trans'); // LINE 1 LABEL
                }
                if (document.getElementById(`bond-geo-line-2-${i}`)) {
                    document.getElementById(`bond-geo-line-2-${i}`).classList.remove('slice-trans'); // LINE 2 LABEL
                }
                if (document.getElementById(`bond-geo-polyline-${i}`)) {
                    document.getElementById(`bond-geo-polyline-${i}`).classList.remove('slice-trans'); // lines
                }
                if (document.getElementById(`bond-geo-percent-${i}`)) {
                    document.getElementById(`bond-geo-percent-${i}`).classList.remove('slice-trans'); // BIG NUMBERS
                }
                if (document.getElementById(`bond-geo-percent-sign-${i}`)) {
                    document.getElementById(`bond-geo-percent-sign-${i}`).classList.remove('slice-trans'); // PERCENT SIGNS
                }
            }
        }

        /////////////////////////////////////////
        const outerArc = d3.arc()
            .outerRadius(RADIUS * outerBig)
            .innerRadius(RADIUS * outerBig)

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SETTING INNER HTML ON TEXT DIVS, AND POSITION
        let yPositionOffset = 0;

        vis.data.currency.data.forEach((d, i) => {
            if (d.value === 0) {
                const currentElement = document.getElementById(`currency-div-${i}`);
                currentElement.style.display = 'none';

                // } else if ((d.value).toFixed(2) <= 10 && (arcDataFiltered[i] && d.name === arcDataFiltered[i].data.name)) {
            } else if ((d.value).toFixed(2) <= 10) {

                const currentElement = document.getElementById(`currency-div-${i}`);

                const xPosition = window.innerWidth < 1100 ? 0 : window.innerWidth < 1400 && window.innerHeight < 777 ? -30 : window.innerWidth < 1400 ? -55 : -30;
                const yStartingPosition = window.innerWidth < 1100 ? 280 : window.innerWidth < 1400 && window.innerHeight < 777 ? 345 : 420;
                const yOffset = window.innerWidth < 1100 ? 48 : 66;

                currentElement.style.display = 'block';
                currentElement.style.left = xPosition + 'px';
                currentElement.style.top = yStartingPosition - yPositionOffset * yOffset + 'px';
                currentElement.style.width = window.innerWidth < 1100 ? '90px' : '200px'

                currentElement.innerHTML = `
                    <div class='pi-text holdings-text' style='color: black;'>${(d.value).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span></div>
                    <div class='pi-text-labs holdings-text' style='color: black;'>${d.name}</div>
                `

                // // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                // currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                // currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';
            } else {
                // ELSE THIS IS FOR POSITIONING INSIDE OF SLICES
                const cords = arc.centroid(arcData[i])

                const currentElement = document.getElementById(`currency-div-${i}`);

                currentElement.style.display = 'block';
                currentElement.style.left = vis.gWIDTH / 2 + cords[0] + 'px';
                currentElement.style.top = vis.gHEIGHT / 2 + cords[1] + 'px';
                currentElement.style.width = window.innerWidth < 1100 ? '62px' : window.innerWidth < 1400 && window.innerHeight < 777 ? '77px' : '100px';
                currentElement.style.pointerEvents = 'none';
                currentElement.style.transform = `translate(${vis.MARGIN.left}px, 0)`;

                // THIS BACKGROUND IS DARK, SO WE NEED A WHITE FONT
                const fontColor = i === 6 ? 'white' : 'black';
                currentElement.innerHTML = `
                    <div class='pi-text holdings-text' style='color: ${fontColor};'>${(d.value).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span></div>
                    <div class='pi-text-labs holdings-text' style='color: ${fontColor};'>${d.name}</div>
                `

                // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';
            }

            if (d.value !== 0) {
                yPositionOffset++
            }
        })

        /* ------- SLICE TO TEXT POLYLINES -------*/
        const names = arcData.map(d => d.data.name);

        /////
        const closePoint = d3.arc()
            .outerRadius(RADIUS * outerWidth * 1.03)
            .innerRadius(RADIUS * outerWidth * 1.03)

        /////
        const farPoint = d3.arc()
            .outerRadius(RADIUS * outerBig * .96)
            .innerRadius(RADIUS * outerBig * .96)

        // JOIN
        let polyline = vis.g.select(".lines").selectAll("polyline")
            .data(arcDataFiltered, d => d.data.name);

        // EXIT
        polyline.exit().remove();

        // UPDATE
        polyline
            .transition()
            .duration(20)
            .style('opacity', d => d.value === 0 ? 0 : d.value >= 10 ? 0 : 1)
            .transition()
            .duration(480)
            .attrTween("points", drawLines);

        // ENTER
        polyline.enter()
            .append("polyline")
            .attr('id', (d, i) => `bond-geo-polyline-${names.indexOf(d.data.name)}`)
            .transition()
            .style('stroke', (d, i) => vis.bondGeoColorScale(d.data.name))
            .attrTween("points", drawLines)
            .style('opacity', 0)
            // .transition()
            // .duration(1000)
            .style('opacity', d => d.value === 0 ? 0 : d.value >= 10 ? 0 : 1)

        ///////////////////////// DRAWING POLYLINES
        function drawLines(d, i) {
            this._current = this._current || d;
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);

            return function (t) {
                const d2 = interpolate(t);

                const xPosition = window.innerWidth < 1400 && window.innerHeight < 777 ? -.57 : window.innerWidth < 1400 ? -.43 : -0.52;
                const yInitialPosition = window.innerWidth < 1100 ? 86 : window.innerWidth < 1400 ? 100 : 80;
                const yOffset = window.innerWidth < 1100 ? 44 : 59;

                const finalPoint = outerArc.centroid(d2);
                finalPoint[0] = RADIUS * xPosition;
                finalPoint[1] = yInitialPosition - i * yOffset;

                return [closePoint.centroid(d2), farPoint.centroid(d2), finalPoint];
                // return [closePoint.centroid(d2), finalPoint];
            };
        }
    } // END REDRAW

    updateText() {
        const vis = this;

        // UPDATE DATE
        document.getElementById('bond-geo-date').innerText = 'As of ' + vis.data.currency.date;
        document.getElementById('bond-geo-date-alt').innerText = 'As of ' + vis.data.currency.date;

        // UPDATE FOOTNOTE
        // if (vis.id === 'SBF') {
        //     document.getElementById('bond-geo-sup').innerText = 7;
        // } else {
        //     document.getElementById('bond-geo-sup').innerText = 7;
        // }

        if (!vis.differentData(vis.data.currency.data, vis.currency)) {

            // REMOVE PREVIOUS
            document.querySelectorAll('.bond-geo-row-grid').forEach(el => el.remove());

            const appendTo = document.getElementById('bond-geo-info-container');

            // CREATE TEXT ELEMENTS
            vis.data.currency.data.forEach((d, i) => {
                const newDiv = document.createElement('div');
                newDiv.id = `bond-geo-row-${i}`;
                newDiv.classList = `bond-geo-row-grid`;

                newDiv.style.transition = 'none';
                newDiv.style.opacity = 0;

                newDiv.innerText = d.value.toFixed(2) + '%';

                newDiv.innerHTML = `
                    <div class='geo-grid-dot' style='background-color: ${vis.bondGeoColorScale(d.name)}'></div>
                    <div class='geo-text'>${d.name}</div>
                    <div class='geo-number'>
                    <div class='text-layers'>
                        <div id='bond-geo-fund-0' class='bond-geo-reg bold' style='opacity: 1;'>${d.value.toFixed(2)}%</div>
                        <div id='bond-geo-fund-0-alt' class='bond-geo-alt bold'>${d.value.toFixed(2)}%</div>
                    </div>
                    </div>
                `

                // APPEND
                appendTo.append(newDiv)
            });

            // SHOW NEW ELEMENTS
            document.querySelectorAll('.bond-geo-row-grid').forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity .4s ease-in-out';
                    el.style.opacity = 1;
                }, i * 99);
            })
        }

        vis.currency = vis.data.currency.data;
    }

    differentData(d1, d2) {
        if (d1 === null || d2 === null || d1 === undefined || d2 === undefined) return 0;

        const vals = [];

        d1.forEach((el, i) => {
            vals.push(el.name === d2[i].name)
            vals.push(el.value === d2[i].value)
        })

        return vals.includes(false) ? 0 : 1;
    }
}

// USED TO TRANSLATE COUNTRY NAMES 
let nameMap = []
names.forEach(n => {
    nameMap[n.name] = n.value;
})

const epsilon = 0.000001;

class BondGeoMap {
    constructor(data, fundClass) {
        const vis = this;

        vis.dataA = data.a.geoData;
        vis.dataF2 = data.f2.geoData;
        if (data.r6)
            vis.dataR6 = data.r6.geoData;
        else vis.dataR6 = null;


        vis.objective = data.a.objective;
        vis.draws = 0;
        vis.fundClass = fundClass;

        vis.init();
    }

    init() {
        const vis = this;

        ////////////////////////////////////////////////////////////////
        // MAP APPENDS
        //////////////////////////////////////////////////////////////
        vis.chartDivMap = document.getElementById("bond-geo-map");
        // REMOVE IF NECESSARY
        if (document.getElementById('bond-geo-svg-map')) document.getElementById('bond-geo-svg-map').remove();
        vis.svgMap = d3.select(vis.chartDivMap).append("svg").attr('id', 'bond-geo-svg-map');

        vis.land = vis.svgMap.append('g').attr('class', 'land').append('path');
        vis.borders = vis.svgMap.append('g').attr('class', 'borders').append('path');
        vis.states = vis.svgMap.append('g').attr('class', 'grey-states');
        vis.countries = vis.svgMap.append('g').attr('class', 'filled-countries');

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {

        const vis = this;
        vis.draws++;
        vis.fundClass = currentFundClass

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
        } else if (vis.fundClass === 'r6') {
            vis.data = vis.dataR6;
        }

        vis.updateMapText();

        setTimeout(() => {

            // Extract the width and height that was computed by CSS.
            const width = vis.chartDivMap.clientWidth
            const height = vis.chartDivMap.clientHeight;

            vis.MARGIN = { top: 0, right: 30, bottom: 0, left: 30 };

            vis.gWIDTH = width - (vis.MARGIN.left + vis.MARGIN.right);
            vis.gHEIGHT = height - (vis.MARGIN.top + vis.MARGIN.bottom);

            // Use the extracted size to set the size of an SVG element.
            vis.svgMap
                .attr('width', vis.gWIDTH)
                .attr('height', vis.gHEIGHT)
                .attr('transform', `translate(${vis.MARGIN.left}, ${vis.MARGIN.top})`);

            // INTERNATIONAL MAP IS FOR TAXABLE BOND
            if (vis.objective.toLowerCase() === 'taxable bond') {

                // params
                const scale = window.innerWidth < 1100 ? 88 : window.innerWidth < 1400 && window.innerHeight < 777 ? 114 : window.innerWidth < 1400 ? 120 : 160;
                const xPos = window.innerWidth < 1100 ? width * .43 : window.innerWidth < 1400 && window.innerHeight < 777 ? width * .44 : window.innerWidth < 1400 ? width * .45 : width * .46;
                const yPos = window.innerWidth < 1100 ? height * .68 : window.innerWidth < 1400 && window.innerHeight < 777 ? height * .69 : window.innerWidth < 1400 ? height * .72 : height * .7;

                // map geoMercator()
                const projection = d3.geoMercator()
                    .scale(scale)
                    .translate([xPos, yPos])
                    .precision(.1);

                const path = d3.geoPath()
                    .projection(projection);

                // REMOVE COUNTRIES IF NECESSARY
                const previousCountries = document.querySelectorAll('.appended-countries');

                setTimeout(() => {

                    vis.data.geography.data.forEach((el, i) => {

                        if (i < 10) {

                            const countryName = el.name.toLowerCase() === 'korea, republic of' ? 'South Korea'
                                : el.name.toLowerCase() === 'russian federation' ? 'Russia' : el.name;

                            const country = countries.features.filter(d => {
                                return d.properties.name == nameMap[countryName];
                            });

                            vis.countries
                                .append('path')
                                .attr('class', 'appended-countries')
                                .attr('id', `${i}-${countryName.toLowerCase().replace(' ', '-')}`)
                                .data(country)
                                .attr("d", path)
                                .attr('stroke', 'white')
                                .attr('stroke-width', 1);

                            if (country.length === 0) console.warn('did not find:', countryName)
                        }
                    })

                    // function showAllCountries() {
                    //     countries.features.forEach((country, i) => {
                    //         vis.countries
                    //             .append('path')
                    //             .attr('class', 'appended-countries')
                    //             .attr('id', `${i}-${country.properties.name.toLowerCase().replace(' ', '-')}`)
                    //             .data(countries.features.filter(d => {
                    //                 return d.properties.name == country.properties.name;
                    //             }))
                    //             .attr("d", path)
                    //             .attr('stroke', 'white')
                    //             .attr('stroke-width', 1);
                    //     })
                    // }

                    // DRAW COUNTRIES
                    vis.land
                        .datum(topojson.feature(world, world.objects.land))
                        .attr("d", path);

                    // DRAW BORDERS
                    vis.borders
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
                        .attr("d", path);

                    // FADE IN MAP
                    document.getElementById('bond-geo-svg-map').style.opacity = 1;
                }, 200);

                document.getElementById('geo-map-title').innerText = 'Top countries';

                // REMOVE OLD
                previousCountries.forEach(country => {
                    setTimeout(() => {
                        country.remove();
                    }, 200);
                })

            }
            else {
                // DOMESTIC

                // params
                const scale = window.innerWidth < 1100 ? 675 : window.innerWidth < 1400 && window.innerHeight < 777 ? 790 : window.innerWidth < 1400 ? 800 : 1000;
                const xPos = window.innerWidth < 1100 ? width * .43 : window.innerWidth < 1400 && window.innerHeight < 777 ? width * .46 : window.innerWidth < 1400 ? width * .46 : width * .46;
                const yPos = window.innerWidth < 1100 ? height * .45 : window.innerWidth < 1400 && window.innerHeight < 777 ? height * .45 : window.innerWidth < 1400 ? height * .48 : height * .45;

                // map geoMercator()
                const projection = geoAlbersUsaPr().scale(scale).translate([xPos, yPos])

                // D3 Projection
                // const projection = d3.geoAlbersUsa()
                //     .translate([width / 2, height / 2])    // translate to center of screen
                //     .scale([1000]);          // scale things down so see entire US

                const path = d3.geoPath()
                    .projection(projection);

                // REMOVE STATES IF NECESSARY
                document.querySelectorAll('.appended-countries').forEach(el => el.remove())
                document.querySelectorAll('.appended-state').forEach(el => el.remove())

                setTimeout(() => {
                    // ALL STATES
                    states.features.forEach((feature, i) => {

                        vis.states
                            .append('path')
                            .attr('class', 'appended-state')
                            .attr('id', `${feature.properties.name.toLowerCase().replace(' ', '-')}-grey`)
                            .data([feature])
                            .attr("d", path)
                            .attr('fill', 'rgba(204, 204, 204, 1)')
                            .attr('stroke', 'white')
                            .attr('stroke-width', 1);

                    })

                    // HIGHLIGHTED STATES
                    if (vis.data.geography.data) {

                        vis.data.geography.data.forEach((el, i) => {
                            if (i < 10) {

                                const state = states.features.filter(d => {
                                    return d.properties.name == el.name;
                                });

                                if (state.length === 0) console.log('did not find:', el.name)

                                vis.countries
                                    .append('path')
                                    .attr('class', 'appended-countries')
                                    .attr('id', `${i}-${el.name.toLowerCase().replace(' ', '-')}`)
                                    .data(state)
                                    .attr("d", path)
                                    .attr('stroke', 'white')
                                    .attr('stroke-width', 1);
                            }
                        })
                    }

                    // DRAW STATES (only states in the stripped down usMap.js file)
                    vis.land
                        .datum(topojson.feature(us, us.objects.states))
                        .attr("d", path);

                    // // DRAW STATE BORDERS
                    // vis.borders
                    //     .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                    //     .attr("d", path);


                    // FADE IN MAP
                    document.getElementById('bond-geo-svg-map').style.opacity = 1;

                }, 200);

                // UPDATE TEXT TITLE
                document.getElementById('geo-map-title').innerText = 'Top states'
            }
        }, 200);

        // const foundState = us.objects.states.geometries.find(state => state.properties.name === 'United States Virgin Islands');
        // const arcNumbs = [];
        // foundState.arcs.forEach(arc => {
        //     arc.forEach(ar => arcNumbs.push(ar))
        // })

        // const actualArcs = []
        // arcNumbs.forEach(d => {
        //     if (d.length > 1) {
        //         d.forEach(el => actualArcs.push(us.arcs[el]))
        //     } else {
        //         actualArcs.push(us.arcs[d])
        //     }
        // })
        // console.log(JSON.stringify(actualArcs))


    } // END REDRAW

    updateMapText() {
        const vis = this;

        // UPDATE DATE
        document.getElementById('bond-geo-date').innerText = 'As of ' + vis.data.geography.date;
        document.getElementById('bond-geo-date-alt').innerText = 'As of ' + vis.data.geography.date;


        if (!vis.differentData(vis.data.geography.data, vis.geography)) {
            // REMOVE IF NECESSARY
            document.querySelectorAll('.appended-map-els').forEach(el => el.remove());

            const appendDiv = document.getElementById('bond-geo-map-text');

            // UPDATE TEXT ELEMENTS
            vis.data.geography.data.forEach((d, i) => {
                // TOP TEN COUNTRIES
                if (i < 10) {
                    const val = Number(d.value).toFixed(2) + '%';

                    const newDiv = document.createElement('div');

                    newDiv.id = `bond-geo-map-row-${i}`;
                    newDiv.classList = 'bond-geo-map-row-grid appended-map-els';

                    newDiv.innerHTML = `
                        <div class='geo-grid-dot geo-bg-1'></div>
                        <div class='geo-text'>${d.name}</div>
                        <div class='geo-number'>
                          <div class='text-layers'>
                            <div id='bond-geo-map-0' class='bold'>${val}</div>
                          </div>
                        </div>
                        `

                    // APPEND ELEMENTS
                    appendDiv.append(newDiv);
                }
            });

            // SHOW NEW ELEMENTS
            document.querySelectorAll('.appended-map-els').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                }, i * 77 + 400);
            })

        }

        vis.geography = vis.data.geography.data;
    }

    differentData(d1, d2) {
        if (d1 === null || d2 === null || d1 === undefined || d2 === undefined) return 0;

        const vals = [];

        d1.forEach((el, i) => {
            vals.push(el.name === d2[i].name)
            vals.push(el.value === d2[i].value)
        })

        return vals.includes(false) ? 0 : 1;
    }
}

function geoAlbersUsaPr() {
    var cache,
        cacheStream,
        lower48 = d3.geoAlbers(), lower48Point,
        alaska = d3.geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
        alaskaPoint,
        hawaii = d3.geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
        hawaiiPoint,
        puertoRico = d3.geoConicEqualArea().rotate([66, 0]).center([0, 18]).parallels([8, 18]),
        puertoRicoPoint,
        guamMariana = d3.geoConicEqualArea().rotate([-45, 0]).center([0, 16]).parallels([10, 20]),
        guamMarianaPoint,
        americanSamoa = d3.geoConicEqualArea().rotate([70, 0]).center([0, -14]).parallels([-14, 0]),
        americanSamoaPoint,
        point,
        pointStream = { point: function (x, y) { point = [x, y]; } };

    function albersUsa(coordinates) {
        var x = coordinates[0], y = coordinates[1];
        return point = null,
            (lower48Point.point(x, y), point)
            || (alaskaPoint.point(x, y), point)
            || (hawaiiPoint.point(x, y), point)
            || (puertoRicoPoint.point(x, y), point)
            || (guamMarianaPoint.point(x, y), point)
            || (americanSamoaPoint.point(x, y), point);

    }

    albersUsa.invert = function (coordinates) {
        var k = lower48.scale(),
            t = lower48.translate(),
            x = (coordinates[0] - t[0]) / k,
            y = (coordinates[1] - t[1]) / k;
        return (y >= 0.120 && y < 0.234 && x >= -0.225 && x < -0.185 ? alaska
            : y >= 0.166 && y < 0.234 && x >= -0.185 && x < -0.080 ? hawaii
                : y >= 0.204 && y < 0.234 && x >= 0.300 && x < 0.380 ? puertoRico
                    : y >= 0.050 && y < 0.204 && x >= -0.415 && x < - 0.225 ? guamMariana
                        : y >= 0.180 && y < 0.234 && x >= -0.415 && x < -0.225 ? americanSamoa
                            : lower48).invert(coordinates);
    };

    albersUsa.stream = function (stream) {
        return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream), puertoRico.stream(stream), guamMariana.stream(stream), americanSamoa.stream(stream)]);
    };

    albersUsa.precision = function (_) {
        if (!arguments.length) return lower48.precision();
        lower48.precision(_), alaska.precision(_), hawaii.precision(_), puertoRico.precision(_), guamMariana.precision(_), americanSamoa.precision(_);
        return reset();
    };

    albersUsa.scale = function (_) {
        if (!arguments.length) return lower48.scale();
        lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_), puertoRico.scale(_), guamMariana.scale(_), americanSamoa.scale(_);
        return albersUsa.translate(lower48.translate());
    };

    albersUsa.translate = function (_) {
        if (!arguments.length) return lower48.translate();
        var k = lower48.scale(), x = +_[0], y = +_[1];

        lower48Point = lower48
            .translate(_)
            .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
            .stream(pointStream);

        alaskaPoint = alaska
            .translate([x - 0.275 * k, y + 0.201 * k])
            .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.185 * k - epsilon, y + 0.234 * k - epsilon]])
            .stream(pointStream);

        hawaiiPoint = hawaii
            .translate([x - 0.180 * k, y + 0.212 * k])
            .clipExtent([[x - 0.185 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.080 * k - epsilon, y + 0.234 * k - epsilon]])
            .stream(pointStream);

        puertoRicoPoint = puertoRico
            .translate([x + 0.335 * k, y + 0.224 * k])
            .clipExtent([[x + 0.300 * k, y + 0.204 * k], [x + 0.380 * k, y + 0.234 * k]])
            .stream(pointStream).point;

        guamMarianaPoint = guamMariana
            .translate([x - 0.415 * k, y + 0.140 * k])
            .clipExtent([[x - 0.450 * k, y + 0.050 * k], [x - 0.390 * k, y + 0.210 * k]])
            .stream(pointStream).point;

        americanSamoaPoint = americanSamoa
            .translate([x - 0.415 * k, y + 0.215 * k])
            .clipExtent([[x - 0.450 * k, y + 0.210 * k], [x - 0.390 * k, y + 0.234 * k]])
            .stream(pointStream).point;

        return reset();
    };

    function reset() {
        cache = cacheStream = null;
        return albersUsa;
    }

    return albersUsa.scale(1070);
}

function multiplex(streams) {
    const n = streams.length;
    return {
        point(x, y) { for (const s of streams) s.point(x, y); },
        sphere() { for (const s of streams) s.sphere(); },
        lineStart() { for (const s of streams) s.lineStart(); },
        lineEnd() { for (const s of streams) s.lineEnd(); },
        polygonStart() { for (const s of streams) s.polygonStart(); },
        polygonEnd() { for (const s of streams) s.polygonEnd(); }
    };
}