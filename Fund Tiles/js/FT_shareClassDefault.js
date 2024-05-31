// **************************************************************** //
// SET DEFAULT SHARE CLASS DEPENDING ON WHAT PROJECT FT IS EMBEDDED IN...
// **************************************************************** //

// DCFF SET TO R6
// CWC SET TO R6
// VRP SET TO R6

// EVERYTHING ELSE 'F2' BY DEFAULT

// IF FT IS INSIDE DC FOCUS FUNDS... R6 SHARE CLASS WILL BE LAUNCHED BY DEFAULT
try {
    if (!window.VC_infoID) throw "window.VC_infoID undefined"

    setShareClass(true)
} catch (error) {
    console.warn(error);
    console.warn('Check websiteInfo.js file.');

    const myInt = setInterval(() => {
        console.warn('pausing...')

        try {
            if (window.VC_infoID) {
                console.warn('found id, setting, clearing')
                setShareClass();
                clearInterval(myInt)
            }
        } catch (error) {
            console.warn(error)
        }
    }, 1000);
}

function setShareClass(flag = false) {
    console.warn('VC_infoID', window.VC_infoID)

    // if (websiteTitle.id === 'DCFF' || websiteTitle.id === 'CWC' || websiteTitle.id === 'VRP') {
    if (window.VC_infoID === 'DCFF' || window.VC_infoID === 'CWC' || window.VC_infoID === 'VRP') {

        if (flag)
            console.warn('R6 set by default')
        else
            console.warn('R6 after pause')

        setR6();

    } else if (window.VC_infoID === 'a shares should go here') {

        // this is where a-shares would get set
        if (flag)
            console.warn('A set by default')
        else
            console.warn('A after pause')

    } else {
        // F2 IS DEFAULT CASE
        if (flag)
            console.warn('F2 set by default')
        else
            console.warn('F2 after pause')

        setF2();
    }
}

function setR6() {
    // TRIPLE SLIDER ONLY FOR DCFF FUNDS
    document.getElementById('ft-share-class-buttons').setAttribute('fund-class', 'r6');
    document.getElementById('slider-2-ft').style.left = '66.6%';
}

function setF2() {
    // TRIPLE SLIDER 
    document.getElementById('ft-share-class-buttons').setAttribute('fund-class', 'f2');
    document.getElementById('slider-2-ft').style.left = '33.3%';

    // DOULBE SLIDER 
    document.getElementById('ft-share-class-two-buttons').setAttribute('fund-class', 'f2');
    document.getElementById('slider-1-ft').style.left = '50%';
}

// **************************************************************** //
// NOTES
// **************************************************************** //

// WE ARE TARGETTING THIS CODE IN THE HTML (FUND CLASS ATTR)
//<div class='ft-share-class-buttons' id='ft-share-class-buttons' fund-class='a'>

// REMEMBER THERE'S A TRIPLE SLIDER FOR ALL FUNDS EXCEPT DARK GREEN BONDS
// THERE'S A DOUBLE SLIDER FOR DARK GREEN BONDS

// THIS IS BEING TARGETED IN THE CSS (INITIAL HIGHLIGHTED POSITION IN SLIDER)
// LEFT = 66.6% FOR R6
// LEFT = 33.3% FOR F2
// LEFT = 0 FOR A
// .ft-button-slider {
//     /* left: 66.6%; */
//     /* ADJUST R6 SHARE CLASS HERE */
//     left: 0;
//   }

