
function annoListenerFT(event) {
    if (event.key.toLowerCase() === 'a') {

        try {
            window.parent.postMessage('a', '*');

        } catch (error) {
            console.warn(error)

        }
        // trackAnalytics("");
    }
}

if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("keydown", annoListenerFT, false);
}
else {
    window.attachEvent("keydown", annoListenerFT);
}
