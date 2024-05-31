function tdEquity() {
    const data = dataTD.equity;
    const data55 = data.find(d => d.name === 'fund2055').data;
    // const data35 = data.find(d => d.name === 'fund2035').data;
    const data15 = data.find(d => d.name === 'fund2015').data;

    setNames('.eq-name-2055', data55);
    // setNames('.eq-name-2035', data35);
    setNames('.eq-name-2015', data15);
    setValues('.eq-val-2055', data55);
    // setValues('.eq-val-2035', data35);
    setValues('.eq-val-2015', data15);

    document.getElementById('eq-wa55').innerText = (Math.round(data.find(d => d.name === 'fund2055').wAvgYield * 100) / 100).toFixed(2);
    // document.getElementById('eq-wa35').innerText = (Math.round(data.find(d => d.name === 'fund2035').wAvgYield * 100) / 100).toFixed(2);
    document.getElementById('eq-wa15').innerText = (Math.round(data.find(d => d.name === 'fund2015').wAvgYield * 100) / 100).toFixed(2);
    document.getElementById('eq-top55').innerText = (Math.round(data.find(d => d.name === 'fund2055').top10 * 100) / 100).toFixed(2);
    // document.getElementById('eq-top35').innerText = (Math.round(data.find(d => d.name === 'fund2035').top10 * 100) / 100).toFixed(2);
    document.getElementById('eq-top15').innerText = (Math.round(data.find(d => d.name === 'fund2015').top10 * 100) / 100).toFixed(2);

    function setNames(el, data) {
        document.querySelectorAll(el).forEach((name, i) => {
            name.innerText = data[i].name;
        })
    }

    function setValues(element, data) {
        document.querySelectorAll(element).forEach((el, i) => {
            el.innerText = data[i].value === 0 ? '–' : data[i].value.toFixed(2);
            setBackground(el, data[i].value)
        })
    }

    function setBackground(el, num) {
        el.classList.remove('teal');
        el.classList.remove('royal-blue');
        el.classList.remove('dark-blue');

        if (num > 3)
            el.classList.add('teal')
        else if (num >= 1.5)
            el.classList.add('royal-blue')
        else
            el.classList.add('dark-blue')
    }

    // updates the date in the header section of the equity
    // also updates the AFTD disclosure dates
    function dateUpdate() {
        document.querySelectorAll('.AFTD-date-update').forEach(el => el.innerText = AFTDdateUpdate)
    }

    dateUpdate();
}
