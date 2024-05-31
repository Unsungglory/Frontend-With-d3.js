// **************************************************************** //
// GET INCOMING MESSAGE WHEN OPENING TEMPLATE
// **************************************************************** //
function receiveMessage(event) {

    if (event.origin.startsWith('https://h') || event.origin.startsWith('http://127.0.0.1') || event.origin === 'null' || event.origin.startsWith('file://capgr') || event.origin.startsWith('http://local')) {

        const fundID = event.data.id;
        receivedShareClass = event.data.fundClass;
        drawPage(fundID);

    } else {
        console.warn('recieved message, but bad URI')
    }
}

// LISTEN FOR INCOMING MESSAGE
if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", receiveMessage, false);
}
else {
    window.attachEvent("onmessage", receiveMessage);
}

// DON'T ALLOW PARENT TO OPEN IFRAME UNTIL IFRAME SOURCE IS BUILT AND READY
document.addEventListener('DOMContentLoaded', () => {
    const myInterval =
        setInterval(() => {
            if (dataA && dataF2 && dataR6) {
                console.log('data found and sending message to parent')
                // window.localStorage.setItem('dataA-fp', JSON.stringify(dataA));
                // window.localStorage.setItem('dataF2-fp', JSON.stringify(dataF2));
                // window.localStorage.setItem('dataR6-fp', JSON.stringify(dataR6));

                // window.localStorage.setItem('dataTD', JSON.stringify(dataTD));
                tdData = dataTD;

                clearInterval(myInterval)
                window.parent.postMessage('ready', '*');
            } else {
                console.log('data not found... yet')
            }
        }, 250);
})
