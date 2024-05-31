// **************************************************************** //
// UPDATES TEMPLATE DEPENDING ON GROWTH, BOND, TAX-EXEMPT, ETC
// **************************************************************** //
async function drawPage(id) {

    // FOR VRP ONLY
    // if (id.toUpperCase() === 'TARGET DATE DEEP DIVE') {
    //     id = 'AFTD';
    //     document.querySelectorAll('.view-all-nav').forEach(el => el.style.display = 'none')
    //     window.parent.closeSidebar();
    // }

    resetGrowthAF2GrowthSlider();
    hideBackToTop();

    console.log('A', dataA);
    console.log('F2', dataF2);
    console.log('R6', dataR6);
    console.log('AFTD', tdData);

    // START SCROLL POSITION FROM TOP WHEN CALLED FOR FIRST TIME (ms edge)
    document.body.scrollTop = 0; //Zero is the pixels from the top of the screen
    document.documentElement.scrollTop = 0;
    currentFundId = id.trim();
    toggleClassText();

    if (id !== 'AFTD') {
        console.log('finding', id)
        // aShares = await find(JSON.parse(window.localStorage.getItem('dataA-fp')));
        // f2Shares = await find(JSON.parse(window.localStorage.getItem('dataF2-fp')));
        // r6Shares = await find(JSON.parse(window.localStorage.getItem('dataR6-fp')));
        aShares = await find(dataA);
        f2Shares = await find(dataF2);
        r6Shares = await find(dataR6);

        // abort if ID is not valid
        try {
            if (r6Shares) {
                console.log('found a, f2, r6', aShares.id, f2Shares.id, r6Shares.id)
            } else {
                console.log('found', aShares.id, f2Shares.id)
            }
        } catch (error) {
            console.error('fund ' + id + ' not found!')
            return
        }
    }
    // else {
    //     tdData = JSON.parse(window.localStorage.getItem('dataTD'))
    // }

    // WAIT FOR DATA TO BE FOUND BEFORE OPENING
    window.parent.postMessage('open', '*');

    async function find(data) {

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data.find((d, i) => {
                    console.log(i, d.id)
                    return d.id === currentFundId
                }))
            }, window.navigator.userAgent.includes('Edge') ? 200 : 0);
        });

        return await promise; // "done!"
    }

    // IF SLIDER IS F2 SHARES, PASS IN F2 SHARES, etc
    let sliderVal = null;

    /// EXCEPTION CASES FOR SETTING R6 BY DEFAULT...
    if (id === 'AFTD') {
        sliderVal = 'TD' // TD ONLY 
    } else if (id === 'AHIM' || id === 'LTEX' || id === 'TEBF') {
        // A AND F2 SHARE CLASSES
        sliderVal = document.getElementById('ft-share-class-two-buttons').getAttribute('fund-class');
    } else {
        // THREE SHARE CLASSES
        sliderVal = document.getElementById('ft-share-class-buttons').getAttribute('fund-class');
    }
    ////////////////
    previousSliderVal = sliderVal;

    if (receivedShareClass) {
        sliderVal = receivedShareClass;
    }

    if (sliderVal === 'f2') {
        currentFundClass = 'f2';
        setHeaderInfo(f2Shares);
        expenseLink = f2Shares.expenseLink;
    } else if (sliderVal === 'a') {
        currentFundClass = 'a';
        setHeaderInfo(aShares);
        expenseLink = aShares.expenseLink;
    } else if (sliderVal === 'r6') {
        currentFundClass = 'r6';
        setHeaderInfo(r6Shares);
        expenseLink = r6Shares.expenseLink;
    } else if (sliderVal === 'TD') {
        setHeaderInfo(tdData);
        expenseLink = tdData.expenseLink;
    }

    changeTopDisc(sliderVal);

    currentFundData['a'] = aShares;
    currentFundData['f2'] = f2Shares;
    currentFundData['r6'] = r6Shares;

    if (receivedShareClass) {
        handleSlider(sliderVal);
        previousSliderVal = sliderVal;
    }

    // INSERT DISCLOSURES
    insertDisclosures(currentFundData, sliderVal);

    // SHOWS / HIDES ENTIRE PAGE GROUPS
    if (sliderVal === 'TD') {
        // ****************************
        // DRAW THE TARGET DATE PAGE
        // ****************************
        togglePageType('target-date');  // shows nav & section for TD

        // GLIDEPATH
        glidePath1 = new GlidePath('td-hero-chart-1');
        glidePath2 = new GlidePath('td-hero-chart-2');
        glidePath3 = new GlidePath('td-hero-chart-3');

        // FLEXIBILITY SECTION
        flexOne = new TDFLEXSECTION('flex-chart-0', tdData.flexibility.assetClass, 100, 7, [20, 30, 40, 50, 60, 70, 80, 90]);
        flexTwo = new TDFLEXSECTION('flex-chart-1', tdData.flexibility.geo, 55, 0, [10, 20, 30, 40, 50]);
        flexThree = new TDFLEXSECTION('flex-chart-2', tdData.flexibility.equity, 55, 0, [10, 20, 30, 40, 50]);
        flexFour = new TDFLEXSECTION('flex-chart-3', tdData.flexibility.marketCap, 55, 0, [10, 20, 30, 40, 50]);

        // VALUE SECTION
        valueChart = new VALUECHART();

        // EXCESS RETURNS 
        excessReturns = new TDEXCESSRETURNS();

        // SUCCESS RATES
        // tdPie1 = new TDDonut('td-pie-0', dataTD, 'rgba(123, 208, 226, 1)');
        // tdPie2 = new TDDonut('td-pie-1', dataTD, 'rgba(12, 155, 216, 1)');
        // tdPie3 = new TDDonut('td-pie-2', dataTD, 'rgba(0, 174, 169, 1)');

        // tdBar1 = new TDBars('td-bar-chart-0', dataTD, true);
        // tdBar2 = new TDBars('td-bar-chart-1', dataTD);
        // tdBar3 = new TDBars('td-bar-chart-2', dataTD);
        // END SUCCESS RATES SECTION 

        // UNDERLYING FUNDS
        underLyingFundsTable();
        // ufStackedBars = new StackedBarChart();
        // tdBarChart = new TDBarChartSection();
        // calculateLinePos();

        // EQUITY 
        tdEquity();

        // RESILIENCY
        // tdResiliency();

        // PEER COMPARISON IN ITS OWN JS FILE

        // RETURNS
        tdReturns();

    } else if (aShares.objective.startsWith('Tax')) {
        // ******************
        // DRAW THE BOND PAGE
        // ******************
        togglePageType('bond-section');  // shows nav & section for bond
        bondSection1(currentFundData, currentFundClass, aShares.objective);
        barChartBond = new BarChartBond(currentFundData, currentFundClass, aShares.objective);
        creditRating(currentFundData, currentFundClass);
        bondHoldings = new BondHoldings(currentFundData, currentFundClass);
        bondGeoPie = new BondGeoPie(currentFundData, currentFundClass);
        bondGeoMap = new BondGeoMap(currentFundData, currentFundClass);

        handleScorecardOverlay(currentFundData, sliderVal); // HANDLE SCORECARD
    } else if ((sliderVal === 'a' || sliderVal === 'f2') && (aShares.objective === 'Growth' || aShares.objective === 'Growth and income' || aShares.objective.toLowerCase().trim().includes('equity income') || currentFundData.a.objective === 'Balanced')) {
        // ******************
        // DRAW GROWTH PAGE
        // ******************

        togglePageType('growth-section'); // UPDATE NAV

        // sets all the info on the bottom of growth section hero
        updateLineChartStats();

        // console.log('')
        // console.error('this is the data being passed to our lineChart constructor', currentFundData)

        // lineChart call
        lineChart = new LineChart('chart-1', currentFundData, isCash, currentFundClass);


        barChart = new BarChart(currentFundData, currentFundClass, aShares.objective); // SECTION 2 A/F2 (IN DRAW PAGE FUNCTION)
        topHoldings(currentFundData, currentFundClass); // SECTION 3 A/F2/ (IN DRAW PAGE FUNCTION)
        growthDonut = new DrawPie('growth-geo-chart', currentFundData, currentFundClass, isDomicile); // SECTION 4 A/F2 (IN DRAW PAGE FUNCTION)
        drawStressTest(currentFundData, currentFundClass) // SECTION 5 A/F2/ (IN DRAW PAGE FUNCTION)
    } else if (sliderVal === 'r6') {
        // ************************************
        // DRAW THE R6 PAGES (drawPage())
        // ************************************
        if (aShares.objective === 'Growth' || aShares.objective === 'Growth and income' || aShares.objective.toLowerCase().trim().includes('equity income')) {

            togglePageType('r6-growth');  // shows nav & section for bond

            // R6 HERO
            r6pieOne = new R6Donut('r6-hero-chart-1', r6Shares, 'index');
            r6pieTwo = new R6Donut('r6-hero-chart-2', r6Shares, 'peer', 200);

            if (currentFundData.r6.id === 'WMIF') {
                document.getElementById('r6-hero-chart-3').style.display = 'block';
                r6pieThree = new R6Donut('r6-hero-chart-3', r6Shares, 'peer2', 400);
            } else {
                document.getElementById('r6-hero-chart-3').style.display = 'none';
            }

            // HERO BOTTOM SECTION FOR BARS
            r6BarsOne = new R6BarChart('r6-hero-bar-1', r6Shares, 'index');

            document.getElementById('r6-bar2-container').style.display = 'grid';
            r6BarsTwo = new R6BarChart('r6-hero-bar-2', r6Shares, 'peer');

            if (currentFundData.r6.id === 'WMIF') {
                document.getElementById('r6-bar3-container').style.display = 'grid';
                r6BarsThree = new R6BarChart('r6-hero-bar-3', r6Shares, 'peer2');
            } else {
                document.getElementById('r6-bar3-container').style.display = 'none';
            }

            r6BarsFour = new R6BarChart('r6-hero-bar-4', r6Shares, 'expense');
            // END R6 HERO

            r6BarChart = new R6BarChartSection('bar-chart-r6-main', currentFundData['r6']); // R6 BARS SECTION 2 (R6)
            r6Longterm = new R6LongtermSection(currentFundData['r6']); // R6 LONGTERM SECTION
            setR6ContributorsText(currentFundData['r6']); // R6 2Q CONTRIBUTORS/DETRACTORS SECTION
            r6GeoPie = new DrawPieR6Geo(currentFundData['r6']) // R6 GEO PIE
            setR6Scorecard(currentFundData['r6']); // R6 SCORECARD
            setR6mstar(currentFundData['r6']); // R6 mstar

        } else if (aShares.objective === 'Balanced') {
            // DRAWPAGE();

            togglePageType('balanced');  // shows nav & section for bond

            r6pieOne = new R6Donut('r6-hero-chart-1', r6Shares, 'peer');
            r6pieTwo = new R6Donut('r6-hero-chart-2', r6Shares, 'index', 200);
            document.getElementById('r6-hero-chart-3').style.display = 'none';

            r6BarsOne = new R6BarChart('r6-hero-bar-1', r6Shares, 'downside');
            r6BarsTwo = new R6BarChart('r6-hero-bar-4', r6Shares, 'expense');
            document.getElementById('r6-bar2-container').style.display = 'none';
            document.getElementById('r6-bar3-container').style.display = 'none';

            r6BarChart = new R6BarChartSection('bar-chart-r6-main', currentFundData['r6']); // R6 BARS SECTION 2 (R6)
            r6Longterm = new R6LongtermSection(currentFundData['r6']); // R6 LONGTERM SECTION
            setR6ContributorsText(currentFundData['r6']); // R6 2Q CONTRIBUTORS/DETRACTORS SECTION
            r6GeoPie = new DrawPieR6Geo(currentFundData['r6']) // R6 GEO PIE
            setR6Scorecard(currentFundData['r6']); // R6 SCORECARD
            setR6mstar(currentFundData['r6']); // R6 mstar
        }

        if (receivedShareClass) {
            receivedShareClass = null;
        }

        draws++;
    }
}

function resetGrowthAF2GrowthSlider() {
    const slider = document.getElementById('slider-2');

    document.querySelector('#pill-toggle2').style.left = 0;
    document.getElementById('ft-toggle-left2').style.color = 'rgba(0, 41, 75, 1)';
    document.getElementById('ft-toggle-right2').style.color = 'rgba(127, 127, 127, 1)';
    isDomicile = true;
    slider.setAttribute('domicile', false)
}

function hideBackToTop() {
    // THIS ONLY EXISTS TO TEMPORARILY HIDE BACK TO TOP BUTTON WHEN CROSSFADING
    // SO THAT THAT BUTTON ISN'T MOMENTARILY VISIBLE
    const btns = document.querySelectorAll('.top-btn button');
    btns.forEach(b => {
        b.style.opacity = 0;
    });
}

// ************************************************ ****************************** //
// ****** CROSSFADES BETWEEN PAGE SECTIONS (GROWTH VS BOND VS TARGET DATE) ****** //
// ********************************************** ****************************** // 
let isTrans = false; // .3S TRANSITION
function togglePageType(el) {
    if (isTrans) return
    isTrans = true;

    const growthSection = document.querySelector('#growth-section');
    const bondSection = document.querySelector('#bond-section');
    const r6GrowthSection = document.querySelector('#r6-growth-section');
    const targetDateSection = document.querySelector('#target-date-section');

    function showSection(el) {
        el.style.display = 'block';
        setTimeout(() => {
            el.style.opacity = 1;
        }, 1);
    }

    function hideSection(el) {
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.display = 'none';
        }, 320);
    }

    if (el === 'growth-section') {
        // SHOW GROWTH SECTION
        showSection(growthSection);
        hideSection(bondSection);
        hideSection(r6GrowthSection);
        hideSection(targetDateSection);
    } else if (el === 'bond-section') {
        // SHOW BOND SECTION
        hideSection(growthSection);
        showSection(bondSection);
        hideSection(r6GrowthSection);
        hideSection(targetDateSection);
    } else if (el === 'r6-growth' || el === 'balanced') {
        // SHOW R6 SECTION
        hideSection(growthSection);
        hideSection(bondSection);
        showSection(r6GrowthSection);
        hideSection(targetDateSection);
    } else if (el === 'target-date') {
        // SHOW TARGET DATE SECTION
        hideSection(growthSection);
        hideSection(bondSection);
        hideSection(r6GrowthSection);
        showSection(targetDateSection);
    }

    setTimeout(() => {
        isTrans = false;
    }, 300);

    // SHOW/HIDE GROWTH/BOND SUBNAV MENUS
    toggleSubMenu(el)

    function toggleSubMenu(section) {
        if (section === 'growth-section') {
            updateSubNav('growth')
        } else if (section === 'bond-section') {
            updateSubNav('bond')
        } else if (section === 'r6-growth' || section === 'balanced') {
            updateSubNav('r6')
        } else if (section === 'target-date') {
            updateSubNav('td')
        }
    }
}

// **************************************************************** //
//  HANDLE SCORECARD ACTIVE/INACTIVE
// **************************************************************** //
function handleScorecardOverlay(currentFundData, id = 'r6') {
    const navScoreCard = document.getElementById('r6-bond-nav');

    if (currentFundData.a.id === 'BFA' || currentFundData.a.id === 'IBFA' || currentFundData.a.id === 'SBF' || currentFundData.a.id === 'MSI') {

        if (id === 'r6') {
            if (currentFundData.a.id === 'SBFjjjjj') {
                document.getElementById('bond-scorecard-overlay').style.opacity = 1;
            } else {
                document.getElementById('bond-scorecard-overlay').style.opacity = 0;
                bondScorecard(currentFundData['r6']); // R6 SCORECARD
            }
            bondSCRestoreHeight();
        } else {
            bondSCRemoveHeight();
        }

    } else {
        // HIDE NAV TITLE, HIDE BOX
        bondSCRemoveHeight();
    }
}

function bondSCRestoreHeight() {
    el = document.getElementById('fp-bond-6');
    el.style.height = window.innerWidth < 1100 ? '229px' : window.innerHeight < 770 ? '289px' : '329px';
    el.style.marginBottom = '50px';
    el.style.opacity = 1;
    document.getElementById('r6-bond-nav').style.opacity = 1;
    document.getElementById('r6-bond-nav').style.pointerEvents = 'all';
}

function bondSCRemoveHeight() {
    // scrollToSection('bond', 5)
    el = document.getElementById('fp-bond-6');
    el.style.height = '0';
    el.style.marginBottom = '0';
    el.style.opacity = '0';
    document.getElementById('r6-bond-nav').style.opacity = 0;
    document.getElementById('r6-bond-nav').style.pointerEvents = 'none';
}
// ********************** ********************** //
// ******* CROSSFADE FOR HEADER UPDATE ******** //
// ********************** ******************** //
function setHeaderInfo(data) {
    // SHOW/HIDE SHARE BUTTONS
    // todo
    if (data.id === 'AFTD') {
        // R6 ONLY
        showShareButtons('ft-r6-only');
        hideShareButtons('ft-share-class-two-buttons');
        hideShareButtons('ft-share-class-buttons');
    } else if (data.id === 'AHIM' || data.id === 'LTEX' || data.id === 'TEBF') {
        // A AND F2
        showShareButtons('ft-share-class-two-buttons');
        hideShareButtons('ft-share-class-buttons');
        setTimeout(() => {
            hideShareButtons('ft-r6-only');
        }, 500);
    } else {
        // ALL THREE CLASSES (A, F2, R6)
        showShareButtons('ft-share-class-buttons');
        hideShareButtons('ft-share-class-two-buttons');
        setTimeout(() => {
            hideShareButtons('ft-r6-only');
        }, 500);
    }

    // BOX COLOR
    document.querySelector('#fund-box').style.backgroundColor = boxColors[data.objective.trim()];

    // FUND EST DATE (NO CROSS FADE)
    if (data.id !== 'AFTD') {
        // const myDate = timeParse(data.inception);
        // const est = `${myDate.getMonth() + 1}/${myDate.getDate()}/${String(myDate.getFullYear()).slice(-2)}`;

        document.getElementById(`growth-fund-est-reg`).innerHTML = 'Fund inception ' + data.inception;
        document.getElementById(`bond-fund-est-reg`).innerHTML = 'Fund inception ' + data.inception;
    }

    // document.getElementById(`bond-fund-est-${section}`).innerHTML = 'Fund inception ' + est;

    // FUND OBJECTIVE (lower case other than first word)
    const words = data.objective.split(' ')
    let output = '';
    words.forEach((word, i) => {
        if (i > 0)
            output += word.toLowerCase() + ' ';
        else
            output = word + ' '
    });

    output = output.trim();

    if (output.toLowerCase() === 'taxable bond')
        output = 'Core bond'

    function updateHeaderText(section) {
        // FUND ID
        document.getElementById(`fund-box-text-${section}`).innerHTML = data.id;

        // TRADEMARK
        const tm = data.trademark === `SM` ? `<sup>${data.trademark}</sup>` : data.trademark;
        document.getElementById(`fund-name-${section}`).innerHTML = data.name + tm;

        // OBJECTIVE
        document.getElementById(`fund-cat-${section}`).innerHTML = output;

        // TICKER 
        document.getElementById(`fund-ticker-${section}`).innerText = data.ticker;
    }

    updateHeaderText('alt');

    // UPDATE LINK
    pageLink = data.pageLink;

    // PREVENT FLICKER (objective & launch icon) WHEN CROSSFADING ELEMENTS IN THE SAME POSITION
    const objectiveReg = document.getElementById(`fund-cat-reg`);
    const objectiveAlt = document.getElementById(`fund-cat-alt`);
    if (objectiveReg.innerText === objectiveAlt.innerText) {
        objectiveReg.classList.add('no-transition');
        objectiveAlt.classList.add('no-transition');
        objectiveAlt.classList.add('no-transition');
    }

    // CROSSFADE ALL ELEMENTS
    if (draws > 0) {
        setTimeout(() => {
            document.querySelectorAll('.header-reg-el').forEach(el => el.style.opacity = 0);
            document.querySelectorAll('.header-alt-el').forEach(el => el.style.opacity = 1);
        }, 0);
    }

    // TURN REG ELEMENTS ON AND TURN ALT ELEMENTS OFF (NOT CROSSFADING, JUST CUT)
    const regElements = document.querySelectorAll('.header-reg-el');
    const altElements = document.querySelectorAll('.header-alt-el');
    setTimeout(() => {
        updateHeaderText('reg');

        regElements.forEach(el => {
            el.classList.add('no-transition');
            el.style.opacity = 1;
        })

        altElements.forEach(el => {
            el.classList.add('no-transition');
            el.style.opacity = 0;
        })

        setTimeout(() => {
            regElements.forEach(el => el.classList.remove('no-transition'));
            altElements.forEach(el => el.classList.remove('no-transition'));

        }, 100);
    }, draws === 0 ? 0 : 550);

    // ********************** ********************** //
    function hideShareButtons(el) {
        const buttons = document.getElementById(el);
        buttons.style.opacity = 0;
        buttons.parentElement.style.pointerEvents = 'none';
    }

    function showShareButtons(el) {
        const buttons = document.getElementById(el);
        buttons.style.opacity = 1;
        buttons.parentElement.style.pointerEvents = 'all';

    }
}



// **************************************************************** //
// ON RESIZE
// **************************************************************** //
window.addEventListener('resize', onResize);

function onResize() {
    if (getPageType() === 'growth') {
        if (lineChart) lineChart.redraw();
        if (barChart) barChart.redraw(currentFundClass, currentFundData.a.objective);
        if (growthDonut) growthDonut.redraw(currentFundClass, isDomicile, true);
        resizeStressText(currentFundData, currentFundClass)
    } else if (getPageType() === 'bond') {
        bondSection1Update(currentFundData, currentFundClass);
        if (barChartBond) barChartBond.redraw(currentFundClass, currentFundData.a.objective);
        if (bondHoldings) bondHoldings.redraw();
        if (bondGeoPie) bondGeoPie.redraw();
        if (bondGeoMap) bondGeoMap.redraw();
    } else if (getPageType() === 'r6 growth') {
        if (r6pieOne) r6pieOne.redraw();
        if (r6pieTwo) r6pieTwo.redraw();
        if (r6pieThree) r6pieThree.redraw();
        setTimeout(() => {
            if (r6BarsOne) r6BarsOne.redraw()
            if (r6BarsTwo) r6BarsTwo.redraw()
            if (r6BarsThree) r6BarsThree.redraw()
            if (r6BarsFour) r6BarsFour.redraw()
        }, 100);
        if (r6BarChart) r6BarChart.redraw();
        if (r6Longterm) r6Longterm.redraw();
        if (r6GeoPie) r6GeoPie.redraw(true)
    } else if (getPageType() === 'target date') {

        // SECTION 1
        if (glidePath1) glidePath1.redraw();
        if (glidePath2) glidePath2.redraw();
        if (glidePath3) glidePath3.redraw();

        // SECTION 2 (FLEXIBILITY)
        if (flexOne) flexOne.redraw();
        if (flexTwo) flexTwo.redraw();
        if (flexThree) flexThree.redraw();
        if (flexFour) flexFour.redraw();

        // SECTION 3 (VALUE)
        if (valueChart) valueChart.redraw();

        // SECTION 4 (EXCESS RETURNS)
        if (excessReturns) excessReturns.wrangle();

        // SECTION 7 UNDERLYING FUNDS
        underLyingFundsTable(true);
        // if (ufStackedBars) ufStackedBars.redraw();
        // if (tdBarChart) tdBarChart.redraw();
        // calculateLinePos();

        // EQUITY not needed on resize
        // RESILIENCY not needed on resize
        // SECTION 6 PEER COMPARISON IN ITS OWN JS FILE
        // TD RETURNS NOT NEEDED ON RESIZE
    }

    addBlackBar();
}

function removeResize() {
    window.removeEventListener('resize', onResize);
}

// **************************************************************** //
// ADD BLACK BAR TO TOP IF USING IPAD (not necessary?)
// **************************************************************** //
// i don't even think this is needed
function addBlackBar() {

    const iPadMobile =
        window.orientation >= -90 &&
        window.navigator.vendor.startsWith('Apple') &&
        window.navigator.userAgent.includes('Safari');

    if (iPadMobile && window.innerHeight > 800) {
        // IF BAR DOESN'T EXIST, PREPEND IT (and only do it once, as this is called on resize when going fullscreen in Seismic)
        if (!document.querySelector('.mobile-bar')) {
            const mobileBar = document.createElement('div');
            mobileBar.classList = 'mobile-bar';
            document.body.prepend(mobileBar);
        }
        document.querySelector('.mobile-bar').style.display = `block`;

    } else {
        // hide bar when leaving fullscreen in Seismic (height < 800px)
        if (document.querySelector('.mobile-bar')) {
            document.querySelector('.mobile-bar').style.display = `none`;
        }
    }
}
addBlackBar();

