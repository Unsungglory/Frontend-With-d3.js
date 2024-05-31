
// **************************************************************** //
//  INSERT DISCLOSURES
// **************************************************************** //
function insertDisclosures(currentFundData, shareClass) {
    if (shareClass === 'TD') return;

    if (shareClass === 'r6') {
        switch (currentFundData.r6.id) {
            case 'AMCAP':
                xFadeFooter('r6-growth', AMCAPdiscR6)
                break;

            case 'IVE':
                xFadeFooter('r6-growth', IVEdiscR6)
                break;

            case 'EUPAC':
                xFadeFooter('r6-growth', EUPACdiscR6)
                break;

            case 'GFA':
                xFadeFooter('r6-growth', GFAR6disc)
                break;

            case 'NPF':
                xFadeFooter('r6-growth', NPFR6disc)
                break;

            case 'NWF':
                xFadeFooter('r6-growth', NWFdiscR6)
                break;

            case 'AMF':
                xFadeFooter('r6-growth', AMFdiscR6)
                break;

            case 'WMIF':
                xFadeFooter('r6-growth', WMIFR6disc)
                break;

            case 'AMBAL':
                xFadeFooter('r6-growth', AMBALdiscR6)
                break;

            case 'SBF':
                xFadeFooter('bond', SBFR6disc)
                break;

            case 'BFA':
                xFadeFooter('bond', BFAR6disc)
                break;

            case 'IBFA':
                xFadeFooter('bond', IBFAR6disc)
                break;

            case 'GIF':
                xFadeFooter('r6-growth', GIFdiscR6)
                break;

            case 'NEF':
                xFadeFooter('r6-growth', NEFdiscR6)
                break;

            case 'SCWF':
                xFadeFooter('r6-growth', SCWFdiscR6)
                break;

            case 'WGI':
                xFadeFooter('r6-growth', WGIR6disc)
                break;

            case 'IGI':
                xFadeFooter('r6-growth', IGIR6disc)
                break;

            case 'DWGI':
                xFadeFooter('r6-growth', DWGIdiscR6)
                break;

            case 'FI':
                xFadeFooter('r6-growth', FIdiscR6)
                break;

            case 'ICA':
                xFadeFooter('r6-growth', ICAdiscR6)
                break;

            case 'CIB':
                xFadeFooter('r6-growth', CIBdiscR6)
                break;

            case 'IFA':
                xFadeFooter('r6-growth', IFAdiscR6)
                break;

            case 'GBAL':
                xFadeFooter('r6-growth', GBALdiscR6)
                break;

            case 'MSI':
                xFadeFooter('bond', MSIdiscR6)
                break;

            default:
                console.error('DISCLOSURE NOT PROPERLY SET')
                xFadeFooter('bond', currentFundData.a.id + ' R6 disclosure not found')
                xFadeFooter('growth', currentFundData.a.id + ' R6 disclosure not found')
                break;
        }
    } else if (shareClass === 'a') {
        if (currentFundData.a.id === 'IVE') {
            xFadeFooter('growth', IVEdisc);
        } else if (currentFundData.a.id === 'AMCAP') {
            xFadeFooter('growth', AMCAPdisc);
        } else if (currentFundData.a.id === 'GFA') {
            xFadeFooter('growth', GFAdisc);
        } else if (currentFundData.a.id === 'EUPAC') {
            xFadeFooter('growth', EUPACdisc);
        } else if (currentFundData.a.id === 'NPF') {
            xFadeFooter('growth', NPFdisc);
        } else if (currentFundData.a.id === 'NWF') {
            xFadeFooter('growth', NWFdisc);
        } else if (currentFundData.a.id === 'AMF') {
            xFadeFooter('growth', AMFdisc);
        } else if (currentFundData.a.id === 'WMIF') {
            xFadeFooter('growth', WMIFdisc);
        } else if (currentFundData.a.id === 'AMBAL') {
            xFadeFooter('growth', AMBALdisc);
        } else if (currentFundData.a.id === 'GIF') {
            xFadeFooter('growth', GIFdisc);
        } else if (currentFundData.a.id === 'NEF') {
            xFadeFooter('growth', NEFdisc);
        } else if (currentFundData.a.id === 'SCWF') {
            xFadeFooter('growth', SCWFdisc);
        } else if (currentFundData.a.id === 'WGI') {
            xFadeFooter('growth', WGIdisc);
        } else if (currentFundData.a.id === 'IGI') {
            xFadeFooter('growth', IGIdisc);
        } else if (currentFundData.a.id === 'SBF') {
            xFadeFooter('bond', SBFdisc);
        } else if (currentFundData.a.id === 'BFA') {
            xFadeFooter('bond', BFAdisc);
        } else if (currentFundData.a.id === 'IBFA') {
            xFadeFooter('bond', IBFAdisc);
        } else if (currentFundData.a.id === 'AHIM') {
            xFadeFooter('bond', AHIMdisc);
        } else if (currentFundData.a.id === 'LTEX') {
            xFadeFooter('bond', LTEXdisc);
        } else if (currentFundData.a.id === 'TEBF') {
            xFadeFooter('bond', TEBFdisc);
        } else if (currentFundData.a.id === 'MSI') {
            xFadeFooter('bond', MSIdisc);
        } else if (currentFundData.a.id === 'DWGI') {
            xFadeFooter('growth', DWGIdisc);
        } else if (currentFundData.a.id === 'FI') {
            xFadeFooter('growth', FIdisc);
        } else if (currentFundData.a.id === 'ICA') {
            xFadeFooter('growth', ICAdisc);
        } else if (currentFundData.a.id === 'CIB') {
            xFadeFooter('growth', CIBdisc);
        } else if (currentFundData.a.id === 'IFA') {
            xFadeFooter('growth', IFAdisc);
        } else if (currentFundData.a.id === 'GBAL') {
            xFadeFooter('growth', GBALdisc);
        } else {
            xFadeFooter('bond', currentFundData.a.id + ' A shares disclosure not found')
            xFadeFooter('growth', currentFundData.a.id + ' A shares disclosure not found')
            console.error('DISCLOSURE NOT PROPERLY SET');
        }
    } else {
        // F2s
        if (currentFundData.a.id === 'IVE') {
            xFadeFooter('growth', IVEF2disc);
        } else if (currentFundData.a.id === 'AMCAP') {
            xFadeFooter('growth', AMCAPF2disc);
        } else if (currentFundData.a.id === 'GFA') {
            xFadeFooter('growth', GFAF2disc);
        } else if (currentFundData.a.id === 'EUPAC') {
            xFadeFooter('growth', EUPACF2disc);
        } else if (currentFundData.a.id === 'NPF') {
            xFadeFooter('growth', NPFF2disc);
        } else if (currentFundData.a.id === 'NWF') {
            xFadeFooter('growth', NWFF2disc);
        } else if (currentFundData.a.id === 'AMF') {
            xFadeFooter('growth', AMFF2disc);
        } else if (currentFundData.a.id === 'WMIF') {
            xFadeFooter('growth', WMIFF2disc);
        } else if (currentFundData.a.id === 'AMBAL') {
            xFadeFooter('growth', AMBALF2disc);
        } else if (currentFundData.a.id === 'GIF') {
            xFadeFooter('growth', GIFF2disc);
        } else if (currentFundData.a.id === 'NEF') {
            xFadeFooter('growth', nefF2disc);
        } else if (currentFundData.a.id === 'SCWF') {
            xFadeFooter('growth', SCWFF2disc);
        } else if (currentFundData.a.id === 'WGI') {
            xFadeFooter('growth', WGIF2disc);
        } else if (currentFundData.a.id === 'IGI') {
            xFadeFooter('growth', IGIF2disc);

        } else if (currentFundData.a.id === 'SBF') {
            xFadeFooter('bond', SBFF2disc);
        } else if (currentFundData.a.id === 'BFA') {
            xFadeFooter('bond', BFAF2disc);
        } else if (currentFundData.a.id === 'IBFA') {
            xFadeFooter('bond', IBFAF2disc);
        } else if (currentFundData.a.id === 'AHIM') {
            xFadeFooter('bond', AHIMF2disc);
        } else if (currentFundData.a.id === 'LTEX') {
            xFadeFooter('bond', LTEXF2disc);
        } else if (currentFundData.a.id === 'TEBF') {
            xFadeFooter('bond', TEBFF2disc);
        } else if (currentFundData.a.id === 'MSI') {
            xFadeFooter('bond', MSIF2disc);
        } else if (currentFundData.a.id === 'DWGI') {
            xFadeFooter('growth', DWGIF2disc);
        } else if (currentFundData.a.id === 'FI') {
            xFadeFooter('growth', FIF2disc);
        } else if (currentFundData.a.id === 'ICA') {
            xFadeFooter('growth', ICAF2disc);
        } else if (currentFundData.a.id === 'CIB') {
            xFadeFooter('growth', CIBF2disc);
        } else if (currentFundData.a.id === 'IFA') {
            xFadeFooter('growth', IFAF2disc);
        } else if (currentFundData.a.id === 'GBAL') {
            xFadeFooter('growth', GBALF2disc);
        } else {
            xFadeFooter('bond', currentFundData.a.id + ' F2 shares disclosure not found')
            xFadeFooter('growth', currentFundData.a.id + ' F2 shares disclosure not found')
            console.error('DISCLOSURE NOT PROPERLY SET');
        }
    }

    ///// helper
    function xFadeFooter(section, text) {
        console.log(section, currentFundData.a.id)
        const footer = document.getElementById(`${section}-footer`);
        const footerAlt = document.getElementById(`${section}-footer-alt`);

        // set alt text
        footerAlt.innerHTML = text;
        footer.style.transition = '.3s all ease-in-out';
        footerAlt.style.transition = '.3s all ease-in-out';

        // wait, fade alt in, and fade non-alt out
        setTimeout(() => {
            footerAlt.style.opacity = 1;
            footer.style.opacity = 0;
        }, 1);

        // wait, then set non-alt text
        setTimeout(() => {
            footer.innerHTML = text;

            footer.style.transition = '0s all ease-in-out';
            footerAlt.style.transition = '0s all ease-in-out';
        }, 401);

        // wait, then reveal non-alt and hide alt
        setTimeout(() => {
            footer.style.opacity = 1;
            footerAlt.style.opacity = 0;
        }, 403);

    }
}
