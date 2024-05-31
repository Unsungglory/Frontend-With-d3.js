
// **************************************************************** //
//  SLIDER IN HEADER FOR SELECTING SHARE CLASS
// **************************************************************** //
async function handleSlider(sliderVal) {
    if (previousSliderVal === sliderVal) return;

    moveSlider(sliderVal);

    adjustScrollforGeo(sliderVal);


    if (currentFundData.a.objective.startsWith('Tax')) {
        // UPDATE BOND SECTION
        updateSubNav('bond');

        bondSection1Update(currentFundData, currentFundClass); // SECTION 1

        // SECTION 2
        if (barChartBond)
            barChartBond.redraw(currentFundClass, currentFundData.a.objective);
        else
            barChartBond = new BarChartBond(currentFundData, currentFundClass, aShares.objective);

        bondHoldings.redraw(currentFundClass); // SECTION 3
        creditRating(currentFundData, currentFundClass); // SECTION 4

        // SECTION 5
        bondGeoPie.redraw(currentFundClass);
        bondGeoMap.redraw(currentFundClass);

        //CHANGE TOP DISC
        changeTopDisc(sliderVal);

        handleScorecardOverlay(currentFundData, sliderVal); // SECTION 6 
    } else if ((sliderVal === 'a' || sliderVal === 'f2') && (currentFundData.a.objective === 'Growth' || currentFundData.a.objective === 'Growth and income' || currentFundData.a.objective === 'Balanced' || currentFundData.a.objective.toLowerCase().trim().includes('equity income'))) {
        // UPDATE GROWTH SECTION
        updateSubNav('growth')

        //CHANGE TOP DISC
        changeTopDisc(sliderVal);

        // await showSection('growth-section');
        showSection('growth-section');

        const sameTemplate = ((previousSliderVal === 'a' && sliderVal === 'f2') || (previousSliderVal === 'f2' && sliderVal === 'a'));
        // SECTION 1
        updateLineChartStats();
        if (lineChart && sameTemplate)
            lineChart.redraw(currentFundClass, isCash);
        else
            lineChart = new LineChart('chart-1', currentFundData, isCash, currentFundClass);

        // SECTION 2
        if (barChart && sameTemplate)
            barChart.redraw(currentFundClass, currentFundData.a.objective);
        else
            barChart = new BarChart(currentFundData, currentFundClass, aShares.objective);

        // SECTION 3
        topHoldings(currentFundData, currentFundClass)

        // SECTION 4
        if (growthDonut && sameTemplate) {
            growthDonut.redraw(currentFundClass, isDomicile, false);
        }
        else {
            growthDonut = new DrawPie('growth-geo-chart', currentFundData, currentFundClass, isDomicile);
        }

        // SECTION 5
        if (draws === 1 && stressTestTextUpdate && stressTestPie && stressTestLineChart)
            updateStressTest(currentFundData, currentFundClass)
        else {
            drawStressTest(currentFundData, currentFundClass)
        }

        //SCROLL UP
        if (previousSliderVal === 'r6') {
            const offsetVal = window.innerWidth < 1200 ? -198 : window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750 ? -238 : -300
            if (window.scrollY > document.getElementById(`growth-footer`).getBoundingClientRect().top + offsetVal + window.scrollY) {
                scrollToSection('growth', 5)
            }
        }
        // END OF GROWTH/ GROWTH & INCOME
    } else if (sliderVal === 'r6') {
        console.log('SLIDER BUILDING R6 PAGE')

        updateSubNav('r6');
        showSection('r6-growth-section'); // works for balanced too

        // TODO R6 FOR EQUITY, VS TARGET DATE vs balanced
        if (currentFundData.a.objective === 'Growth' || currentFundData.a.objective === 'Growth and income' || currentFundData.a.objective.toLowerCase().trim().includes('equity income')) {
            updateR6hero(); // SECTION 1
            r6BarChart = new R6BarChartSection('bar-chart-r6-main', currentFundData['r6']); // SECTION 2
            r6Longterm = new R6LongtermSection(currentFundData['r6']);  // SECTION 3 // R6 LONGTERM SECTION
            setR6ContributorsText(currentFundData['r6']);  // SECTION 4 // R6 2Q CONTRIBUTORS/DETRACTORS SECTION
            r6GeoPie = new DrawPieR6Geo(currentFundData['r6'])  // SECTION 5 // R6 GEO PIE
            setR6Scorecard(currentFundData['r6']); // SECTION 6 // R6 SCORECARD
            setR6mstar(currentFundData['r6']); // SECTION 7 // R6 mstar

        } else if (currentFundData.a.objective === 'Balanced') {
            updateR6hero(); // SECTION 1
            r6BarChart = new R6BarChartSection('bar-chart-r6-main', currentFundData['r6']); // SECTION 2
            r6Longterm = new R6LongtermSection(currentFundData['r6']); // R6 LONGTERM SECTION
            setR6ContributorsText(currentFundData['r6']); // SECTION 4 // R6 2Q CONTRIBUTORS/DETRACTORS SECTION
            r6GeoPie = new DrawPieR6Geo(currentFundData['r6']) // SECTION 5 // R6 GEO PIE
            setR6Scorecard(currentFundData['r6']); // R6 SCORECARD
            setR6mstar(currentFundData['r6']);// R6 mstar
        }
    }

    insertDisclosures(currentFundData, sliderVal);
    previousSliderVal = sliderVal;
    receivedShareClass = null;

}

function changeTopDisc(sliderVal) {
    const moveUp = window.innerWidth < 1200 ? '-10px' : window.innerWidth < 1400 && window.innerHeight < 800 ? '-17px' : window.innerWidth < 1400 ? '-25px' : '-30px';
    if (sliderVal === 'a') {
        document.getElementById('top-disc-a').style.opacity = 1;
        document.getElementById('top-disc-f2').style.opacity = 0;

        document.getElementById('bond-disc-a').style.opacity = 1;
        document.getElementById('bond-disc-f2').style.opacity = 0;

        document.querySelectorAll('.top-disc').forEach((el, i) => i < 1 ? el.style.marginBottom = '10px' : null);
    } else {
        document.getElementById('top-disc-a').style.opacity = 0;
        document.getElementById('top-disc-f2').style.opacity = 1;

        document.getElementById('bond-disc-a').style.opacity = 0;
        document.getElementById('bond-disc-f2').style.opacity = 1;

        document.querySelectorAll('.top-disc').forEach((el, i) => i < 1 ? el.style.marginBottom = moveUp : null);
    }
}

// **************************************************************** //
//  SHOW BUTTONS, MOVE SLIDER, AND SET HEADER LINKS
// **************************************************************** //
function moveSlider(sliderVal) {

    const slider1 = document.getElementById('slider-1-ft');
    const slider2 = document.getElementById('slider-2-ft');
    const twoButtons = document.getElementById('ft-share-class-two-buttons');
    const threeButtons = document.getElementById('ft-share-class-buttons');

    if (sliderVal === 'r6') {
        // twoButtons.setAttribute('fund-class', 'r6');
        threeButtons.setAttribute('fund-class', 'r6');

        currentFundClass = 'r6';
        // slider1.style.left = '50%';
        slider2.style.left = '66.6%';

        pageLink = currentFundData.r6.pageLink;
        expenseLink = currentFundData.r6.expenseLink;
        setTicker(currentFundData.r6.ticker);
    } else if (sliderVal === 'f2') {
        twoButtons.setAttribute('fund-class', 'f2');
        threeButtons.setAttribute('fund-class', 'f2');

        currentFundClass = 'f2';
        slider1.style.left = '50%';
        slider2.style.left = '33.3%';

        pageLink = currentFundData.f2.pageLink;
        expenseLink = currentFundData.f2.expenseLink;
        setTicker(currentFundData.f2.ticker);

    } else if (sliderVal === 'a') {
        twoButtons.setAttribute('fund-class', 'a');
        threeButtons.setAttribute('fund-class', 'a');

        currentFundClass = 'a';
        slider1.style.left = '0%';
        slider2.style.left = '0%';

        pageLink = currentFundData.a.pageLink;
        expenseLink = currentFundData.a.expenseLink;
        setTicker(currentFundData.a.ticker);
    }

}

// **************************************************************** //
//  UPDATE R6 HERO
// **************************************************************** //
function updateR6hero() {

    // UPDATE PIES
    r6pieOne = new R6Donut('r6-hero-chart-1', r6Shares, 'index');
    r6pieTwo = new R6Donut('r6-hero-chart-2', r6Shares, 'peer', 200);

    if (currentFundData.r6.id === 'WMIF') {
        document.getElementById('r6-hero-chart-3').style.display = 'block';
        r6pieThree = new R6Donut('r6-hero-chart-3', r6Shares, 'peer2', 400);
    } else {
        document.getElementById('r6-hero-chart-3').style.display = 'none';
    }

    // SECTION 1 LOWER PART... UPDATE BARS
    if (currentFundData.r6.objective === 'Growth and income' || currentFundData.r6.objective === 'Growth' || currentFundData.r6.objective.toLowerCase() === 'equity income') {
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
    } else if (currentFundData.r6.objective === 'Balanced') {
        r6BarsOne = new R6BarChart('r6-hero-bar-1', r6Shares, 'downside');
        r6BarsTwo = new R6BarChart('r6-hero-bar-4', r6Shares, 'expense');
        document.getElementById('r6-bar2-container').style.display = 'none';
        document.getElementById('r6-bar3-container').style.display = 'none';
        // document.getElementById('r6-hero-bar-3').style.display = 'none';
    }
}

// **************************************************************** //
//  UPDATE SUBNAV
// **************************************************************** //
function updateSubNav(input) {
    const gMenu = document.getElementById("ft-subheader-growth");
    const bMenu = document.getElementById('ft-subheader-bond');
    const r6Menu = document.getElementById('ft-subheader-r6-growth');
    const tdMenu = document.getElementById('ft-subheader-target-date');

    if (input === 'growth') {
        show(gMenu);
        hide(bMenu);
        hide(r6Menu);
        hide(tdMenu);
    } else if (input === 'bond') {
        hide(gMenu);
        show(bMenu);
        hide(r6Menu);
        hide(tdMenu);
    } else if (input === 'r6') {
        hide(gMenu);
        hide(bMenu);
        show(r6Menu);
        hide(tdMenu);
    } else if (input === 'td') {
        hide(gMenu);
        hide(bMenu);
        hide(r6Menu);
        show(tdMenu);
    }

    function show(el) {
        el.style.opacity = 1;
        el.style.pointerEvents = 'all';
    }

    function hide(el) {
        el.style.opacity = 0;
        el.style.pointerEvents = 'none';
    }
}

// ********************** ********************** //
// ************** SUBNAV FUNCTIONS ************* //
// ********************** ********************** //
function toggleSubnav() {
    const sub = document.querySelector('.ft-subheader');
    if (sub.getAttribute('open') === 'true') {
        closeSubnav();
    } else {
        openSubnav();
        window.parent.postMessage('closeAnnotationUI', '*');
    }
}

function openSubnav() {
    const subnav = document.querySelector('.subnav');

    // const topPosition = window.innerWidth < 1200 ? '110px' : window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750 ? '140px' : window.innerWidth < 1400 ? '190px' : '190px';
    // subnav.style.top = topPosition;

    const headerHeight = document.querySelector('.ft-header').clientHeight + document.querySelector('.ft-subheader').clientHeight;
    subnav.style.top = headerHeight * .9 + 'px';

    const blackBg = document.querySelector('.subnav-black');
    blackBg.style.opacity = 1;
    blackBg.style.pointerEvents = 'all';

    const fundContainer = document.querySelector('.fund-container');
    fundContainer.style.boxShadow = '0px 0px 10px 20px rgba(0, 0, 0, 0.10)';

    const sub = document.querySelector('.ft-subheader');
    sub.setAttribute('open', true)
}

function closeSubnav() {
    const subnav = document.querySelector('.subnav');
    // subnav.style.top = window.innerWidth < 1200 ? '-310px' : '-510px';

    const headerHeight = document.querySelector('.ft-header').clientHeight + document.querySelector('.ft-subheader').clientHeight;
    const subNavHeight = document.getElementById('subnav').clientHeight;
    subnav.style.top = -subNavHeight * 1.02 + headerHeight + 'px';

    const blackBg = document.querySelector('.subnav-black');
    blackBg.style.opacity = 0;
    blackBg.style.pointerEvents = 'none';

    const fundContainer = document.querySelector('.fund-container');
    fundContainer.style.boxShadow = '0px 0px 10px 20px rgba(0, 0, 0, 0)';

    const sub = document.querySelector('.ft-subheader');
    sub.setAttribute('open', false)
};

// ********************** ********************** //
// ****** CLICKING A FUND FROM THE SUBNAV ****** //
// ********************** ********************** //
function fundClick(el) {
    // const el = this;
    const id = el.firstElementChild.innerText;

    // ONLY REDRAW IF DIFFERENT FUND SELECTED BY USER FROM SUBNAV
    if (document.getElementById('fund-box-text-reg').innerText !== id) {

        document.querySelectorAll('.page-section').forEach(page => page.style.opacity = 0);

        // WAIT FOR FADE
        // TRANSITION
        setTimeout(() => {
            drawPage(id); // DRAW NEXT FUND
        }, 400);

        // CLEAR ANNOTATION WHEN SELECTING ANOTHER FUND
        window.parent.postMessage('clear', '*');
    }
    closeSubnav();
}
