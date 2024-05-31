// ******************************* ******************************* //
// ******* SETS TEXT FOR CREDIT RATING FOR BOND PAGES ********* //
// ***************************** **************************** //

function creditRating(data, currentFundClass) {

    // SET DATA FOR OUR CLASSES (A-shares, F2, etc)
    if (currentFundClass === 'a') {
        data = data.a.chartData
    } else {
        data = data.f2.chartData
    }

    // WE CAN CROSS FADE EACH TIME, BECAUSE THE FIRST TIME THE THING IS CALLED YOU'LL NEVER SEE THE FADE

    // SET ALT TEXT
    document.getElementById('credit-rating-date-alt').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

    const creditRatings = data.creditRating
        .filter(d => d.name !== "Equities")
        .filter(d => d.name !== "Other");

    // TURN OFF / SHOW BOXES DEPENDING ON LENGTH OF DATA
    document.querySelectorAll('.cr-grid-box').forEach(el => el.style.opacity = 1);
    // document.getElementById('bond-credit-rating-bd').style.height = '527px';
    if (creditRatings.length < 7) {
        document.querySelectorAll('.cr-grid-box')[6].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[7].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[8].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

        // SET HEIGHT OF THE ENTIRE CONTAINER BASED ON NUMBER OF ROWS
        // document.getElementById('bond-credit-rating-bd').style.height = '404px';
    } else if (creditRatings.length < 8) {
        document.querySelectorAll('.cr-grid-box')[7].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[8].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

    } else if (creditRatings.length < 9) {
        document.querySelectorAll('.cr-grid-box')[8].style.opacity = '0';
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';

        // SET HEIGHT OF THE ENTIRE CONTAINER BASED ON NUMBER OF ROWS
        // document.getElementById('bond-credit-rating-bd').style.height = '464px';
    } else if (creditRatings.length < 10) {
        document.querySelectorAll('.cr-grid-box')[9].style.opacity = '0';
    }

    const numStack = []
    let half = null;

    if (creditRatings.length % 2 === 0) {
        half = creditRatings.length / 2 - 1;
    } else {
        half = Math.floor(creditRatings.length / 2);
    }

    creditRatings.forEach((d, i) => {
        if (i <= half) {
            document.getElementById(`credit-rating-name-${i * 2}-alt`).innerText = d.name;
            document.getElementById(`credit-rating-val-${i * 2}-alt`).innerText = Number(d.value).toFixed(2) + "%";
            numStack.push(i);
        } else {
            const index = i - numStack.pop();
            document.getElementById(`credit-rating-name-${index}-alt`).innerText = d.name;
            document.getElementById(`credit-rating-val-${index}-alt`).innerText = Number(d.value).toFixed(2) + "%";
        }
    });

    // CROSS FADE (ALT TEXT FADES IN, REG TEXT FADES OUT)
    document.querySelectorAll('.cr-reg-text').forEach(el => el.style.opacity = 0);
    document.querySelectorAll('.cr-alt-text').forEach(el => el.style.opacity = 1);

    // SET REG TEXT (after cross fade is complete)
    setTimeout(() => {
        document.getElementById('credit-rating-date').innerText = `% of net assets as of ${data.date} (updated quarterly)`;

        creditRatings.forEach((d, i) => {

            if (i <= half) {
                document.getElementById(`credit-rating-name-${i * 2}`).innerText = d.name;
                document.getElementById(`credit-rating-val-${i * 2}`).innerText = Number(d.value).toFixed(2) + "%";
                numStack.push(i);
            } else {
                const index = i - numStack.pop();
                document.getElementById(`credit-rating-name-${index}`).innerText = d.name;
                document.getElementById(`credit-rating-val-${index}`).innerText = Number(d.value).toFixed(2) + "%";
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