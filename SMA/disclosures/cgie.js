const cgieTEXT = `
Sources: Capital Group. MSCI. 
<br><br>
Lifetime: as of 1/1/87. Capital Group International Equity SMA Composite inception: 
07/01/2012. The composite consists of all unrestricted, discretionary SMA portfolios 
that are managed according to its investment strategy. Beginning 07/01/2012, the 
composite includes all SMA portfolios applicable to the International Equity strategy.
Prior to 07/01/2012, no SMA portfolios were managed in the International Equity 
strategy, and for that reason, the results presented are based on the Capital Group 
Private Client Services (CGPCS) International Equity Composite (inception: 
01/01/1987) returns, which contain non-SMA similar strategy portfolios. As of 
1/1/2019, only unrestricted portfolios are included in the composite. Prior to 
1/1/2019, both restricted and unrestricted portfolios were included. Past results are 
not predictive of results in future periods. Investment results assume all 
distributions are reinvested and reflect applicable fees and expenses. 
<br><br>
MSCI EAFE® (Europe, Australasia, Far East) Index is a free float-adjusted market 
capitalization weighted index that is designed to measure developed equity market 
results, excluding the United States and Canada. Results reflect dividends net of 
withholding taxes. This index is unmanaged, and its results include reinvested 
dividends and/or distributions but do not reflect the effect of sales charges, 
commissions, account fees, expenses or U.S. federal income taxes. Investors cannot
invest directly in an index. 
<br><br>
©2022 Morningstar, Inc. All rights reserved. The information contained herein: (1) is
proprietary to Morningstar and/or its content providers; (2) may not be copied or 
distributed; and (3) is not warranted to be accurate, complete or timely. Neither 
Morningstar nor its content providers are responsible for any damages or losses 
arising from any use of this information. Past performance is no guarantee of future 
results. 
<br><br>
MSCI has not approved, reviewed or produced this report, makes no express or 
implied warranties or representations and is not liable whatsoever for any data in 
the report. You may not redistribute the MSCI data or use it as a basis for other 
indices or investment products.
<br><br>
Net returns are calculated by subtracting a monthly hypothetical fee (equivalent to 
3% annual, which is equal to or higher than the highest actual SMA fee charged by a
program sponsor) from ”pure” gross composite monthly returns. Actual fees will 
vary. For information concerning program sponsor fees, contact your financial 
advisor. Excess return represents the mean annualized premium/deficit between 
the results for the stated equity service composite and the respective benchmark 
for all rolling one-year periods in which the market delivered the referenced level of 
returns (index return 15%; index return of >15%). Numbers are based on rolling 
monthly data for both the composite and the respective benchmark in order to 
represent the broadest range of beginning and ending points available and reduce 
entry- and exit-point bias, thus reflecting the range of entry points experienced by 
investors. Rolling returns are based on monthly observations since the inception 
date of the composite. Results are net of withholding taxes on dividends, interest 
and capital gains. Information regarding the fees charged by program sponsors for 
SMA portfolios included in this composite is available in the relevant program 
sponsor’s Form ADV or other relevant disclosure materials in the non-U.S. markets. 
Past performance does not guarantee future results. 
<br><br>
The return of principal for bond funds and for funds with significant underlying bond 
holdings is not guaranteed. Fund shares are subject to the same interest rate, 
inflation and credit risks associated with the underlying bond holdings. Lower rated 
bonds are subject to greater fluctuations in value and risk of loss of income and 
principal than higher rated bonds. Income from municipal bonds may be subject to 
state or local income taxes and/or the federal alternative minimum tax. Also, certain
other income (such as distributions from gains on the sale of certain bonds 
purchased at less than par value, for The Tax-Exempt Bond Fund of America), as 
well as capital gains distributions, may be taxable. Bond ratings, which typically 
range from AAA/Aaa (highest) to D (lowest), are assigned by credit rating agencies 
such as Standard & Poor’s, Moody’s and/or Fitch, as an indication of an issuer’s 
creditworthiness. If agency ratings differ, the security will be considered to have 
received the highest of those ratings, consistent with the fund’s investment policies.
<br><br>
Statements attributed to an individual represent the opinions of that individual as of
the date published and do not necessarily reflect the opinions of Capital Group or its
affiliates. This information is intended to highlight issues and should not be 
considered advice, an endorsement or a recommendation. 
<br><br>
This content, developed by Capital Group, home of American Funds, should not be 
used as a primary basis for investment decisions and is not intended to serve as 
impartial investment or fiduciary advice. 
<br><br>
All Capital Group trademarks mentioned are owned by The Capital Group 
Companies, Inc., an affiliated company or fund. All other company and product 
names mentioned are the property of their respective companies. 
<br><br>
American Funds Distributors, Inc., member FINRA. 
<br><br>
© 2022 Capital Group. All rights reserved.
`



const CGIEDisc = `    
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
    ${cgieTEXT}
    </p>

    <p class='disc-text'>
    ${cgieTEXT}
    </p>

    <p class="disc-text">
    ${cgieTEXT}
    </p>

    <p class="disc-text">
       
    </p>
`