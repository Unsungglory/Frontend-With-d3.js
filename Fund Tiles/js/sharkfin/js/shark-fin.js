(function () {
  const chart = document.getElementById('chart');
  const baselineLabel = document.querySelector('.baseline-label');
  const detailsBox = document.querySelector('.details-box');
  const slider = document.getElementById('slider');
  const innerContainer = document.querySelector('.inner-container');
  const assumptionsSection = document.querySelector('.assumptions-section');
  const sliderThumb = document.getElementById('current-bps');
  const sliderContainer = document.querySelector('.slider-container');
  const additionalBPSTextElements = document.querySelectorAll('.js-bps-number');
  const additionalYearsTextElement = document.querySelector('.js-extra-years');
  const additionalSavingsTextElement = document.querySelector('.js-extra-savings');
  const returnsBefore65Element = document.querySelector('.js-returns-before-65');
  const returnsAfter65Element = document.querySelector('.js-returns-after-65');
  const accountBalanceAt65Element = document.querySelector('.js-account-balance-at-65');


  const clipPathRect = document.querySelector('#sharkFinAreaClip rect');
  let CHART_CONTAINER_WIDTH;
  let CHART_CONTAINER_HEIGHT;
  const CHART_AXIS_MARGIN_BOTTOM = 50;
  const CHART_AXIS_MARGIN_LEFT = 70;
  const CHART_AXIS_MARGIN_TOP = 20;
  const CHART_AXIS_MARGIN_RIGHT = 50;
  let CHART_WIDTH;
  let CHART_HEIGHT;


  const fetchDataFor = (basisPoints) => {
    return sharkFinApp.data.filter((row) => Number(row.BPS) == basisPoints)[0]
  };

  const formatValue = (value, format) => {
    return numeral(value).format(format);
  }

  const data = fetchDataFor(0);
  const INITIAL_ADDITIONAL_BASIS_POINTS = 50;
  const MAX_ADDITIONAL_BASIS_POINTS = 125;
  const MAX_AGE = 105;
  const BASE_SAVINGS_ASSUMPTIONS = {
    ageYears: _.range(25, MAX_AGE),
    startingBalance: 0,
    startingAge: 25,
    startingSalary: 40000,
    annualSalaryGrowth: .03,
    annualContributionRate: .10,
    retirementAge: 65,
    returnsBeforeRetirement: Number(formatValue(data['Returns before 65'], '0.000')),
    returnsAfterRetirement: Number(formatValue(data['Returns after 65'], '0.000')),
    withdrawalRate: .50,
  };

  let yScale;
  let xScale;
  let xAxis;
  let yAxis;
  let newSavingsData;
  let comparisonData;


  // ==================
  // Chart functions
  // ==================
  const calculateChartDimensions = () => {
    CHART_CONTAINER_WIDTH = chart.getBoundingClientRect().width;
    CHART_CONTAINER_HEIGHT = chart.getBoundingClientRect().height;

    CHART_WIDTH = CHART_CONTAINER_WIDTH - CHART_AXIS_MARGIN_LEFT - CHART_AXIS_MARGIN_RIGHT;
    CHART_HEIGHT = CHART_CONTAINER_HEIGHT - CHART_AXIS_MARGIN_BOTTOM - CHART_AXIS_MARGIN_TOP;
  };

  const calculateChartScalesAndAxis = () => {
    yScale = d3.scaleLinear()
      .domain([0, maxPrincipal * 1.8])
      .range([CHART_HEIGHT, 0]);

    xScale = d3.scaleLinear()
      .domain([BASE_SAVINGS_ASSUMPTIONS.startingAge, MAX_AGE])
      .range([0, CHART_WIDTH]);

    xAxis = d3.axisBottom(xScale)
      .ticks(15)
      .tickSize(0)
      .tickPadding(20);

    yAxis = d3.axisLeft(yScale)
      .tickFormat(function (tickText, i, n) {
        return n[i + 1] ? '$' + numeral(tickText / 1000).format('0,0') : '$' + numeral(tickText / 1000).format('0,0') + ' (USD thousands)';
      })
      .tickSize(0)
      .tickPadding(20);
  };

  const createSharkFinArea = (chartData) => {
    return d3.area()
      .x(data => xScale(data.age))
      .y1(data => yScale(data.principal))
      .y0(CHART_HEIGHT)
      (chartData);
  };

  const drawChart = () => {
    xAxisGroup
      .attr('transform', `translate(${CHART_AXIS_MARGIN_LEFT}, ${CHART_HEIGHT + CHART_AXIS_MARGIN_TOP})`)
      .call(xAxis)

    yAxisGroup
      .attr('transform', `translate(${CHART_AXIS_MARGIN_LEFT}, ${CHART_AXIS_MARGIN_TOP})`)
      .call(yAxis);

    d3.selectAll('g.tick text')
      .attr('class', 'axis-tick-text');

    // move the last tick of the y axis over to compensate for string size
    const xOffset = window.innerWidth < 1200 ? 59 : 83
    d3.select('.y-axis .tick:last-of-type text').attr('x', xOffset)




    clipPathRect.setAttribute('height', CHART_HEIGHT);
    clipPathRect.setAttribute('width', CHART_WIDTH);

    baselineLabel.style.left = xScale(BASE_SAVINGS_ASSUMPTIONS.retirementAge) + CHART_AXIS_MARGIN_LEFT + 'px';
    baselineLabel.style.top = yScale(baseHighestPrincipal)
      + (CHART_HEIGHT - yScale(baseHighestPrincipal)) / 2
      + CHART_AXIS_MARGIN_TOP
      + 'px';
    improvedSharkFinPath.attr('d', createSharkFinArea(newSavingsData));
    baseSharkFinPath.attr('d', createSharkFinArea(baseSavingsData));
    slider.style.width = CHART_HEIGHT - CHART_AXIS_MARGIN_TOP - CHART_AXIS_MARGIN_BOTTOM + 'px';
    sliderContainer.style.height = CHART_HEIGHT - CHART_AXIS_MARGIN_TOP - CHART_AXIS_MARGIN_BOTTOM + 'px';

    // calculate padding for left and right sections based on the relative position of the last y axis tick to the its parent div
    const chartPos = chart.getBoundingClientRect()
    const lastYaxisTickPos = d3.select('.y-axis .tick:last-of-type text').node().getBoundingClientRect()
    const relativePos = lastYaxisTickPos.top - chartPos.top;

    innerContainer.style.paddingTop = relativePos + 'px';
    assumptionsSection.style.paddingTop = relativePos - 28 + 'px';

    calculateSliderThumbPosition(slider.value);

  };

  const sliderUpdateHandler = (basisPoints) => {
    const data = fetchDataFor(basisPoints);

    newSavingsData = savingsDataWithExtraBasisPoints(basisPoints);
    calculateSliderThumbPosition(basisPoints);
    updateBPSTextElements(basisPoints);
    updateDetailBox(data);
    updateScenarioAssumptions(data);
    improvedSharkFinPath.attr('d', createSharkFinArea(newSavingsData));
  };

  const updateBPSTextElements = (basisPoints) => {
    additionalBPSTextElements.forEach(el => el.textContent = basisPoints);


    sliderThumb.firstElementChild.innerHTML = basisPoints;
  };

  const updateDetailBox = (data) => {
    additionalSavingsTextElement.textContent = formatValue(data['Additional savings at age 65'], '0,0')
    additionalYearsTextElement.textContent = data['Additional years of retirement spending'];
  };

  const updateScenarioAssumptions = (data) => {
    returnsBefore65Element.textContent = data['Returns before 65'];
    returnsAfter65Element.textContent = data['Returns after 65'];
    accountBalanceAt65Element.textContent = formatValue(data['Account Balance at 65'], '0,0');
  }


  // ==================
  // Savings calculation functions
  // ==================
  const calculateSavingsAssumptions = (extraBasisPoints = 0) => {
    const newSavingsAssumptions = Object.assign({}, BASE_SAVINGS_ASSUMPTIONS);
    newSavingsAssumptions.returnsBeforeRetirement += (extraBasisPoints / 10000);
    newSavingsAssumptions.returnsAfterRetirement += (extraBasisPoints / 10000);
    return newSavingsAssumptions;
  };

  const savingsDataWithExtraBasisPoints = R.pipe(
    calculateSavingsAssumptions,
    sharkFinApp.calculateSavingsData,
  );


  // ==================
  // Important calculated chart values
  // ==================
  const baseSavingsData = savingsDataWithExtraBasisPoints(0);
  const baseHighestPrincipal = sharkFinApp.highestPrincipal(baseSavingsData);

  const maxPrincipal = R.pipe(
    savingsDataWithExtraBasisPoints,
    sharkFinApp.highestPrincipal,
  )(MAX_ADDITIONAL_BASIS_POINTS);


  // ==================
  // Create the Line charts
  // ==================
  const chartGroup = d3.select('#chart').append('g');
  const xAxisGroup = chartGroup.append('g');
  const yAxisGroup = chartGroup.append('g').attr('class', 'y-axis');

  const improvedSharkFinPath = chartGroup.append('path')
    .attr('transform', `translate(${CHART_AXIS_MARGIN_LEFT}, ${CHART_AXIS_MARGIN_TOP})`)
    .attr('fill', 'rgb(0,142,119)')
    .attr('clip-path', 'url(#sharkFinAreaClip)');

  const baseSharkFinPath = chartGroup.append('path')
    .attr('transform', `translate(${CHART_AXIS_MARGIN_LEFT}, ${CHART_AXIS_MARGIN_TOP})`)
    .attr('fill', 'rgb(0,41,75)')
    .attr('class', "base-sharkfin-path")
    .attr('data-title', 'hello')
    .attr('clip-path', 'url(#sharkFinAreaClip)');


  // FOR Safari/iOS height bug
  setTimeout(() => {
    calculateChartDimensions();
    calculateChartScalesAndAxis();
    sliderUpdateHandler(INITIAL_ADDITIONAL_BASIS_POINTS);
    drawChart();
  }, 250);

  detailsBox.style.left = CHART_AXIS_MARGIN_LEFT + 20 + 'px';
  detailsBox.style.top = CHART_AXIS_MARGIN_TOP + 'px';


  // ==================
  // Setup slider
  // ==================
  slider.value = INITIAL_ADDITIONAL_BASIS_POINTS;
  slider.max = MAX_ADDITIONAL_BASIS_POINTS;
  slider.addEventListener('input', e => sliderUpdateHandler(e.target.value));

  const calculateSliderThumbPosition = (currentValue) => {
    let halfThumbWidth = 35 / 2;
    let newPoint = (currentValue - slider.max) / (slider.min - slider.max);
    let sliderWidth = slider.style.width.split("p")[0];
    let centerPos = sliderWidth / 2;
    let pxPosition = newPoint * sliderWidth;
    let distFromCenter = pxPosition - centerPos;
    let percentDistFromCenter = distFromCenter / centerPos;
    let offset = percentDistFromCenter * halfThumbWidth;
    let finalThumbPos = pxPosition - offset;
    sliderThumb.style.top = finalThumbPos - 20 + "px";
  }

  // ==================
  // Selection Helper Functions
  // ==================

  d3.selection.prototype.first = function () {
    return d3.select(this[0][0]);
  };

  // ==================
  // Resize chart on screen size change
  // ==================
  window.onresize = () => {
    calculateChartDimensions();
    calculateChartScalesAndAxis();
    drawChart();
  };

})();
