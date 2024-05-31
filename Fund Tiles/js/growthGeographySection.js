// SLIDER (BREAKDOWN BY DOMICLE VS BREAKDOWN BY REVENUE)
let isSliding = false;
const toggleSlider2 = () => {
    if (!isSliding) {
        isSliding = true;
        const slider = document.getElementById('slider-2');

        if (!slider.getAttribute('domicile') || slider.getAttribute('domicile') === 'false') {
            slider2Right();
        } else {
            resetSlider2();
        }

        growthDonut.redraw(currentFundClass, isDomicile)
        document.querySelectorAll('.geo-row').forEach(el => el.style.opacity = 1);

        setTimeout(() => {
            isSliding = false;
        }, 500);
    }
}

function slider2Right() {
    const slider = document.getElementById('slider-2');

    document.querySelector('#pill-toggle2').style.left = '50%';
    document.getElementById('ft-toggle-left2').style.color = 'rgba(127, 127, 127, 1)';
    document.getElementById('ft-toggle-right2').style.color = 'rgba(0, 41, 75, 1)';
    isDomicile = false;
    slider.setAttribute('domicile', true)
}

function resetSlider2() {
    const slider = document.getElementById('slider-2');

    document.querySelector('#pill-toggle2').style.left = 0;
    document.getElementById('ft-toggle-left2').style.color = 'rgba(0, 41, 75, 1)';
    document.getElementById('ft-toggle-right2').style.color = 'rgba(127, 127, 127, 1)';
    isDomicile = true;
    slider.setAttribute('domicile', false)
}

// *************************************************************** //
// ********************** DRAW PIE CHART *********************** //
// *********************************************************** //
const US = 'rgba(0, 156, 220, 1)';
const CANADA = 'rgba(102, 194, 236, 1)';
const EUROPE = 'rgba(124, 135, 142, 1)';
const JAPAN = 'rgba(204, 204, 204, 1)';
const ASIA = 'rgba(242, 185, 0, 1)';
const EMERGING = 'rgba(247, 213, 102, 1)';

// ***************** SCALES ******************** //
const COLORS = [US, CANADA, EUROPE, JAPAN, ASIA, EMERGING];
const keys = ['United States ', 'Canada ', 'Europe ', 'Japan ', 'Asia-Pacific ex. Japan ', 'Emerging Markets '];
// color scale
const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(COLORS);

class DrawPie {
    constructor(el, data, currentFundClass, isDomicile, delay = 0) {
        // // LATE UPDATE TO RESET DOMICLIE
        // isDomicile = true;
        // resetSlider2();

        this.el = el;
        this.id = data.a.id;
        this.indexNameA = data.a.indexPrimary;
        this.indexNameF2 = data.f2.indexPrimary;
        this.asOfDateA = data.a.donutData.date;
        this.asOfDateF2 = data.f2.donutData.date;
        this.domicileFundA = data.a.donutData.domicile.fund;
        this.domicileIndexA = data.a.donutData.domicile.index;
        this.revenueFundA = data.a.donutData.revenue.fund;
        this.revenueIndexA = data.a.donutData.revenue.index;
        this.domicileFundF2 = data.f2.donutData.domicile.fund;
        this.domicileIndexF2 = data.f2.donutData.domicile.index;
        this.revenueFundF2 = data.f2.donutData.revenue.fund;
        this.revenueIndexF2 = data.f2.donutData.revenue.index;
        this.fundClass = currentFundClass;
        this.isDomicile = isDomicile;
        this.delay = delay;
        this.draws = 0;
        this.initVis();
    }

    initVis() {
        const vis = this;
        vis.chartDiv = document.getElementById(vis.el);

        // REMOVE OLD VIS
        if (document.getElementById('g-class-id')) document.getElementById('g-class-id').remove();

        vis.svg = d3.select(vis.chartDiv).append("svg").attr('class', 'svg-class').attr('id', 'g-class-id');
        vis.g = vis.svg.append('g').attr('class', 'g-class')
        vis.bars = vis.g.append("g").attr("class", "bars");
        vis.lines = vis.g.append("g").attr("class", "lines");
        vis.textLables = vis.g.append("g").attr("class", "text-labels");

        this.redraw();
    }

    redraw(fundClass = this.fundClass, isDomicile = this.isDomicile, resize = false) {
        const vis = this;

        vis.iPad = window.innerWidth < 1400 && window.innerHeight > 1000;
        vis.desktop = window.innerWidth > 1400;
        vis.smallLapTop = window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750;
        vis.seismicApp = window.innerWidth < 1100;

        vis.centroidsX = [];
        vis.centroidsY = [];
        vis.draws++;
        vis.fundClass = fundClass;
        vis.isDomicile = isDomicile;

        // SET VIS.DATA ACCORDING TO SLIDERS
        if (vis.isDomicile) {
            if (vis.fundClass === 'a') {
                vis.data = vis.domicileFundA;
            } else {
                vis.data = vis.domicileFundF2;
            }
            resetSlider2()
        } else {
            if (vis.fundClass === 'a') {
                vis.data = vis.revenueFundA;
            } else {
                vis.data = vis.revenueFundF2;
            }
            slider2Right()
        }

        vis.updateText();

        // MARGINS
        const margin = { top: 0, right: window.innerWidth < 1400 ? 0 : 40, bottom: 0, left: 0 };

        // Extract the width and height that was computed by CSS.
        const width = vis.chartDiv.clientWidth;
        const height = vis.chartDiv.clientHeight;
        const RADIUS = d3.min([width, height]);
        vis.gWIDTH = width - (margin.left + margin.right);
        vis.gHEIGHT = height - (margin.top + margin.bottom);

        // DEFINE SVG
        vis.svg.attr('width', width).attr('height', height);

        // G
        vis.g
            .attr('width', vis.gWIDTH)
            .attr('height', vis.gHEIGHT)
            .attr('transform', `translate(${vis.gWIDTH * .5 + margin.left}, ${vis.gHEIGHT * .5 + margin.top})`);

        // SETUP PIE
        const pieGenerator = d3
            .pie()
            .padAngle(0.04)
            .startAngle(0 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(d => d.value)
            .sort((a, b) => {
                return null;
                // console.log(a, b)
                // return a.orderVal.localeCompare(b.orderVal)
            });

        // ***************************************************
        // ***************************************************
        // ***************************************************

        const outerWidth = vis.smallLapTop ? .29 : .31; // for donut wedges
        const innerWidth = .09; // for donut wedges

        const outerBig = outerWidth * 1.13; // for num and text labels, and poly line

        const outerStagger = vis.smallLapTop ? outerWidth * 1.44 : outerWidth * 1.42; // staggering small slices
        // ***************************************************
        // ***************************************************
        // ***************************************************

        const arc = d3.arc()
            .outerRadius(RADIUS * outerWidth)
            .innerRadius(RADIUS * innerWidth)

        const arcData = pieGenerator(vis.data.filter(d => d.value !== 0)); // dont include wedges that are zero
        // const arcData = pieGenerator(vis.data);

        const idTranslate = []
        idTranslate[0] = 'us';
        idTranslate[1] = 'ca';
        idTranslate[2] = 'eu';
        idTranslate[3] = 'jp';
        idTranslate[4] = 'ap';
        idTranslate[5] = 'em';

        // JOIN DONUT SLICES
        let donutVis = vis.bars.selectAll('path')
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
            .attr('fill', d => color(d.data.name))
            .attrTween('d', arcTween)

        // ENTER
        if (vis.draws === 1) {
            donutVis
                .enter()
                .append('path')
                .attr('class', 'slice')
                .attr('id', (d, i) => `slice-${idTranslate[i]}`)
                .attr('fill', d => color(d.data.name))
                .style('opacity', 0)
                .transition()
                .delay((d, i) => i * 100 + 50 + vis.delay)
                .duration(800)
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
                .attr('id', (d, i) => `slice-${idTranslate[i]}`)
                .style('opacity', 0)
                .transition()
                .duration(500)
                .attr('fill', d => color(d.data.name))
                .style('opacity', 1)
                .attrTween('d', arcTween) // THIS GETS READY FOR THE UPDATE TWEEN
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
        let clicked = [0, 0, 0, 0, 0, 0];
        const slices = document.querySelectorAll('.slice')
        slices.forEach(el => {
            el.addEventListener('mouseover', handleHover);
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        });

        // APPLY LISTENERS FOR RIGHT GRID ELEMENTS
        document.querySelectorAll(`.geo-row`).forEach((el, i) => {
            el.addEventListener('mouseover', () => dimSlices(i));
            el.addEventListener('mouseout', handleOut);
            el.addEventListener('click', handleClick);
        })

        // HOVER OVER PIE SLICE
        function handleHover() {
            if (!clicked.includes(1)) {

                const currentSlice = this.id.split('-').slice(-1)[0]
                for (let i = 0; i < 6; i++) {
                    const row = document.getElementById(`g-row-${idTranslate[i]}`);
                    if (row.id.split('-').slice(-1)[0] !== currentSlice) {
                        darkenPieSegment(idTranslate[i])
                    } else {
                        brightenPieSegment(idTranslate[i])
                    }
                }
            }
        }

        function darkenPieSegment(i) {
            if (document.getElementById(`slice-${i}`)) {
                document.getElementById(`slice-${i}`).classList.add('slice-trans');
                document.getElementById(`slice-${i}`).style.opacity = .4; // PIE SLICE
            }

            if (document.getElementById(`growth-geo-div-${i}`)) {
                document.getElementById(`growth-geo-div-${i}`).classList.add('slice-trans');
                document.getElementById(`growth-geo-div-${i}`).style.opacity = .4; // PIE SLICE
            }

            // POLYLINES
            if (document.getElementById(`polyline-${i}`)) {
                if (Number(document.getElementById(`polyline-${i}`).style.opacity) > 0) {
                    document.getElementById(`polyline-${i}`).classList.add('slice-trans'); // lines
                    document.getElementById(`polyline-${i}`).style.opacity = .4; // lines
                }
            }

            // GRID ON THE RIGHT
            if (document.getElementById(`g-row-${i}`)) {
                document.getElementById(`g-row-${i}`).classList.add('slice-trans');
                document.getElementById(`g-row-${i}`).style.opacity = .4;
            }
        }

        function brightenPieSegment(i) {
            if (document.getElementById(`slice-${i}`)) {
                document.getElementById(`slice-${i}`).style.opacity = 1;
            }

            // TEXT ELEMENTS
            if (document.getElementById(`growth-geo-div-${i}`)) {
                document.getElementById(`growth-geo-div-${i}`).style.opacity = 1;
            }

            if (document.getElementById(`polyline-${i}`)) {
                Number(document.getElementById(`polyline-${i}`).style.opacity) > 0 ? document.getElementById(`polyline-${i}`).style.opacity = 1 : null; // lines
            }

            // GRID ELEMENTS
            if (document.getElementById(`g-row-${i}`)) {
                document.getElementById(`g-row-${i}`).style.opacity = 1;
            }
        }

        // LEAVE PIE SLICE, RESOTRE ELEMENTS
        function handleOut() {
            if (!clicked.includes(1)) {
                for (let i = 0; i < 6; i++) {
                    brightenPieSegment(idTranslate[i]);
                }
            }
        }

        // HANDLE CLICK FOR PIE SLICES AND GRID ELEMENTS
        const position = ['us', 'ca', 'eu', 'jp', 'ap', 'em']
        function handleClick() {
            const currentEl = this;
            let clickedIndex = null;

            // get the ID of whatever was clicked
            clickedIndex = position.indexOf(currentEl.id.split('-').slice(-1)[0])

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
        function dimSlices(id) {
            if (!clicked.includes(1)) {
                updateAll(id);
            }
        }

        function updateAll(id) {
            for (let i = 0; i < 6; i++) {
                if (i === id) {
                    brightenPieSegment(idTranslate[i])
                } else {
                    darkenPieSegment(idTranslate[i])
                };
            }
        }

        // REMOVE TRANSITIONS FROM PIE ELEMENTS (FOR HOVERING FADES, ETC)
        document.getElementById('subnav').addEventListener('mouseenter', removeClasses)
        document.getElementById('slider-2').addEventListener('mouseenter', removeClasses)
        function removeClasses() {
            for (let i = 0; i < 6; i++) {
                if (document.getElementById(`slice-${i}`)) {
                    document.getElementById(`slice-${i}`).classList.remove('slice-trans') // pie slices
                }
                if (document.getElementById(`growth-geo-row-${i}`)) { }
                // document.getElementById(`growth-geo-row-${i}`).classList.remove('slice-trans'); // TEXT EL

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

        const movedAngle = [];
        for (let i = 0; i < angles.length; i++) {
            movedAngle[i] = { staggered: 0, value: arcData[i].data.value, midAngle: midAngle({ startAngle: arcData[i].startAngle, endAngle: arcData[i].endAngle }) };
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

        const textLables = vis.textLables.selectAll('.pi-text-labs').data(arcData);

        // EXIT
        textLables.exit().remove();

        // UPDATE
        textLables
            .style('opacity', 0)
            .attr('x', (d, i) => setXy(d, i, 0))
            .attr('y', (d, i) => setXy(d, i, 1))

        // ENTER
        textLables
            .enter()
            .append('text')
            .style('opacity', 0)
            .attr('x', (d, i) => setXy(d, i, 0))
            .attr('y', (d, i) => setXy(d, i, 1))

        ///////////////////////
        function getDegrees(d) {
            return (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
        }

        function reviseAngles(angles) {
            for (let i = 0; i < angles.length; i++) {

                const minAngle = 20;
                const moveBy = 9;
                // TESTS LAST ENTRY VS FIRST ENTRY
                if (i === angles.length - 1) {
                    if ((angles[0] + 360) - angles[i] < minAngle && movedAngle[0].staggered !== 1) {
                        // console.log('last ANGLE IS TOO CLOSE TO FIRST')
                        if (movedAngle[i].midAngle <= Math.PI * .25 || movedAngle[i].midAngle >= Math.PI * .75 && movedAngle[i].midAngle <= Math.PI * 1.25
                            || movedAngle[i].midAngle >= Math.PI * 1.75) {
                        }
                        movedAngle[i] = { staggered: 1, value: movedAngle[i].value, midAngle: movedAngle[i].midAngle };
                    }
                } else {
                    // NEXT ANGLE minAngleUS PREVIOUS
                    if (angles[i + 1] - angles[i] < minAngle && movedAngle[i].staggered !== 1) {
                        // console.log(arcData[i + 1])

                        // console.log('updating angle for', adjustedData[i + 1].data.name)
                        // adjustedData[i + 1].startAngle = adjustedData[i + 1].startAngle + (moveBy * Math.PI / 180);
                        // adjustedData[i + 1].endAngle = adjustedData[i + 1].endAngle + (moveBy * Math.PI / 180);
                        if (movedAngle[i + 1].midAngle <= Math.PI * .25 || movedAngle[i + 1].midAngle >= Math.PI * .75 && movedAngle[i + 1].midAngle <= Math.PI * 1.25
                            || movedAngle[i + 1].midAngle >= Math.PI * 1.75) {
                        }
                        movedAngle[i + 1] = { staggered: 1, value: movedAngle[i + 1].value, midAngle: movedAngle[i + 1].midAngle };
                    }
                }
            }
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

        // X COORDINATES GETTING COMBINED WITH Y COORDINATES
        const coordinates = [];
        vis.centroidsX.forEach((d, i) => {
            if (d)
                coordinates.unshift([d, vis.centroidsY[i]])
        })

        // console.log(coordinates)
        const finalWidth = window.innerWidth < 1100 ? 90 : 220;
        const secondaryWidth = window.innerWidth < 1100 ? '45px' : '80px'

        const finalPoint = vis.data.length - 1;
        const penUltimatePoint = vis.data.length - 2;
        const thirdFromEnd = vis.data.length - 3;
        // const fourthFromEnd = vis.data.holdings.data.length - 4;

        // JOIN TEXTUAL LABLES FOR COUNTRIES
        const textMap = [];
        textMap['United States '] = 'U.S.';
        textMap['Canada '] = 'Canada';
        textMap['Europe '] = 'Europe';
        textMap['Japan '] = 'Japan';
        textMap['Asia-Pacific ex. Japan '] = 'APAC ex. Japan';
        textMap['Emerging Markets '] = 'Emerging markets';

        const nameTranslate = []
        nameTranslate['United States '] = 'us';
        nameTranslate['Canada '] = 'ca';
        nameTranslate['Europe '] = 'eu';
        nameTranslate['Japan '] = 'jp';
        nameTranslate['Asia-Pacific ex. Japan '] = 'ap';
        nameTranslate['Emerging Markets '] = 'em';

        // SETTING INNER HTML ON TEXT DIVS, AND POSITION
        if (vis.dataDifferent(arcData, vis.previousData) || resize) {

            idTranslate.forEach(id => {
                if (document.getElementById(`growth-geo-div-${id}`))
                    document.getElementById(`growth-geo-div-${id}`).style.opacity = 0;

                setTimeout(() => {
                    if (document.getElementById(`growth-geo-div-${id}`))
                        document.getElementById(`growth-geo-div-${id}`).remove();
                }, 250);
            })


            arcData.forEach((d, i) => {
                //             0:
                // data: {name: "United States ", value: 1.5}
                // endAngle: 0.1306477796076938
                // index: 0
                // padAngle: 0.04
                // startAngle: 0
                // value: 1.5

                if (d.value == 0) {
                    return
                }

                // WAIT FOR FADE & REMOVAL
                setTimeout(() => {
                    if ((d.value).toFixed(2) <= 10) {

                        const cords = coordinates.pop();

                        const currentElement = document.createElement('div')
                        currentElement.id = `growth-geo-div-${nameTranslate[d.data.name]}`;
                        currentElement.classList = 'growth-geo-div';
                        // console.log(d, coordinates[0], coordinates[1])
                        currentElement.style.display = d.value === 0 ? 'none' : 'block';
                        currentElement.style.opacity = 0;
                        currentElement.style.left = vis.gWIDTH / 2 + cords[0] + 'px';
                        currentElement.style.top = vis.gHEIGHT / 2 + cords[1] + 'px';
                        currentElement.style.pointerEvents = 'all';
                        currentElement.style.cursor = 'pointer'
                        // currentElement.style.width = i === (angles.length - outsideAngles.length) ? `${finalWidth}px` : i === finalPoint ? `${finalWidth}px` : secondaryWidth
                        currentElement.style.width = window.innerWidth < 1100 ? '60px' : '80px';

                        const outLabel = document.createElement('div');
                        outLabel.classList = 'pi-text-labs holdings-text';
                        outLabel.style.color = 'black';
                        outLabel.innerText = textMap[d.data.name];

                        currentElement.innerHTML = `
                                <div class='pi-text holdings-text' style='color: black;'>
                                    ${(d.value).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span>
                                </div>
                            `
                        currentElement.append(outLabel)
                        document.getElementById(vis.el).append(currentElement)

                        // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                        currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                        currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';


                        setTimeout(() => {
                            const translateFactorY = Math.cos(midAngle(arcData[i])); // 
                            const translateFactorX = Math.sin(midAngle(arcData[i])); // 
                            const translateAmountY = outLabel.clientHeight > 16 ? -21 : -13; // -13px when in the upper half for one-lined output, -21 for two-lined output
                            let translateAmountX = translateFactorX < 0 ? 41 : 35; // POSITIVE FOR RIGHT HALF

                            // IF ALL ANGLES ARE OUTSIDE EXCEPT ONE
                            if (outsideAngles.length === vis.data.length - 1 && i === finalPoint) {
                                // THE VERY LAST OUTER ANGLE MOVES RIGHT
                                currentElement.style.transform = `translate(${translateAmountX * translateFactorX + 10}px, ${translateFactorY * translateAmountY}px)`;
                            } else if (outsideAngles.length === vis.data.length - 1 && i === thirdFromEnd) {
                                // THE THIRD FROM LAST MOVES LEFT
                                currentElement.style.transform = `translate(${translateAmountX * translateFactorX - 5}px, ${translateFactorY * translateAmountY}px)`;
                            } else {
                                currentElement.style.transform = `translate(${translateFactorX * translateAmountX}px, ${translateFactorY * translateAmountY}px)`
                            }

                            // currentElement.style.transform =
                            //     // THE FIRST OUTER ANGLE MOVES LEFT
                            //     i === (angles.length - outsideAngles.length) ? `translate(${-vis.gWIDTH * .13}px, 5px)` :
                            //         // THIRD TO LAST MOVES LEFT 
                            //         i === thirdFromEnd ? `translate(${-vis.gWIDTH * .1}px, 5px)` :
                            //             // SECOND TO LAST MOVES RIGHT (IF IT'S NOT IN THE MIDDLE OF THREE OUTER ANGLES)
                            //             i === penUltimatePoint && outsideAngles.length !== 3 ? `translate(${vis.gWIDTH * .13}px, 5px)` :
                            //                 // THE VERY LAST OUTER ANGLE MOVES RIGHT
                            //                 i === finalPoint ? `translate(${vis.gWIDTH * .2}px, -5px)` : 'translate(0px, -13px)';

                            setTimeout(() => {
                                currentElement.style.opacity = 1;
                            }, 1);

                        }, 0);


                    } else {
                        // ELSE THIS IS FOR POSITIONING INSIDE OF SLICES
                        const cords = coordinates.pop();

                        const currentElement = document.createElement('div')
                        currentElement.id = `growth-geo-div-${nameTranslate[d.data.name]}`;
                        currentElement.classList = 'growth-geo-div';
                        currentElement.style.opacity = 0;

                        // console.log(d, coordinates[0], coordinates[1])
                        currentElement.style.left = vis.gWIDTH / 2 + cords[0] + 'px';
                        currentElement.style.top = vis.gHEIGHT / 2 + cords[1] + 'px';
                        currentElement.style.width = window.innerWidth < 1100 ? '62px' : window.innerWidth < 1400 && window.innerHeight < 777 ? '77px' : '80px';
                        currentElement.style.pointerEvents = 'none';

                        // const xMove = window.innerWidth < 1400 && window.innerHeight < 777 ? vis.gWIDTH * .01 : vis.gWIDTH * .02;
                        // const xTranslate = movedAngle[i].midAngle > Math.PI * 1.8 ? -4 : movedAngle[i].midAngle < Math.PI ? xMove : -xMove; // POS OR NEG IF RIGHT OR LEFT HALF
                        // const yTranslate = window.innerWidth < 1100 && movedAngle[i].midAngle > Math.PI * 1.8 ? -14 : movedAngle[i].midAngle > Math.PI * 1.8 ? -25 : -5;
                        // currentElement.style.transform = `translate(${xTranslate}px, ${yTranslate}px)`;

                        currentElement.innerHTML = `
                                <div class='pi-text holdings-text' style='color: white'};'>${(d.value).toFixed(2)}<span class='percent-signs' style='margin-left: 1px;'>%</span></div>
                                <div class='pi-text-labs holdings-text' style='color: white'};'>${textMap[d.data.name]}</div>
                            `

                        document.getElementById(vis.el).append(currentElement)
                        // MARGIN IS NEGATIVE HALF OF WIDTH, AND NEGATIVE HALF OF HEIGHT TO KEEP THING POSITIONED CORRECTLY
                        currentElement.style.marginLeft = -currentElement.clientWidth / 2 + 'px';
                        currentElement.style.marginTop = -currentElement.clientHeight / 2 + 'px';

                        setTimeout(() => {
                            currentElement.style.opacity = 1;
                        }, 1);

                    }

                    // THROW LISTNERS ONTO ALL OF THE DIVS
                    document.querySelectorAll('.growth-geo-div').forEach(el => {
                        el.addEventListener('mouseover', handleHover);
                        el.addEventListener('mouseout', handleOut);
                        el.addEventListener('click', handleClick);
                    })

                }, 260);

            })
        }

        vis.previousData = arcData;

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
            .style('opacity', d => d.value === 0 ? 0 : d.value >= 10 ? 0 : 1)
            .transition()
            .duration(480)
            .attrTween("points", drawLines);

        // ENTER
        polyline.enter()
            .append("polyline")
            .attr('id', (d, i) => `polyline-${idTranslate[i]}`)
            .transition()
            .style('stroke', d => color(d.data.name))
            .attrTween("points", drawLines)
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', d => d.value === 0 ? 0 : d.value >= 10 ? 0 : 1)

        /////////////////////////////////
        const outerLinePoint = d3.arc()
            .outerRadius(RADIUS * outerStagger * .95)
            .innerRadius(RADIUS * outerStagger * .95)


        function drawLines(d, i) {
            this._current = this._current || d;
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);

            return function (t) {
                const d2 = interpolate(t);

                const staggeredPoint = movedAngle[i].staggered;

                // ADD LINE EXTENDING EITHER LEFT/RIGHT DEPENDING IF POSIITION IS IN LEFT/RIGHT HALF OF CIRC
                // LESS THAN MATH.PI IS RIGHT HALF
                const lengthOfExention = movedAngle[i] ? 0 : 0;
                // lineEnd[0] = xPosition + lengthOfExention * (midAngle(d2) < Math.PI ? 1 : -1); // DRAW AN EXTENTION ON THE POLYLINE

                // const endPoint = farPoint.centroid(d2)[0] + (document.getElementById(`country-${i}`).getBoundingClientRect().x - farPoint.centroid(d2)[0]) * (midAngle(d2) < Math.PI ? 1 : -1);
                if (staggeredPoint) {
                    const lineEnd = outerLinePoint.centroid(d2);
                    const xOffset = movedAngle[i].midAngle < Math.PI ? 2 : -2;
                    lineEnd[0] = outerLinePoint.centroid(d2)[0];

                    // const yOffset = movedAngle[i].midAngle < Math.PI * .5 || movedAngle[i].midAngle > Math.PI * 1.5 ? 13 : -15;
                    const yOffset = 0;

                    lineEnd[1] = lineEnd[1] + yOffset;

                    return [closePoint.centroid(d2), lineEnd]
                }
                return [closePoint.centroid(d2), farPoint.centroid(d2)];
            };
        }

        if (vis.id === 'GBAL' || vis.id === 'CIB' || vis.id === 'IFA') {
            document.querySelectorAll('.geo-header-sm').forEach(el => el.style.top = '-15px')
        } else {
            document.querySelectorAll('.geo-header-sm').forEach(el => el.style.top = '0px')
        }

    } // end redraw

    dataDifferent(d1, d2) {
        if (!d2) return true;

        if (d1.length !== d2.length) return true;

        let output = false;
        d1.forEach((el, i) => {
            if (el.data.name !== d2[i].data.name) output = true;
            if (el.startAngle !== d2[i].startAngle) output = true;
            if (el.endAngle !== d2[i].endAngle) output = true;
            if (el.value !== d2[i].value) output = true;
        })

        return output;
    }

    updateText() {
        const vis = this;

        // GET OUTPUT DATA
        if (vis.isDomicile) {
            if (vis.fundClass === 'a') {
                vis.col1 = vis.domicileFundA;
                vis.col2 = vis.domicileIndexA;
                vis.asOf = vis.asOfDateA;
                vis.indexName = vis.indexNameA;
            } else {
                vis.col1 = vis.domicileFundF2;
                vis.col2 = vis.domicileIndexF2
                vis.asOf = vis.asOfDateF2;
                vis.indexName = vis.indexNameF2;
            }

            document.querySelectorAll('.domicile-label').forEach(l => l.style.opacity = 1)
            document.querySelectorAll('.revenue-label').forEach(l => l.style.opacity = 0)
        } else {
            if (vis.fundClass === 'a') {
                vis.col1 = vis.revenueFundA;
                vis.col2 = vis.revenueIndexA
                vis.asOf = vis.asOfDateA;
                vis.indexName = vis.indexNameA;
            } else {
                vis.col1 = vis.revenueFundF2;
                vis.col2 = vis.revenueIndexF2;
                vis.asOf = vis.asOfDateF2;
                vis.indexName = vis.indexNameF2;
            }

            document.querySelectorAll('.domicile-label').forEach(l => l.style.opacity = 0)
            document.querySelectorAll('.revenue-label').forEach(l => l.style.opacity = 1)
        }

        // NOT PART OF THE CROSS FADE, BUT ENSURES OPACITY IS GOOD ON TITLES and dots
        document.querySelectorAll('.geo-text').forEach(el => el.style.opacity = 1);
        document.querySelectorAll('.geo-grid-dot').forEach(el => el.style.opacity = 1);

        // SET ALT TEXT
        document.getElementById('growth-geo-date-alt').innerText = 'As of ' + vis.asOfDateA;
        document.getElementById('geo-index-name-alt').innerText = vis.indexName;

        vis.col1.forEach((el, i) => {
            document.getElementById(`geo-fund-${i}-alt`).innerText = el.value.toFixed(2) + '%'
        })
        vis.col2.forEach((el, i) => {
            document.getElementById(`geo-index-${i}-alt`).innerText = el.value.toFixed(2) + '%'
        })

        // CROSSFADE REG OFF, ALT ON
        document.querySelectorAll('.geo-alt').forEach(el => el.style.opacity = 1);
        document.querySelectorAll('.geo-reg').forEach(el => el.style.opacity = 0);

        // SET REG TEXT
        setTimeout(() => {
            vis.col1.forEach((el, i) => {
                document.getElementById(`geo-fund-${i}`).innerText = el.value.toFixed(2) + '%'
            })
            vis.col2.forEach((el, i) => {
                document.getElementById(`geo-index-${i}`).innerText = el.value.toFixed(2) + '%'
            })
            document.getElementById('growth-geo-date').innerText = 'As of ' + vis.asOfDateA;
            document.getElementById('geo-index-name-reg').innerText = vis.indexName;

        }, 410);

        // CUT TO REG TEXT
        setTimeout(() => {
            document.querySelectorAll('.geo-alt').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = 0;
                setTimeout(() => {
                    el.style.transition = 'opacity .4s ease-in-out';
                }, 1);
            });
            document.querySelectorAll('.geo-reg').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = 1;
                setTimeout(() => {
                    el.style.transition = 'opacity .4s ease-in-out';
                }, 1);
            });
        }, 421);

        // SET FOOTNOTE
        if (vis.id === 'IVE' || vis.id === 'GIF' || vis.id === 'DWGI' || vis.id === 'GBAL') {
            document.getElementById('growth-geo-sup').innerText = 7;
        } else {
            document.getElementById('growth-geo-sup').innerText = 8;
        }

        // SET WIDTH OF TITLE
        if (window.innerWidth < 1200) {
            setNameWidth('115px', '105px')
        } else if (window.innerHeight < 800) {
            setNameWidth('205px', '175px')
        } else {
            setNameWidth('205px', '165px')
        }

        function setNameWidth(num, num1) {
            if (vis.id === 'AMBAL') {
                document.getElementById('geo-index-name-reg').style.width = num
                document.getElementById('geo-index-name-alt').style.width = num
            } else {
                document.getElementById('geo-index-name-reg').style.width = num1
                document.getElementById('geo-index-name-alt').style.width = num1
            }
        }

    }

} // END class

