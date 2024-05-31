const data = {
    indexData: [
    ],
    shareClassA: {
        data: [
            {
                "indexId": "sp",
                "funds": [
                ]
            },
            {
                "indexId": "country-world",
                "funds": [
                ]
            },
            {
                "indexId": "exusa",
                "funds": [
                ]
            },
            {
                "indexId": "smallcap",
                "funds": [
                ]
            },
            {
                "indexId": "eafe",
                "funds": [
                ]
            },
            {
                "indexId": "emerging",
                "funds": [
                ]
            },
            {
                "indexId": "world",
                "funds": [
                ]
            },
            {
                "indexId": "70-30",
                "funds": [
                ]
            },
            {
                "indexId": "65-35",
                "funds": [
                ]
            },
            {
                "indexId": "65-40",
                "funds": [
                ]
            },
            {
                "indexId": "60-40",
                "funds": [
                ]
            }
        ]
    },
    shareClassF2: {
        data: [{
            "indexId": "sp",
            "funds": [
            ]
        },
        {
            "indexId": "country-world",
            "funds": [
            ]
        },
        {
            "indexId": "exusa",
            "funds": [
            ]
        },
        {
            "indexId": "smallcap",
            "funds": [
            ]
        },
        {
            "indexId": "eafe",
            "funds": [
            ]
        },
        {
            "indexId": "emerging",
            "funds": [
            ]
        },
        {
            "indexId": "world",
            "funds": [
            ]
        },
        {
            "indexId": "70-30",
            "funds": [
            ]
        },
        {
            "indexId": "65-35",
            "funds": [
            ]
        },
        {
            "indexId": "65-40",
            "funds": [
            ]
        },
        {
            "indexId": "60-40",
            "funds": [
            ]
        }
        ]
    },
    shareClassF3: {
        data: [{
            "indexId": "sp",
            "funds": [
            ]
        },
        {
            "indexId": "country-world",
            "funds": [
            ]
        },
        {
            "indexId": "exusa",
            "funds": [
            ]
        },
        {
            "indexId": "smallcap",
            "funds": [
            ]
        },
        {
            "indexId": "eafe",
            "funds": [
            ]
        },
        {
            "indexId": "emerging",
            "funds": [
            ]
        },
        {
            "indexId": "world",
            "funds": [
            ]
        },
        {
            "indexId": "70-30",
            "funds": [
            ]
        },
        {
            "indexId": "65-35",
            "funds": [
            ]
        },
        {
            "indexId": "65-40",
            "funds": [
            ]
        },
        {
            "indexId": "60-40",
            "funds": [
            ]
        }
        ]
    },
    shareClassR6: {
        data: [{
            "indexId": "sp",
            "funds": [
            ]
        },
        {
            "indexId": "country-world",
            "funds": [
            ]
        },
        {
            "indexId": "exusa",
            "funds": [
            ]
        },
        {
            "indexId": "smallcap",
            "funds": [
            ]
        },
        {
            "indexId": "eafe",
            "funds": [
            ]
        },
        {
            "indexId": "emerging",
            "funds": [
            ]
        },
        {
            "indexId": "world",
            "funds": [
            ]
        },
        {
            "indexId": "70-30",
            "funds": [
            ]
        },
        {
            "indexId": "65-35",
            "funds": [
            ]
        },
        {
            "indexId": "65-40",
            "funds": [
            ]
        },
        {
            "indexId": "60-40",
            "funds": [
            ]
        }]
    },
}

///////
// updates start here

// resetting data
function clearOldData() {
    data.indexData = []
    data.shareClassA = []
    data.shareClassF2 = []
    data.shareClassF3 = []
    data.shareClassR6 = []
}
clearOldData();

const indexes = [
    'S&P 500 Index',
    'MSCI All Country World Index (ACWI)',
    'MSCI ACWI ex USA',
    'MSCI ACWI Small Cap',
    'MSCI EAFE (Europe, Australasia, Far East) Index',
    'MSCI Emerging Markets Index',
    'MSCI World Index',
    '70% MSCI ACWI/30% Bloomberg U.S. Aggregate',
    '65% S&P 500/35% Bloomberg U.S. Aggregate',
    '65% S&P 500/40% Bloomberg U.S. Aggregate',
    '60% MSCI ACWI/40% Bloomberg Global Aggregate Index',
]

const indexTranslate = [
    "S&P 500 Index",
    "MSCI All Country World Index (ACWI)",
    "MSCI All Country World Index (ACWI) ex USA",
    "MSCI All Country World Small Cap Index",
    "MSCI EAFE (Europe, Australasia, Far East) Index",
    "MSCI Emerging Markets Index ",
    "MSCI World Index",
    "70%/30% MSCI All Country World Index/Bloomberg U.S. Aggregate Index",
    "65%/35% S&P 500 Index/Bloomberg U.S. Aggregate Index",
    "60%/40% S&P 500 Index/Bloomberg U.S. Aggregate Index",
    "60%/40% MSCI All Country World Index/Bloomberg Global Aggregate Index",
]

function repopuplateIndexesInData() {
    f2SharesData.forEach(d => indexes.includes(d.name) || indexTranslate.includes(d.name) ? data.indexData.push(d) : null)
}
repopuplateIndexesInData()

const indexIds = [
    "sp",
    "country-world",
    "exusa",
    "smallcap",
    "eafe",
    "emerging",
    "world",
    "70-30",
    "65-35",
    "65-40",
    "60-40",
]

const spFunds = [
    "AMCAP Fund",
    "American Mutual Fund",
    "Fundamental Investors",
    "The Growth Fund of America",
    "The Investment Company of America",
    "Washington Mutual Investors Fund",
]

const countryWorldFunds = [
    "Capital World Growth and Income Fund",
    "The New Economy Fund",
    "New Perspective Fund",
    "New World Fund",
]

const exUSAFunds = [
    "EuroPacific Growth Fund",
    "International Growth and Income Fund",
]

const smallCapFunds = [
    "SMALLCAP World Fund",
]

const eafeFunds = [
    "American Funds International Vantage Fund"
]

const emergingFunds = [
    "American Funds Developing World Growth and Income Fund",
]

const worldFunds = [
    "American Funds Global Insight Fund",
]

const seventyThirtyFunds = [
    "Capital Income Builder"
]

const sixtyFiveThirtyFiveFunds = [
    "The Income Fund of America"
]

const sixtyFiveForty = [
    "American Balanced Fund",
]

const sixtyForty = [
    "American Funds Global Balanced Fund"
]

const differentFunds = [
    spFunds, countryWorldFunds, exUSAFunds, smallCapFunds, eafeFunds, emergingFunds, worldFunds,
    seventyThirtyFunds, sixtyFiveThirtyFiveFunds, sixtyFiveForty, sixtyForty
]

function repopulate(inputData, names, shareClass, indexId) {
    if (!data[shareClass].data)
        data[shareClass]['data'] = []

    data[shareClass]['data'].push({ indexId: indexId, funds: [] })

    inputData.forEach(d => {
        if (names.includes(d.name))
            data[shareClass].data.find(d => d.indexId === indexId).funds.push(d)
    })
}


// rebuild a shares
indexIds.forEach((id, i) => {
    repopulate(f2SharesData, differentFunds[i], 'shareClassF2', id)
})


const fundInfo = [

    { name: 'S&P 500 Index', id: 'sp' },
    { name: 'MSCI All Country World Index (ACWI)', id: 'country-world' },
    { name: 'MSCI ACWI ex USA', id: 'exusa' },
    { name: 'MSCI ACWI Small Cap', id: 'smallcap' },
    { name: 'MSCI EAFE (Europe, Australasia, Far East) Index', id: 'eafe' },
    { name: 'MSCI Emerging Markets Index', id: 'emerging' },
    { name: 'MSCI World Index', id: 'world' },
    { name: '70% MSCI ACWI/30% Bloomberg U.S. Aggregate', id: '70-30' },
    { name: '65% S&P 500/35% Bloomberg U.S. Aggregate', id: '65-35' },
    { name: '65% S&P 500/40% Bloomberg U.S. Aggregate', id: '65-40' },
    { name: '60% MSCI ACWI/40% Bloomberg Global Aggregate Index', id: '60-40' },


    { name: "AMCAP Fund", date: "5/1/1967", group: "growth", linkAbrv: "amcpx", fundAbrv: "AMCAP" },
    { name: "American Mutual Fund", date: "2/21/1950", group: "growth-income", linkAbrv: "amrmx", fundAbrv: "AMF" },
    { name: "Fundamental Investors", date: "8/1/1978", group: "growth-income", linkAbrv: "ancfx", fundAbrv: "FI" },
    { name: "The Growth Fund of America", date: "12/1/1973", group: "growth", linkAbrv: "agthx", fundAbrv: "GFA" },
    { name: "The Investment Company of America", date: "1/1/1934", group: "growth-income", linkAbrv: "aivsx", fundAbrv: "ICA" },
    { name: "Washington Mutual Investors Fund", date: "7/31/1952", group: "growth-income", linkAbrv: "awshx", fundAbrv: "WMIF" },
    { name: "Capital World Growth and Income Fund", date: "3/26/1993", group: "growth-income", linkAbrv: "cwgix", fundAbrv: "WGI" },
    { name: "The New Economy Fund", date: "12/1/1983", group: "growth", linkAbrv: "anefx", fundAbrv: "NEF" },
    { name: "New Perspective Fund", date: "3/13/1973", group: "growth", linkAbrv: "anwpx", fundAbrv: "NPF" },
    { name: "New World Fund", date: "6/17/1999", group: "growth", linkAbrv: "newfx", fundAbrv: "NWF" },
    { name: "EuroPacific Growth Fund", date: "4/16/1984", group: "growth", linkAbrv: "aepgx", fundAbrv: "EUPAC" },
    { name: "International Growth and Income Fund", date: "10/1/2008", group: "growth-income", linkAbrv: "igffx", fundAbrv: "IGI" },
    { name: "SMALLCAP World Fund", date: "4/30/1990", group: "growth", linkAbrv: "smcwx", fundAbrv: "SCWF" },
    { name: "American Funds International Vantage Fund", date: "4/1/2011", group: "growth", linkAbrv: "aivbx", fundAbrv: "IVE" },
    { name: "American Funds Developing World Growth and Income Fund", date: "2/3/2014", group: "growth-income", linkAbrv: "dwgax", fundAbrv: "DWGI" },
    { name: "American Funds Global Insight Fund", date: "4/1/2011", group: "growth", linkAbrv: "agvfx", fundAbrv: "GIF" },
    { name: "Capital Income Builder", date: "7/30/1987", group: "equity-income", linkAbrv: "caibx", fundAbrv: "CIB" },
    { name: "The Income Fund of America", date: "12/1/1973", group: "equity-income", linkAbrv: "amecx", fundAbrv: "IFA" },
    { name: "American Balanced Fund", date: "7/26/1975", group: "balanced", linkAbrv: "abalx", fundAbrv: "AMBAL" },
    { name: "American Funds Global Balanced Fund", date: "2/1/2011", group: "balanced", linkAbrv: "gblax", fundAbrv: "GBAL" }

]
