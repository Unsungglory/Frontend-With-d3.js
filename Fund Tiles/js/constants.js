// ******************************* ******************************* //
// ******************************* ******************************* //
const iPad = window.innerWidth < 1400 && window.innerHeight > 1000;
const desktop = window.innerWidth > 1400;
const smallLapTop = window.innerWidth < 1400 && window.innerHeight < 1000 && window.innerHeight > 750;
const seismicApp = window.innerWidth < 1100;


// ******************************* ******************************* //
const quarterDate = '12/31/2021'; //bond disclosures date NOTE: THIS IS FOR QUARTERS OF THE YEAR, AND CAN ONLY BE: MARCH, JUNE, SEPT, OR DEC

const hypoDateOne = '12/31/01';
const hypoDateTwo = '12/31/21';
const stressTestDate = hypoDateTwo;
const tdReturnDate = '12/31/2021';

const yearVar = new Date().getFullYear(); // this is the date in the disclosures
// const bondYield = '2/28/22'; // removed 
const longTermSuccessDate = 'December 31, 2021';
const AFTDdateUpdate = longTermSuccessDate;
const cdQuarter = '4Q';
// ******************************* ******************************* //


const DARKBLUE = 'rgba(1, 45, 114, 1)';
const TERQ = 'rgba(0, 174, 169, 1)';
const GREY = 'rgba(178, 178, 178, 1)';
const DARK_TERQ = 'rgba(0, 76, 70, 1)';
const DARK_TERQ2 = 'rgba(0, 142, 119, 1)';
const OCEAN = 'rgba(0, 156, 220, 1)';
const SKY = 'rgba(123, 208, 226, 1)';
const BLUE = 'rgba(0, 87, 184, 1)';
const SAPH = 'rgba(0, 95, 158, 1)';
const DENIMCOLOR = 'rgba(0, 41, 75, 1)';
const EQINCOME = 'rgba(0, 142, 170, 1)';
const GRAPE = 'rgba(83, 42, 69, 1)';
const DARK_RASP = 'rgba(118, 33, 87, 1)';
const RASP = 'rgba(180, 37, 115, 1)';

const colors = [];

colors["S&P 500 Index"] = GREY;
colors["Standard & Poor's 500 Index"] = GREY;
colors["Standard & Poor's 500 Composite Index"] = GREY;
colors['Lipper Large-Cap Growth Funds Index'] = DARK_TERQ;
colors['Lipper Growth Funds Index'] = TERQ;
colors['Lipper Capital Appreciation Funds Index'] = OCEAN;
colors['Lipper Growth & Income Funds Index'] = DARK_TERQ;
colors['Lipper Large-Cap Value Funds Index'] = DARK_TERQ2;
colors['Lipper International Funds Index'] = EQINCOME;
colors['MSCI All Country World Index (ACWI)'] = DARK_TERQ2;
colors['Lipper Global Funds Index'] = DARK_TERQ;
colors['MSCI Emerging Markets Index'] = DENIMCOLOR;
colors['J.P. Morgan Emerging Markets Bond Index (EMBI) Global Diversified'] = SKY;
colors['MSCI World Index'] = RASP;
colors['MSCI EAFE (Europe, Australasia, Far East) Index'] = GRAPE;
colors["60%/40% S&P 500 Index/Bloomberg U.S. Aggregate Index"] = DARK_TERQ;
colors["Bloomberg U.S. Aggregate Index"] = RASP;
colors["Lipper Balanced Funds Index"] = SAPH;
colors["MSCI All Country World Index (ACWI) ex USA"] = RASP;
colors['undefined'] = 'yellow';
colors['MSCI All Country World Small Cap Index'] = TERQ;
colors['Global Service and Information Index'] = RASP;
colors['60%/40% MSCI All Country World Index/Bloomberg Global Aggregate Index'] = RASP;
colors['Bloomberg Global Aggregate Index'] = DARK_TERQ;
colors['Lipper Flexible Portfolio Funds Index'] = 'orange';
colors['70%/30% MSCI All Country World Index/Bloomberg U.S. Aggregate Index'] = TERQ;
colors['Lipper Global Equity Income Funds Average'] = 'orange';
colors['Lipper Emerging Markets Funds Index'] = RASP;
colors['65%/35% S&P 500 Index/Bloomberg U.S. Aggregate Index'] = BLUE;
colors['Lipper Income Funds Index'] = DARK_RASP;

const boxColors = [];
boxColors['Growth'] = 'rgba(1, 45, 114, 1)';
boxColors['Growth and income'] = 'rgba(0, 87, 184, 1)';
boxColors['Taxable Bond'] = 'rgba(3, 150, 94, 1)';
boxColors['taxable bond'] = 'rgba(3, 150, 94, 1)';
boxColors['Taxable bond'] = 'rgba(3, 150, 94, 1)';

boxColors['Tax-exempt Bond'] = 'rgba(0, 108, 91, 1)';
boxColors['Equity income'] = 'rgba(0, 142, 170, 1)';
boxColors['Balanced'] = '#2DCCD3';
boxColors['Retirement series'] = 'rgba(172, 163, 154, 1)';