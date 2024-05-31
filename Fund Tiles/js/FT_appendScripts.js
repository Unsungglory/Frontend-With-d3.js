
try {
    console.log('append ../website info')
    let failed = false;
    // NOT FUND TILES (TWO DOTS, AND TRY TO APPEND THIS FIRST)
    // FUND TILES (ONE DOT)
    try {
        appendScript("../../websiteInfo.js");
    } catch (error) {
        failed = true;
        console.error(error)
    }

    if (failed) {
        console.log('append ./website info')

        appendScript(".././websiteInfo.js");
    }
} catch (error) {
    console.error(error)
}

function appendScript(scriptLocation) {
    const scriptToAppend = document.createElement('script');
    scriptToAppend.type = 'text/javascript';
    // scriptToAppend.defer = true;
    // scriptToAppend.async = false;
    scriptToAppend.src = scriptLocation;
    document.body.appendChild(scriptToAppend);
}

try {
    console.log('append ../receiveMsg')
    appendScript("./js/FT_receiveMsg.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_shareClassDefault')
    appendScript("./js/FT_shareClassDefault.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_drawPage')
    appendScript("./js/FT_drawPage.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_slider')
    appendScript("./js/FT_slider.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_utilities')
    appendScript("./js/FT_utilities.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_viewAllFunds')
    appendScript("./js/FT_viewAllFunds.js");
} catch (error) {
    console.error(error)
}

try {
    console.log('append ../FT_annotationListener')
    appendScript("./js/FT_annotationListener.js");
} catch (error) {
    console.error(error)
}
