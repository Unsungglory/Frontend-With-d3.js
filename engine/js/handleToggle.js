
function handleToggle(num) {

    const pill = document.querySelector('#pill-toggle');
    const bfa = document.getElementById('bfa-btn');
    const sbf = document.getElementById('sbf-btn');
    const page1 = document.getElementById('chart-page-1');
    const page2 = document.getElementById('chart-page-2');
    const legend1 = document.getElementById('chart-legend-1');
    const legend2 = document.getElementById('chart-legend-2');

    if (num === 0) {
        pill.style.left = '0%';
        bfa.classList.add('toggle-on')
        bfa.style.color = '#00294B';
        sbf.style.color = '#7F7F7F';
        page1.style.opacity = 1;
        page1.style.pointerEvents = 'all';
        page2.style.opacity = 0;
        page2.style.pointerEvents = 'none';
        legend1.style.opacity = 1;
        legend2.style.opacity = 0;
    } else {
        pill.style.left = '50%';
        sbf.style.color = '#00294B';
        bfa.style.color = '#7F7F7F';
        page1.style.opacity = 0;
        page2.style.opacity = 1;
        page1.style.pointerEvents = 'none';
        page2.style.pointerEvents = 'all';
        legend1.style.opacity = 0;
        legend2.style.opacity = 1;
    }

}
