// donutData: {
//     holdings: {
//         asOfDate: '2020-04-01T00:00:00.000Z',
//      data: [
//          { name: 'U.S. Treasury bonds & notes ', value: 0.274 },
//          { name: 'Other bonds & notes ', value: 0.024 },
//          { name: 'Mortgage-backed obligations ', value: 0.333 },
//          { name: 'Corporate bonds & notes ', value: 0.224 },
//          { name: 'Cash & equivalents ', value: 0.062 },
//          { name: 'Asset-backed obligations ', value: 0.083 },
//          ],
//     },
//     issuers: {
//         asOfDate: '3/31/20',
//         data: [
//             { name: 'The City of New York', value: '1.3' },
//             { name: 'State of Illinois', value: '1.1' },
//             { name: 'Metropolitan Transportation Authority', value: '1' },
//             { name: 'New York City Transitional Finance Authority', value: '0.9' },
//             { name: 'Chicago Board of Education', value: '0.9' },
//             { name: 'Santee Cooper', value: '0.8' },
//             { name: 'Pennsylvania Turnpike Commission', value: '0.8' },
//             { name: 'TRINITY HEALTH', value: '0.8' },
//             { name: 'The Illinois State Toll Highway Authority', value: '0.8' },
//         ],
//     },
// },

// data.x.donutData.holdings


// *************************************************************** //
// ********************** DRAW PIE CHART *********************** //
// *********************************************************** //
const USTBONDS = 'rgba(80, 124, 175, 1)';
const CORPBONDS = 'rgba(48, 154, 218, 1)';
const MORTGAGE = 'rgba(116, 193, 232, 1)';
const CASH = 'rgba(208, 234, 248, 1)';
const NONUS = 'rgba(102, 102, 102, 1)';
const OTHERBONDS = 'rgba(178, 178, 178, 1)';
const MUNI = 'rgba(0, 0, 0, 0.9)';
const ASSETBACKED = 'rgba(208, 234, 248, 1)';

// ***************** SCALES ******************** //
const HOLDINGSCOLORS = [USTBONDS, CORPBONDS, MORTGAGE, CASH, NONUS, OTHERBONDS, MUNI, ASSETBACKED];
const HOLDINGSKEYS = [0, 1, 2, 3, 4, 5, 6, 7];
// color scale
const holdingsColorScale = d3
    .scaleOrdinal()
    .domain(HOLDINGSKEYS)
    .range(HOLDINGSCOLORS);

///// CHART 1
class BondHoldings {
    constructor(data, currentFundClass) {
        const vis = this;

        vis.dataA = data.a.donutData;
        vis.dataF2 = data.f2.donutData;
        if (data.r6)
            vis.dataR6 = data.r6.donutData;
        else vis.dataR6 = null;


        vis.draws = 0;
        vis.fundClass = currentFundClass;

        // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
        if (vis.fundClass === 'a') {
            vis.data = vis.dataA
        } else if (vis.fundClass === 'f2') {
            vis.data = vis.dataF2
        } else {
            vis.data = vis.dataR6;
        }

        vis.init();
    }

    init() {
        const vis = this;

        // REMOVE IF NECESSARY
        if (document.getElementById('bond-holdings-svg')) document.getElementById('bond-holdings-svg').remove();

        // MAIN SVG
        vis.chartDiv = document.getElementById(`bond-holdings-chart`);
        vis.svg = d3.select(vis.chartDiv).append('svg').attr('class', `bond-holdings-svg`).attr("id", 'bond-holdings-svg');

        // APPEND G
        vis.g = vis.svg.append('g').attr('class', 'g-class');

        // APPEND PIE WEDGES
        vis.slices = vis.g.append("g").attr("class", "slices");

        // APPEND POLYLINES
        vis.lines = vis.g.append("g").attr("class", "lines");

        // APPEND PI LABLES
        vis.textLables = vis.g.append("g").attr("class", "text-labels");

        // DIVS

        // REMOVE DIVS IF NECESSARY
        document.querySelectorAll('.holdings-div').forEach(el => el.remove())

        // AND APPEND DIVS
        vis.data.holdings.data.forEach((d, i) => {
            d3.select(vis.chartDiv).append('div')
                .attr('id', `holdings-div-${i}`)
                .attr('class', 'holdings-div')
                .style('text-align', 'center')
                .style('text-anchor', 'middle')
                .style('position', 'absolute')
        })

        vis.redraw();
    }

    redraw(currentFundClass = this.fundClass) {

        const outerWidth = .31; // for donut wedges
        const innerWidth = .09; // for donut wedges
        const outerBig = outerWidth * 1.13; // for num and text labels, and poly line
        const outerStagger = outerWidth * 1.42; // staggering small slices

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
        } else {
            vis.data = vis.dataR6;
        }

        // UPDATE TEXT ELEMENTS
        vis.setGridTextUpper();
        vis.setGridTextLower();
        vis.setDate();

        vis.MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

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
            .endAngle(3.1 * Math.PI)
            .value(d => d.value * 100)
            .sort((a, b) => {
                // console.log(a, b)
                return a - b;
                return a.orderVal.localeCompare(b.orderVal)
            });

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        // const arcData = pieGenerator(vis.data.filter(d => d.value !== 0)); // dont include wedges that are zero
        const arcData = pieGenerator(vis.data.holdings.data);

        // console.log(arcData)

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
            .attr('fill', (d, i) => holdingsColorScale(i))
            .attrTween('d', arcTween)

        // ENTER
        if (vis.draws === 1) {
            donutVis
                .enter()
                .append('path')
                .attr('class', 'bond-holdings-slice')
                .attr('id', (d, i) => `bond-holdings-slice-${i}`)
                .attr('fill', (d, i) => holdingsColorScale(i))
                .style('opacity', 0)
                .transition()
                // .delay((d, i) => i * 100 + 50)
                .duration(0)
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
                .attr('fill', (d, i) => holdingsColorScale(i))
                // .style('opacity', 0)
                .transition()
                .duration(0)
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
        const slices = document.querySelectorAll('.bond-holdings-slice')
        slices.forEach(el => {
            el.addEventListener('mouseover', handleHover);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        });

        // APPLY LISTENERS FOR RIGHT GRID ELEMENTS
        document.querySelectorAll(`.appened-upper-grid-el`).forEach(el => {
            el.addEventListener('mouseover', dimSlices);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        })

        // APPLY LISTENERS FOR DONUT LABELS OUTSIDE OF DONUT
        document.querySelectorAll(`.holdings-div`).forEach(el => {
            el.addEventListener('mouseover', dimSlices);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        })

        // HOVER OVER PIE SLICE
        function handleHover() {
            if (!clicked.includes(1)) {

                const currentSlice = this.id.slice(-1)
                for (let i = 0; i < numberOfSlices; i++) {

                    if (document.getElementById(`bond-holdings-slice-${i}`)) {
                        if (document.getElementById(`bond-holdings-slice-${i}`).id.slice(-1) !== currentSlice) {
                            darkenPieSegment(i)
                        } else {
                            brightenPieSegment(i)
                        }
                    }
                }
            }
        }

        function darkenPieSegment(i) {

            // TEXT
            if (document.getElementById(`holdings-div-${i}`)) {
                document.getElementById(`holdings-div-${i}`).classList.add('slice-trans');
                document.getElementById(`holdings-div-${i}`).style.opacity = .5; // PIE SLICE
            }

            if (document.getElementById(`bond-holdings-slice-${i}`)) {
                document.getElementById(`bond-holdings-slice-${i}`).classList.add('slice-trans');
                document.getElementById(`bond-holdings-slice-${i}`).style.opacity = .5; // PIE SLICE
            }

            // POLYLINES
            if (document.getElementById(`holdings-polyline-${i}`)) {
                if (Number(document.getElementById(`holdings-polyline-${i}`).style.opacity) > 0) {
                    document.getElementById(`holdings-polyline-${i}`).classList.add('slice-trans'); // lines
                    document.getElementById(`holdings-polyline-${i}`).style.opacity = .5; // lines
                }
            }

            // ROWS IN THE GRID/TABLE
            if (document.getElementById(`holdings-row-${i}`))
                document.getElementById(`holdings-row-${i}`).style.opacity = .5;
        }

        function brightenPieSegment(i) {
            // TEXT
            if (document.getElementById(`holdings-div-${i}`)) {
                document.getElementById(`holdings-div-${i}`).style.opacity = 1;
            }

            if (document.getElementById(`bond-holdings-slice-${i}`)) {
                document.getElementById(`bond-holdings-slice-${i}`).style.opacity = 1;
            }
            if (document.getElementById(`holdings-polyline-${i}`)) {
                Number(document.getElementById(`holdings-polyline-${i}`).style.opacity) > 0 ? document.getElementById(`holdings-polyline-${i}`).style.opacity = 1 : null; // lines
            }

            // ROWS IN THE GRID/TABLE
            if (document.getElementById(`holdings-row-${i}`))
                document.getElementById(`holdings-row-${i}`).style.opacity = 1;
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
                if (document.getElementById(`bond-holdings-slice-${i}`)) {
                    document.getElementById(`bond-holdings-slice-${i}`).classList.remove('slice-trans') // pie slices
                }
                if (document.getElementById(`holdings-country-${i}`)) {
                    document.getElementById(`holdings-country-${i}`).classList.remove('slice-trans'); // LINE 1 LABEL
                }
                if (document.getElementById(`holdings-line-2-${i}`)) {
                    document.getElementById(`holdings-line-2-${i}`).classList.remove('slice-trans'); // LINE 2 LABEL
                }
                if (document.getElementById(`holdings-polyline-${i}`)) {
                    document.getElementById(`holdings-polyline-${i}`).classList.remove('slice-trans'); // lines
                }
                if (document.getElementById(`holdings-percent-${i}`)) {
                    document.getElementById(`holdings-percent-${i}`).classList.remove('slice-trans'); // BIG NUMBERS
                }
                if (document.getElementById(`holdings-percent-sign-${i}`)) {
                    document.getElementById(`holdings-percent-sign-${i}`).classList.remove('slice-trans'); // PERCENT SIGNS
                }
            }
        }

        // END OF BARS
        /////////////////////////////////////////
        const outerArc = d3.arc()
            .outerRadius(RADIUS * outerBig)
            .innerRadius(RADIUS * outerBig)

        const staggerArc = d3.arc()
            .outerRadius(RADIUS * outerStagger)
            .innerRadius(RADIUS * outerStagger)

        //************************************************/////////////////
        //************************************************/////////////////
        //************************************************/////////////////
        const angles = arcData.map(d => getDegrees(d));

        // FOR POSITIONING
        const movedAngle = [];
        for (let i = 0; i < angles.length; i++) {
            movedAngle[i] = { staggered: 0, value: arcData[i].data.value * 100, midAngle: midAngle({ startAngle: arcData[i].startAngle, endAngle: arcData[i].endAngle }) };
        }

        const outsideAngles = [];
        movedAngle.forEach(an => {
            if (an.value <= 10)
                outsideAngles.push(an)
        })

        reviseAngles(angles);
        //************************************************/////////////////
        //************************************************/////////////////
        //************************************************/////////////////

        // JOIN NUMERICAL LABLES
        const numLabels = vis.g.selectAll('.pi-text').data(arcData);

        // EXIT
        numLabels.exit().remove();

        // UPDATE
        numLabels
            .attr('x', (d, i) => setXy(d, i, 0))
            .attr('y', (d, i) => setXy(d, i, 1))

        // ENTER
        numLabels
            .enter()
            .append('text')
            .attr('id', (d, i) => `holdings-percent-${i}`)
            .attr('x', (d, i) => setXy(d, i, 0))
            .attr('y', (d, i) => setXy(d, i, 1))
            .transition()
            .styleTween("transform", setTranslate)
            .style('opacity', 0)

        function getDegrees(d) {
            return (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
        }

        function setTranslate(d, i) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            let x = 0;
            let xOffset = 0;
            let y = 0;
            return function (t) {

                // INSIDE THE SLICE POSITIONING
                if (d.value >= 10) {
                    y = 0;
                    x = 0;
                    return `translate(${x + xOffset}px, ${y}px)`
                }

                const d2 = interpolate(t);

                // Math.PI * 2 is the circumference (2piR, just not R here)
                // This determines if the angle is in the top half or lower half of the circle
                y = midAngle(d2) <= Math.PI * .5 || midAngle(d2) >= Math.PI * 1.5 ? -13 : 13;

                // IF WE ARE AT TOP OR BOTTOM OF CIRCLE
                if (midAngle(d2) < Math.PI * 1.1 && midAngle(d2) > Math.PI * .8 || midAngle(d2) < Math.PI * .1 || midAngle(d2) > Math.PI * 1.9) {
                    x = 0;
                } else if (midAngle(d2) < Math.PI) {
                    // LESS THAN MATH.PI IS RIGHT HALF
                    x = 30;
                } else {
                    x = -30;
                }

                return `translate(${x + xOffset}px, ${y}px)`
            };
        }

        function setXy(d, i, cord) {
            if (d.value > 10) {
                if (cord === 0) vis.centroidsX.push(arc.centroid(d)[cord])
                else vis.centroidsY.push(arc.centroid(d)[cord])

                return arc.centroid(d)[cord]
            }
            else if (movedAngle[i].staggered) {
                if (cord === 0) vis.centroidsX.push(staggerArc.centroid(d)[cord])
                else vis.centroidsY.push(staggerArc.centroid(d)[cord])

                return staggerArc.centroid(d)[cord]
            } else {
                if (cord === 0) vis.centroidsX.push(outerArc.centroid(d)[cord])
                else vis.centroidsY.push(outerArc.centroid(d)[cord])

                return outerArc.centroid(d)[cord];
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        function reviseAngles(angles) {
            for (let i = 0; i < angles.length; i++) {

                const minAngle = 30;
                // LAST ANGLE (ALWAYS THE SMALLEST)
                if (i === angles.length - 1) {
                    // ALWAYS SHALLOW POSITIONING ON LAST (SMALLEST) TEXT POSITION
                    movedAngle[i] = { staggered: 0, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle };
                    // } else if (outsideAngles.length === 3 && i === angles.length - 2) {
                    //     // THIS IS FOR THE MIDDLE ANGLE WHEN THERE ARE 3 OUTSIDE ANGLES (SET TO INNER RIM)
                    //     movedAngle[i] = { staggered: 0, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle };
                } else if (outsideAngles.length !== 2 && i === angles.length - 2) {
                    // SECOND TO LAST ANGLE ALWAYS SET TO OUTER RIM, UNLESS OUTER ANGLES IS 2
                    movedAngle[i] = { staggered: 1, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle };
                } else if (outsideAngles.length !== 3 && i === angles.length - 3) {
                    // THIRD TO LAST ANGLE SET TO OUTER RIM IF MORE THAN 3 OUTER ANGLES
                    movedAngle[i] = { staggered: 1, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle }
                } else if (i === angles.length - 4) {
                    // FOURTH TO LAST ANGLE SET TO INNER RIM 
                    movedAngle[i] = { staggered: 0, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle }
                } else {
                    // THIS WOULD HANDLE 5TH AND 6TH ANGLES, BUT IT HASN'T BEEN TESTED SINCE THIS CASE WASN'T IN CURRENT DATA
                    // THE CODE IS JUST LEFTOVER FROM GROWTH SECTION AND WILL NEED UPDATING

                    // NEXT ANGLE minAngleUS PREVIOUS
                    if (angles[i + 1] - angles[i] < minAngle && movedAngle[i].staggered !== 1) {

                        if (movedAngle[i + 1].midAngle <= Math.PI * .25 || movedAngle[i + 1].midAngle >= Math.PI * .75 && movedAngle[i + 1].midAngle <= Math.PI * 1.25
                            || movedAngle[i + 1].midAngle >= Math.PI * 1.75) {
                        }
                        movedAngle[i + 1] = { staggered: 1, value: movedAngle[i + 1].value, midAngle: movedAngle[i + 1].midAngle };
                    }
                }
            }
        }

        // X COORDINATES GETTING COMBINED WITH Y COORDINATES
        const coordinates = [];
        vis.centroidsX.forEach((d, i) => {
            if (d)
                coordinates.unshift([d, vis.centroidsY[i]])
        })

        // console.log(coordinates)
        const finalWidth = window.innerWidth < 1100 ? 90 : window.innerHeight < 777 ? 120 : 220;
        const secondaryWidth = window.innerWidth < 1100 ? '75px' : '120px'

        const firstOutsideAngle = angles.length - outsideAngles.length;
        const finalPoint = vis.data.holdings.data.length - 1;
        const penUltimatePoint = vis.data.holdings.data.length - 2;
        const thirdFromEnd = vis.data.holdings.data.length - 3;
        // const fourthFromEnd = vis.data.holdings.data.length - 4;

        // SETTING INNER HTML ON TEXT DIVS, AND POSITION
        vis.data.holdings.data.forEach((d, i) => {
            // IF IT IS AN OUTSIDE ANGLE...
            if ((d.value * 100).toFixed(2) <= 10) {
                const cords = coordinates.pop();

                const currentElement = document.getElementById(`holdings-div-${i}`);
                // console.log(d, coordinates[0], coordinates[1])
                currentElement.style.left = vis.gWIDTH / 2 + cords[0] + 'px';
                currentElement.style.top = vis.gHEIGHT / 2 + cords[1] + 'px';
                // angle.len - outsideAngles.len means first outside angle
                currentElement.style.width = i === firstOutsideAngle ? `${finalWidth}px` : i === finalPoint ? `${finalWidth}px` : secondaryWidth;
                currentElement.style.transform =
                    // THE FIRST OUTER ANGLE MOVES LEFT
                    i === firstOutsideAngle ? `translate(${-vis.gWIDTH * .13}px, 5px)` :
                        // THIRD TO LAST MOVES LEFT 
                        i === thirdFromEnd ? `translate(${-vis.gWIDTH * .1}px, 5px)` :
                            // SECOND TO LAST MOVES RIGHT (IF IT'S NOT IN THE MIDDLE OF THREE OUTER ANGLES)
                            i === penUltimatePoint && outsideAngles.length !== 3 ? `translate(${vis.gWIDTH * .13}px, 5px)` :
                                // THE VERY LAST OUTER ANGLE MOVES RIGHT
                                i === finalPoint ? `translate(${vis.gWIDTH * .2}px, -5px)` : 'translate(0px, -13px)';

                const sup = d.name.trim() === 'Cash & equivalents' ? d.name + '<sup style="font-size: .7em;">5</sup>' : d.name;
                currentElement.innerHTML = `
                    <div class='pi-text holdings-text' style='color: black;'>${(d.value * 100).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span></div>
                    <div class='pi-text-labs holdings-text' style='color: black;'>${sup}</div>
                `

                // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';
            } else {
                // ELSE THIS IS FOR POSITIONING INSIDE OF SLICES
                const cords = coordinates.pop();

                const currentElement = document.getElementById(`holdings-div-${i}`);
                // console.log(d, coordinates[0], coordinates[1])
                currentElement.style.left = vis.gWIDTH / 2 + cords[0] + 'px';
                currentElement.style.top = vis.gHEIGHT / 2 + cords[1] + 'px';
                currentElement.style.width = window.innerWidth < 1100 ? '62px' : window.innerWidth < 1400 && window.innerHeight < 777 ? '77px' : '100px';
                currentElement.style.pointerEvents = 'none';

                const xMove = window.innerWidth < 1400 && window.innerHeight < 777 ? vis.gWIDTH * .01 : vis.gWIDTH * .02;
                const xTranslate = movedAngle[i].midAngle > Math.PI * 1.8 ? -4 : movedAngle[i].midAngle < Math.PI ? xMove : -xMove; // POS OR NEG IF RIGHT OR LEFT HALF
                const yTranslate = window.innerWidth < 1100 && movedAngle[i].midAngle > Math.PI * 1.8 ? -14 : movedAngle[i].midAngle > Math.PI * 1.8 ? -25 : -5;
                currentElement.style.transform = `translate(${xTranslate}px, ${yTranslate}px)`;

                const sup = d.name.trim() === 'Cash & equivalents' ? d.name + '<sup style="font-size: .7em;">5</sup>' : d.name;
                currentElement.innerHTML = `
                    <div class='pi-text holdings-text' style='color: ${i === 3 ? 'black' : 'white'};'>${(d.value * 100).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span></div>
                    <div class='pi-text-labs holdings-text' style='color: ${i === 3 ? 'black' : 'white'};'>${sup}</div>
                `

                // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';
            }
        })

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        /* ------- SLICE TO TEXT POLYLINES -------*/
        const key = d => d.data.name;

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
            .data(arcData, key);

        // EXIT
        polyline.exit().remove();

        // UPDATE
        polyline
            .transition()
            .duration(20)
            .style('opacity', d => d.value === 0 ? 0 : d.value > 10 ? 0 : 1)
            .transition()
            .duration(480)
            .attrTween("points", drawLines);

        // ENTER
        polyline.enter()
            .append("polyline")
            .attr('id', (d, i) => `holdings-polyline-${i}`)
            .transition()
            .style('stroke', (d, i) => holdingsColorScale(i))
            .attrTween("points", drawLines)
            .style('opacity', 0)
            .transition()
            .duration(0)
            .style('opacity', d => d.value === 0 ? 0 : d.value > 10 ? 0 : 1)

        /////////////////////////////////
        const outerLinePoint = d3.arc()
            .outerRadius(RADIUS * outerStagger * .95)
            .innerRadius(RADIUS * outerStagger * .95)

        ///////////////////////// DRAWING POLYLINES
        function drawLines(d, i) {
            this._current = this._current || d;
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);

            return function (t) {
                const d2 = interpolate(t);

                const lineEnd = outerLinePoint.centroid(d2);

                // THIS IS FOR SPECIAL CASES WITH LONG LABEL NAMES THAT WILL WRAP
                let lineWidth = document.getElementById(`holdings-div-${i}`).lastElementChild.innerText.length * 7; // APPROXIMATELY
                if (document.getElementById(`holdings-div-${i}`).lastElementChild.innerText.length >= 30) {
                    lineWidth = window.innerWidth < 1100 ? 15 * 7 : window.innerWidth < 1400 ? 21 * 7 : 25 * 7;
                }

                const lineOneLen = window.innerWidth < 1100 ? Math.abs(vis.gWIDTH * .17 - lineWidth / 2) : Math.abs(vis.gWIDTH * .13 - lineWidth / 2);
                const lineTwoLen = window.innerWidth < 1100 ? Math.abs(vis.gWIDTH * .13 - lineWidth / 2) : Math.abs(vis.gWIDTH * .1 - lineWidth / 2);
                const lineThreLen = window.innerWidth < 1100 ? Math.abs(vis.gWIDTH * .16 - lineWidth / 2) : Math.abs(vis.gWIDTH * .13 - lineWidth / 2);

                // ADD LINE EXTENDING EITHER LEFT/RIGHT DEPENDING IF POSIITION IS IN LEFT/RIGHT HALF OF CIRC
                // LESS THAN MATH.PI IS RIGHT HALF
                const lengthOfExtension =
                    // THE FIRST LINE (left)
                    i === firstOutsideAngle ? lineOneLen :
                        // THIRD FROM END (left)
                        i === thirdFromEnd ? lineTwoLen :
                            // SECOND FROM END (right), unless it's in the middle of 3 outer angles
                            i === penUltimatePoint && outsideAngles.length !== 3 ? lineThreLen :
                                // LAST LINE (always right)
                                i === finalPoint ? Math.abs(vis.gWIDTH * .2 - lineWidth / 2)
                                    : 0;

                const extensionDirection =
                    // FIRST LINE
                    i === firstOutsideAngle ? -1 :
                        // THIRD FROM END
                        i === thirdFromEnd ? -1 :
                            // SECOND FROM END 
                            i === penUltimatePoint ? 1 :
                                // LAST LINE
                                i === finalPoint ? 1 :
                                    (midAngle(d2) < Math.PI ? 1 : -1);

                let extensionPoint = null;
                if (movedAngle[i].staggered === 1)
                    extensionPoint = outerLinePoint.centroid(d2)
                else
                    extensionPoint = farPoint.centroid(d2);

                const extension = [extensionPoint[0] + lengthOfExtension * extensionDirection, extensionPoint[1]]; // DRAW AN EXTENTION ON THE POLYLINE

                if (movedAngle[i].staggered === 1) {
                    // const xOffset = movedAngle[i].midAngle < Math.PI ? 2 : -2;
                    lineEnd[0] = outerLinePoint.centroid(d2)[0];

                    // const yOffset = movedAngle[i].midAngle < Math.PI * .5 || movedAngle[i].midAngle > Math.PI * 1.5 ? 13 : -15;
                    const yOffset = 0;

                    lineEnd[1] = lineEnd[1] + yOffset;

                    return [closePoint.centroid(d2), lineEnd, extension]
                }
                return [closePoint.centroid(d2), farPoint.centroid(d2), extension];
            };
        }
    } // end redraw

    // TITLE: TOTAL BOND HOLDINGS (UPPER RIGHT GRID)
    setGridTextUpper() {
        const vis = this;
        const sortedData = vis.data.holdings.data.sort((a, b) => b.value - a.value);

        if (!vis.differentData(sortedData, vis.holdingsSorted)) {
            // REMOVE OLD ELEMENTS IF NECESSARY
            document.querySelectorAll('.appened-upper-grid-el').forEach(el => {
                el.remove()
            })

            const upperGrid = document.getElementById('bond-holdings-holdings-grid');

            // APPEND NEW ELEMENTS
            sortedData.forEach((el, i) => {

                const name = el.name.trim() === 'Cash & equivalents' ? el.name.trim() + '<sup>5</sup>' : el.name;

                const newDiv = document.createElement('div');

                newDiv.classList = `bond-holdings-grid-row appened-upper-grid-el`;
                newDiv.id = `holdings-row-${i}`;

                newDiv.innerHTML = `
                <div class='bond-holdings-grid-dot' style='background-color: ${holdingsColorScale(i)};'></div>
                <div class='bond-holdings-text'>${name}</div>
                <div class='bond-holdings-number'>
                  <div class='text-layers'>
                    <div id='geo-fund-0' class='bond-holdings-reg bold'>${(Number(el.value) * 100).toFixed(2)}%</div>
                    <div id='geo-fund-0-alt' class='bond-holdings-alt bold'>${(Number(el.value) * 100).toFixed(2)}%</div>
                  </div>
                </div>
                `;

                upperGrid.append(newDiv)

            });

            // SHOW NEW ELEMENTS
            document.querySelectorAll('.appened-upper-grid-el').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                }, i * 77);
            })
        }

        vis.holdingsSorted = sortedData;
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

    // TITLE: TOP FIXED-INCOME ISSUERS (LOWER RIGHT GRID TEXT)
    setGridTextLower() {
        const vis = this;
        const lowerGrid = document.getElementById('bond-holdings-issuers-grid');

        if (!vis.differentData(vis.data.issuers.data, vis.issuers)) {
            // REMOVE OLD ELEMENTS IF NECESSARY
            document.querySelectorAll('.appened-lower-grid-el').forEach(el => {
                el.remove()
            })

            // APPEND NEW ELEMENTS
            vis.data.issuers.data.forEach((el, i) => {
                const newDiv = document.createElement('div');

                newDiv.classList = 'appened-lower-grid-el';
                newDiv.id = 'bond-holdings-grid-2';

                newDiv.innerHTML = `
                    <div class='bond-holdings-text'>${el.name}</div>
                    <div class='bond-holdings-meter'>
                    <div id='bond-holdings-meter-bar' style='width: ${el.value}%'></div>
                    <div id='bond-holdings-meter-bg'></div>
                    </div>
                    <div class='bond-holdings-number'>
                    <div class='text-layers'>
                        <div id='geo-fund-0' class='bond-holdings-reg bold'>${Number(el.value).toFixed(2)}%</div>
                        <div id='geo-fund-0-alt' class='bond-holdings-alt bold'>${Number(el.value).toFixed(2)}%</div>
                    </div>
                    </div>
                `;

                lowerGrid.append(newDiv)

            });

            // SHOW NEW ELEMENTS
            document.querySelectorAll('.appened-lower-grid-el').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = 1;
                }, i * 77);
            })
        }

        vis.issuers = vis.data.issuers.data;
    }

    setDate() {
        const vis = this;
        const date = vis.data.holdings.asOfDate;

        if (document.getElementById('bond-holdings-date'))
            document.getElementById('bond-holdings-date').innerText = `As of ${date} (updated quarterly)`;

        // I DON'T THINK THIS IS USED
        if (document.getElementById('bond-holdings-date-alt'))
            document.getElementById('bond-holdings-date-alt').innerText = `As of ${date} (updated quarterly)`;
    }
}
