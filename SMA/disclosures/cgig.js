const CGIGDiscText = `
Sources: Capital Group. Standard & Poor's.
<br><br>
Lifetime: as of 4/1/92. Capital Group Global Equity SMA Composite inception: 09/01/2011. The composite consists of all unrestricted, discretionary SMA portfolios that are managed according to its investment strategy. Beginning
09/01/2011, the composite includes all SMA portfolios applicable to the Global Equity strategy. Prior to 09/01/2011, no SMA portfolios were managed in the Global Equity strategy, and for that reason, the results presented are based on the
Capital Group Private Client Services (CGPCS) Global Equity Composite (inception: 04/01/1992) returns, which contain non-SMA similar strategy portfolios. As of 1/1/2019, only unrestricted portfolios are included in the composite. Prior to
1/1/2019, both restricted and unrestricted portfolios were included. Past results are not predictive of results in future periods.
<br><br>
Standard & Poor’s 500 Composite Index is a market capitalization-weighted index based on the results of approximately 500 widely held common stocks. Indexes are unmanaged and, therefore, have no expenses. Investors cannot invest
directly in an index.
<br><br>
Standard & Poor’s 500 Composite Index (“Index”) is a product of S&P Dow Jones Indices LLC and/or its affiliates and has been licensed for use by Capital Group. Copyright © 2021 S&P Dow Jones Indices LLC, a division of S&P Global, and/or
its affiliates. All rights reserved. Redistribution or reproduction in whole or in part is prohibited without written permission of S&P Dow Jones Indices LLC.
<br><br>
The return of principal for bond funds and for funds with significant underlying bond holdings is not guaranteed. Fund shares are subject to the same interest rate, inflation and credit risks associated with the underlying bond holdings.
Lower rated bonds are subject to greater fluctuations in value and risk of loss of income and principal than higher rated bonds. Income from municipal bonds may be subject to state or local income taxes and/or the federal alternative
minimum tax. Also, certain other income (such as distributions from gains on the sale of certain bonds purchased at less than par value, for The Tax-Exempt Bond Fund of America), as well as capital gains distributions, may be taxable. Bond
ratings, which typically range from AAA/Aaa (highest) to D (lowest), are assigned by credit rating agencies such as Standard & Poor’s, Moody’s and/or Fitch, as an indication of an issuer’s creditworthiness. If agency ratings differ, the security
will be considered to have received the highest of those ratings, consistent with the fund’s investment policies.
<br><br>
Statements attributed to an individual represent the opinions of that individual as of the date published and do not necessarily reflect the opinions of Capital Group or its affiliates. This information is intended to highlight issues and should
not be considered advice, an endorsement or a recommendation.
<br><br>
This content, developed by Capital Group, home of American Funds, should not be used as a primary basis for investment decisions and is not intended to serve as impartial investment or fiduciary advice.
<br><br>
All Capital Group trademarks mentioned are owned by The Capital Group Companies, Inc., an affiliated company or fund. All other company and product names mentioned are the property of their respective companies.
<br><br>
American Funds Distributors, Inc., member FINRA.
<br><br>
© 2022 Capital Group. All rights reserved
`

const CGIGDisc = `    
    <!-- engine back to top -->
    <span class="top-btn p-16">
        <button onclick="scrollToTop()">
            Back to Top
            <svg id="W-sharp-arrow_upward" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24">
                <path id="Path" d="M0,0H24V24H0Z" fill="#005f9e" fill-rule="evenodd" />
                <path id="Path-2" data-name="Path" d="M4,12l1.41,1.41L11,7.83V20h2V7.83l5.58,5.59L20,12,12,4Z"
                    fill="#fff" fill-rule="evenodd" />
            </svg>
        </button>
    </span>
    <!-- end back to top -->
    <p class='disc-text'>
        ${CGIGDiscText}
    </p>

    <p class='disc-text'>
    ${CGIGDiscText}
    </p>

    <p class="disc-text">
    ${CGIGDiscText} 
    </p>

    <p class="disc-text">
        
    </p>
`