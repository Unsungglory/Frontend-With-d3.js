const LTEXdisc =
  `
  <!-- engine back to top -->
  <span class="top-btn">
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

  <strong>
       <span id='disclosure-big-line'>
      Investments are not FDIC-insured, nor are they deposits of or guaranteed by a bank or any other entity, so
      they may lose value.
    </span>

    <br><br>
    Investors should carefully consider investment objectives, risks, charges and expenses. This and other
    important information is contained in the fund prospectuses and summary prospectuses, which can be obtained
    from a financial professional and should be read carefully before investing.

  </strong>
  <br><br>
  Investing outside the United States involves risks, such as currency fluctuations, periods of illiquidity and
  price volatility. These risks may be heightened in connection with investments in developing countries.

  <br><br>
  For more information about the risks associated with each investment, go to its detailed information page or read the prospectus, if applicable. 

  <br><br>
  Class A shares were ﬁrst offered on January 1, 1934. Class A share results prior to the date of ﬁrst sale are hypothetical based on the results of the original share class of the fund without a sales charge, adjusted for typical estimated expenses. Please see <span style='text-decoration: underline; cursor: pointer;' onclick='goWeb()'>capitalgroup.com</span> for more information on speciﬁc expense adjustments and the actual dates of ﬁrst sale. 

  <br><br>
  The return of principal for bond portfolios and for portfolios with significant underlying bond holdings is not guaranteed. Fund shares are subject to the same interest rate, inflation and credit risks associated with the underlying bond holdings. Lower rated bonds are subject to greater fluctuations in value and risk of loss of income and principal than higher rated bonds. Income from municipal bonds may be subject to state or local income taxes and/or the federal alternative minimum tax. Certain other income, as well as capital gain distributions, may be taxable. 

  <br><br>
  There may have been periods when the results lagged the index(es). Certain market indexes are unmanaged and, therefore, have no expenses. Investors cannot invest directly in an index. 

  <br><br>
  Portfolios are managed, so holdings will change. Certain ﬁxed income and/or cash and equivalents holdings may be held through mutual funds managed by the investment adviser or its afﬁliates that are not offered to the public.

  <br><br>
  Investment results assume all distributions are reinvested and reﬂect applicable fees and expenses unless otherwise noted. Returns for one year or less are not annualized, but calculated as cumulative total returns. The expense ratios are as of each fund’s prospectus available at the time of publication. 

  <br><br>
  When applicable, investment results reflect fee waivers and/or expense reimbursements, without which results would have been lower and net expense ratios higher if shown. This information is provided in detail in the prospectus. Please see <span style='text-decoration: underline; cursor: pointer;' onclick='goWeb()'>capitalgroup.com</span> for more information. 

  <ol class='dis-ol'>
    <li>
      <span>
      Shown within the range for funds in the Morningstar Muni National Short-Term Bond category. 

      </span>
    </li>
    <br>
    <li>
      <span>
      Based on monthly data from fund inception through ${quarterDate}. 
      </span>
    </li>
    <br>

    <li>
      <span>
      Results for certain funds with an inception date after the share class inception also include hypothetical returns because those funds’ shares sold after the funds’ date of first offering. 

      </span>
    </li>
    <br>

    <li>
      <span>

      YTD (year-to-date return): the net change in the value of the portfolio (in percentage terms) from January 1 of the current year to the date shown above. 

      </span>
    </li>
    <br>

    <li>
      <span>
        Cash & equivalents includes short-term securities, accrued income and other assets less
        liabilities. It may also include investments in money market or similar funds managed by the investment
        advisor or it’s affiliates that are not offered to the public. Totals may not reconcile due to rounding.
      </span>
    </li>
    <br>

    <li>
      <span>
      The information shown does not include cash and cash equivalents. This includes shares of money market or similar funds managed by the investment adviser or its affiliates that are not offered to the public. 

      </span>
    </li>


  </ol>
  Bloomberg Barclays Municipal Short-Intermediate 1–10 Years Index is a market value-weighted index that includes investment-grade tax-exempt bonds with maturities of one to 10 years. This index is unmanaged, and its results include reinvested distributions but do not reflect the effect of sales charges, commissions, account fees, expenses or U.S. federal income taxes. 

  <br><br>
  Bloomberg® is a trademark of Bloomberg Finance L.P. (collectively with its affiliates, “Bloomberg”). Barclays® is a trademark of Barclays Bank Plc (collectively with its affiliates, “Barclays”), used under license. Neither Bloomberg nor Barclays approves or endorses this material, guarantees the accuracy or completeness of any information herein and, to the maximum extent allowed by law, neither shall have any liability or responsibility for injury or damages arising in connection therewith. 

  <br><br>
  © ${yearVar} Morningstar, Inc. All rights reserved. The information contained herein: (1) is proprietary to Morningstar and/or its content providers; (2) may not be copied or distributed; and (3) is not warranted to be accurate, complete or timely. Neither Morningstar nor its content providers are responsible for any damages or losses arising from any use of this information. Past performance is no guarantee of future results. 

  <br><br>
  This content, developed by Capital Group, home of American Funds, should not be used as a primary basis for investment decisions and is not intended to serve as impartial investment or fiduciary advice. 

  <br><br>
  All Capital Group trademarks mentioned are owned by The Capital Group Companies, Inc., an affiliated company or fund. All other company and product names mentioned are the property of their respective companies. 

  <br><br>
  American Funds Distributors, Inc., member FINRA. 

  <br><br>
  © ${yearVar} Capital Group. All rights reserved.
`