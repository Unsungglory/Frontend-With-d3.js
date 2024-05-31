// ******************************* ******************************* //
// ******* SETS TEXT FOR CREDIT RATING FOR BOND PAGES ********* //
// ***************************** **************************** //

function creditRating(data, currentFundClass) {

    // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
    if (currentFundClass === 'a') {
        data = data.a.chartData
    } else if (currentFundClass === 'f2') {
        data = data.f2.chartData
    } else if (currentFundClass === 'r6') {
        data = data.r6.chartData
    }

    // WE CAN CROSS FADE EACH TIME, BECAUSE THE FIRST TIME THE THING IS CALLED YOU'LL NEVER SEE THE FADE

    // SET ALT TEXT
    document.getElementById('credit-rating-date-alt').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

    const creditRatings = data.creditRating
        .filter(d => d.name !== "Equities")
        .filter(d => d.name !== "Other")
        .filter(d => d.name !== "Convertibles");

    // TURN OFF / SHOW BOXES DEPENDING ON LENGTH OF DATA
    document.querySelectorAll('.cr-grid-box').forEach(el => el.style.opacity = 1);
    // document.getElementById('bond-credit-rating-bd').style.height = '527px';

    if (creditRatings.length < 7) {
        document.querySelectorAll('.cr-grid-box')[3].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[5].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[7].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

        // SET HEIGHT OF THE ENTIRE CONTAINER BASED ON NUMBER OF ROWS
        // document.getElementById('bond-credit-rating-bd').style.height = '404px';
    } else if (creditRatings.length < 8) {
        document.querySelectorAll('.cr-grid-box')[5].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[7].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

    } else if (creditRatings.length < 9) {
        document.querySelectorAll('.cr-grid-box')[7].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

        // SET HEIGHT OF THE ENTIRE CONTAINER BASED ON NUMBER OF ROWS
        // document.getElementById('bond-credit-rating-bd').style.height = '464px';
    } else if (creditRatings.length < 10) {
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';
    }

    creditRatings.forEach((d, i) => {
        const name = d.name === 'Cash & equivalents' ? d.name + '<sup>7</sup>' : d.name;
        if (i <= 4) {
            document.getElementById(`credit-rating-name-${i * 2}-alt`).innerHTML = name;
            document.getElementById(`credit-rating-val-${i * 2}-alt`).innerText = Number(d.value).toFixed(2) + "%";
        } else {
            if (document.getElementById(`credit-rating-name-${i * 2 - 9}-alt`))
                document.getElementById(`credit-rating-name-${i * 2 - 9}-alt`).innerHTML = name;

            if (document.getElementById(`credit-rating-val-${i * 2 - 9}-alt`))
                document.getElementById(`credit-rating-val-${i * 2 - 9}-alt`).innerText = Number(d.value).toFixed(2) + "%";
        }
    });

    // CROSS FADE (ALT TEXT FADES IN, REG TEXT FADES OUT)
    document.querySelectorAll('.cr-reg-text').forEach(el => el.style.opacity = 0);
    document.querySelectorAll('.cr-alt-text').forEach(el => el.style.opacity = 1);

    // SET REG TEXT (after cross fade is complete)
    setTimeout(() => {
        document.getElementById('credit-rating-date').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

        creditRatings.forEach((d, i) => {
            const name = d.name === 'Cash & equivalents' ? d.name + '<sup>5</sup>' : d.name;

            if (i <= 4) {
                document.getElementById(`credit-rating-name-${i * 2}`).innerHTML = name;
                document.getElementById(`credit-rating-val-${i * 2}`).innerText = Number(d.value).toFixed(2) + "%";
            } else {
                if (document.getElementById(`credit-rating-name-${i * 2 - 9}`))
                    document.getElementById(`credit-rating-name-${i * 2 - 9}`).innerHTML = name;

                if (document.getElementById(`credit-rating-val-${i * 2 - 9}`))
                    document.getElementById(`credit-rating-val-${i * 2 - 9}`).innerText = Number(d.value).toFixed(2) + "%";
            }
        });

    }, 400);

    // TURN ON REG TEXT
    // TURN OFF ALT TEXT
    setTimeout(() => {
        document.querySelectorAll('.cr-reg-text').forEach(el => el.style.opacity = 1);
        document.querySelectorAll('.cr-alt-text').forEach(el => el.style.opacity = 0);
    }, 450);

}