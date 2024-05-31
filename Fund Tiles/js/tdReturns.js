
function tdReturns() {
    const tdThreeCols = document.querySelectorAll('.td-returns-group-1');
    const tdFourCols = document.querySelectorAll('.td-returns-group-2');
    const tdExpRatios = document.querySelectorAll('.td-exp-rate');

    const d1 = dataTD.returns.d1;
    const d2 = dataTD.returns.d2;
    const expenses = dataTD.returns.expData;

    // THREE COL PART OF TABLE
    tdThreeCols.forEach((el, i) => {
        el.innerHTML = d1[i];
    })

    // FOUR COLUMN PART OF TABLE
    tdFourCols.forEach((el, i) => {
        el.innerHTML = d2[i];
    })

    // EXPENSE
    tdExpRatios.forEach((el, i) => {
        el.innerHTML = expenses[i];
    })

    // SET DATE
    document.getElementById('tdr-date').innerHTML = tdReturnDate;
}