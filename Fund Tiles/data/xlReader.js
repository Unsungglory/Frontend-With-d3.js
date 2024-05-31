////////////////////////////////////////////////////////////// //////////
// MASTER FUNCTION THAT GETS CALLED WHEN READING THE SPREADSHEET FILE
//////////////////////////////////////////////////////////// //////////

const DEBUGMODE = false; // gets two funds and stops

async function readExcel(file) {
  console.log('')
  console.warn(currentTime(true), 'FILENAME:', file.name)
  console.log('')

  // READ FROM XL
  // console.log(currentTime(true), 'FETCHING FILE')
  // const response = await fetch(file);
  console.log(currentTime(true), 'BUFFERING DATA...')
  // const arrayBuff = await response.arrayBuffer();

  const arrayBuff = await file.arrayBuffer();

  console.log(currentTime(true), 'CONVERTING DATA......')
  const rawData = await new Uint8Array(arrayBuff);
  console.log(currentTime(true), 'READING XL DATA...........')
  var workbook = XLSX.read(rawData, { type: "array" });

  const sheetNames = workbook.SheetNames.map(sheetName => sheetName);
  // console.log(JSON.stringify(sheetNames))

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  // CHECK SHEET NAMES FOR LEADING OR TRAILING SPACES 
  try {
    checkSheetNamesForLeadingOrTrailingSpaces();
    function checkSheetNamesForLeadingOrTrailingSpaces() {
      sheetNames.forEach(sheet => {
        if (sheet[0] === ' ' || sheet[sheet.length - 1] === ' ')
          throw `CHECK SHEET NAME "${sheet}" for leading/trailing spaces.`
      })
    }
  } catch (error) {
    console.error(currentTime(true), error)
    return // STOPS PROGRAM
  }
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  function validateSheetNames() {
    const sortedExpected = alphabetizeSheets(EXPECTEDSHEETNAMES);
    const sortedCurrent = alphabetizeSheets(sheetNames)

    // IF NAMES DON'T MATCH THEN WE DO MORE CHECKS
    if (JSON.stringify(sortedExpected) !== JSON.stringify(sortedCurrent)) {
      console.warn(currentTime(true), "SHEET NAMES NOT AS EXPECTED")

      sheetNames.forEach(sheet => {
        if (!EXPECTEDSHEETNAMES.includes(sheet)) {
          console.error(currentTime(true), `This sheet name is unexpected: ${sheet}`)
        }
      })

      EXPECTEDSHEETNAMES.forEach(sheet => {
        if (!sheetNames.includes(sheet)) {
          console.error(currentTime(true), `This sheet name was not found: ${sheet}`)
        }
      })
    } else {
      console.log(currentTime(true), 'sheet names as expected...')
    }
  }
  validateSheetNames();
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  function alphabetizeSheets(sheetNames) {
    const alphabeticalSheets = sheetNames;
    alphabeticalSheets.sort(function (a, b) {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    })
    return sheetNames
  }

  console.log(currentTime(true), alphabetizeSheets(sheetNames))
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  const filteredPages = workbook.SheetNames.filter(s => s.includes('IFA'))
  console.log(currentTime(true), 'FILTERED PAGES', filteredPages)
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  // GET DATA BY SHARE CLASS
  const dataA = getJson(workbook.Sheets, 'A'); // A SHARE CLASS
  const dataF2 = getJson(workbook.Sheets, 'F-2'); // F-2 SHARE CLASS
  const dataR6 = getJson(workbook.Sheets, 'R-6'); // R-6 SHARE CLASS
  const dataTD = getTDData(workbook.Sheets);

  // RETURN ALL DATA STRINGYFIED
  return (
    "const dataA = " + dataA + ";\n\n" +
    "const dataF2 = " + dataF2 + ";\n\n" +
    "const dataR6 = " + dataR6 + ";\n\n" +
    "const dataTD = " + dataTD + ";\n"
  );
}

////////////////////////////////////////////////////////////// 
// METHODS USED FOR READING FROM VARIOUS SHEETS
////////////////////////////////////////////////////////////

const TICKERS = []

// BUILDS EACH FUND AND EACH FUND ARRARY (3 ARRAYS TOTAL = A, F2, R6)
const getJson = (sheets, shareClass) => {
  let funds = [];
  const xlToJSONfunds = XLSX.utils.sheet_to_json(sheets["Fund Details"]);

  // LOOP THROUGH 'Fund Details' xlxs page and add funds for each specified share class
  for (const fund of xlToJSONfunds) {
    if (fund['Share Class'] === shareClass) {
      funds.push({
        name: fund["Name"].trim(),
        class: fund["Share Class"].replace('-', ''),
        id: fund["Abbreviation"].trim(),
        fundClassNumber: fund["Fund class number"],
        trademark: fund["Trademark"].trim(),
        inception: convertDate(fund["Fund Inception"]).trim(),
        objective: fund["Objective"].trim(),
        indexPrimary: fund["Index Primary"].trim(),
        indexPrimaryAbbr: fund["Index Primary Abbreviation"].trim(),
        indexSecondary: fund["Index Secondary"] ? fund["Index Secondary"].trim() : null,
        indexSecondary2: fund["Index Secondary 2"] ? fund["Index Secondary 2"].trim() : null,
        indexSecondary3: fund["Index Secondary 3"] ? fund["Index Secondary 3"].trim() : null,
        ticker: fund["Ticker"].trim(),
        expenseLink: fund['Expense Ratio and Returns Link'].trim(),
        pageLink: fund['Fund Detail Page Link'].trim(),
        mstarCat: fund['Mstar Category'].trim()
      });
    }
  }

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  ///////////////// VALIDATE TICKERS 
  funds.forEach(fund => TICKERS.push({ id: fund.id, ticker: fund.ticker }));

  if (shareClass === 'R-6') {

    TICKERS.forEach(ticker => {
      if (!EXPECTEDTICKERS.map(ticker => ticker.ticker).includes(ticker.ticker)) {
        console.error(`THIS TICKER LIKELY SHOULDN'T BE INCLUDED: ${ticker.ticker} FOR ${ticker.id}`)
      }
    })

    EXPECTEDTICKERS.forEach(ticker => {
      if (!TICKERS.map(ticker => ticker.ticker).includes(ticker.ticker)) {
        console.error(`TICKER NOT FOUND, BUT LIKELY SHOULD BE: ${ticker.ticker} (${ticker.id})`)
      }
    })
  }
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  if (DEBUGMODE) {
    funds = funds.slice(0, 1)
  }
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  funds.forEach((fund, i) => {
    if ((fund.objective.includes("Growth") || fund.objective === 'Balanced' || fund.objective.toLowerCase().includes('equity')) && (fund.class === 'A' || fund.class === 'F2')) {

      // A/F2 HERO SECTION (LINE CHART)
      const dataReinvested = getLineData(
        fund,
        XLSX.utils.sheet_to_json(sheets[`10k mtn div reinvested-${fund.class}`]),
        XLSX.utils.sheet_to_json(sheets['Index 10k mtn']),
        sheets[`10k mtn div reinvested-${fund.class}`],
        sheets['Index 10k mtn'],
      );
      const dataCash = getLineData(
        fund,
        XLSX.utils.sheet_to_json(sheets[`10k mtn cash-${fund.class}`]),
        XLSX.utils.sheet_to_json(sheets['Index 10k mtn']),
        sheets[`10k mtn cash-${fund.class}`],
        sheets['Index 10k mtn'],
      );

      funds[i]["lineData"] = { reinvested: dataReinvested, cash: dataCash, asOfDate: sheets[`10k mtn div reinvested-${fund.class}`]['B3'].w };

      const overviewData = getOverviewData(
        fund,
        XLSX.utils.sheet_to_json(sheets["Assets fund total"]),
        XLSX.utils.sheet_to_json(sheets["Companies-issuers"])
      );

      const expensesData = getExpensesData(fund, XLSX.utils.sheet_to_json(sheets["Prosp exp ratio fund"]));
      const riskData = getRiskData(fund, XLSX.utils.sheet_to_json(sheets["Capture ratios"]));
      const accumulationData = getAccumulationData(fund, sheets[`CA ${fund.class} accum hypo`]);
      const distData = getAccumulationData(fund, sheets[`CA ${fund.class} withd hypo`]);
      funds[i]["metricsData"] = { overviewData, expensesData, riskData, accumulationData, distData };

      // A/F2 SECTION 2 (QUARTER END AT NAV BARS)
      funds[i]["barData"] = getBarData(
        fund,
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index returns lifetime af funds"]),
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative MOP"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual MOP"]),
        XLSX.utils.sheet_to_json(sheets["Prosp exp ratio fund"]),
        XLSX.utils.sheet_to_json(sheets["Yields"]),
      );

      // A/F2 SECTION 3 TOP HOLDINGS
      funds[i]["chartData"] = getFundChartData(
        fund,
        sheets[`${fund.id} top industry holdings`],
        sheets[`${fund.id} top equity holdings`]
      );

      // A/F2 SECTION 4: NEW GEOGRAPHY DONUT CHART
      funds[i]["donutData"] = newGeoDonutData(
        fund,
        sheets[`${fund.id} country domicile eq`],
        sheets[`${fund.id} country revenue eq`],
        sheets[`${fund.indexPrimaryAbbr} country domicile eq`],
        sheets[`${fund.indexPrimaryAbbr} country revenue eq`]
      );

      // A/F2 SECTION 5: STRESS TEXT DATA
      funds[i]["stressData"] = getStressData(fund, sheets[`CA Stress tests`], fund.class);
    } else if (fund.objective.toLowerCase().includes("bond")) {
      // FOR BONDS
      funds[i]["heroData"] = getHeroData(fund, sheets, fund.class);;

      // BONDS (QUARTER END AT NAV BARS)
      const barData = getBarData(
        fund,
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index returns lifetime af funds"]),
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative MOP"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual MOP"]),
        XLSX.utils.sheet_to_json(sheets["Prosp exp ratio fund"]),
        XLSX.utils.sheet_to_json(sheets["Yields"]),
      );
      funds[i]["barData"] = barData;

      const donutData = getBondDonutData(fund.id, XLSX.utils.sheet_to_json(sheets[`${fund.id} portfolio summary 2`]), sheets[`${fund.id} top issuers`]);
      funds[i]["donutData"] = donutData;

      const chartData = getBondChartData(fund, sheets[`FI qual breakdown`]);
      funds[i]["chartData"] = chartData;

      const geoBreakdownData = getGeoBreakdownData(
        fund,
        sheets["Currency weighting"],
        sheets[`${fund.id} country breakdown`],
        sheets[`${fund.id} all states`]
      );
      funds[i]["geoData"] = geoBreakdownData;

      // SCORECADRD FOR R6 BOND FUNDS
      if (fund.class === 'R6') {
        funds[i]['scorecard'] = getScorecardData(fund, sheets[`Fi360`]);
      }
    } else if (fund.class === 'R6' && (fund.objective.includes('Growth') || fund.objective === 'Balanced' || fund.objective.toLowerCase().includes('equity'))) {

      // HERO
      funds[i]['heroData'] = getR6HeroData(fund, sheets[`Lifetime success rate index`], sheets['Lifetime success rate peers'],
        sheets['MStar fee level group avg'], sheets['Blended capture ratio'], sheets['Prosp exp ratio fund']);

      // SECTION 2 R6
      const barData = getBarData(
        fund,
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Cumulative NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index Returns Avg Annual NAV"]),
        XLSX.utils.sheet_to_json(sheets["Index returns lifetime af funds"]),
        XLSX.utils.sheet_to_json(sheets["Returns Cumulative MOP"]),
        XLSX.utils.sheet_to_json(sheets["Returns Avg Annual MOP"]),
        XLSX.utils.sheet_to_json(sheets["Prosp exp ratio fund"]),
        XLSX.utils.sheet_to_json(sheets["Yields"]),
      );
      funds[i]["barData"] = barData;

      // SECTION 3 (LONG TERM SUCCESS)
      funds[i]['longTermSuccess'] = getLongTermSuccessData(fund, sheets[`Lifetime growth 10k`]);

      // SECTION 4 (TOP CONTRIBUTORS)
      funds[i]['contributors'] = getR6TopContributorsData(fund, sheets[`${fund.id} Top and Bottom 5`]);

      // SECTION 5 NEW GEOGRAPHY DONUT CHART
      funds[i]["donutData"] = newGeoDonutData(
        fund,
        sheets[`${fund.id} country domicile eq`],
        sheets[`${fund.id} country revenue eq`],
        sheets[`${fund.indexPrimaryAbbr} country domicile eq`],
        sheets[`${fund.indexPrimaryAbbr} country revenue eq`]
      );

      // SECTION 6 R6 BONDS
      funds[i]['scorecard'] = getScorecardData(fund, sheets[`Fi360`]);

      // SECTION 7 R6 MORNINGSTAR
      funds[i]['mstar'] = getMstarData(fund, sheets);
    }
  });

  // OUTPUT ARRAYS TO CONSOLE
  console.log(currentTime(true), shareClass + ' SHARES:', funds); // A SHARES: {...}, F2 SHARES: {...}, R6 SHARES: {...}
  return JSON.stringify(funds);
};

// RETURNS DATA FOR TARGET FUND SECTION
const getTDData = (sheets) => {
  const tdData = {};

  // HARD CODE ATTRIBUTES (NOT IN XL FILE)
  tdData['class'] = 'R6'
  tdData['expenseLink'] = 'https://www.capitalgroup.com/individual/investments/americanfunds?objective=retirement+target+date&shareclass=r6'
  tdData['fundClassNumber'] = -1;
  tdData['id'] = 'AFTD';
  tdData['inception'] = '';
  tdData['name'] = 'American Funds Target Date Series';
  tdData['objective'] = 'Retirement series';
  tdData['pageLink'] = 'https://www.capitalgroup.com/individual/investments/americanfunds?objective=retirement+target+date&shareclass=r6'
  tdData['ticker'] = 'AFTD';
  tdData['trademark'] = '®';

  // GLIDEPATH IS SECTION 1
  tdData['glidepath'] = tdHeroData(sheets);

  // VALUE OF FLEXIBILITY (SECTION 2)
  tdData['flexibility'] = tdFlexibility(sheets);

  // FEE VALUE (SECTION 3)
  tdData['feeValue'] = tdFeeValue(sheets);

  // EXCESS RETURN (SECTION 4)
  tdData['excessReturn'] = tdExcessReturn(sheets);

  // UNDERLYING FUNDS (BREAKDOWN WITH THE COLORED CHART) (SECTION 5)
  tdData['underlyingFunds'] = tdUF(sheets);

  // EQUITY (SECTION 6) 
  tdData['equity'] = tdEquity(sheets);

  // TD RETURNS (LAST SECTION)
  tdData['returns'] = tdReturns(sheets);

  // NOT USED NO MORE!! ******************************
  // SUCCESS RATES (SECTION 2)
  // tdData['successRate'] = tdSuccessRate(sheets);
  // RESILIENCY (SECTION 5)
  // tdData['resiliency'] = tdResiliency(sheets);
  // PEER RANKINGS (section 6)
  // tdData['peerRankings'] = tdPeerRankings(sheets);
  // NOT USED NO MORE!! ******************************

  console.log(currentTime(true), 'TD SHARES:', tdData);
  return JSON.stringify(tdData);
}

// AFTD FLEX SECTION
const tdFlexibility = (sheets) => {
  // here are the sheets...
  // 'AFTD_Flexibility_AC'
  // 'AFTD_Flexibility_Geo'
  // 'AFTD_Flexibility_Equity'
  // 'AFTD_Flexibility_Market Cap'

  const getFlexChartData = (sheets, sheetName) => {
    const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
    const currentVals = [];
    const avgVals = [];
    const highVals = [];
    const prevYearVals = [];
    const lowVals = [];
    const outputData = [];

    // get columns in a somewhat robust way... hopefully ;)
    const keys = Object.keys(jsonSheet[0]);

    if (keys.length < 10) {
      console.error(sheetName, keys)
      console.error('AFTD FLEX SECTION ISNT GOING TO WORK')
    }

    // const colA = keys[0]; 
    const colB = keys[0];
    const colC = keys[1];
    const colD = keys[2];
    const colE = keys[3];
    const colF = keys[4];
    const colG = keys[5];
    const colH = keys[6];
    const colI = keys[7];
    const colJ = keys[8];
    const colK = keys[9];
    const colL = keys[10];
    const colM = keys[11];
    const colN = keys[12];
    const colO = keys[13];
    const colP = keys[14];
    const colQ = keys[15];

    // const colB = keys[1];
    // const colC = keys[2];
    // const colD = keys[3];
    // const colE = keys[4];
    // const colF = keys[5];
    // const colG = keys[6];
    // const colH = keys[7];
    // const colI = keys[8];
    // const colJ = keys[9];
    // const colK = keys[10];
    // const colL = keys[11];
    // const colM = keys[12];
    // const colN = keys[13];
    // const colO = keys[14];
    // const colP = keys[15];
    // const colQ = keys[16];

    // store columns
    jsonSheet.forEach((row, i) => {

      // console.log(row)
      // const name = row[colA] ? row[colA] : '';
      const bb = row[colB] ? row[colB] : '';
      const cc = row[colC] ? row[colC] : '';
      const dd = row[colD] ? row[colD] : '';
      const ee = row[colE] ? row[colE] : '';
      const ff = row[colF] ? row[colF] : '';
      const gg = row[colG] ? row[colG] : '';
      const hh = row[colH] ? row[colH] : '';
      const ii = row[colI] ? row[colI] : '';
      const jj = row[colJ] ? row[colJ] : '';
      const kk = row[colK] ? row[colK] : '';
      const ll = row[colL] ? row[colL] : '';
      const mm = row[colM] ? row[colM] : '';
      const nn = row[colN] ? row[colN] : '';
      const oo = row[colO] ? row[colO] : '';
      const pp = row[colP] ? row[colP] : '';
      const qq = row[colQ] ? row[colQ] : '';

      // console.warn(i, name, bb, cc, dd)

      if (i === 1) {
        avgVals[0] = bb; // B
        avgVals[1] = cc; // C
        avgVals[2] = dd; // D
        avgVals[3] = ee; // F
        avgVals[4] = ff; // E
        avgVals[5] = gg; // G
        avgVals[6] = hh; // H
        avgVals[7] = ii; // I
        avgVals[8] = jj; // J
        avgVals[9] = kk; // K
        avgVals[10] = ll; // L
        avgVals[11] = mm; // N
        avgVals[12] = nn; // M
        avgVals[13] = oo; // O
        avgVals[14] = pp; // P
        avgVals[15] = qq; // Q
      }

      if (i === 2) {
        highVals[0] = bb; // B
        highVals[1] = cc; // C
        highVals[2] = dd; // D
        highVals[3] = ee; // F
        highVals[4] = ff; // E
        highVals[5] = gg; // G
        highVals[6] = hh; // H
        highVals[7] = ii; // I
        highVals[8] = jj; // J
        highVals[9] = kk; // K
        highVals[10] = ll; // L
        highVals[11] = mm; // N
        highVals[12] = nn; // M
        highVals[13] = oo; // O
        highVals[14] = pp; // P
        highVals[15] = qq; // Q
      }

      if (i === 3) {
        lowVals[0] = bb; // B
        lowVals[1] = cc; // C
        lowVals[2] = dd; // D
        lowVals[3] = ee; // F
        lowVals[4] = ff; // E
        lowVals[5] = gg; // G
        lowVals[6] = hh; // H
        lowVals[7] = ii; // I
        lowVals[8] = jj; // J
        lowVals[9] = kk; // K
        lowVals[10] = ll; // L
        lowVals[11] = mm; // N
        lowVals[12] = nn; // M
        lowVals[13] = oo; // O
        lowVals[14] = pp; // P
        lowVals[15] = qq; // Q
      }

      if (i === 4) {
        currentVals[0] = bb; // B
        currentVals[1] = cc; // C
        currentVals[2] = dd; // D
        currentVals[3] = ee; // F
        currentVals[4] = ff; // E
        currentVals[5] = gg; // G
        currentVals[6] = hh; // H
        currentVals[7] = ii; // I
        currentVals[8] = jj; // J
        currentVals[9] = kk; // K
        currentVals[10] = ll; // L
        currentVals[11] = mm; // N
        currentVals[12] = nn; // M
        currentVals[13] = oo; // O
        currentVals[14] = pp; // P
        currentVals[15] = qq; // Q
      }

      // if (i === 5) {
      //   // previous quarter
      // }

      if (i === 6) {
        prevYearVals[0] = bb; // B
        prevYearVals[1] = cc; // C
        prevYearVals[2] = dd; // D
        prevYearVals[3] = ee; // F
        prevYearVals[4] = ff; // E
        prevYearVals[5] = gg; // G
        prevYearVals[6] = hh; // H
        prevYearVals[7] = ii; // I
        prevYearVals[8] = jj; // J
        prevYearVals[9] = kk; // K
        prevYearVals[10] = ll; // L
        prevYearVals[11] = mm; // N
        prevYearVals[12] = nn; // M
        prevYearVals[13] = oo; // O
        prevYearVals[14] = pp; // P
        prevYearVals[15] = qq; // Q
      }

      // if (i === 7) {
      //  // RANGE
      // }
    })

    const YEARS = [-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30]
    YEARS.forEach((year, i) => {
      outputData.push({
        year: year,
        average: avgVals[i],
        high: highVals[i],
        low: lowVals[i],
        current: currentVals[i],
        lastYear: prevYearVals[i]
      })
    })

    return outputData;
  }

  return {
    assetClass: getFlexChartData(sheets, 'AFTD_Flexibility_AC'),
    geo: getFlexChartData(sheets, 'AFTD_Flexibility_Geo'),
    equity: getFlexChartData(sheets, 'AFTD_Flexibility_Equity'),
    marketCap: getFlexChartData(sheets, 'AFTD_Flexibility_Market Cap')
  }
}

// AFTD FEE VAL SECTION
const tdFeeValue = (sheets) => {
  const sheetName = 'AFTD_Fee';
  const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);

  // get columns in a somewhat robust way... hopefully ;)
  const colJ = sheets[sheetName][`J1`] ? sheets[sheetName][`J1`].v : 'J';
  const colI = sheets[sheetName][`I1`] ? sheets[sheetName][`I1`].v : 'I';
  const colL = sheets[sheetName][`L1`] ? sheets[sheetName][`L1`].v : 'L';
  const colM = sheets[sheetName][`M1`] ? sheets[sheetName][`M1`].v : 'M';
  const colN = sheets[sheetName][`N1`] ? sheets[sheetName][`N1`].v : 'N';
  const colO = sheets[sheetName][`O1`] ? sheets[sheetName][`O1`].v : 'O';
  const colP = sheets[sheetName][`P1`] ? sheets[sheetName][`P1`].v : 'P';
  const colQ = sheets[sheetName][`Q1`] ? sheets[sheetName][`Q1`].v : 'Q';
  const colR = sheets[sheetName][`R1`] ? sheets[sheetName][`R1`].v : 'R';
  const colS = sheets[sheetName][`S1`] ? sheets[sheetName][`S1`].v : 'S';
  const colT = sheets[sheetName][`T1`] ? sheets[sheetName][`T1`].v : 'T';
  const colU = sheets[sheetName][`U1`] ? sheets[sheetName][`U1`].v : 'U';
  const colV = sheets[sheetName][`V1`] ? sheets[sheetName][`V1`].v : 'V';

  const colX = sheets[sheetName][`X1`] ? sheets[sheetName][`X1`].v : 'X';
  const colY = sheets[sheetName][`Y1`] ? sheets[sheetName][`Y1`].v : 'Y';
  const colAA = sheets[sheetName][`AA1`] ? sheets[sheetName][`AA1`].v : 'AA';
  const colAB = sheets[sheetName][`AB1`] ? sheets[sheetName][`AB1`].v : 'AB';
  const colAC = sheets[sheetName][`AC1`] ? sheets[sheetName][`AC1`].v : 'AC';
  const colAD = sheets[sheetName][`AD1`] ? sheets[sheetName][`AD1`].v : 'AD';
  const colAE = sheets[sheetName][`AE1`] ? sheets[sheetName][`AE1`].v : 'AE';
  const colAF = sheets[sheetName][`AF1`] ? sheets[sheetName][`AF1`].v : 'AF';
  const colAG = sheets[sheetName][`AG1`] ? sheets[sheetName][`AG1`].v : 'AG';
  const colAH = sheets[sheetName][`AH1`] ? sheets[sheetName][`AH1`].v : 'AH';
  const colAI = sheets[sheetName][`AI1`] ? sheets[sheetName][`AI1`].v : 'AI';
  const colAJ = sheets[sheetName][`AJ1`] ? sheets[sheetName][`AJ1`].v : 'AJ';
  const colAK = sheets[sheetName][`AK1`] ? sheets[sheetName][`AK1`].v : 'AK';

  const columns = [];

  jsonSheet.forEach((row, i) => {
    const jj = row[colJ] ? row[colJ] : '';
    const ii = row[colI] ? row[colI] : '';
    const ll = row[colL] ? row[colL] : '';
    const mm = row[colM] ? row[colM] : '';
    const nn = row[colN] ? row[colN] : '';
    const oo = row[colO] ? row[colO] : '';
    const pp = row[colP] ? row[colP] : '';
    const qq = row[colQ] ? row[colQ] : '';
    const rr = row[colR] ? row[colR] : '';
    const ss = row[colS] ? row[colS] : '';
    const tt = row[colT] ? row[colT] : '';
    const uu = row[colU] ? row[colU] : '';
    const vv = row[colV] ? row[colV] : '';

    const xx = row[colX] ? row[colX] : '';
    const yy = row[colY] ? row[colY] : '';
    const aa = row[colAA] ? row[colAA] : '';
    const ab = row[colAB] ? row[colAB] : '';
    const ac = row[colAC] ? row[colAC] : '';
    const ad = row[colAD] ? row[colAD] : '';
    const ae = row[colAE] ? row[colAE] : '';
    const af = row[colAF] ? row[colAF] : '';
    const ag = row[colAG] ? row[colAG] : '';
    const ah = row[colAH] ? row[colAH] : '';
    const ai = row[colAI] ? row[colAI] : '';
    const aj = row[colAJ] ? row[colAJ] : '';
    const ak = row[colAK] ? row[colAK] : '';

    if (i < 22) {
      if ((ii && typeof ii === 'string') && (ii.trim() === 'Max' || ii.trim() === 'Min' || ii.trim() === 'Average')) {
        columns.push(jj); // J
        columns.push(ll); // L
        columns.push(mm); // N
        columns.push(nn); // M
        columns.push(oo); // O
        columns.push(pp); // P
        columns.push(qq); // Q
        columns.push(rr); // R
        columns.push(ss); // S
        columns.push(tt); // T
        columns.push(uu); // U
        columns.push(vv); // V
      }
    } else {
      if ((xx && typeof xx === 'string') && (xx.trim() === 'Max' || xx.trim() === 'Min' || xx.trim() === 'Average')) {
        columns.push(yy); // YY
        columns.push(aa); // AA
        columns.push(ab); // AB
        columns.push(ac); // AC
        columns.push(ad); // AD
        columns.push(ae); // AE
        columns.push(af); // AF
        columns.push(ag); // AG
        columns.push(ah); // AH
        columns.push(ai); // AI
        columns.push(aj); // AJ
        columns.push(ak); // AK
      }
    }
  })

  // console.warn(columns)

  const YEARS = ['avg', 2060, 2055, 2050, 2045, 2040, 2035, 2030, 2025, 2020, 2015, 2010,];
  const BLUEDATA = [];
  const REDDATA = [];
  YEARS.forEach((year, i) => {
    BLUEDATA.push({ color: '#B8E2FF', name: year, max: columns[i], min: columns[i + 12], avg: columns[i + 24] })
  })
  YEARS.forEach((year, i) => {
    i = i + 36;
    REDDATA.push({ color: '#EDC5DF', name: year, max: columns[i], min: columns[i + 12], avg: columns[i + 24] })
  })

  // console.warn(BLUEDATA)
  // console.warn(REDDATA)

  return { blue: BLUEDATA, red: REDDATA };
}

// AFTD EXCESS RETURN SECTION
const tdExcessReturn = (sheets) => {
  const sheetName = 'AFTD_Excess Return';
  const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);

  if (!sheets[sheetName]['N5'].w)
    console.warn('AFTD_Excess Return page possibly missing green box (and N column)')

  const returnsData = [];
  returnsData.push(sheets[sheetName]['N5'].w)
  returnsData.push(sheets[sheetName]['N6'].w)
  returnsData.push(sheets[sheetName]['N7'].w)
  returnsData.push(sheets[sheetName]['N8'].w)
  returnsData.push(sheets[sheetName]['N9'].w)

  const outputData = [];
  const colA = sheets[sheetName][`A1`].v;
  const colB = sheets[sheetName][`B1`].v;
  const colC = sheets[sheetName][`C1`].v;
  const colD = sheets[sheetName][`D1`].v;
  const colE = sheets[sheetName][`E1`].v;

  jsonSheet.forEach((row, i) => {

    const date = row[colA];
    if (convertDate(date) !== "Invalid Date") {
      const AFTD = row[colB];
      const TI = row[colC];
      const CI = row[colD];
      const SP = row[colE];

      outputData.push({ date: convertDate(date), AFTD: AFTD, TI: TI, CI: CI, SP: SP });
    }

  })

  return { data: outputData, returns: returnsData };
}

// get the data for the glide path in AFTD
// note: this is only for the first toggle, the other data is still hard coded in tdHero.js
const tdHeroData = (sheets) => {
  const sheetName = 'AFTD glidepath';
  const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
  const outputData = [];
  const columns = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  //   [
  //     "As of 9/30/21", //0
  //     "__EMPTY",       //1
  //     "__EMPTY_1",     //2
  //     "__EMPTY_2",     //3
  //     "__EMPTY_3",     //4
  //     "__EMPTY_4",     //5
  //     "__EMPTY_5",     //6
  //     "__EMPTY_6",     //7
  //     "__EMPTY_7",     //8
  //     "__EMPTY_8",     //9
  //     "__EMPTY_9",     //10
  //     "__EMPTY_10",    //11
  //     "__EMPTY_11",    //12
  //     "__EMPTY_12",    //13
  //     "__EMPTY_13",    //14
  //     "__EMPTY_14",    //15
  //     "__EMPTY_15"     //16
  // ]

  // get the actual columns names/text in a somewhat robust way... hopefully ;)
  const keys = Object.keys(jsonSheet[0])

  const colB = keys[0]; // as of date
  const colC = keys[1];
  const colD = keys[2];
  const colE = keys[3];
  const colF = keys[4];
  const colG = keys[5];
  const colH = keys[6];
  const colI = keys[7];
  const colJ = keys[8];
  const colK = keys[9];
  const colL = keys[10];
  const colM = keys[11];
  const colN = keys[12];
  const colO = keys[13];
  const colP = keys[14];
  const colQ = keys[15];
  const colR = keys[16];

  const LOOKUP = [
    'Growth Allocation (%)',
    'Growth-and-Income Allocation (%)',
    'Equity-Income Allocation (%)',
    'Balanced allocation (%)',
    'Fixed Income Allocation (%)',
  ]

  // store columns
  jsonSheet.forEach((row, i) => {
    // console.log(row)

    const name = row[colB];
    const cc = row[colC] === '-' ? 0 : row[colC] === 0 ? 0 : row[colC] ? row[colC] : '';
    const dd = row[colD] === '-' ? 0 : row[colD] === 0 ? 0 : row[colD] ? row[colD] : '';
    const ee = row[colE] === '-' ? 0 : row[colE] === 0 ? 0 : row[colE] ? row[colE] : '';
    const ff = row[colF] === '-' ? 0 : row[colF] === 0 ? 0 : row[colF] ? row[colF] : '';
    const gg = row[colG] === '-' ? 0 : row[colG] === 0 ? 0 : row[colG] ? row[colG] : '';
    const hh = row[colH] === '-' ? 0 : row[colH] === 0 ? 0 : row[colH] ? row[colH] : '';
    const ii = row[colI] === '-' ? 0 : row[colI] === 0 ? 0 : row[colI] ? row[colI] : '';
    const jj = row[colJ] === '-' ? 0 : row[colJ] === 0 ? 0 : row[colJ] ? row[colJ] : '';
    const kk = row[colK] === '-' ? 0 : row[colK] === 0 ? 0 : row[colK] ? row[colK] : '';
    const ll = row[colL] === '-' ? 0 : row[colL] === 0 ? 0 : row[colL] ? row[colL] : '';
    const mm = row[colM] === '-' ? 0 : row[colM] === 0 ? 0 : row[colM] ? row[colM] : '';
    const nn = row[colN] === '-' ? 0 : row[colN] === 0 ? 0 : row[colN] ? row[colN] : '';
    const oo = row[colO] === '-' ? 0 : row[colO] === 0 ? 0 : row[colO] ? row[colO] : '';
    const pp = row[colP] === '-' ? 0 : row[colP] === 0 ? 0 : row[colP] ? row[colP] : '';
    const qq = row[colQ] === '-' ? 0 : row[colQ] === 0 ? 0 : row[colQ] ? row[colQ] : '';
    const rr = row[colR] === '-' ? 0 : row[colR] === 0 ? 0 : row[colR] ? row[colR] : '';

    // console.log(name, cc, dd, ee, ff, gg, hh, ii, jj, kk, ll, mm, nn, oo, pp, qq, rr)

    if (name.trim() === LOOKUP[0] || name.trim() === LOOKUP[1] || name.trim() === LOOKUP[2] || name.trim() === LOOKUP[3] || name.trim() === LOOKUP[4]) {
      columns[0].push(Math.round(cc * 10) / 10); // C
      columns[1].push(Math.round(dd * 10) / 10); // D
      columns[2].push(Math.round(ee * 10) / 10); // F
      columns[3].push(Math.round(ff * 10) / 10); // E
      columns[4].push(Math.round(gg * 10) / 10); // G
      columns[5].push(Math.round(hh * 10) / 10); // H
      columns[6].push(Math.round(ii * 10) / 10); // I
      columns[7].push(Math.round(jj * 10) / 10); // J
      columns[8].push(Math.round(kk * 10) / 10); // K
      columns[9].push(Math.round(ll * 10) / 10); // L
      columns[10].push(Math.round(mm * 10) / 10); // N
      columns[11].push(Math.round(nn * 10) / 10); // M
      columns[12].push(Math.round(oo * 10) / 10); // O
      columns[13].push(Math.round(pp * 10) / 10); // P
      columns[14].push(Math.round(qq * 10) / 10); // Q
      columns[15].push(Math.round(rr * 10) / 10); // R
    }
  })

  const AGES = [-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30]
  columns.forEach((col, i) => {
    outputData.push({
      'age': AGES[i],
      'Growth funds': col[0],
      'Growth-and-income funds': col[1],
      'Equity-income funds': col[2],
      'Balanced funds': col[3],
      'Fixed income': col[4]
    })
  })

  return outputData;

  //   "heroData": [
  //         { 'Growth funds': 45, 'Growth-and-income funds': 40, 'Equity-income funds': 0, 'Balanced funds': 10, 'Fixed income': 5, age: -45 },
  //         { 'Growth funds': 45, 'Growth-and-income funds': 40, 'Equity-income funds': 0, 'Balanced funds': 10, 'Fixed income': 5, age: -40 },
  //         { 'Growth funds': 45, 'Growth-and-income funds': 40, 'Equity-income funds': 0, 'Balanced funds': 10, 'Fixed income': 5, age: -35 },
  //         { 'Growth funds': 45, 'Growth-and-income funds': 40, 'Equity-income funds': 0, 'Balanced funds': 10, 'Fixed income': 5, age: -30 },
  //         { 'Growth funds': 43, 'Growth-and-income funds': 36, 'Equity-income funds': 4, 'Balanced funds': 12, 'Fixed income': 5, age: -25 },
  //         { 'Growth funds': 41, 'Growth-and-income funds': 34, 'Equity-income funds': 7, 'Balanced funds': 13, 'Fixed income': 5, age: -20 },
  //         { 'Growth funds': 37, 'Growth-and-income funds': 33, 'Equity-income funds': 7, 'Balanced funds': 13, 'Fixed income': 10, age: -15 },
  //         { 'Growth funds': 23, 'Growth-and-income funds': 31, 'Equity-income funds': 8, 'Balanced funds': 13, 'Fixed income': 25, age: -10 },
  //         { 'Growth funds': 17, 'Growth-and-income funds': 27, 'Equity-income funds': 8, 'Balanced funds': 13, 'Fixed income': 35, age: -5 },
  //         { 'Growth funds': 6, 'Growth-and-income funds': 24, 'Equity-income funds': 13, 'Balanced funds': 12, 'Fixed income': 45, age: 0 },
  //         { 'Growth funds': 3, 'Growth-and-income funds': 22, 'Equity-income funds': 18, 'Balanced funds': 12, 'Fixed income': 45, age: 5 },
  //         { 'Growth funds': 0, 'Growth-and-income funds': 20, 'Equity-income funds': 19, 'Balanced funds': 11, 'Fixed income': 50, age: 10 },
  //         { 'Growth funds': 0, 'Growth-and-income funds': 16, 'Equity-income funds': 25, 'Balanced funds': 9, 'Fixed income': 50, age: 15 },
  //         { 'Growth funds': 0, 'Growth-and-income funds': 12, 'Equity-income funds': 26, 'Balanced funds': 7, 'Fixed income': 55, age: 20 },
  //         { 'Growth funds': 0, 'Growth-and-income funds': 6, 'Equity-income funds': 27, 'Balanced funds': 7, 'Fixed income': 60, age: 25 },
  //         { 'Growth funds': 0, 'Growth-and-income funds': 5, 'Equity-income funds': 28, 'Balanced funds': 7, 'Fixed income': 60, age: 30 }

  // ]
};

const tdUF = (sheets) => {
  // const sheetName = 'AFTD allocation';
  const sheetName = 'AFTD glidepath';

  const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);

  const keys = Object.keys(jsonSheet[0]);

  if (keys.length < 10) {
    console.error(sheetName, keys)
    console.error('AFTD Underlying Funds SECTION ISNT GOING TO WORK')
  }

  console.warn(keys)

  const colA = keys[0];
  const colB = keys[1];
  const colC = keys[2];
  const colD = keys[3];
  const colE = keys[4];
  const colF = keys[5];
  const colG = keys[6];
  const colH = keys[7];
  const colI = keys[8];
  const colJ = keys[9];
  const colK = keys[10];
  const colL = keys[11];
  const colM = keys[12];
  const colN = keys[13];
  const colO = keys[14];
  const colP = keys[15];
  const colQ = keys[16];

  const outputData = [];

  jsonSheet.forEach((row, i) => {

    if (i >= 2) {
      const name = row[colA];
      const allocationRow = name.includes('%');
      const v1 = allocationRow && row[colB] === 0 ? '—' : row[colB] ? row[colB] : '';
      const v2 = allocationRow && row[colC] === 0 ? '—' : row[colC] ? row[colC] : '';
      const v3 = allocationRow && row[colD] === 0 ? '—' : row[colD] ? row[colD] : '';
      const v4 = allocationRow && row[colE] === 0 ? '—' : row[colE] ? row[colE] : '';
      const v5 = allocationRow && row[colF] === 0 ? '—' : row[colF] ? row[colF] : '';
      const v6 = allocationRow && row[colG] === 0 ? '—' : row[colG] ? row[colG] : '';
      const v7 = allocationRow && row[colH] === 0 ? '—' : row[colH] ? row[colH] : '';
      const v8 = allocationRow && row[colI] === 0 ? '—' : row[colI] ? row[colI] : '';
      const v9 = allocationRow && row[colJ] === 0 ? '—' : row[colJ] ? row[colJ] : '';
      const v10 = allocationRow && row[colK] === 0 ? '—' : row[colK] ? row[colK] : '';
      const v11 = allocationRow && row[colL] === 0 ? '—' : row[colL] ? row[colL] : '';
      const v12 = allocationRow && row[colM] === 0 ? '—' : row[colM] ? row[colM] : '';
      const v13 = allocationRow && row[colN] === 0 ? '—' : row[colN] ? row[colN] : '';
      const v14 = allocationRow && row[colO] === 0 ? '—' : row[colO] ? row[colO] : '';
      const v15 = allocationRow && row[colP] === 0 ? '—' : row[colP] ? row[colP] : '';
      const v16 = allocationRow && row[colQ] === 0 ? '—' : row[colQ] ? row[colQ] : '';

      // const pctSign = name.includes('%') ? '%' : '';
      // we aren't going to use this percent sign for now
      const pctSign = null;

      outputData.push(
        name,
        typeof v1 === 'string' ? v1 : Math.round(Number(v1) * 10) / 10 + pctSign,
        typeof v2 === 'string' ? v2 : Math.round(Number(v2) * 10) / 10 + pctSign,
        typeof v3 === 'string' ? v3 : Math.round(Number(v3) * 10) / 10 + pctSign,
        typeof v4 === 'string' ? v4 : Math.round(Number(v4) * 10) / 10 + pctSign,
        typeof v5 === 'string' ? v5 : Math.round(Number(v5) * 10) / 10 + pctSign,
        typeof v6 === 'string' ? v6 : Math.round(Number(v6) * 10) / 10 + pctSign,
        typeof v7 === 'string' ? v7 : Math.round(Number(v7) * 10) / 10 + pctSign,
        typeof v8 === 'string' ? v8 : Math.round(Number(v8) * 10) / 10 + pctSign,
        typeof v9 === 'string' ? v9 : Math.round(Number(v9) * 10) / 10 + pctSign,
        typeof v10 === 'string' ? v10 : Math.round(Number(v10) * 10) / 10 + pctSign,
        typeof v11 === 'string' ? v11 : Math.round(Number(v11) * 10) / 10 + pctSign,
        typeof v12 === 'string' ? v12 : Math.round(Number(v12) * 10) / 10 + pctSign,
        typeof v13 === 'string' ? v13 : Math.round(Number(v13) * 10) / 10 + pctSign,
        typeof v14 === 'string' ? v14 : Math.round(Number(v14) * 10) / 10 + pctSign,
        typeof v15 === 'string' ? v15 : Math.round(Number(v15) * 10) / 10 + pctSign,
        typeof v16 === 'string' ? v16 : Math.round(Number(v16) * 10) / 10 + pctSign,
      )
    }
  })

  return outputData;
}

// TARGET DATE RETURNS SECTION
const tdReturns = (sheets) => {
  const sheetName = 'AFTD Results';
  const jsonSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
  // const xlSheet = sheets[sheetName];

  const colC = '__EMPTY_2';
  const colD = '__EMPTY_3';
  const colE = '__EMPTY_4';
  const colF = '__EMPTY_5';
  const colG = '__EMPTY_6';
  const colH = '__EMPTY_7';
  const colI = '__EMPTY_8';
  const expenseCol = '8';

  const d1 = [];
  const d2 = [];
  const expData = [];

  jsonSheet.forEach((row, i) => {
    const v1 = row[colC] ? (Math.round(row[colC] * 100) / 100).toFixed(2) : '—';
    const v2 = row[colD] ? (Math.round(row[colD] * 100) / 100).toFixed(2) : '—';
    const v3 = row[colE] ? (Math.round(row[colE] * 100) / 100).toFixed(2) : '—';

    const v4 = row[colF] ? (Math.round(row[colF] * 100) / 100).toFixed(2) : '—';
    const v5 = row[colG] ? (Math.round(row[colG] * 100) / 100).toFixed(2) : '—';
    const v6 = row[colH] ? (Math.round(row[colH] * 100) / 100).toFixed(2) : '—';
    const v7 = row[colI] ? (Math.round(row[colI] * 100) / 100).toFixed(2) : '—';

    const e1 = row[expenseCol] ? (Math.round(row[expenseCol] * 100) / 100).toFixed(2) : '—';

    if (i >= 5 && i <= 20) {
      d1.push(v1, v2, v3);
      d2.push(v4, v5, v6, v7);
      expData.push(e1)
    }
  })

  return { d1, d2, expData }
}

const tdResiliency = (sheets) => {
  const sheetName = 'AFTD heatmap';
  const currentSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
  const xlSheet = sheets[sheetName];

  const colE = '__EMPTY_4';
  const colH = '__EMPTY_7';
  const colK = '__EMPTY_10';
  const colN = '__EMPTY_13';
  const colQ = '__EMPTY_16';
  const colT = '__EMPTY_19';
  const colW = '__EMPTY_22';
  const colZ = '__EMPTY_25';

  const d1 = [];
  const d2 = [];
  const d3 = [];
  const d4 = [];
  const d5 = [];
  const d6 = [];
  const d7 = [];
  const d8 = [];

  currentSheet.forEach((row, i) => {
    if (i >= 7 && i <= 18) {
      d1.push(row[colE])
      d2.push(row[colH])
      d3.push(row[colK])
      d4.push(row[colN])
      d5.push(row[colQ])
      d6.push(row[colT])
      d7.push(row[colW])
      d8.push(row[colZ])
    }
  })

  return [
    d1, d2, d3, d4, d5, d6, d7, d8
  ];
}

const tdEquity = (sheets) => {
  const sheetName = 'AFTD equity';
  const currentSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
  const xlSheet = sheets[sheetName];

  const fund2055 = []
  // const fund2035 = []
  const fund2015 = []

  const name55 = '__EMPTY_3';
  const yield55 = '__EMPTY_4';
  // const name35 = '__EMPTY_7';
  // const yield35 = '__EMPTY_8';
  const name15 = '__EMPTY_7';
  const yield15 = '__EMPTY_8';

  currentSheet.forEach((row, i) => {
    if (i >= 1 && i < 11) {
      fund2055.push({ name: row[name55], value: row[yield55] })
      // fund2035.push({ name: row[name35], value: row[yield35] })
      fund2015.push({ name: row[name15], value: row[yield15] })
    }
  })

  // weighted average and top 10
  const wa55 = xlSheet[`F13`].v;
  const top55 = xlSheet[`D13`].v;
  // const wa35 = xlSheet[`K13`].v;
  // const top35 = xlSheet[`I13`].v;
  const wa15 = xlSheet[`K13`].v;
  const top15 = xlSheet[`I13`].v;

  return [
    { name: 'fund2055', data: fund2055, wAvgYield: wa55, top10: top55 },
    // { name: 'fund2035', data: fund2035, wAvgYield: wa35, top10: top35 },
    { name: 'fund2015', data: fund2015, wAvgYield: wa15, top10: top15 }
  ];
}

const tdPeerRankings = (sheets) => {

  const output = {};

  // vs peers
  const vPeers = []
  const currentName = 'AFTD vs peers';
  // for (let i = 5; i < 76; i = i + 14) {
  //   vPeers.push({
  //     name: sheets[currentName][`E${i}`].w,
  //     aum: sheets[currentName][`F${i}`].v,
  //     inception: sheets[currentName][`G${i}`].w,
  //     // aum: sheets[currentName][`H${i}`].w,
  //     qtd: sheets[currentName][`I${i}`].v,
  //     ytd: sheets[currentName][`J${i}`].v,
  //     oneYear: sheets[currentName][`K${i}`].v,
  //     threeYears: sheets[currentName][`L${i}`].v,
  //     fiveYears: sheets[currentName][`M${i}`].v,
  //     tenYears: sheets[currentName][`N${i}`].v,
  //     lifetime: sheets[currentName][`O${i}`].v,
  //   })
  // }

  // vs mStar
  const vMstar = []
  const sheetName = 'AFTD excess v mstar';
  const mstarSheet = XLSX.utils.sheet_to_json(sheets[sheetName]);
  let fundName = ''
  const name = '__EMPTY_4'
  const value = '__EMPTY_6';

  const years = []
  for (let i = 2060; i >= 2010; i = i - 5) {
    years.push(i)
    vMstar[i] = [];
  }

  mstarSheet.forEach(row => {
    if (row[name] && !(String(row[name]).startsWith('2'))) {
      fundName = row[name];
    }
    if (years.includes(Number(row[name]))) {
      vMstar[Number(row[name])].push({ name: fundName, value: Math.round(row[value] * 100) / 100, year: row[name] })
    }
  })

  // add to output
  output['vPeers'] = vPeers;
  output['vMstar'] = vMstar;

  return output;
}

// const tdSuccessRate = (sheets) => {
//   const output = {};
//   const asOf = sheets["AFTD success rate"]["A1"].w;
//   const col1 = asOf
//   const colB = '__EMPTY';
//   const colC = '__EMPTY_1';
//   const successRateJSON = XLSX.utils.sheet_to_json(sheets["AFTD success rate"]);
//   const passiveBars = [];
//   let passiveDonut = null;
//   const hybridBars = [];
//   let hybridDonut = null;
//   const activeBars = [];
//   let activeDonut = null;

//   let flag = 0;
//   successRateJSON.forEach((row) => {
//     if (row[col1] === 'AFTD Relative to Average Passive TD Manager') {
//       flag = 1;
//     }
//     if (flag === 1 && row[col1] === 'All periods') {
//       passiveDonut = row[colC];
//       passiveBars[2] = Math.round(row[colB] * 100);
//     }
//     if (flag === 1 && row[col1] === 'Only positive periods') {
//       passiveBars[0] = Math.round(row[colB] * 100);
//     }
//     if (flag === 1 && row[col1] === 'Only negative periods') {
//       passiveBars[1] = Math.round(row[colB] * 100);
//     }

//     if (row[col1] === 'AFTD relative to Average Blend TD Manager') {
//       flag = 2;
//     }
//     if (flag === 2 && row[col1] === 'All periods') {
//       hybridDonut = row[colC];
//       hybridBars[2] = Math.round(row[colB] * 100);
//     }
//     if (flag === 2 && row[col1] === 'Only positive periods') {
//       hybridBars[0] = Math.round(row[colB] * 100);
//     }
//     if (flag === 2 && row[col1] === 'Only negative periods') {
//       hybridBars[1] = Math.round(row[colB] * 100);
//     }

//     if (row[col1] === 'AFTD relative to Average Active TD Manager (x AFTD)') {
//       flag = 3;
//     }
//     if (flag === 3 && row[col1] === 'All periods') {
//       activeDonut = row[colC];
//       activeBars[2] = Math.round(row[colB] * 100);
//     }
//     if (flag === 3 && row[col1] === 'Only positive periods') {
//       activeBars[0] = Math.round(row[colB] * 100);
//     }
//     if (flag === 3 && row[col1] === 'Only negative periods') {
//       activeBars[1] = Math.round(row[colB] * 100);
//     }
//   })

//   output['passive'] = {
//     asOf: asOf,
//     donut: Math.round(passiveDonut * 100),
//     bars: passiveBars
//   }

//   output['hybrid'] = {
//     asOf: asOf,
//     donut: Math.round(hybridDonut * 100),
//     bars: hybridBars
//   }

//   output['active'] = {
//     asOf: asOf,
//     donut: Math.round(activeDonut * 100),
//     bars: activeBars
//   }

//   return output;
// }

////////////////////////////////////
// Gets line graph data for indexes (from sheet "Index 10k mtn")
const getIndexLineData = indexMtnSheet => {
  let indexNameColumn = Object.keys(indexMtnSheet[0])[0];
  let indices = [];
  let lineData = [];

  // STARTS AT ROW 5
  for (let i = 3; i < indexMtnSheet.length; i++) {
    if (!indices.includes(indexMtnSheet[i][indexNameColumn].trim())) {
      indices.push(indexMtnSheet[i][indexNameColumn].trim());
    }
  }

  indices.forEach(index => {
    let data = [];

    // STARTS AT ROW 5
    for (let i = 3; i < indexMtnSheet.length; i++) {

      if (indexMtnSheet[i][indexNameColumn].trim() === index.trim()) {
        data.push({
          date: convertDate(indexMtnSheet[i]["__EMPTY"]),
          value: indexMtnSheet[i]["__EMPTY_1"]
        });
      }
    }

    if (indexMtnSheet[i][indexNameColumn].startsWith('MSCI E')) {
      console.warm('DATA', data)
    }

    lineData.push({ name: index.trim(), data });
  });

  return JSON.stringify(lineData);
};

// GETS R6 HERO DATA FROM PAGE...
// ltIndex = sheets[`Lifetime success rate index`]
// ltPeers = sheets['Lifetime success rate peers']
// msAvg = sheets['MStar fee level group avg']
// BLENDED = sheets['Blended capture ratio']
// EXP = sheets['Prosp exp ratio fund']

const getR6HeroData = (fund, ltIndex, ltPeers, msAvg, blended, exp) => {
  const lifetimeIdxSheet = XLSX.utils.sheet_to_json(ltIndex);
  const lifetimePeer = XLSX.utils.sheet_to_json(ltPeers);
  const mstarAv = XLSX.utils.sheet_to_json(msAvg);
  const blendedRatio = XLSX.utils.sheet_to_json(blended);
  const expenseRatios = XLSX.utils.sheet_to_json(exp);
  const asOfExp = exp['B1'].w;

  let output = {};

  if (fund.objective === 'Balanced') {
    // BLENDED = sheets['Blended capture ratio']

    const fundName = blended['A1'].w;
    const upside = blended['B1'].w;
    const downside = '__EMPTY';
    const avgOutpacedReturn = '__EMPTY_1';
    const avgLaggedReturn = '__EMPTY_2';
    const asOfDate = blended['B3'].w;

    blendedRatio.forEach(row => {
      if (row[fundName].trim() === fund.name) {
        output['captureRatio'] = { 'asOfDate': asOfDate, 'upside': row[upside], 'downside': row[downside] };
        output['bars'] = [
          { name: 'avgOutpacedReturn', value: row[avgOutpacedReturn] },
          { name: 'avgLaggedReturn', value: row[avgLaggedReturn] }
        ]
      }
    })

    //
    output['expenses'] = getExpenseRatios(asOfExp, asOfExp, fund);

  } else if (fund.objective === 'Growth' || fund.objective === 'Equity income') {
    const fundNameIndex = ltIndex['A1'].w;
    const fundNamePeer = ltPeers['A1'].w;
    const indexPageIndexColumn = ltIndex['B1'].w;
    const peerPagePeerColumn = ltPeers['B1'].w;
    const timePeriodYears = '__EMPTY_1';
    const periodsOutpaced = '__EMPTY_2';
    // const periodsLagged = '__EMPTY_3';
    const totalPeriods = '__EMPTY_4';
    const successRate = '__EMPTY_5';
    const avgOutpacedReturn = '__EMPTY_8';
    const avgLaggedReturn = '__EMPTY_9';

    const donutData = {};
    const barData = {};
    let peerName = '';

    // ltIndex = sheets[`Lifetime success rate index`]
    lifetimeIdxSheet.forEach(row => {

      const timePeriod = fund.id === 'IVE' || fund.id === 'GIF' ? 3 : 10;

      if (row[fundNameIndex] === fund.name && row[indexPageIndexColumn] === fund.indexPrimary && row[timePeriodYears] === timePeriod) {
        donutData['index'] = { 'periodsOutpaced': row[periodsOutpaced], 'totalPeriods': row[totalPeriods], 'successRate': Math.round(row[successRate]) };
        barData['index'] = [
          { name: 'avgOutpacedReturn', value: row[avgOutpacedReturn] },
          { name: 'avgLaggedReturn', value: row[avgLaggedReturn] }
        ]
      }
    })

    // ltPeers = sheets['Lifetime success rate peers']
    lifetimePeer.forEach(row => {

      const xlFundName = row[fundNamePeer].toLowerCase().trim() === 'income fund of america' ? 'The Income Fund of America' : row[fundNamePeer];

      if (xlFundName === fund.name) {
        donutData['peer'] = { 'periodsOutpaced': row['__EMPTY_1'], 'totalPeriods': row['__EMPTY_3'], 'successRate': Math.round(row['__EMPTY_4']) };
        barData['peer'] = [
          { name: 'avgOutpacedReturn', value: row['__EMPTY_5'] },
          { name: 'avgLaggedReturn', value: row['__EMPTY_6'] }
        ]
        peerName = row[peerPagePeerColumn];
      }

    })

    output['donuts'] = donutData;
    output['bars'] = barData;
    output['peerName'] = peerName;
    output['expenses'] = getExpenseRatios(asOfExp, asOfExp, fund);

  } else if (fund.objective === 'Growth and income') {
    const fundNameIndex = ltIndex['A1'].w;
    const fundNamePeer = ltPeers['A1'].w;
    const indexPageIndexColumn = ltIndex['B1'].w;
    const peerIndexName = ltPeers['B1'].w;

    const timePeriodYears = '__EMPTY_1';
    const periodsOutpaced = '__EMPTY_2';
    // const periodsLagged = '__EMPTY_3';
    const totalPeriods = '__EMPTY_4';
    const successRate = '__EMPTY_5';
    const avgOutpacedReturn = '__EMPTY_8';
    const avgLaggedReturn = '__EMPTY_9';

    const donutData = {};
    const barData = {};
    let peerName = '';
    let peerName2 = '';

    // ONE donuts
    // lifetimeIdxSheet = sheets[`Lifetime success rate index`]
    lifetimeIdxSheet.forEach(row => {

      const timePeriod = fund.id === 'DWGI' ? 3 : 10;

      if (row[fundNameIndex] === fund.name && row[indexPageIndexColumn] === fund.indexPrimary && row[timePeriodYears] === timePeriod) {
        donutData['index'] = { 'periodsOutpaced': row[periodsOutpaced], 'totalPeriods': row[totalPeriods], 'successRate': Math.round(row[successRate]) };

        // BAR CHARTS WITH THREE VALUE
        barData['index'] = [
          { name: 'avgOutpacedReturn', value: row[avgOutpacedReturn] },
          { name: 'avgLaggedReturn', value: row[avgLaggedReturn] },
          { name: 'avgExcess', value: row['__EMPTY_10'] }
        ]
      }
    })

    let flag = false;
    // TWO DONUTS, TWO BAR CHARTS WITH THREE VALUES
    // lifetimePeer = sheets['Lifetime success rate peers']
    lifetimePeer.forEach(row => {
      const xlFundName = row[fundNamePeer] === 'Developing World Growth and Income Fund' ? 'American Funds ' + row[fundNamePeer] : row[fundNamePeer];

      if (xlFundName === fund.name && !flag) {
        flag = true;
        donutData['peer'] = { 'name': row[peerIndexName], 'periodsOutpaced': row['__EMPTY_1'], 'totalPeriods': row['__EMPTY_3'], 'successRate': Math.round(row['__EMPTY_4']) };

        barData['peer'] = [
          { name: 'avgOutpacedReturn', value: row['__EMPTY_5'] },
          { name: 'avgLaggedReturn', value: row['__EMPTY_6'] },
          { name: 'avgExcess', value: row['__EMPTY_7'] }
        ]
        peerName = row[peerIndexName];
      }

      if (xlFundName === fund.name && flag) {
        donutData['peer2'] = { 'name': row[peerIndexName], 'periodsOutpaced': row['__EMPTY_1'], 'totalPeriods': row['__EMPTY_3'], 'successRate': Math.round(row['__EMPTY_4']) };

        barData['peer2'] = [
          { name: 'avgOutpacedReturn', value: row['__EMPTY_5'] },
          { name: 'avgLaggedReturn', value: row['__EMPTY_6'] },
          { name: 'avgExcess', value: row['__EMPTY_7'] }
        ]
        peerName2 = row[peerIndexName];
      }
    })

    // EXPENSES 
    output['donuts'] = donutData;
    output['bars'] = barData;
    output['peerName'] = peerName;
    output['peerName2'] = peerName2;
    output['expenses'] = getExpenseRatios(asOfExp, asOfExp, fund);
  }

  function getExpenseRatios(fundName, asOf, fund) {
    let fundVal = null;
    let peer = null;

    // GET EXPENSE RATIOS
    expenseRatios.forEach(row => {
      if (row[fundName] === fund.fundClassNumber) {
        fundVal = row['__EMPTY_5'];
      }
    })

    mstarAv.forEach(row => {
      if (row['Share Class'] === fund.name) {
        peer = row['R-6'];
      }
    })

    return {
      'asOfDate': asOf,
      'data': [
        { name: 'fund', value: fundVal },
        { name: 'peer', value: peer }
      ]
    }
  }

  return output;
}

// GET R6 DATA FOR 'LONG TERM SUCCESS' SECTION FROM PAGE 'Lifetime growth 10k' IN XL FILE
// getLongTermSuccessData(fund, sheets[`Lifetime growth 10k`]);
const getLongTermSuccessData = (fund, xlSheet) => {
  const sheet = XLSX.utils.sheet_to_json(xlSheet);

  let output = [];
  sheet.forEach(row => {
    if (row['Share Class'] === fund.name) {

      output.push({ name: row['Share Class'], value: row['R-6'] });
      output.push({ name: row['__EMPTY'].replace('US', "U.S."), value: row['__EMPTY_1'] });
      output.push({ name: row['__EMPTY_4'].replace('US', "U.S."), value: row['__EMPTY_5'] })

      if (row['__EMPTY_2'] && row['__EMPTY_3'])
        output.push({ name: row['__EMPTY_2'].replace('US', "U.S."), value: row['__EMPTY_3'] })

      if (row['__EMPTY_6'] && row['__EMPTY_7'])
        output.push({ name: row['__EMPTY_6'].replace('US', "U.S."), value: row['__EMPTY_7'] })
    }
  })

  return output;
}

// GET R6 DATA FOR '2Q TOP CONTRIBUTORS, AND TOP DETRACTORS' SECTION FROM XL PAGE 'fund abbreviation Top and Bottom 5'
const getR6TopContributorsData = (fund, xlSheet) => {
  const sheet = XLSX.utils.sheet_to_json(xlSheet);
  let flag = false;
  let counter = 0;
  const top5 = [];
  const tempBottom5 = [];
  let bottom5 = [];

  // HERE ARE THE COLUMNS FROM THE XL
  const fundName = '__EMPTY';
  const sector = '__EMPTY_12';
  const portWeight = '__EMPTY_3';
  const weightDiff = '__EMPTY_5';
  const stockReturn = '__EMPTY_6';
  const relativeContri = '__EMPTY_11';

  // LOOP THROUGH XL DATA TO GET TOP FIVE
  sheet.forEach((row, i) => {
    if (row[fundName] === 'Security') {
      flag = true;
    }

    if (row[fundName] !== 'Security' && row[fundName] !== 'Cash' && flag && counter < 5) {
      top5.push({
        name: row[fundName], sector: row[sector], portWeight: row[portWeight], weightDiff: row[weightDiff],
        stockReturn: row[stockReturn], relativeCont: row[relativeContri]
      })
      counter++;
    }

    // GET FINAL SIX ROWS IN DATA
    if (i > sheet.length - 8 && row[fundName] !== 'Grand Total') {
      tempBottom5.push({
        name: row[fundName], sector: row[sector], portWeight: row[portWeight], weightDiff: row[weightDiff],
        stockReturn: row[stockReturn], relativeCont: row[relativeContri]
      })

      // REMOVE CASH IF IT EXISTS (after going through all rows)
      if (tempBottom5.length === 6) {
        tempBottom5.forEach(el => {
          if (el.name !== 'Cash')
            bottom5.push(el);
        })

        // IF CASH DIDN'T EXIST TAKE THE LAST 5 OF THE ARRAY
        if (bottom5.length === 6) {
          bottom5 = bottom5.slice(1)
        }
      }

    }
  })

  return { top5: top5, bottom5: bottom5 };
}

// GET R6 MSTAR DATA FROM PAGE 'Market Cap Breakdown' in XL page and 'wAvg market cap'
const getMstarData = (fund, sheets) => {
  const mstar = XLSX.utils.sheet_to_json(sheets[`Market cap breakdown`]);
  const wAvg = XLSX.utils.sheet_to_json(sheets[`wAvg market cap`]);

  // COLUMNS FROM THE XL
  const fundName = 'Fact Type';
  const large = '__EMPTY';
  const medium = '__EMPTY_1';
  const small = '__EMPTY_2';

  let output = {}

  let mstarfound = false;
  mstar.forEach(row => {
    if (row[fundName] === fund.name) {
      output['large'] = row[large];
      output['medium'] = row[medium];
      output['small'] = row[small];
      mstarfound = true;
    }
  })

  if (!mstarfound) {
    console.error(fund.id, 'not found in "Market cap breakdown" page')
  }

  let wAvgFound = false;
  wAvg.forEach(row => {
    if (row[fundName] === fund.name) {
      output['wAvg'] = row['__EMPTY']
      wAvgFound = true;
    }
  })

  if (!wAvgFound) {
    console.error(fund.id, 'not found in "wAvg market cap" page')
  }

  return output;
}

// GETS SCORECARD INFO FROM PAGE 'Fi360'
// Find the row corresponding to the Fund based on “Fund Name”  as defined on the “Fund Details” tab
const getScorecardData = (fund, xlSheet) => {
  const asOfDate = xlSheet['B3'].w;
  const sheet = XLSX.utils.sheet_to_json(xlSheet);

  // ALL THE COLUMNS FROM THE XL SHEET
  const fundName = 'Share Class';
  const score = 'R-6';
  const scorePeers = '__EMPTY';
  const scoreColor = '__EMPTY_1';
  const oneYear = '__EMPTY_2';
  const oneYearPeers = '__EMPTY_3';
  const oneYearColor = '__EMPTY_4';
  const threeYear = '__EMPTY_5';
  const threeYearPeers = '__EMPTY_6';
  const threeYearColor = '__EMPTY_7';
  const fiveYear = '__EMPTY_8';
  const fiveYearPeers = '__EMPTY_9';
  const fiveYearColor = '__EMPTY_10';
  const firmScore = '__EMPTY_11';
  const RPAGScore = '__EMPTY_12';

  let output = null;
  sheet.forEach(row => {
    const updatedName = row[fundName] === 'Developing World Growth and Income Fund' ? 'American Funds ' + row[fundName] : row[fundName];
    if (row.__rowNum__ >= 5 && fund.name === updatedName) {
      output = {
        'asOfDate': asOfDate, 'score': row[score], 'scorePeers': row[scorePeers], 'scoreColor': row[scoreColor], 'oneYear': row[oneYear],
        'oneYearPeers': row[oneYearPeers], 'oneYearColor': row[oneYearColor], 'threeYear': row[threeYear],
        'threeYearPeers': row[threeYearPeers], 'threeYearColor': row[threeYearColor], 'fiveYear': row[fiveYear], 'fiveYearPeers': row[fiveYearPeers],
        'fiveYearColor': row[fiveYearColor], 'firmScore': row[firmScore], 'RPAGScore': row[RPAGScore],
      }
    }
  })

  return output;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// GET LINE DATA ///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let flag = 0;

// A/F2 returns points for a line graph as an array of objects
const getLineData = (fund, reinvestedPage, indexPage, reinvestedXl, indexXl) => {

  // getLineData(
  //   fund,
  //   reinvested = XLSX.utils.sheet_to_json(sheets[`10k mtn div reinvested-${fund.class}`]),
  //   indexPage = XLSX.utils.sheet_to_json(sheets['Index 10k mtn']),
  //   reinvestedXl = sheets[`10k mtn div reinvested-${fund.class}`],
  //   indexXl = sheets['Index 10k mtn'],
  // );

  // 10k mtn div reinvested-${fund.class}
  // 10k mtn div reinvested-a
  // 10k mtn div reinvested-f2
  // Index 10k mtn


  let A1reinvest = reinvestedXl['A1'].w;
  let indexNameColumn = indexXl['A1'].w; // 'Index 10k mtn'

  const REINVDATECOLUMN = reinvestedXl['B1'].w;
  const VALATNAV = "__EMPTY";
  const VALATMOP = "__EMPTY_1";
  const indexPrimary = {};
  const indexSecondary = {};
  const indexSecondary2 = {};
  const indexSecondary3 = {};
  const dates = [];
  const nav = {};

  const latestYear = new Date(reinvestedXl['B3'].w).getFullYear();

  if (flag === 0) {
    console.log(currentTime(true), 'last year in getLineData:', latestYear)
  }
  flag++;

  // PROCESS 10K MTN DIV REINVESTED-${SHARE-CLASS} PAGE
  reinvestedPage.forEach((row, i) => {
    const convertedDate = String(convertDate(row[REINVDATECOLUMN], true));
    const validDate = convertedDate !== "Invalid Date" && latestYear - convertDate(row[REINVDATECOLUMN], true).getFullYear() <= 20;

    const fundNameFromXL = row[A1reinvest] === 'Developing World Growth and Income Fund' ? "American Funds Developing World Growth and Income Fund" : row[A1reinvest];

    if (fundNameFromXL === fund.name && validDate) {
      nav[row[REINVDATECOLUMN]] = row[VALATNAV];

      if (!dates.includes(row[REINVDATECOLUMN])) {
        dates.push(row[REINVDATECOLUMN]);
      }
    }
  });

  // ON PAGE 'INDEX 10K MTN' OF THE SPREADSHEET...
  // SEVERAL INDEXES ARE LISTED WITH THEIR ASSOCIATED FUND ID AT THE BEGINNING OF THEIR NAME...
  // THIS IS TRUE FOR THESE FUNDS...
  // IVE, GIF, IGI, GBAL, DGWI
  // SO THESE FUNDS HAVE AN EXCEPTION BELOW IN THE IF/ELSE STATEMENT

  // INDEX 10K MTN *********** SPREADSHEET PAGE ***********************
  if (fund.id === 'IVE') {
    indexPage.forEach((row, i) => {
      switch (row[indexNameColumn].trim()) {
        case "IVE" + fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "IVE" + fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        // case fund["indexSecondary2"]: {
        //   indexSecondary2[row[VALATNAV]] = row[VALATMOP];
        //   break;
        // }
        // case fund["indexSecondary3"]: {
        //   indexSecondary3[row[VALATNAV]] = row[VALATMOP];
        //   break;
        // }
      }
    });
  } else if (fund.id === 'GIF') {
    indexPage.forEach((row, i) => {
      switch (row[indexNameColumn].trim()) {
        case "GIF" + fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "GIF" + fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
      }
    })
  } else if (fund.id === 'IGI') {
    indexPage.forEach((row, i) => {
      switch (row[indexNameColumn].trim()) {
        case "IGI" + fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "IGI" + fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
      }
    })
  } else if (fund.id === 'GBAL') {
    indexPage.forEach((row, i) => {
      switch (row[indexNameColumn].trim()) {
        case "GBAL" + fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "GBAL" + fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "GBAL" + fund["indexSecondary2"]: {
          indexSecondary2[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "GBAL" + fund["indexSecondary3"]: {
          indexSecondary3[row[VALATNAV]] = row[VALATMOP];
          break;
        }
      }
    })
  } else if (fund.id === 'DWGI') {
    indexPage.forEach((row, i) => {
      switch (row[indexNameColumn].trim()) {
        case "DWGI" + fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case "DWGI" + fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
      }
    })
  } else {

    indexPage.forEach((row, i) => {

      switch (row[indexNameColumn].trim()) {
        case fund["indexPrimary"]: {
          indexPrimary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case fund["indexSecondary"]: {
          indexSecondary[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case fund["indexSecondary2"]: {
          indexSecondary2[row[VALATNAV]] = row[VALATMOP];
          break;
        }
        case fund["indexSecondary3"]: {
          indexSecondary3[row[VALATNAV]] = row[VALATMOP];
          break;
        }
      }
    });
  }

  const processedData = [];
  dates.forEach(date => {
    if (fund.indexSecondary3) {
      processedData.push({
        date: convertDate(date),
        navValue: nav[date],
        indexPrimaryValue: indexPrimary[date],
        indexSecondaryValue: indexSecondary[date],
        indexSecondary2Value: indexSecondary2[date],
        indexSecondary3Value: indexSecondary3[date]
      });
    } else if (fund.indexSecondary2) {
      processedData.push({
        date: convertDate(date),
        navValue: nav[date],
        indexPrimaryValue: indexPrimary[date],
        indexSecondaryValue: indexSecondary[date],
        indexSecondary2Value: indexSecondary2[date]
      });
    } else if (fund.indexSecondary) {
      processedData.push({
        date: convertDate(date),
        navValue: nav[date],
        indexPrimaryValue: indexPrimary[date],
        indexSecondaryValue: indexSecondary[date]
      });
    } else {
      processedData.push({
        date: convertDate(date),
        navValue: nav[date],
        indexPrimaryValue: indexPrimary[date]
      });
    }
  });

  return processedData;
};
// end getLineData()
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// A/F2 returns points for share fund overview in an object
// const overviewData = getOverviewData(
//   fund,
//   assets=XLSX.utils.sheet_to_json(sheets["Assets fund total"]),
//   companies=XLSX.utils.sheet_to_json(sheets["Companies-issuers"])
// );
const getOverviewData = (info, assets, companies) => {
  let fundName = Object.keys(assets[1])[0];
  let assetsCol2 = Object.keys(assets[1])[1];
  let fundAssets = Object.keys(assets[1])[2];
  const asOfDate = convertDate(assets[0][assetsCol2]);


  const assetsValue = assets.find(value => value[fundName] === info.name) ? assets.find(value => value[fundName] === info.name)[fundAssets] : null;

  if (!assetsValue) {
    console.error(info.id, info.name, 'getOverviewData(): not found in ASSETS FUND TOTAL sheet');
  }

  let companiesCol1 = Object.keys(companies[1])[0];
  let companiesCol3 = Object.keys(companies[1])[2];
  const companiesValue = companies.find(value => value[companiesCol1] === info.name) ? companies.find(value => value[companiesCol1] === info.name)[companiesCol3] : null;

  if (!companiesValue) {
    console.error(info.id, info.name, 'getOverviewData(): not found in "Companies-issuers" sheet');
  }

  return { asOfDate, assetsValue, companiesValue };
};


// const yieldData = getYieldData(
//   fund,
//   XLSX.utils.sheet_to_json(sheets["Distribution rates"]),
//   XLSX.utils.sheet_to_json(sheets["Yields"]),
//   startIndex
// );

// returns points for share fund yield in an object
// const getYieldData = (info, distRates, yields, startIndex) => {
//   const yieldsCols = Object.keys(yields[1]);

//   const asOfDate = yieldsCols[1];
//   const netSECYield = yieldsCols[2];

//   const distRatesCols = Object.keys(distRates[1]);
//   const col1 = distRatesCols[1];
//   const rateAtNav = distRatesCols[3];
//   const rateAtMop = distRatesCols[2];

//   let nav = {};
//   let mop = {};

//   const distRow = distRates.filter(value => {
//     return value[col1] === info.fundClassNumber;
//   })[0];
//   const yieldsRow = yields.filter(value => {
//     return value[asOfDate] === info.fundClassNumber;
//   })[0];

//   // console.log(yieldsRow['Date-As of:'], yieldsRow['__EMPTY'], yieldsRow[netSECYield])

//   // startIndex === 0 if share class A, 1 if F2
//   // POSSIBLY NEED TO EDIT FOR R6
//   if (startIndex === 0) {
//     const monthRatesNav = distRow ? distRow[rateAtNav] : "";
//     const monthRatesMop = distRow ? distRow[rateAtMop] : "";
//     const daySec = yieldsRow ? yieldsRow[netSECYield] : "";

//     nav = { monthDistRates: monthRatesNav, daySec: "N/A" };
//     mop = { monthDistRates: monthRatesMop, daySec };
//   } else if (startIndex === 1) {
//     const monthRatesNav = distRow ? distRow[rateAtNav] : "";
//     const daySec = yieldsRow ? yieldsRow[netSECYield] : "";

//     nav = { monthDistRates: monthRatesNav, daySec: daySec };
//     mop = { monthDistRates: "N/A", daySec: "N/A" };
//   }

//   return { asOfDate, nav, mop };
// };



// A/F2 HERO: returns points for share fund expenses in an object
const getExpensesData = (info, expenses) => {
  let col2 = Object.keys(expenses[1])[1];
  let col8 = Object.keys(expenses[1])[7];
  const asOfDate = col2;
  const expensesValue = expenses.filter(value => {
    return value[col2] === info.fundClassNumber;
  })[0][col8];

  return { asOfDate, expensesValue };
};

// A/F2 HERO: returns points for share fund risk in an object
const getRiskData = (info, ratios) => {
  // o	Risk Measures – “Capture ratios” tab
  // 	As of date found in cell B1 (updated quarterly)
  // 	Rules based on fund age (calculate using most recent year end and “Fund Inception” column on the “Fund Details” tab for a given fund)
  // •	For funds aged younger than 3 years
  // o	Data not available, return a 0 or dash for both upside and downside
  // •	For funds aged between 3 to 5 years
  // o	Upside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Upside-3 Yrs”
  // o	Downside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Downside-3 Yrs”
  // •	For funds aged between 5 to 10 years
  // o	Upside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Upside-5 Yrs”
  // o	Downside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Downside-5 Yrs”
  // •	For funds aged 10 years or greater
  // o	Upside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Upside-10 Yrs”
  // o	Downside - Use Fund class number for share class of a given fund found on “Fund Details” tab to look up fund class in column “Fund class number” and return the column “Downside-10 Yrs”

  // const riskData = getRiskData(fund, XLSX.utils.sheet_to_json(sheets["Capture ratios"]));

  const cols = Object.keys(ratios[1]);
  const asOfDate = cols[1];
  const fund = info;

  // JOYCE
  // const lastYearEnd = new Date(`${new Date().getMonth() + 1} ${new Date().getDate()} ${new Date().getFullYear()} 23:23:23 GMT-0700 (Pacific Daylight Time)`);
  const lastYearEnd = new Date(asOfDate);
  const inception = new Date(info.inception);
  let diff = (lastYearEnd.getTime() - inception.getTime()) / 1000;

  diff /= 60 * 60 * 24;

  const age = Math.abs(diff / 365.25);

  let upside = -1;
  let downside = -1;
  let down10 = null;
  let down20 = null;
  let downLife = null; // i hope you don't have a downLife 

  const row = ratios.filter(value => {
    return value[cols[1]] === info.fundClassNumber;
  })[0];

  if (row) {
    if (age > 3 && age < 5) {
      upside = row[cols[2]];
      downside = row[cols[3]];

      // this is technically not used anywhere that I know of
      down10 = row[cols[9]]
      down20 = row[cols[13]]
      downLife = row[cols[15]]

    } else if (age > 5 && age < 10) {
      upside = row[cols[4]];
      downside = row[cols[5]];

      // this is technically not used anywhere that I know of
      down10 = row[cols[9]]
      down20 = row[cols[13]]
      downLife = row[cols[15]]

    } else if (age > 10) {
      upside = row[cols[8]];
      downside = row[cols[9]];

      // this is used PRI  project (for WMIF) so I'm adding it 
      down10 = row[cols[9]]
      down20 = row[cols[13]]
      downLife = row[cols[15]]
    }
  }

  if (!upside || !downside) {
    console.error('getRiskData:', fund.id, 'upside/downside not properly set')
  }

  return { asOfDate, upside, downside, down10, down20, downLife };
};

// A/F2 HERO
const getAccumulationData = (fund, worksheet) => {

  // worksheet['A5'].v
  const jsonSheet = XLSX.utils.sheet_to_json(worksheet);

  const colA = 'User Notes:'
  const colC = '__EMPTY';
  const colE = '__EMPTY_2'

  let associatedIndex = null;
  let output = null;

  jsonSheet.forEach(row => {
    if (row.__rowNum__ >= 6 && row[colA]) {
      // SET CURRENT INDEX-ASSOCIATION FOR FUND (SEE THE WAY FUNDS ARE GROUPED IN spreadsheet)
      if (row[colA].startsWith('S&') || row[colA].startsWith('MSCI') || row[colA].includes('%'))
        associatedIndex = { name: row[colA].trim(), value: row[colC] };
      else {
        // NOT AN INDEX, POSSIBLE FUND MATCH
        if (fund.name.toLowerCase().includes(row[colA].toLowerCase().slice(0, -3).trim())) {
          // console.log(fund.name, row[colA], associatedIndex)
          return output = { index: associatedIndex, peer: row[colE], value: row[colC] };
        }
      }
    }

  })

  return output;
}

// A/F2 LAST SECTION 
const getStressData = (fund, worksheet, shareClass) => {
  // sheets[`CA Stress tests`]
  if (shareClass === 'F2')
    shareClass = 'F-2';

  const jsonSheet = XLSX.utils.sheet_to_json(worksheet);

  const colC = '__EMPTY_1'; // col in xl for fund name
  // date = __EMPTY_3
  const colF = '__EMPTY_4'; // col for time period
  // number of periods = __EMPTY_5
  const colH = '__EMPTY_6'; // cols for SUCCESS
  const colI = '__EMPTY_7'; // cols for FUND
  const colJ = '__EMPTY_8'; // cols for INDEX
  const colK = '__EMPTY_9'; // cols for return DIFF

  let output = {};

  const translateTable = [];
  translateTable['One'] = 1;
  translateTable['Three'] = 3;
  translateTable['Five'] = 5;
  translateTable['Ten'] = 10;
  translateTable['Twenty'] = 20;
  translateTable['Thirty'] = 30;

  jsonSheet.forEach(row => {
    if (row.__rowNum__ >= 3 && row[colC])
      if (fund.name.toLowerCase().includes(row[colC].toLowerCase().slice(0, -3).trim())) {

        // console.log(fund.id, typeof (row[colK]), row[colK], String(row[colK]))

        let diff = Number(String(row[colK]).replace('%', ''));
        let success = Number(String(row[colH]).replace('%', ''));
        let fundReturn = Number(String(row[colI]).replace('%', ''));
        let index = Number(String(row[colJ]).replace('%', ''));

        // this is weird, but it should handle differt formats in this XL sheet.
        // one of the data updates provides numbers in the XL cells, and another gives strings
        // if it's a number the percent is .5, if it's a string it's 50%. Although both look identical when viewing the spreadsheet...
        // and this affects all of our values
        if (fundReturn <= 1) {
          diff = diff * 100
          success = success * 100
          fundReturn = fundReturn * 100
          index = index * 100
        }

        if (row[colC].split(' ').slice(-1)[0] === shareClass) {
          output[translateTable[row[colF].split(' ')[0]]] = { diff, success, fundReturn, index };
        }
      }

  })

  return output;
}

// funds[i]["barData"] = getBarData(
//   fund,
//   cumulative=XLSX.utils.sheet_to_json(sheets["Returns Cumulative NAV"]),
//   average=XLSX.utils.sheet_to_json(sheets["Returns Avg Annual NAV"]),
//   cumulativeIndex=XLSX.utils.sheet_to_json(sheets["Index Returns Cumulative NAV"]),
//   averageIndex=XLSX.utils.sheet_to_json(sheets["Index Returns Avg Annual NAV"]),
//   lifetimeIndex=XLSX.utils.sheet_to_json(sheets["Index returns lifetime af funds"]),
//   cumMop=XLSX.utils.sheet_to_json(sheets["Returns Cumulative MOP"]),
//   annMop=XLSX.utils.sheet_to_json(sheets["Returns Avg Annual MOP"]),
//   expense=XLSX.utils.sheet_to_json(sheets["Prosp exp ratio fund"]),
//   // XLSX.utils.sheet_to_json(sheets["Yields"]),
// );
// QUARTER END RETURNS AT NAV SECTION: returns points for a bar graph as an array of objects
const getBarData = (fund, cumulative, average, cumulativeIndex, indexReturnsPage, indexLifetime, cumMop, annMop, expense, yeildSheet) => {
  let processedData = [];
  const fundTimeIndices = [
    "__EMPTY_4",
    "__EMPTY_5",
    "__EMPTY",
    "__EMPTY_1",
    "__EMPTY_3",
    "__EMPTY_6"
  ];
  const indexTimeIndices = [
    "__EMPTY_3",
    "__EMPTY_4",
    "Returns: Average Annual (NAV)",
    "__EMPTY",
    "__EMPTY_2"
  ];
  const length = Math.max(
    cumulative.length,
    average.length,
    cumulativeIndex.length,
    indexReturnsPage.length,
    indexLifetime.length
  );

  // Set the row based on fund class number (for fund), or fund's primary index (for index)
  let cumulativeRow;
  let cumulativeIndexRow;
  let averageRow;
  let currentRowIndexPage;
  let currentRowIndexLifetime;

  const asOfDate = Object.keys(cumulative[1])[1]; // formerly '3/31/20'

  for (let i = 0; i < length; i++) {
    if (cumulative[i] && cumulative[i][asOfDate] === fund.fundClassNumber) {
      cumulativeRow = i;
    }
    if (average[i] && average[i][asOfDate] === fund.fundClassNumber) {
      averageRow = i;
    }
    if (cumulativeIndex[i] && cumulativeIndex[i]["Fact Type"].trim() === fund.indexPrimary) {
      cumulativeIndexRow = i;
    }
    if (indexReturnsPage[i] && indexReturnsPage[i]["Fact Type"].trim() === fund.indexPrimary) {
      currentRowIndexPage = i;
    }
    if (indexLifetime[i] && indexLifetime[i]["Fact Type"].trim() === fund.indexPrimary) {
      if (indexLifetime[i]['Returns: Index Lifetime AF Funds'].trim() === fund.name)
        // if index primary is found in col A and fund name is found in col b...
        currentRowIndexLifetime = i;
    }
  }

  // WE EXIT IF FUND NOT FOUND IN EXCEL PAGE
  if (!cumulativeRow) {
    // console.log(fund.name, 'not found in getBarData for', fund.class)
    return { asOfDate: 'Issues found', data: {} };
  }


  for (let i = 0; i < fundTimeIndices.length; i++) {
    if (i < 2) {
      // console.warn(fund.id, cumulativeIndex, cumulativeIndexRow)

      // YTD and 1 Year data is from the Cumulative sheets

      if (!cumulativeIndex[cumulativeIndexRow])
        console.warn("Index Returns Cumulative NAV", fund.id)

      processedData.push({
        time: cumulative[1][fundTimeIndices[i]],
        value: cumulative[cumulativeRow][fundTimeIndices[i]],

        indexValue: cumulativeIndex[cumulativeIndexRow][indexTimeIndices[i]]
      });
    } else if (i === 2) {

      if (!indexReturnsPage[currentRowIndexPage])
        console.warn("Index Returns Avg Annual NAV page in xcel...", fund.id)

      // 3 YEAR COLUMN
      processedData.push({
        time: average[1][fundTimeIndices[i]],
        value: average[averageRow][fundTimeIndices[i]],
        indexValue: indexReturnsPage[currentRowIndexPage][indexTimeIndices[i]]
      });
    } else if (i <= 4) {
      // 5 & 10 YEAR COLUMN

      if (average[averageRow][fundTimeIndices[i]]) {
        processedData.push({
          time: average[1][fundTimeIndices[i]],
          value: average[averageRow][fundTimeIndices[i]],
          indexValue: indexReturnsPage[currentRowIndexPage][indexTimeIndices[i]]
        });

      } else {
        processedData.push({
          time: average[1][fundTimeIndices[i]],
          value: average[averageRow][fundTimeIndices[i]],
          indexValue: undefined
        });
      }

    } else {
      // LIFETIME
      if (currentRowIndexLifetime) {
        processedData.push({
          time: average[1][fundTimeIndices[i]],
          value: average[averageRow][fundTimeIndices[i]],
          indexValue: indexLifetime[currentRowIndexLifetime]['__EMPTY']
        });
      } else {
        processedData.push({
          time: average[1][fundTimeIndices[i]],
          value: average[averageRow][fundTimeIndices[i]],
          indexValue: undefined
        });
      }
    }
  }

  // EXTRA DATA POINT FOR BOND SHEETS (30 DAY SEC YIELD)
  if (yeildSheet) {
    const asOfDate = Object.keys(yeildSheet[1])[1]
    yeildSheet.forEach(row => {

      if (row[asOfDate] && row[asOfDate] === fund.fundClassNumber) {
        processedData.push({
          time: '30 day SEC Yield',
          value: row['__EMPTY'], // NEY YEILD COLUMN IN YIELDS
          indexValue: undefined,
          asOfDate: asOfDate
        })
      }
    })
  }

  // CUMULATIVE
  const cfID = Object.keys(cumMop[1])[1];
  const ytdCum = '__EMPTY_4';
  const oneYear = '__EMPTY_5';
  const mopData = [];
  const values = [];

  cumMop.forEach(row => {
    if (fund.fundClassNumber === row[cfID]) {
      values.push({ time: 'YTD', value: row[ytdCum] });
      values.push({ time: '1 Yr', value: row[oneYear] });
    }
  })

  const annID = Object.keys(annMop[1])[1];
  const aThree = '__EMPTY';
  const aFive = '__EMPTY_1';
  const aTen = '__EMPTY_3';
  const aLife = '__EMPTY_6';

  annMop.forEach(row => {
    if (fund.fundClassNumber === row[annID]) {
      values.push({ time: '3 Yrs', value: row[aThree] });
      values.push({ time: '5 Yrs', value: row[aFive] });
      values.push({ time: '10 Yrs', value: row[aTen] });
      values.push({ time: 'Lifetime', value: row[aLife] });
    }
  })

  values.forEach((val, i) => {
    mopData.push({ time: val.time, value: val.value, indexValue: processedData[i].indexValue })
  })

  // normalizing array to size 7
  mopData.push({ time: 'mopData', value: null, indexValue: null })

  return { date: asOfDate, data: processedData, mopData: mopData };
};

// returns points for a chart as an array of objects
// getFundChartData(
// fund,
//   industry=sheets[`${fund.id} top industry holdings`],
//   equity=sheets[`${fund.id} top equity holdings`]
// );
const getFundChartData = (fund, industry, equity) => {
  let indData = [];
  let eqData = [];

  if (!industry || !equity) {
    if (!industry)
      console.error('Missing', fund.id, ' top industy holdings page', industry)

    if (!equity)
      console.error('Missing', fund.id, ' top equity holdings page', equity)

    return
  }

  for (i = 0; i < 5; i++) {
    j = i + 5; // first few rows do not contain relevant data
    indData[i] = {
      name: industry[`B${j}`]["w"].split("|")[0],
      value: industry[`C${j}`]["w"]
    };

    if (!equity || !equity[`B${j}`] || !equity[`D${j}`] || !equity[`C${j}`]) {
      console.error(currentTime(true), fund.id, ' top equity holdings page: cells probably should not be empty')
    }

    eqData[i] = {
      name: equity[`B${j}`] ? equity[`B${j}`]["w"].split("|")[0] : "xx",
      sector: equity[`D${j}`] ? equity[`D${j}`]["w"].split("|")[0] : 'xx',
      value: equity[`C${j}`] ? equity[`C${j}`]["w"] : "xx"
    };
  }

  return { date: industry["B2"]["w"], industry: indData, equity: eqData };
};

// returns points for a donut chart as an array of objects
// funds[i]["donutData"] = newGeoDonutData(
//   fund,
//   fundDom=sheets[`${fund.id} country domicile eq`],
//   fundRev=sheets[`${fund.id} country revenue eq`],
//   indexDom=sheets[`${fund.indexPrimaryAbbr} country domicile eq`],
//   indexRev=sheets[`${fund.indexPrimaryAbbr} country revenue eq`]
// );
const newGeoDonutData = (fund, fundDom, fundRev, indexDom, indexRev) => {

  /// IF sheets[`${fund.indexPrimaryAbbr} country domicile eq`] NOT THERE...
  if (fundDom === undefined || fundRev === undefined || indexDom === undefined || indexRev === undefined) {
    if (!fundDom) {
      console.error('newGeoDonutData: MISSING:', fund.id + ' country domcile eq', fundDom)
      console.error(`sheets[${fund.id} country domicile eq] likely has issues`)
    }

    if (!fundRev) {
      console.error('newGeoDonutData: MISSING:', fund.id + ' country revenue eq', fundRev)
      console.error(`sheets[${fund.id} country revenue eq] likely has issues`)

    }

    if (!indexDom) {
      console.error('(' + fund.id + ') newGeoDonutData: MISSING:', fund.indexPrimaryAbbr, 'country domcile eq', indexDom)
      console.error(`sheets[${fund.indexPrimaryAbbr} country domicile eq] likely has issues`)
    }

    if (!indexRev) {
      console.error('(' + fund.id + ') newGeoDonutData: MISSING:', fund.indexPrimaryAbbr, 'country revenue eq', indexRev)
      console.error(`sheets[${fund.indexPrimaryAbbr} country revenue eq] likely has issues`)
    }

    return
  }
  let fundDomData = [];
  let fundRevData = [];
  let indexDomData = [];
  let indexRevData = [];

  // Check if i < 6 condition is appropriate
  for (let i = 0; i < 6; i++) {
    let j = i + 6; // starts at 6th row
    if (fundDom[`B${j}`]) {
      fundDomData[i] = {
        name: fundDom[`B${j}`]["w"].split("|")[0],
        value: Number(fundDom[`C${j}`]["w"].replace('%', ''))
      };
    }
    if (fundRev[`B${j}`]) {
      fundRevData[i] = {
        name: fundRev[`B${j}`]["w"].split("|")[0],
        value: Number(fundRev[`C${j}`]["w"].replace('%', ''))
      };
    }
    if (indexDom[`B${j}`]) {
      indexDomData[i] = {
        name: indexDom[`B${j}`]["w"].split("|")[0],
        value: Number(indexDom[`C${j}`]["w"].replace('%', ''))
      };
    }
    if (indexRev[`B${j}`]) {
      indexRevData[i] = {
        name: indexRev[`B${j}`]["w"].split("|")[0],
        value: Number(indexRev[`C${j}`]["w"].replace('%', ''))
      };
    }
  }


  const keys = ['United States ', 'Canada ', 'Europe ', 'Japan ', 'Asia-Pacific ex. Japan ', 'Emerging Markets '];

  keys.forEach((key) => {
    if (!fundDomData.find(el => el.name === key)) {
      fundDomData.push({ name: key, value: 0 })
    }
    if (!fundRevData.find(el => el.name === key)) {
      fundRevData.push({ name: key, value: 0 })
    }
    if (!indexDomData.find(el => el.name === key)) {
      indexDomData.push({ name: key, value: 0 })
    }
    if (!indexRevData.find(el => el.name === key)) {
      indexRevData.push({ name: key, value: 0 })
    }
  })

  // sort everything (in case not sorted) and shove in these arrays
  const fundDomicleData = [];
  const indexDomicleData = [];
  const fundRevenueData = [];
  const indexRevenueData = [];

  // ordering (sorting)
  keys.forEach(key => {
    fundDomicleData.push(fundDomData.find(el => el.name === key));
    indexDomicleData.push(indexDomData.find(el => el.name === key));
    fundRevenueData.push(fundRevData.find(el => el.name === key));
    indexRevenueData.push(indexRevData.find(el => el.name === key));
  })

  return {
    date: fundDom["B2"]["w"],
    domicile: { fund: fundDomicleData, index: indexDomicleData },
    revenue: { fund: fundRevenueData, index: indexRevenueData }
  };
};

// BOND SECTION HERO: returns points for a bond's hero section as an object
const getHeroData = (fund, sheets, shareClass) => {
  const correlation = sheets['Correlation Support'];
  const positiveReturns = sheets['Positive Returns Success Ratios'];
  const bondStats = sheets['Bond statistics'];
  // const avgAnnualNav = sheets[13];
  const returnsCumNav = sheets['Returns Cumulative NAV'];
  const inflationProtection = sheets['Inflation protection'];
  const expensePage = sheets['Prosp exp ratio fund'];

  let diversification = {};
  let capitalPreservation = "";
  let income = "";
  let inflProt = {};

  const correlationJSON = XLSX.utils.sheet_to_json(correlation);
  // GET COL E
  let colE = null;
  // if (correlation['E1']) {
  //   colE = correlation['E1'].w;
  // } else {
  //   colE = Object.keys(correlationJSON[0]).slice(-1)[0];
  // }

  // if (!colE) {
  //   console.log('There is a problem the CORRELATION SUPPORT page when trying to use cell E1 as an index to our rows.')
  //   return
  // }

  let max = null;
  let min = null;
  let val = null;
  let fundId = null;
  let stop = false;

  const colD = '__EMPTY_5' // col g
  colE = '__EMPTY_6' // col h

  // CORRELATION SUPPORT TAB USING COLS D AND E
  correlationJSON.forEach((row, i) => {
    if (stop) return;

    if (row[colD]) {
      if (row[colD].split(' ')[0] === fund.id) {
        fundId = row[colD].split(' ')[0];
        if (row[colD].split(' ')[1].replace('-', '') === fund.class) {
          val = row[colE];
        }
      } else if (row[colD] === 'Category Min') {
        min = row[colE]
      } else if (row[colD] === 'Category Max') {
        max = row[colE]

        if (fundId === fund.id) {
          diversification["min"] = Math.round(min * 100) / 100;
          diversification["max"] = Math.round(max * 100) / 100;
          diversification["fund"] = Math.round(val * 100) / 100;
          stop = true;;
        }
      }
    }
  })

  setCapitalPreservation(shareClass);  // 'POSITIVE RETURNS SUCCESS RATIOS' TAB

  const a1 = bondStats.A1.w;
  XLSX.utils.sheet_to_json(bondStats).forEach(row => {
    if (row[a1] === fund.name) {
      income = row["__EMPTY"]; // COL C FROM 'BOND STATISTICS'
    }
  });

  // const returnsCumNav = sheets['Returns Cumulative NAV'];
  const b1 = (returnsCumNav.B1.w); // formerly 3/31/20
  XLSX.utils.sheet_to_json(returnsCumNav).forEach(row => {
    if (row[b1] === fund.fundClassNumber) {
      inflProt["fund"] = row["__EMPTY_8"];
      inflProt["CPI"] = Number(inflationProtection["B3"]["w"].replace('%', ''));
    }
  });

  const date = bondStats.B2.w; // BEAUTIFUL ASOF DATE

  // GET THE EXPENSE FOR THE FUND
  const expensePageXL = XLSX.utils.sheet_to_json(expensePage);
  let expenseData;
  expensePageXL.forEach(row => {
    if (fund.fundClassNumber === row[expensePage['B1']['w']]) {
      expenseData = row['__EMPTY_5'];
    }
  })

  return { date, diversification, capitalPreservation, income, inflProt, expenseData };

  function setCapitalPreservation(shareClass) {
    // 'POSITIVE RETURNS SUCCESS RATIOS' TAB
    const offset = shareClass === 'A' ? 0 : shareClass === 'F2' ? 1 : 2;

    switch (fund.name) {
      case "The Bond Fund of America": {
        capitalPreservation = Number(positiveReturns[`B${12 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "American Funds Strategic Bond Fund": {
        capitalPreservation = Number(positiveReturns[`B${16 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "The Tax-Exempt Bond Fund of America": {
        capitalPreservation = Number(positiveReturns[`B${20 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "Intermediate Bond Fund of America": {
        capitalPreservation = Number(positiveReturns[`B${23 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "American High-Income Municipal Bond Fund": {
        capitalPreservation = Number(positiveReturns[`B${27 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "Limited Term Tax-Exempt Bond Fund of America": {
        capitalPreservation = Number(positiveReturns[`B${30 + offset}`]["w"].replace('%', ''));
        break;
      }
      case "American Funds Multi-Sector Income Fund": {
        if (positiveReturns['B33'] && positiveReturns['B33'].w)
          capitalPreservation = Number(positiveReturns[`B${33 + offset}`]["w"].replace('%', ''));
        break;
      }
    }
  }
};

// returns points for chart as an object
const getBondChartData = (fund, FIbreakdown) => {
  let creditRating = [];

  const FIbreakdownJson = XLSX.utils.sheet_to_json(FIbreakdown);
  const cols = Object.keys(FIbreakdownJson[1]);

  for (j = 0; j < FIbreakdownJson.length; j++) {
    if (
      fund.name ===
      FIbreakdownJson[j][cols[0]]
    ) {
      cols.forEach(col => {
        if (
          col !== "Fact Type" &&
          col !== "Fixed-income quality breakdown" &&
          FIbreakdownJson[j][col] !== "N/A"
        ) {
          creditRating.push({
            name: FIbreakdownJson[1][col],
            value: FIbreakdownJson[j][col]
          });
        }
      });
    }
  }

  return {
    date: FIbreakdown["B2"]["w"],
    creditRating: creditRating
  };
};

// returns points for donut chart as an object
// getBondDonutData(fund.id, XLSX.utils.sheet_to_json(sheets[`${fund.id} portfolio summary 2`]), sheets[`${fund.id} top issuers`]);
const getBondDonutData = (fundID, summarySheet, issuersSheet) => {

  const summarySheetCols = Object.keys(summarySheet[0]);
  const holdingsCol2 = summarySheetCols[1];
  const holdingsAsOfDate = summarySheet[0][holdingsCol2];

  const issuersAsOfDate = issuersSheet[`B2`]["w"];

  const holdings = [];
  for (let i = summarySheet.length - 1; i >= 2; i--) {
    if (summarySheet[i][holdingsCol2]) {
      holdings.push({
        name: summarySheet[i][holdingsCol2].split("|")[0],
        value: summarySheet[i]["__EMPTY_1"]
      });
    }
  }

  const topIssuers = [];
  for (let i = 0; i < 10; i++) {
    j = i + 5;
    if (issuersSheet[`B${j}`]) {
      topIssuers.push({
        name: issuersSheet[`B${j}`]["w"].split("|")[0],
        value: issuersSheet[`C${j}`]["w"]
      });
    }
  }

  return {
    holdings: { asOfDate: convertDate(holdingsAsOfDate), data: holdings },
    issuers: { asOfDate: issuersAsOfDate, data: topIssuers }
  };
};

// returns points for geography breakdown chart as an object
const getGeoBreakdownData = (fund, currWeighting, country, state) => {
  let currency = [];
  let geography = [];
  let geoDate = "";

  const currWeightingJSON = XLSX.utils.sheet_to_json(currWeighting);
  const cols = Object.keys(currWeightingJSON[1]);
  currWeightingJSON.forEach((row, i) => {
    if (fund.name === row["Fact Type"]) {
      cols.forEach(col => {
        if (
          col !== "Fact Type" &&
          col !== "Currency Weighting" &&
          col !== "__EMPTY" &&
          currWeightingJSON[i][col] !== "N/A"
        ) {
          currency.push({
            name: currWeightingJSON[1][col],
            value: currWeightingJSON[i][col]
          });
        }
      });
    }
  });

  // fund will either have country info or state info (the other will be undefined)
  if (country) {
    const countryJSON = XLSX.utils.sheet_to_json(country);
    geoDate = country["B2"]["w"];
    for (let j = 2; j < countryJSON.length; j++) {
      geography.push({
        name: countryJSON[j]["FUND"],
        value: countryJSON[j][fund.name]
      });
    }
  } else if (state) {
    const stateJSON = XLSX.utils.sheet_to_json(state);
    geoDate = state["B2"]["w"];
    for (let j = 2; j < stateJSON.length; j++) {
      geography.push({
        name: stateJSON[j][fund.name],
        value: stateJSON[j]["__EMPTY_2"]
      });
    }
  }

  return {
    currency: { date: currWeighting["B2"]["w"], data: currency },
    geography: { date: geoDate, data: geography }
  };
};


// CONVERTS DATES FROM THE SPREADSHEET
const convertDate = (date, nd = false) => {

  // TIME ZONE OFFSET WILL BE NEGATIVE WHEN EAST OF LONDON
  // THIS IS FOR OUR FRIENDS IN INDIA
  const timeZoneOffset = new Date().getTimezoneOffset();
  const oneDay = 1000 * 60 * 60 * 24;

  const dateFromXL = new Date((date - (25567 + 1)) * 86400 * 1000);

  // NO toLocaleDateString()
  if (nd) {
    if (timeZoneOffset <= 0) {
      return new Date(dateFromXL.getTime() - oneDay); // returns yesterday if we are east of london
    }
    return dateFromXL;
  }

  // THESE RETURN toLocaleDateString()
  if (timeZoneOffset <= 0) {
    return new Date(dateFromXL.getTime() - oneDay).toLocaleDateString(); // returns yesterday if we are east of london
  }
  return dateFromXL.toLocaleDateString();
};