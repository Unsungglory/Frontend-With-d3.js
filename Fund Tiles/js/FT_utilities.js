// **************************************************************** //
// FADES BETWEEN PAGE SECTIONS
// **************************************************************** //
async function showSection(el) {
    console.log('show section')
    let alt = 'r6-growth-section'

    if (el === 'r6-growth-section') {
        alt = 'growth-section';
    }

    document.getElementById(alt).style.opacity = 0;

    document.getElementById(el).style.display = 'block';
    setTimeout(() => {
        document.getElementById(el).style.opacity = 1;
    }, 5);
    setTimeout(() => {
        document.getElementById(alt).style.display = 'none';
    }, 350);

    return new Promise((resolve, reject) => setTimeout(resolve, 1000));
}

// **************************************************************** //
//  SET TICKER IN HEADER
// **************************************************************** //
function setTicker(ticker) {
    const reg = document.getElementById('fund-ticker-reg')
    const alt = document.getElementById('fund-ticker-alt')

    // SET ALT
    alt.innerText = ticker;

    // CROSS FADE
    setTimeout(() => {
        alt.style.opacity = 1;
        reg.style.opacity = 0;
    }, 0);

    // SET REG
    setTimeout(() => {
        reg.innerText = ticker;
    }, 450);

    // CUT TO REG
    setTimeout(() => {
        reg.classList.add('no-transition');
        alt.classList.add('no-transition');

        // CUT
        reg.style.opacity = 1;
        alt.style.opacity = 0;

        setTimeout(() => {
            reg.classList.remove('no-transition');
            alt.classList.remove('no-transition');
        }, 100);
    }, 550);
}

function getPageType() {
    if (document.getElementById('growth-section').style.opacity === '1') return 'growth';
    if (document.getElementById('bond-section').style.opacity === "1") return 'bond';
    if (document.getElementById('r6-growth-section').style.opacity === "1") return 'r6 growth';
    if (document.getElementById('target-date-section').style.opacity === "1") return 'target date';
}


// ******************************************** //
// *********** CLOSE FUND TILE ON X *********** //
// ******************************************** //

// send message to parent to close iframe
document.querySelector('.close').addEventListener('click', () => {
    window.parent.postMessage('close', '*');
    // window.parent.postMessage('closeAnnotationUI', '*');
    window.parent.clearAnnotation()

    // wait for fade out
    setTimeout(() => {
        window.parent.postMessage('clear', '*');
    }, 500);

    setTimeout(() => {
        closeSubnav();
    }, 300);

    hideAllSections();
})

function hideAllSections() {
    const growthSection = document.querySelector('#growth-section');
    const bondSection = document.querySelector('#bond-section');
    const r6GrowthSection = document.querySelector('#r6-growth-section');
    const targetDateSection = document.querySelector('#target-date-section');

    setTimeout(() => {
        document.querySelector('#growth-section').style.opacity = 0;
        document.querySelector('#bond-section').style.opacity = 0;
        document.querySelector('#r6-growth-section').style.opacity = 0;
        document.querySelector('#target-date-section').style.opacity = 0;
    }, 1000)
}

// **************************************************************** //
//  ADJUST SCROLL POSITIONS WHEN GOING FROM GEO DONUTS BETWEEN (A/F2) AND R6
// **************************************************************** //
function adjustScrollforGeo(sliderVal) {

    if (currentFundData.a.objective.startsWith('Tax'))
        return

    const scroll = window.scrollY;

    const minOne = window.innerWidth < 1200 ? 2000 : window.innerHeight < 800 ? 2350 : 2700;
    const maxOne = window.innerWidth < 1200 ? 2100 : window.innerHeight < 800 ? 2450 : 3000;
    const minTwo = window.innerWidth < 1200 ? 1450 : window.innerHeight < 800 ? 1700 : 1900;
    const maxTwo = window.innerWidth < 1200 ? 1550 : window.innerHeight < 800 ? 1800 : 2200;

    if ((sliderVal === 'a' || sliderVal === 'f2') && previousSliderVal === 'r6') {
        if (scroll > minOne && scroll < maxOne) {
            setTimeout(() => {
                scrollToSection('growth', 4)
            }, 0);
        }
    } else if ((previousSliderVal === 'a' || previousSliderVal === 'f2') && sliderVal === 'r6') {
        if (scroll > minTwo && scroll < maxTwo) {
            setTimeout(() => {
                scrollToSection('r6-growth', 5)
            }, 0);
        }
    }

}

// **************************************************************** //
// FORMATTERS
// **************************************************************** //
const formatTime = d3.timeFormat('%B %d, %Y');

function nd(time) {
    return new Date(time);
}

const dollar = d3.format("($,.0f");
const comma = d3.format("(,");
// const timeParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

// function convertTime(time) {
//     // format date formateDate makeDate
//     if (time.length != 24) {
//         console.log('convertTime: non-UTC time passed into function, no conversion executed.')
//         return time;
//     }

//     console.error(time);

//     const month = timeParse(time).getMonth() + 1;
//     const day = timeParse(time).getDate();
//     const year = timeParse(time).getFullYear();

//     return month + '/' + day + '/' + year;
// }

// **************************************************************** //
// ON SCROLL
// **************************************************************** //
window.addEventListener('scroll', () => {

    // hide tooltip in glide path
    if (window.scrollY > 50) closeGlidepathTooltip()

    /// make back to top button sticky
    let offsetVal = window.innerWidth < 1200 ? -198 : window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750 ? -238 : -300;
    const section = getPageType() === 'growth' ? 'growth' : getPageType() === 'bond' ? 'bond' : getPageType() === 'r6 growth' ? 'r6-growth' : 'target-date'

    const addedDist = section === 'target-date' ? 80 : 0;
    const jump = document.getElementById(`${section}-footer`).getBoundingClientRect().top + offsetVal + window.scrollY + addedDist;

    let topValue = window.innerWidth < 1200 ? '140px' : window.innerWidth < 1400 && window.innerHeight < 777 ? '181px' : '242px';

    const btns = document.querySelectorAll('.top-btn');

    if (jump <= window.scrollY) {

        btns.forEach(b => b.style.position = 'fixed');
        btns.forEach(b => b.style.top = topValue);

        if (window.innerWidth < 1200) {
            const topbtn = document.querySelector('.p-footer .top-btn');
            topbtn.style.right = '50px';
        }

    } else {
        // RESHOW AS SOON AS WE SCROLL, THIS IS KIND OF A WEIRD WAY OF DOING THIS
        const tbb = document.querySelectorAll('.top-btn button');
        tbb.forEach(b => {
            b.style.opacity = 1;
        });

        const btns = document.querySelectorAll('.top-btn');

        btns.forEach(b => b.style.position = 'absolute');
        btns.forEach(b => b.style.top = '22px');

        if (window.innerWidth < 1200) {
            const topbtn = document.querySelector('.p-footer .top-btn');
            topbtn.style.right = '50px';
        }
    }
});

function closeGlidepathTooltip() {
    document.getElementById('r6-tooltip').style.opacity = 0;
}

// **************************************************************** //
// SCROLL FUNCTIONS
// **************************************************************** //
function jumpToDisclosures() {
    let section = null;
    let addedDist = 0;
    if (getPageType() === 'growth') {
        section = 'growth';
    } else if (getPageType() === 'bond') {
        section = 'bond';
    } else if (getPageType() === 'r6 growth') {
        section = 'r6-growth'
    } else {
        addedDist = 80;
        section = 'target-date';
    }

    const offsetVal = window.innerWidth < 1200 ? -198 : window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750 ? -238 : -300

    const jump = document.getElementById(`${section}-footer`).getBoundingClientRect().top + offsetVal + window.scrollY + addedDist;

    $('html, body').animate(
        {
            scrollTop: jump
        },
        900,
        'swing'
    );
}

const scrollToSection = (section, num) => {
    closeSubnav();

    const offsetVal = window.innerWidth < 1200 ? -125 : window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750 ? -175 : -232

    const jump = num === 1 ? 0 : document.querySelector(`#fp-${section}-${num}`).getBoundingClientRect().top + offsetVal + window.scrollY;

    $('html, body').animate(
        {
            scrollTop: jump
        },
        800,
        'swing'
    );
}

function scrollToTop(e = null) {
    if (e)
        e.preventDefault();
    $('html, body').animate(
        {
            scrollTop: 0
        },
        700,
        'swing'
    );
}

// **************************************************************** //
// LISTEN FOR KEYPRESSES
// **************************************************************** //
window.addEventListener('keydown', (e) => {
    // D PRESSED
    if (e.key.toLowerCase() === 'd') {
        jumpToDisclosures();
    }

    // UP PRESSED
    if (e.key === 'ArrowUp') {
        scrollToTop(e);
    }

    if (event.key.toLowerCase() === 'a') {
        const uiHidden =
            window.parent.document.querySelector('#annotation-ui-container').style.opacity === '0' ||
            window.parent.document.querySelector('#annotation-ui-container').style.right === '-45px';

        if (uiHidden) {
            window.parent.postMessage('openAnno', '*');
        } else {
            window.parent.postMessage('closeAnnotationUI', '*');
            if (document.getElementById('subnav')) {
                document.getElementById('subnav').focus();
                document.getElementById('subnav').focus;
                document.getElementById('subnav').click();
            }
        }
    }
})

// **************************************************************** //
// **************************************************************** //
function goWeb() {
    window.open("http://capitalgroup.com")
}


///////////////////////////
function launchPage() {
    if (pageLink)
        window.open(pageLink);
}

///////////////////////////
function launchExpensePage() {
    if (expenseLink)
        window.open(expenseLink);
}

// **************************************************************** //
// **************************************************************** //
function launchSharkfinPage() {
    try {
        window.parent.postMessage('launchSF', '*');
    } catch (error) {
        console.log(error)
    }

    try {
        window.parent.launchSharkfin();
    } catch (error) {
        console.log(error)
    }
}

//***************************************** */
// TRIGGER SCREEN SHOT BY PRESSING: SsS ///
//***************************************** */
let one = false;
let two = false;
document.addEventListener('keydown', e => {
    if (e.key === 'S') {
        if (two) {
            window.parent.postMessage('makePic()', '*');
            document.querySelectorAll('.top-btn').forEach(btn => btn.style.display = 'none');
            one = false;
            two = false;
        } else {
            one = true;
        }
    } else if (one && e.key === 's') {
        two = true;
    } else if (e.key != 'Shift') {
        one = false;
        two = false;
    }
});
