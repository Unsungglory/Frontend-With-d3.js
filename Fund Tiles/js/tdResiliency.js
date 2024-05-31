function tdResiliency() {
    const data = dataTD.resiliency;

    setText(".re-vals-0", 0);
    setText(".re-vals-1", 1);
    setText(".re-vals-2", 2);
    setText(".re-vals-3", 3);
    setText(".re-vals-4", 4);
    setText(".re-vals-5", 5);
    setText(".re-vals-6", 6);
    setText(".re-vals-7", 7);

    function setText(element, num) {
        document.querySelectorAll(element).forEach((el, i) => {
            el.classList = el.classList[0];

            if (data[num][i]) {
                el.innerText = data[num][i]
                setBackground(el, data[num][i])
            }
            else
                el.innerText = ""
        })
    }

    function setBackground(element, num) {
        if (num >= 90) {
            element.classList.add('red-90')
        } else if (num >= 82) {
            element.classList.add('orange-82')
        } else if (num >= 70) {
            element.classList.add('orange-70')
        } else if (num >= 66) {
            element.classList.add('orange-66')
        } else if (num >= 64) {
            element.classList.add('orange-64')
        } else if (num >= 62) {
            element.classList.add('orange-62')
        } else if (num >= 61) {
            element.classList.add('orange-61')
        } else if (num >= 57) {
            element.classList.add('yellow-57')
        } else if (num >= 55) {
            element.classList.add('yellow-55')
        } else if (num >= 51) {
            element.classList.add('yellow-51')
        } else if (num >= 50) {
            element.classList.add('yellow-50')
        } else if (num >= 47) {
            element.classList.add('yellow-47')
        } else if (num >= 44) {
            element.classList.add('yellow-44')
        } else if (num >= 42) {
            element.classList.add('yellow-42')
        } else if (num >= 40) {
            element.classList.add('yellow-40')
        } else if (num >= 36) {
            element.classList.add('yellow-36')
        } else if (num >= 33) {
            element.classList.add('yellow-33')
        } else if (num >= 31) {
            element.classList.add('green-31')
        } else if (num >= 26) {
            element.classList.add('green-26')
        } else if (num >= 21) {
            element.classList.add('green-21')
        } else if (num >= 20) {
            element.classList.add('green-20')
        } else if (num >= 17) {
            element.classList.add('green-17')
        } else if (num >= 14) {
            element.classList.add('green-14')
        } else if (num >= 12) {
            element.classList.add('green-12')
        } else if (num >= 10) {
            element.classList.add('green-10')
        } else if (num >= 7) {
            element.classList.add('green-7')
        } else if (num >= 6) {
            element.classList.add('green-6')
        } else if (num >= 3) {
            element.classList.add('green-3')
        } else if (num >= 0) {
            element.classList.add('green-1')
        }
    }

    // SETS THE AVERAGE PERCENTILE RANK (THESE VALS ARE LAST IN THE DATA ARRAYS)
    document.querySelectorAll('.re-col-end').forEach((el, i) => {
        el.innerText = Math.round(data[i].slice(-1));
    })
}