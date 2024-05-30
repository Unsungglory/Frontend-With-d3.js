// const growth = '#00294B';
const DENIM = 'rgba(0, 41, 75, 1)';
// const DENIM30 = 'rgba(0, 41, 75, .3)';
// const DENIM40 = 'rgba(0, 41, 75, .35)';

const BONE = 'rgba(213, 208, 202, 1)';

const websiteTitle = {
    title: 'Equity Roadshow',
    subtitle: '',
};

window.VC_infoID = 'EQRS';


// IF CAT TITLE IN UPPER LEFT OF PAGE IS THE SAME EVERYWHERE SET IT HERE, ELSE SET FALSE
const globalCatTitle = false;

const websiteInfo = [
    {
        category: 'Table of contents', // MUST BE UNIQUE this is Cat Title in upper left unless globalCatTitle is set
        header: 'Table of contents', // SIDEBAR HEADER
        subheader: '', // SIDEBAR SUBHEADER
        pages: [
            {
                link: 'one-01.html',
                timelineText: '',
                sidebarText: ''
            },
        ]
    },

    {
        category: 'Equity markets insights', // MUST BE UNIQUE this is Cat Title in upper left unless globalCatTitle is set
        header: 'Equity markets insights', // SIDEBAR HEADER
        subheader: '', // SIDEBAR SUBHEADER
        pages: [
            {
                link: 'two-01.html',
                timelineText: 'GEOPOLITICS',
                sidebarText: 'Geopolitical events'
            },

            {
                link: 'two-02.html',
                timelineText: 'P/E VALUATIONS',
                sidebarText: 'P/E Valuations'
            },
            {
                link: 'two-03.html',
                timelineText: 'RATE INCREASE',
                sidebarText: 'Rate increase'
            },
            {
                link: 'two-04.html',
                timelineText: 'LOWER FOR LONGER',
                sidebarText: 'Lower for longer'
            },
            {
                link: 'two-05.html',
                timelineText: 'BEYOND THE FAANGS',
                sidebarText: 'Beyond the FAANGs'
            },
            {
                link: 'two-06.html',
                timelineText: 'DIVIDENDS COMEBACK',
                sidebarText: 'Dividends comeback'
            },
            {
                link: 'two-07.html',
                timelineText: 'PERFORMANCE GAP',
                sidebarText: 'Performance gap'
            },
            {
                link: 'two-08.html',
                timelineText: 'INTERNATIONAL INDEX',
                sidebarText: 'International index'
            },
            {
                link: 'two-09.html',
                timelineText: 'VENTURE CAPITAL FUNDING',
                sidebarText: 'Venture capital funding'
            },
        ]
    },
    {
        category: 'Equities at Capital Group', // MUST BE UNIQUE this is Cat Title in upper left unless globalCatTitle is set
        header: 'Equities at Capital Group', // SIDEBAR HEADER
        subheader: '', // SIDEBAR SUBHEADER
        pages: [
            {
                link: 'three-01.html',
                timelineText: 'CAPITAL SYSTEM',
                sidebarText: '<div style="display: flex; align-items: center;"><div>The Capital System</div><sup>SM</sup></div>'
            },
            // {
            //     link: 'three-02.html',
            //     timelineText: 'RESILIENCY',
            //     sidebarText: 'We held up better in bear markets'
            // },
            {
                link: 'three-02.html',
                timelineText: 'STEWARDSHIP',
                sidebarText: 'Culture of stewardship'
            }
        ]
    },
    {
        category: 'Equity actionable ideas', // MUST BE UNIQUE this is Cat Title in upper left unless globalCatTitle is set
        header: 'Equity actionable ideas', // SIDEBAR HEADER
        subheader: '', // SIDEBAR SUBHEADER
        pages: [
            {
                link: 'four-01.html',
                timelineText: 'FOUR ROLES',
                sidebarText: 'Four roles of equity'
            },
            {
                link: 'four-02.html',
                timelineText: 'Actionable insights',
                sidebarText: 'Actionable insights'
            },
            {
                link: 'four-03.html',
                timelineText: 'Dividend income/resilience',
                sidebarText: 'Dividend income/resilience'
            },
            {
                link: 'four-04.html',
                timelineText: 'Flexible objectives',
                sidebarText: 'Flexible objectives'
            },
            {
                link: 'four-05.html',
                timelineText: 'Broad global mandates',
                sidebarText: 'Broad global mandates'
            },
        ]
    },
    {
        category: 'Investment results', // MUST BE UNIQUE this is Cat Title in upper left unless globalCatTitle is set
        header: 'Investment results', // SIDEBAR HEADER
        subheader: '', // SIDEBAR SUBHEADER
        pages: [
            {
                link: 'five-01.html',
                timelineText: 'Investment results',
                sidebarText: 'Investment results'
            },
            // {
            //     link: 'five-02.html',
            //     timelineText: 'BEAR MARKET RETURNS',
            //     sidebarText: 'Bear markets'
            // },
            // {
            //     link: 'five-03.html',
            //     timelineText: 'Rolling Peroids',
            //     sidebarText: 'Rolling Peroids'
            // },
        ]
    },
];

// BUILDS THE FUND TILES IN THE  full screen MENU
const LIST1 = [
    {
        id: 'GFA',
        name: 'The Growth Fund of America®',
        //tm: 'SM',
        color: 'growth'
    },

    {
        id: 'NPF',
        name: 'New Perspective Fund®',
        color: 'growth'
    },

    {
        id: 'SCWF',
        name: 'SMALLCAP World Fund®',
        color: 'growth'
    },

    {
        id: 'WMIF',
        name: 'Washington Mutual Investors Fund',
        tm: 'SM',
        color: 'growth-income'
    },

    {
        id: 'IGI',
        name: 'International Growth and Income Fund',
        tm: 'SM',
        color: 'growth-income'
    },

    {
        id: 'CIB',
        name: 'Capital Income Builder®',
        color: 'equity-income'
    },
]

////////
const LIST2 = [

    {
        id: 'CGGG',
        name: 'Capital Group Global Growth<sup>SM</sup> SMA',
        color: 'sma'
    },

    {
        id: 'CGUSIG',
        name: 'Capital Group U.S. Income and Growth<sup>SM</sup> SMA',
        // tm: 'SM',
        color: 'sma'
    },

    {
        id: 'CGFG',
        name: 'Capital Group U.S. Flexible Growth<sup>SM</sup> SMA',
        // tm: 'SM',
        color: 'sma'
    },
];

//////// builds COLUMN 3
const LIST3 = [

    // {
    //     id: 'MSI',
    //     name: 'American Funds Multi-Sector Income Fund',
    //     tm: 'SM',
    //     color: 'taxable-bond'
    // },
    // {
    //     id: 'BFA',
    //     name: 'The Bond Fund of America®',
    //     color: 'taxable-bond'
    // },
    // {
    //     id: 'SBF',
    //     name: 'American Funds Strategic Bond Fund',
    //     tm: 'SM',
    //     color: 'taxable-bond'
    // },

];

//////// builds COLUMN 4
const LIST4 = [

    // {
    //     id: 'TEBF',
    //     name: 'The Tax-Exempt Bond Fund of America®',
    //     color: 'tax-exempt-bond'
    // },


];

// THIS LIST WILL APPEAR IN THE 'VIEW ALL' DROPDOWN IN THE FUND TILES
const VIEWALLFUNDS = []

//////////////////////////////////////////////////////////////////
const column1List = LIST1.map(el => {
    // return {
    //     id: el.id,
    //     html:
    //         `
    //     <div class='menu-fund-box'>
    //         <span style='position: absolute; opacity:0; pointer-events: none;'>${el.id}</span>
    //       <div class='fs-menu-ft-name p-18'>${el.name}${el.tm ? `<sup>${el.tm}</sup>` : ''}</div>
    //     </div>
    //     `
    // }

    return `
        <div class='menu-fund-tile-square menu-fund-box ${el.color}'>
            <div class='menu-fund-tile-id'>${el.id}</div>
            <div class='menu-fund-title-name'>${el.name}${el.tm ? `<sup>${el.tm}</sup>` : ''}</div>
            <div class='menu-fund-tile-arrow'></div>
        </div>
      `
});

const column2List = LIST2.map(el => {
    // return `
    //     <div class='menu-fund-box'>
    //         <span style='position: absolute; opacity:0; pointer-events: none;'>${el.id}</span>
    //         <div class='fs-menu-ft-name p-18'>${el.name}${el.tm ? `<sup>${el.tm}</sup>` : ''}</div>
    //     </div>
    //   `

    return `
        <div class='menu-fund-tile-square menu-fund-boxxxxxx ${el.color}'>
          <div class='menu-fund-tile-id'>${el.id}</div>
          <div class='menu-fund-title-name'>${el.name}${el.tm ? `<sup>${el.tm}</sup>` : ''}</div>
          <div class='menu-fund-tile-arrow'></div>
        </div>
          `
});

const column3List = LIST3.map(item => {

    // return `
    //     <div class='menu-fund-box' ${clickFunc}>
    //         <span style='position: absolute; opacity:0; pointer-events: none;'>${item.id}</span>
    //         <div class='fs-menu-ft-name p-18'>${item.name}${item.tm ? `<sup>${item.tm}</sup>` : ''}</div>
    //     </div>`

    return `
        <div class='menu-fund-tile-square menu-fund-box ${item.color}'>
          <div class='menu-fund-tile-id'>${item.id}</div>
          <div class='menu-fund-title-name'>${item.name}${item.tm ? `<sup>${item.tm}</sup>` : ''}</div>
          <div class='menu-fund-tile-arrow'></div>
        </div>`
});

const column4List = LIST4.map(item => {
    // return `
    //     <div class='menu-fund-box'>
    //         <span style='position: absolute; opacity:0; pointer-events: none;'>${item.id}</span>
    //         <div class='fs-menu-ft-name p-18'>${item.name}${item.tm ? `<sup>${item.tm}</sup>` : ''}</div>
    //     </div>
    //   `

    return `
        <div class='menu-fund-tile-square menu-fund-box ${item.color}'>
          <div class='menu-fund-tile-id'>${item.id}</div>
          <div class='menu-fund-title-name'>${item.name}${item.tm ? `<sup>${item.tm}</sup>` : ''}</div>
          <div class='menu-fund-tile-arrow'></div>
        </div>
          `
});

const lowerSection = () => {

    return `
        <!--- tiles menu system -->
        <div style="flex-grow: .1" class='menu-bot-spacer'></div>

        <div class="menu-tiles-wrapper" id="tiles-ani" style='padding-top: 0%'>
            ${lowerGroups()}
        </div>

        <div style="flex-grow: .1" class='menu-bot-spacer'></div>
            ${disclosureForFSPage()}
        `
}

const l1 = column1List.length ? 1 : 0;
const l2 = column2List.length ? 1 : 0;
const l3 = column3List.length ? 1 : 0;
const l4 = column4List.length ? 1 : 0;
const listSum = l1 + l2 + l3 + l4;
const columnWidth = listSum === 4 ? '25%' : listSum === 3 ? '33%' : listSum === 2 ? '50%' : '100%';
const marginRight = listSum === 4 ? '1%' : listSum === 3 ? '2%' : listSum === 2 ? '3%' : '4%';

const topColor1 = 'border-top-color: #005F9E;'
const topColor2 = 'border-top-color: #009CDC;'
const topColor3 = 'border-top-color: #008E77;'
const topColor4 = 'border-top-color: #004C46;'

function lowerGroups() {
    return `
    ${column1List.length ? `
        <!-- Fund Tiles -->
        <div class="menu-tiles-container" style='width: ${columnWidth}; margin-right:${marginRight}; ${topColor1};'>
            
            <div style='pointer-events: none; width: 100%;' class="menu-fund-title p-18 bold" onclick="window.location.href = 'five-01.html?0'">
                Funds
                <div class="menu-arrow-black"></div>
            </div>
            
            ${column1List.join(' ')}
        </div>
        ` : ''} 

        ${column2List.length ? `
            <!--- More Like "Fun" Tiles -->
            <div class="menu-tiles-container" style="width: ${columnWidth}; margin-right:${marginRight}; ${topColor2}">
                
                <div style='pointer-events: none; width: 100%;' class="menu-fund-title p-18 bold" onclick="window.location.href = 'five-01.html?1'">
                    SMAs
                    <div class="menu-arrow-black"></div>
                </div>
                
                ${column2List.join(' ')}
            </div>
            ` : ''} 

        ${column3List.length ? `
            <!--- Tiles -->
            <div class="menu-tiles-container" style="width: ${columnWidth}; margin-right:${marginRight}; ${topColor3}">
                
                <div style='cursor: pointer; width: 100%;' class="menu-fund-title p-18 bold" onclick="window.location.href = 'five-01.html?2'">
                    Taxable fixed income
                    <div class="menu-arrow-black"></div>
                </div>
                
                ${column3List.join(' ')}
            </div>
            ` : ''} 

        ${column4List.length ? `
            <!--- Tiles -->
            <div class="menu-tiles-container" style="width: ${columnWidth}; margin-right:${marginRight}; ${topColor4}">
                
                <div style='cursor: pointer; width: 100%;' class="menu-fund-title p-18 bold" onclick="window.location.href = 'five-01.html?3'">
                    Tax-exempt fixed income
                    <div class="menu-arrow-black"></div>
                </div>
                
                ${column4List.join(' ')}
            </div>
            ` : ''} 
    `
}

function disclosureForFSPage() {
    return `
    <div class='bold p-18 fs-disclosure' style='padding-right: 3%; margin-top: 2%; width:97%;'>
    Investments are not FDIC-insured, nor are they deposits of or guaranteed by a bank or any other entity, so they may lose value.
    <br><br>
    Investors should carefully consider investment objectives, risks, charges and expenses. This and other important information is contained in the fund prospectuses and summary prospectuses, which can be obtained from a financial professional and should be read carefully before investing.
    </div>
    `
}