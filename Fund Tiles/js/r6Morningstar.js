const mstarFundNames = [
    'AMBAL', 'AMCAP', 'AMF', 'CIB', 'DWGI', 'EUPAC', 'FI', 'GBAL', 'GFA', 'GIF', 'ICA',
    'NPF', 'WMIF', 'IVE', 'NWF', 'NEF', 'SCWF', 'WGI', 'IGI', 'IFA'
]

function setR6mstar(data) {

    // remove stuff from legacy code just in case
    document.querySelectorAll('.r6-mstar-overlay-text').forEach(el => el.remove())
    document.querySelectorAll('.mstar-fund-overlay').forEach(el => el.remove())

    // append all these elements
    const gridElement = document.getElementById('mstar-fund-grid');
    mstarFundNames.forEach(name => {
        const newText = document.createElement('div');
        newText.classList = 'r6-mstar-overlay-text';
        newText.id = `${name}-overlay-text`
        newText.innerHTML = `${name}`;

        const newDiv = document.createElement('div');
        newDiv.className = 'mstar-fund-overlay';
        newDiv.id = `${name}-overlay`;

        gridElement.prepend(newDiv);
        gridElement.prepend(newText);
    })

    // set date
    document.getElementById('r6-mstar-date').innerText = `Morningstar data as of ${data.heroData.expenses.asOfDate} (updated quarterly)`;
    document.getElementById('r6-mstar-date-1').innerText = `Morningstar data as of ${data.heroData.expenses.asOfDate} (updated quarterly)`;

    const sup1 = document.getElementById('r6-ms-sup-1');
    const sup2 = document.getElementById('r6-ms-sup-2');
    const lgTxtGrwth = document.getElementById('large-growth-text');

    // set sup text
    if (data.id === 'AMCAP' || data.id === 'EUPAC' || data.id === 'GFA' || data.id === 'WMIF' || data.id === 'IVE' || data.id === 'NWF' || data.id === 'AMF'
        || data.id === 'GIF' || data.id === 'FI' || data.id === 'IGI' || data.id === 'DWGI' || data.id === 'WGI' || data.id === 'CIB' || data.id === 'IFA'
        || data.id === 'ICA' || data.id === 'NEF' || data.id === 'SCWF'
    ) {
        sup1.innerText = '6';
        sup2.innerText = '7';
    } else {
        sup1.innerText = '7';
        sup2.innerText = '8';
    }

    // GROWTH TEXT
    lgTxtGrwth.innerText = data.mstarCat;

    // set color
    const dotColor = boxColors[data.objective]

    document.getElementById('r6-fund-dot').style.backgroundColor = dotColor;

    // set values
    const trans = ['large', 'medium', 'small', 'wAvg']
    document.querySelectorAll('.r6-morn-big').forEach((el, i) => {
        if (i === 3) {
            el.innerText = d3.format("$,.2f")(data.mstar['wAvg']) + 'M';
        } else {
            el.innerText = data.mstar[trans[i]] + '%';
        }
    })

    // get all overlays
    const blobs = document.querySelectorAll('.mstar-fund-overlay');
    blobs.forEach(blob => blob.style.opacity = 0);

    // get all fund names
    const fundNames = document.querySelectorAll('.r6-mstar-overlay-text');
    fundNames.forEach(name => name.style.opacity = 0);

    const redDot = document.getElementById('red-dot-container');

    switch (data.id) {
        case 'AMBAL':
            document.getElementById('AMBAL-overlay').style.opacity = 1;
            document.getElementById('AMBAL-overlay-text').style.opacity = 1;

            redDot.style.left = '41%';
            redDot.style.top = '-3%';
            break;

        case 'AMCAP':
            document.getElementById('AMCAP-overlay').style.opacity = 1;
            document.getElementById('AMCAP-overlay-text').style.opacity = 1;

            redDot.style.left = '79%';
            redDot.style.top = '3.5%';
            break;

        case 'AMF':
            document.getElementById('AMF-overlay').style.opacity = 1;
            document.getElementById('AMF-overlay-text').style.opacity = 1;

            redDot.style.left = '24%';
            redDot.style.top = '2%';
            break;

        case 'CIB':
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '20%';
            redDot.style.top = '0%';
            break;

        case 'DWGI':
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '47%';
            redDot.style.top = '-3%';
            break;

        case 'EUPAC':
            document.getElementById('EUPAC-overlay').style.opacity = 1;
            document.getElementById('EUPAC-overlay-text').style.opacity = 1;

            redDot.style.left = '66%';
            redDot.style.top = '-3%';
            break;

        case "FI":
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '55%';
            redDot.style.top = '0%';
            break;

        case "GBAL":
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '50%';
            redDot.style.top = '-3%';
            break;

        case 'GFA':
            document.getElementById('GFA-overlay').style.opacity = 1;
            document.getElementById('GFA-overlay-text').style.opacity = 1;

            redDot.style.left = '85%';
            redDot.style.top = '-3%';
            break;

        case 'GIF':
            document.getElementById('GIF-overlay').style.opacity = 1;
            document.getElementById('GIF-overlay-text').style.opacity = 1;

            redDot.style.left = '54%';
            redDot.style.top = '-3%';
            break;

        case 'ICA':
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '47%';
            redDot.style.top = '-3%';
            break;

        case 'IFA':
            document.getElementById(`${data.id}-overlay`).style.opacity = 1;
            document.getElementById(`${data.id}-overlay-text`).style.opacity = 1;

            redDot.style.left = '21%';
            redDot.style.top = '4%';
            break;

        case 'IGI':
            document.getElementById('IGI-overlay').style.opacity = 1;
            document.getElementById('IGI-overlay-text').style.opacity = 1;

            redDot.style.left = '47%';
            redDot.style.top = '-2%';
            break;

        case 'IVE':
            document.getElementById('IVE-overlay').style.opacity = 1;
            document.getElementById('IVE-overlay-text').style.opacity = 1;

            redDot.style.left = '65%';
            redDot.style.top = '-3%';
            break;

        case 'NEF':
            document.getElementById('NEF-overlay').style.opacity = 1;
            document.getElementById('NEF-overlay-text').style.opacity = 1;

            redDot.style.left = '82%';
            redDot.style.top = '-1%';
            break;

        case 'NPF':
            document.getElementById('NPF-overlay').style.opacity = 1;
            document.getElementById('NPF-overlay-text').style.opacity = 1;

            redDot.style.left = '74%';
            redDot.style.top = '-3%';
            break;

        case 'NWF':
            document.getElementById('NWF-overlay').style.opacity = 1;
            document.getElementById('NWF-overlay-text').style.opacity = 1;

            redDot.style.left = '73%';
            redDot.style.top = '-3%';
            break;

        case 'SCWF':
            document.getElementById('SCWF-overlay').style.opacity = 1;
            document.getElementById('SCWF-overlay-text').style.opacity = 1;

            redDot.style.left = '95%';
            redDot.style.top = '51%';
            break;

        case 'WGI':
            document.getElementById('WGI-overlay').style.opacity = 1;
            document.getElementById('WGI-overlay-text').style.opacity = 1;

            redDot.style.left = '55%';
            redDot.style.top = '-3%';
            break;

        case 'WMIF':
            document.getElementById('WMIF-overlay').style.opacity = 1;
            document.getElementById('WMIF-overlay-text').style.opacity = 1;

            redDot.style.left = '29%';
            redDot.style.top = '2%';
            break;

        default:
            console.error('NO MSTAR ZONE')
            break;
    }
}