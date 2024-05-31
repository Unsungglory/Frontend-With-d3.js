const EXPECTEDTICKERS = [
    {
        "id": "IVE",
        "ticker": "AIVBX"
    },
    {
        "id": "GFA",
        "ticker": "AGTHX"
    },
    {
        "id": "NPF",
        "ticker": "ANWPX"
    },
    {
        "id": "NWF",
        "ticker": "NEWFX"
    },
    {
        "id": "AMF",
        "ticker": "AMRMX"
    },
    {
        "id": "WMIF",
        "ticker": "AWSHX"
    },
    {
        "id": "SBF",
        "ticker": "ANBAX"
    },
    {
        "id": "BFA",
        "ticker": "ABNDX"
    },
    {
        "id": "TEBF",
        "ticker": "AFTEX"
    },
    {
        "id": "IBFA",
        "ticker": "AIBAX"
    },
    {
        "id": "LTEX",
        "ticker": "LTEBX"
    },
    {
        "id": "AHIM",
        "ticker": "AMHIX"
    },
    {
        "id": "AMCAP",
        "ticker": "AMCPX"
    },
    {
        "id": "EUPAC",
        "ticker": "AEPGX"
    },
    {
        "id": "AMBAL",
        "ticker": "ABALX"
    },
    {
        "id": "GIF",
        "ticker": "AGVFX"
    },
    {
        "id": "NEF",
        "ticker": "ANEFX"
    },
    {
        "id": "SCWF",
        "ticker": "SMCWX"
    },
    {
        "id": "WGI",
        "ticker": "CWGIX"
    },
    {
        "id": "IGI",
        "ticker": "IGAAX"
    },
    {
        "id": "FI",
        "ticker": "ANCFX"
    },
    {
        "id": "ICA",
        "ticker": "AIVSX"
    },
    {
        "id": "IFA",
        "ticker": "AMECX"
    },
    {
        "id": "CIB",
        "ticker": "CAIBX"
    },
    {
        "id": "GBAL",
        "ticker": "GBLAX"
    },
    {
        "id": "DWGI",
        "ticker": "DWGAX"
    },
    {
        "id": "IVE",
        "ticker": "AIVFX"
    },
    {
        "id": "GFA",
        "ticker": "GFFFX"
    },
    {
        "id": "NPF",
        "ticker": "ANWFX"
    },
    {
        "id": "NWF",
        "ticker": "NFFFX"
    },
    {
        "id": "AMF",
        "ticker": "AMRFX"
    },
    {
        "id": "WMIF",
        "ticker": "WMFFX"
    },
    {
        "id": "SBF",
        "ticker": "ANBFX"
    },
    {
        "id": "BFA",
        "ticker": "ABNFX"
    },
    {
        "id": "TEBF",
        "ticker": "TEAFX"
    },
    {
        "id": "IBFA",
        "ticker": "IBAFX"
    },
    {
        "id": "LTEX",
        "ticker": "LTEFX"
    },
    {
        "id": "AHIM",
        "ticker": "AHMFX"
    },
    {
        "id": "AMCAP",
        "ticker": "AMCFX"
    },
    {
        "id": "EUPAC",
        "ticker": "AEPFX"
    },
    {
        "id": "AMBAL",
        "ticker": "AMBFX"
    },
    {
        "id": "GIF",
        "ticker": "AGVGX"
    },
    {
        "id": "NEF",
        "ticker": "NEFFX"
    },
    {
        "id": "SCWF",
        "ticker": "SMCFX"
    },
    {
        "id": "WGI",
        "ticker": "WGIFX"
    },
    {
        "id": "IGI",
        "ticker": "IGFFX"
    },
    {
        "id": "FI",
        "ticker": "FINFX"
    },
    {
        "id": "ICA",
        "ticker": "ICAFX"
    },
    {
        "id": "IFA",
        "ticker": "AMEFX"
    },
    {
        "id": "CIB",
        "ticker": "CAIFX"
    },
    {
        "id": "GBAL",
        "ticker": "GBLFX"
    },
    {
        "id": "DWGI",
        "ticker": "DWGHX"
    },
    {
        "id": "IVE",
        "ticker": "RIVGX"
    },
    {
        "id": "GFA",
        "ticker": "RGAGX"
    },
    {
        "id": "NPF",
        "ticker": "RNPGX"
    },
    {
        "id": "NWF",
        "ticker": "RNWGX"
    },
    {
        "id": "AMF",
        "ticker": "RMFGX"
    },
    {
        "id": "WMIF",
        "ticker": "RWMGX"
    },
    {
        "id": "SBF",
        "ticker": "RANGX"
    },
    {
        "id": "BFA",
        "ticker": "RBFGX"
    },
    {
        "id": "IBFA",
        "ticker": "RBOGX"
    },
    {
        "id": "AMCAP",
        "ticker": "RAFGX"
    },
    {
        "id": "EUPAC",
        "ticker": "RERGX"
    },
    {
        "id": "AMBAL",
        "ticker": "RLBGX"
    },
    {
        "id": "GIF",
        "ticker": "RGLGX"
    },
    {
        "id": "NEF",
        "ticker": "RNGGX"
    },
    {
        "id": "SCWF",
        "ticker": "RLLGX"
    },
    {
        "id": "WGI",
        "ticker": "RWIGX"
    },
    {
        "id": "IGI",
        "ticker": "RIGGX"
    },
    {
        "id": "FI",
        "ticker": "RFNGX"
    },
    {
        "id": "ICA",
        "ticker": "RICGX"
    },
    {
        "id": "IFA",
        "ticker": "RIDGX"
    },
    {
        "id": "CIB",
        "ticker": "RIRGX"
    },
    {
        "id": "GBAL",
        "ticker": "RGBGX"
    },
    {
        "id": "DWGI",
        "ticker": "RDWGX"
    },
    {
        "id": "MSI",
        "ticker": "MIAQX"
    },
    {
        "id": "MSI",
        "ticker": "MIAYX"
    },
    {
        "id": "MSI",
        "ticker": "RMDUX"
    },
]