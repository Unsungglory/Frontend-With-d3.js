const names = [
    { name: "Afghanistan", value: "Afghanistan" },
    { name: "Angola", value: "Angola" },
    { name: "Albania", value: "Albania" },
    { name: "United Arab Emirates", value: "United Arab Emirates" },
    { name: "Argentina", value: "Argentina" },
    { name: "Armenia", value: "Armenia" },
    { name: "Antarctica", value: "Antarctica" },
    { name: "French Southern and Antarctic Lands", value: "French Southern and Antarctic Lands" },
    { name: "Australia", value: "Australia" },
    { name: "Austria", value: "Austria" },
    { name: "Azerbaijan", value: "Azerbaijan" },
    { name: "Burundi", value: "Burundi" },
    { name: "Belgium", value: "Belgium" },
    { name: "Benin", value: "Benin" },
    { name: "Burkina Faso", value: "Burkina Faso" },
    { name: "Bangladesh", value: "Bangladesh" },
    { name: "Bulgaria", value: "Bulgaria" },
    { name: "The Bahamas", value: "The Bahamas" },
    { name: "Bosnia and Herzegovina", value: "Bosnia and Herzegovina" },
    { name: "Belarus", value: "Belarus" },
    { name: "Belize", value: "Belize" },
    { name: "Bolivia", value: "Bolivia" },
    { name: "Brazil", value: "Brazil" },
    { name: "Brunei", value: "Brunei" },
    { name: "Bhutan", value: "Bhutan" },
    { name: "Botswana", value: "Botswana" },
    { name: "Central African Republic", value: "Central African Republic" },
    { name: "Canada", value: "Canada" },
    { name: "Switzerland", value: "Switzerland" },
    { name: "Chile", value: "Chile" },
    { name: "China", value: "China" },
    { name: "Ivory Coast", value: "Ivory Coast" },
    { name: "Cameroon", value: "Cameroon" },
    { name: "Democratic Republic of the Congo", value: "Democratic Republic of the Congo" },
    { name: "Republic of the Congo", value: "Republic of the Congo" },
    { name: "Colombia", value: "Colombia" },
    { name: "Costa Rica", value: "Costa Rica" },
    { name: "Cuba", value: "Cuba" },
    { name: "Northern Cyprus", value: "Northern Cyprus" },
    { name: "Cyprus", value: "Cyprus" },
    { name: "Czech Republic", value: "Czech Republic" },
    { name: "Germany", value: "Germany" },
    { name: "Djibouti", value: "Djibouti" },
    { name: "Denmark", value: "Denmark" },
    { name: "Dominican Republic", value: "Dominican Republic" },
    { name: "Algeria", value: "Algeria" },
    { name: "Ecuador", value: "Ecuador" },
    { name: "Egypt", value: "Egypt" },
    { name: "Eritrea", value: "Eritrea" },
    { name: "Spain", value: "Spain" },
    { name: "Estonia", value: "Estonia" },
    { name: "Ethiopia", value: "Ethiopia" },
    { name: "Finland", value: "Finland" },
    { name: "Fiji", value: "Fiji" },
    { name: "Falkland Islands", value: "Falkland Islands" },
    { name: "France", value: "France" },
    { name: "Gabon", value: "Gabon" },
    { name: "United Kingdom", value: "England" },
    { name: "Georgia", value: "Georgia" },
    { name: "Ghana", value: "Ghana" },
    { name: "Guinea", value: "Guinea" },
    { name: "Gambia", value: "Gambia" },
    { name: "Guinea Bissau", value: "Guinea Bissau" },
    { name: "Equatorial Guinea", value: "Equatorial Guinea" },
    { name: "Greece", value: "Greece" },
    { name: "Greenland", value: "Greenland" },
    { name: "Guatemala", value: "Guatemala" },
    { name: "Guyana", value: "Guyana" },
    { name: "Honduras", value: "Honduras" },
    { name: "Croatia", value: "Croatia" },
    { name: "Haiti", value: "Haiti" },
    { name: "Hungary", value: "Hungary" },
    { name: "Indonesia", value: "Indonesia" },
    { name: "India", value: "India" },
    { name: "Ireland", value: "Ireland" },
    { name: "Iran", value: "Iran" },
    { name: "Iraq", value: "Iraq" },
    { name: "Iceland", value: "Iceland" },
    { name: "Israel", value: "Israel" },
    { name: "Italy", value: "Italy" },
    { name: "Jamaica", value: "Jamaica" },
    { name: "Jordan", value: "Jordan" },
    { name: "Japan", value: "Japan" },
    { name: "Kazakhstan", value: "Kazakhstan" },
    { name: "Kenya", value: "Kenya" },
    { name: "Kyrgyzstan", value: "Kyrgyzstan" },
    { name: "Cambodia", value: "Cambodia" },
    { name: "South Korea", value: "South Korea" },
    { name: "Kosovo", value: "Kosovo" },
    { name: "Kuwait", value: "Kuwait" },
    { name: "Laos", value: "Laos" },
    { name: "Lebanon", value: "Lebanon" },
    { name: "Liberia", value: "Liberia" },
    { name: "Libya", value: "Libya" },
    { name: "Sri Lanka", value: "Sri Lanka" },
    { name: "Lesotho", value: "Lesotho" },
    { name: "Lithuania", value: "Lithuania" },
    { name: "Luxembourg", value: "Luxembourg" },
    { name: "Latvia", value: "Latvia" },
    { name: "Morocco", value: "Morocco" },
    { name: "Moldova", value: "Moldova" },
    { name: "Madagascar", value: "Madagascar" },
    { name: "Mexico", value: "Mexico" },
    { name: "Macedonia", value: "Macedonia" },
    { name: "Mali", value: "Mali" },
    { name: "Myanmar", value: "Myanmar" },
    { name: "Montenegro", value: "Montenegro" },
    { name: "Mongolia", value: "Mongolia" },
    { name: "Mozambique", value: "Mozambique" },
    { name: "Mauritania", value: "Mauritania" },
    { name: "Malawi", value: "Malawi" },
    { name: "Malaysia", value: "Malaysia" },
    { name: "Namibia", value: "Namibia" },
    { name: "New Caledonia", value: "New Caledonia" },
    { name: "Niger", value: "Niger" },
    { name: "Nigeria", value: "Nigeria" },
    { name: "Nicaragua", value: "Nicaragua" },
    { name: "Netherlands", value: "Netherlands" },
    { name: "Norway", value: "Norway" },
    { name: "Nepal", value: "Nepal" },
    { name: "New Zealand", value: "New Zealand" },
    { name: "Oman", value: "Oman" },
    { name: "Pakistan", value: "Pakistan" },
    { name: "Panama", value: "Panama" },
    { name: "Peru", value: "Peru" },
    { name: "Philippines", value: "Philippines" },
    { name: "Papua New Guinea", value: "Papua New Guinea" },
    { name: "Poland", value: "Poland" },
    { name: "Puerto Rico", value: "Puerto Rico" },
    { name: "North Korea", value: "North Korea" },
    { name: "Portugal", value: "Portugal" },
    { name: "Paraguay", value: "Paraguay" },
    { name: "Qatar", value: "Qatar" },
    { name: "Romania", value: "Romania" },
    { name: "Russia", value: "Russia" },
    { name: "Rwanda", value: "Rwanda" },
    { name: "Western Sahara", value: "Western Sahara" },
    { name: "Saudi Arabia", value: "Saudi Arabia" },
    { name: "Sudan", value: "Sudan" },
    { name: "South Sudan", value: "South Sudan" },
    { name: "Senegal", value: "Senegal" },
    { name: "Solomon Islands", value: "Solomon Islands" },
    { name: "Sierra Leone", value: "Sierra Leone" },
    { name: "El Salvador", value: "El Salvador" },
    { name: "Somaliland", value: "Somaliland" },
    { name: "Somalia", value: "Somalia" },
    { name: "Republic of Serbia", value: "Republic of Serbia" },
    { name: "Suriname", value: "Suriname" },
    { name: "Slovakia", value: "Slovakia" },
    { name: "Slovenia", value: "Slovenia" },
    { name: "Sweden", value: "Sweden" },
    { name: "Swaziland", value: "Swaziland" },
    { name: "Syria", value: "Syria" },
    { name: "Chad", value: "Chad" },
    { name: "Togo", value: "Togo" },
    { name: "Thailand", value: "Thailand" },
    { name: "Tajikistan", value: "Tajikistan" },
    { name: "Turkmenistan", value: "Turkmenistan" },
    { name: "East Timor", value: "East Timor" },
    { name: "Trinidad and Tobago", value: "Trinidad and Tobago" },
    { name: "Tunisia", value: "Tunisia" },
    { name: "Turkey", value: "Turkey" },
    { name: "Taiwan", value: "Taiwan" },
    { name: "United Republic of Tanzania", value: "United Republic of Tanzania" },
    { name: "Uganda", value: "Uganda" },
    { name: "Ukraine", value: "Ukraine" },
    { name: "Uruguay", value: "Uruguay" },
    { name: "United States", value: "USA" },
    { name: "Uzbekistan", value: "Uzbekistan" },
    { name: "Venezuela", value: "Venezuela" },
    { name: "Vietnam", value: "Vietnam" },
    { name: "Vanuatu", value: "Vanuatu" },
    { name: "West Bank", value: "West Bank" },
    { name: "Yemen", value: "Yemen" },
    { name: "South Africa", value: "South Africa" },
    { name: "Zambia", value: "Zambia" },
    { name: "Zimbabwe", value: "Zimbabwe" },

]