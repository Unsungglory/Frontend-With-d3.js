
// ****************************************************************************************************************************** //
// Generates black mobile bar on Seismic app (when fullscreen)
// ****************************************************************************************************************************** //

// ADD BLACK BAR TO TOP IF USING IPAD
function addBlackBar() {
    if (iPadMobile && window.innerHeight > 800) {
        // IF BAR DOESN'T EXIST, PREPEND IT (and only do it once, as this is called on resize when going fullscreen in Seismic)
        if (!document.getElementById('mobile-bar')) {
            const mobileBar = document.createElement('div');
            mobileBar.id = 'mobile-bar';
            document.body.prepend(mobileBar);
        }
        document.getElementById('mobile-bar').style.display = `block`;

    } else {
        // hide bar when leaving fullscreen in Seismic (height < 800px)
        if (document.getElementById('mobile-bar')) {
            document.getElementById('mobile-bar').style.display = `none`;
        }
    }
}

addBlackBar();
window.addEventListener('resize', addBlackBar);
