// ******************************* ******************************* //
// ******* SETS TEXT FOR TOP HOLDINGS FOR GROWTH PAGES ********* //
// ***************************** ***************************** //

function topHoldings(data, currentFundClass) {

    const id = data.a.id;
    // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
    if (currentFundClass === 'a') {
        data = data.a.chartData
    } else {
        data = data.f2.chartData
    }

    // SET ALT TEXT
    document.getElementById('growth-top-holdings-date-alt').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

    data.equity.forEach((d, i) => {
        document.getElementById(`top-holdings-company-${i}-alt`).innerText = d.name;
        document.getElementById(`top-holdings-sector-${i}-alt`).innerText = d.sector;
        document.getElementById(`top-holdings-eq-val-${i}-alt`).innerText = Number(d.value).toFixed(2) + "%";
    });

    data.industry.forEach((d, i) => {
        document.getElementById(`top-holdings-industry-${i}-alt`).innerText = d.name;
        document.getElementById(`top-holdings-industry-val-${i}-alt`).innerText = Number(d.value).toFixed(2) + '%';
    });

    // CROSS FADE (ALT TEXT FADES IN, REG TEXT FADES OUT)
    document.querySelectorAll('.th-reg-text').forEach(el => el.style.opacity = 0);
    document.querySelectorAll('.th-alt-text').forEach(el => el.style.opacity = 1);

    // SET REG TEXT (after cross fade is complete)
    setTimeout(() => {
        document.getElementById('growth-top-holdings-date').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

        data.equity.forEach((d, i) => {
            document.getElementById(`top-holdings-company-${i}`).innerText = d.name;
            document.getElementById(`top-holdings-sector-${i}`).innerText = d.sector;
            document.getElementById(`top-holdings-eq-val-${i}`).innerText = Number(d.value).toFixed(2) + "%";
        });

        data.industry.forEach((d, i) => {
            document.getElementById(`top-holdings-industry-${i}`).innerText = d.name;
            document.getElementById(`top-holdings-industry-val-${i}`).innerText = Number(d.value).toFixed(2) + '%';
        });
    }, 400);

    // TURN ON REG TEXT
    // TURN OFF ALT TEXT
    setTimeout(() => {
        // cut not xfade
        document.querySelectorAll('.th-reg-text').forEach(el => {
            el.style.transition = 'none';
            el.style.opacity = 1;
        });
        document.querySelectorAll('.th-alt-text').forEach(el => {
            el.style.transition = 'none';
            el.style.opacity = 0
        });
    }, 410);

    // RESET TRANSITIONS
    setTimeout(() => {
        // cut not xfade
        document.querySelectorAll('.th-reg-text').forEach(el => {
            el.style.transition = 'opacity .4s ease-in-out';
        });
        document.querySelectorAll('.th-alt-text').forEach(el => {
            el.style.transition = 'opacity .4s ease-in-out';
        });
    }, 420);

    // SET FOOTNOTE IN HEADER (NO XFADE REQUIRED)
    if (id === 'IVE' || id === 'GIF' || id === 'DWGI' || id === 'GBAL') {
        document.getElementById('growth-holdings-sup').innerText = 6;
    } else {
        document.getElementById('growth-holdings-sup').innerText = 7;
    }

}