function setR6Scorecard(data) {

    console.log('SC', data)

    if (Object.keys(data.scorecard).length < 5) {
        document.getElementById('r6-sc-hider').style.opacity = 1;
        return;
    } else {
        document.getElementById('r6-sc-hider').style.opacity = 0;
    }
    // set date
    document.getElementById('r6-sc-date').innerText = `As of ${data.scorecard.asOfDate}`;

    // set dot color
    const dotColor = boxColors[data.objective]

    document.getElementById('r6-scorecard-cirle-color').style.backgroundColor = dotColor;

    // set fund name
    document.getElementById('r6-sc-fund-name').innerHTML = data.name;

    // set fund ticker
    document.getElementById('r6-sc-ticker').innerText = data.ticker;

    // set objective
    document.getElementById('r6-sc-objective').innerText = data.mstarCat;

    // SET VALS AND COLORS
    document.querySelectorAll('.r6-sc-bx').forEach((box, i) => {
        if (i < 4)
            box.classList = 'bsc-colored-box r6-sc-bx';
        switch (i) {
            case 0:
                // 'Score' box
                box.firstElementChild.innerText = typeof data.scorecard.score === "Number" ? d3.format(',')(data.scorecard.score) : data.scorecard.score === 'NA' ? enDash('-') : data.scorecard.score;
                const scorePeers = data.scorecard.scorePeers ? d3.format(',')(data.scorecard.scorePeers) : enDash('-');
                box.lastElementChild.innerText = "(" + scorePeers + ")";
                box.classList.add(setBoxColor(data.scorecard.score))
                break;
            case 1:
                // 1-yr avg box
                box.firstElementChild.innerText = String(data.scorecard.oneYear) ? typeof data.scorecard.oneYear === "Number" ? d3.format(',')(data.scorecard.oneYear) : data.scorecard.oneYear === 'NA' ? enDash('-') : data.scorecard.oneYear : enDash('-');
                const oneYearPeers = data.scorecard.oneYearPeers ? d3.format(',')((data.scorecard.oneYearPeers)) : enDash('-')
                box.lastElementChild.innerText = "(" + oneYearPeers + ")";
                box.classList.add(setBoxColor(data.scorecard.oneYear))
                break;
            case 2:
                // 3 year box
                box.firstElementChild.innerText = data.scorecard.threeYear === 'NA' ? enDash('-') : String(data.scorecard.threeYear) ? d3.format(',')(data.scorecard.threeYear) : enDash('-');
                const threeYearPeers = data.scorecard.threeYearPeers === 'NA' ? enDash('-') : data.scorecard.threeYearPeers ? d3.format(',')(data.scorecard.threeYearPeers) : enDash('-');
                box.lastElementChild.innerText = "(" + threeYearPeers + ")";
                box.classList.add(setBoxColor(data.scorecard.threeYear))
                break;
            case 3:
                // 5 year box
                box.firstElementChild.innerText = data.scorecard.fiveYear === 'NA' ? enDash('-') : String(data.scorecard.fiveYear) ? d3.format(',')(data.scorecard.fiveYear) : enDash('-');
                const fiveYearPeers = data.scorecard.fiveYearPeers === 'NA' ? enDash('-') : data.scorecard.fiveYearPeers ? d3.format(',')(data.scorecard.fiveYearPeers) : enDash('-');
                box.lastElementChild.innerText = "(" + fiveYearPeers + ")";
                box.classList.add(setBoxColor(data.scorecard.fiveYear))
                break;
            case 4:
                const firmScore = data.scorecard.firmScore === 'NA' ? 'N/A' : String(data.scorecard.firmScore) ? data.scorecard.firmScore : enDash('-');
                box.firstElementChild.innerText = firmScore;
                break;
            case 5:
                const RPAGScore = data.scorecard.RPAGScore === 'NA' ? 'N/A' : String(data.scorecard.RPAGScore) ? data.scorecard.RPAGScore : enDash('-')
                box.firstElementChild.innerText = RPAGScore;
                break;
            default:
                break;
        }
    })
}

function noVal(box) {
    box.lastElementChild.style.marginLeft = '1em';
    return 'N/A';
}

function setBoxColor(num) {
    if (num <= 25) {
        return 'bond-sc-green'
    } else if (num <= 50) {
        return 'bond-sc-pale-green'
    } else if (num <= 75) {
        return 'bond-sc-yellow'
    } else if (num <= 100) {
        return 'bond-sc-red'
    } else {
        return 'grey-bg'
    }
}

// data format

// scorecard:
// RPAGScore: "7 of 10"
// asOfDate: "6/30/20"
// firmScore: "7 of 10"
// fiveYear: 13
// fiveYearColor: "green"
// fiveYearPeers: 314
// oneYear: 31
// oneYearColor: "light green"
// oneYearPeers: 432
// score: 53
// scoreColor: "yellow"
// scorePeers: 473
// threeYear: 17
// threeYearColor: "green"
// threeYearPeers: 368