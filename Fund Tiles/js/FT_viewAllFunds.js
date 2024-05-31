// SETS THE VIEW ALL DROP DOWN TO INCLUDE THE FUNDS FOUND IN THE websiteInfo ARRAY
try {
    if (VIEWALLFUNDS.length) {

        const fundsList = VIEWALLFUNDS.map((fund, i) => {
            const sup = fund.tm ? `<sup>${fund.tm}</sup>` : '';

            return `
            <div class='fund-box-container' onclick="fundClick(this)">
            <div id='${fund.id}' class='fund-box ${fund.color}'>${fund.id}</div>
            <div class='fund-text'>${fund.name}${sup}</div>
            </div>
            `
        })

        let outputText = '<div>';

        fundsList.forEach((fund, i) => {
            outputText += fund;

            if (i === 5 || i === 11 || i === 17 || i === 23) {
                if (i < fundsList.length)
                    outputText += `
            </div>
            <div>
                    `;
                else
                    outputText += `
                
                    </div>`
            }
        });

        document.querySelector('.fund-container').innerHTML = outputText;
    }

} catch (error) {

}

// THERE ARE SIX FUNDS PER COLUMN
`
<div>
  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-10' class='fund-box dark-blue'>AMCAP</div>
    <div class='fund-text'>AMCAP Fund®</div>
  </div>

  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-0' class='fund-box dark-blue'>GIF</div>
    <div class='fund-text'>American Funds Global Insight Fund<sup>SM</sup></div>
  </div>

  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-10' class='fund-box dark-blue'>IVE</div>
    <div class='fund-text'>American Funds International Vantage Fund<sup>SM</sup></div>
  </div>

  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-0' class='fund-box dark-blue'>EUPAC</div>
    <div class='fund-text'>EuroPacific Growth Fund®</div>
  </div>

  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-0' class='fund-box dark-blue'>GFA</div>
    <div class='fund-text'>The Growth Fund of America®</div>
  </div>

  <div class='fund-box-container' onclick="fundClick(this)">
    <div id='fb-8' class='fund-box dark-blue'>NEF</div>
    <div class='fund-text'>New Economy Fund®</div>
  </div>
</div>
`