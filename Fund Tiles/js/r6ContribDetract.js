/// data format
// name: "Tesla Inc"
// portWeight: 2.1425549999999998
// relativeCont: 1.403498
// sector: "Consumer Discretionary"
// stockReturn: 106.070618
// weightDiff: 2.1425549999999998


function setR6ContributorsText(data) {

    console.log(data)

    const titles = document.querySelectorAll('.r6-cont-big-title')
    const words = ['contributors', 'detractors']
    const versusTitle = data.id === 'GBAL' || data.id === 'CIB' || data.id === 'IFA' ? data.indexSecondary : data.indexPrimary;
    titles.forEach((title, i) => {
        title.innerText = `${cdQuarter} top ${words[i]} versus ${versusTitle}`
    })
    const top5 = data.contributors.top5;
    const bot5 = data.contributors.bottom5
    const bot5sorted = bot5.sort(sortByVal);

    function sortByVal(a, b) {
        if (a.relativeCont < b.relativeCont) {
            return -1;
        }
        if (a.relativeCont > b.relativeCont) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    const trans = ['portWeight', 'weightDiff', 'stockReturn', 'relativeCont'];
    const names = document.querySelectorAll('.r6-cont-company-name');
    const sectors = document.querySelectorAll('.r6-cd-sector');
    const values = document.querySelectorAll('.r6-cont-num');
    const dates = document.querySelectorAll('.r6-cd-date');
    const sups = document.querySelectorAll('.r6-pw-sup');

    // FOOTNOTE
    if (data.id === 'AMCAP' || data.id === 'GFA' || data.id === 'EUPAC' || data.id === 'WMIF' || data.id === 'IVE' || data.id === 'NWF' || data.id === 'AMF' ||
        data.id === 'NEF' || data.id === 'SCWF' || data.id === 'WGI' || data.id === 'IGI' || data.id === 'GIF' || data.id === 'FI' || data.id === 'DWGI'
        || data.id === 'CIB' || data.id === 'IFA' || data.id === 'ICA'
    ) {
        sups.forEach(sup => sup.innerText = '4')
    } else
        sups.forEach(sup => sup.innerText = '5')

    dates.forEach(date => date.innerText = `For periods ended ${data.heroData.expenses.asOfDate}`)

    // sets name and sectors
    names.forEach((name, i) => {
        if (i < 5) {
            name.innerText = top5[i].name
            sectors[i].innerText = top5[i].sector

            // set vals
            let counter = 0;
            for (let j = i * 4; j < i * 4 + 4; j++) {
                values[j].innerText = (Math.round(top5[i][trans[counter]] * 100) / 100).toFixed(2);
                counter++;
            }
        } else {
            name.innerText = bot5sorted[i - 5].name
            sectors[i].innerText = bot5sorted[i - 5].sector;

            // set vals
            let counter = 0;
            for (let j = i * 4; j < i * 4 + 4; j++) {
                values[j].innerText = (Math.round(bot5sorted[i - 5][trans[counter]] * 100) / 100).toFixed(2);
                counter++;
            }
        }

    })
}