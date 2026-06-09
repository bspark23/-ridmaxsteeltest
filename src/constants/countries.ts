const countriesWithFlagsAndCodes = [
  {
    "name": "United States",
    "dialCode": "+1",
    "emoji": "🇺🇸",
    "countryCode": "US",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Canada",
    "dialCode": "+1",
    "emoji": "🇨🇦",
    "countryCode": "CA",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Bahamas",
    "dialCode": "+1",
    "emoji": "🇧🇸",
    "countryCode": "BS",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Barbados",
    "dialCode": "+1",
    "emoji": "🇧🇧",
    "countryCode": "BB",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Anguilla",
    "dialCode": "+1",
    "emoji": "🇦🇮",
    "countryCode": "AI",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Antigua and Barbuda",
    "dialCode": "+1",
    "emoji": "🇦🇬",
    "countryCode": "AG",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Virgin Islands, British",
    "dialCode": "+1",
    "emoji": "🇻🇬",
    "countryCode": "VG",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Virgin Islands, U.S.",
    "dialCode": "+1",
    "emoji": "🇻🇮",
    "countryCode": "VI",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Bermuda",
    "dialCode": "+1",
    "emoji": "🇧🇲",
    "countryCode": "BM",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Grenada",
    "dialCode": "+1",
    "emoji": "🇬🇩",
    "countryCode": "GD",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Turks and Caicos Islands",
    "dialCode": "+1",
    "emoji": "🇹🇨",
    "countryCode": "TC",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Montserrat",
    "dialCode": "+1",
    "emoji": "🇲🇸",
    "countryCode": "MS",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Northern Mariana Islands",
    "dialCode": "+1",
    "emoji": "🇲🇵",
    "countryCode": "MP",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Guam",
    "dialCode": "+1",
    "emoji": "🇬🇺",
    "countryCode": "GU",
    "pattern": "(###) ###-####"
  },
  {
    "name": "AmericanSamoa",
    "dialCode": "+1",
    "emoji": "🇦🇸",
    "countryCode": "AS",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Saint Lucia",
    "dialCode": "+1",
    "emoji": "🇱🇨",
    "countryCode": "LC",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Dominica",
    "dialCode": "+1",
    "emoji": "🇩🇲",
    "countryCode": "DM",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "dialCode": "+1",
    "emoji": "🇻🇨",
    "countryCode": "VC",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Dominican Republic",
    "dialCode": "+1",
    "emoji": "🇩🇴",
    "countryCode": "DO",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Trinidad and Tobago",
    "dialCode": "+1",
    "emoji": "🇹🇹",
    "countryCode": "TT",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Saint Kitts and Nevis",
    "dialCode": "+1",
    "emoji": "🇰🇳",
    "countryCode": "KN",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Jamaica",
    "dialCode": "+1",
    "emoji": "🇯🇲",
    "countryCode": "JM",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Puerto Rico",
    "dialCode": "+1",
    "emoji": "🇵🇷",
    "countryCode": "PR",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Egypt",
    "dialCode": "+20",
    "emoji": "🇪🇬",
    "countryCode": "EG",
    "pattern": "### ### ####"
  },
  {
    "name": "South Sudan",
    "dialCode": "+211",
    "emoji": "🇸🇸",
    "countryCode": "SS",
    "pattern": "### ### ###"
  },
  {
    "name": "Morocco",
    "dialCode": "+212",
    "emoji": "🇲🇦",
    "countryCode": "MA",
    "pattern": "###-######"
  },
  {
    "name": "Algeria",
    "dialCode": "+213",
    "emoji": "🇩🇿",
    "countryCode": "DZ",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Tunisia",
    "dialCode": "+216",
    "emoji": "🇹🇳",
    "countryCode": "TN",
    "pattern": "## ### ###"
  },
  {
    "name": "Libyan Arab Jamahiriya",
    "dialCode": "+218",
    "emoji": "🇱🇾",
    "countryCode": "LY",
    "pattern": "##-#######"
  },
  {
    "name": "Gambia",
    "dialCode": "+220",
    "emoji": "🇬🇲",
    "countryCode": "GM",
    "pattern": "### ####"
  },
  {
    "name": "Senegal",
    "dialCode": "+221",
    "emoji": "🇸🇳",
    "countryCode": "SN",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Mauritania",
    "dialCode": "+222",
    "emoji": "🇲🇷",
    "countryCode": "MR",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Mali",
    "dialCode": "+223",
    "emoji": "🇲🇱",
    "countryCode": "ML",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Guinea",
    "dialCode": "+224",
    "emoji": "🇬🇳",
    "countryCode": "GN",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Cote d'Ivoire",
    "dialCode": "+225",
    "emoji": "🇨🇮",
    "countryCode": "CI",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Burkina Faso",
    "dialCode": "+226",
    "emoji": "🇧🇫",
    "countryCode": "BF",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Niger",
    "dialCode": "+227",
    "emoji": "🇳🇪",
    "countryCode": "NE",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Togo",
    "dialCode": "+228",
    "emoji": "🇹🇬",
    "countryCode": "TG",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Benin",
    "dialCode": "+229",
    "emoji": "🇧🇯",
    "countryCode": "BJ",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Mauritius",
    "dialCode": "+230",
    "emoji": "🇲🇺",
    "countryCode": "MU",
    "pattern": "#### ####"
  },
  {
    "name": "Liberia",
    "dialCode": "+231",
    "emoji": "🇱🇷",
    "countryCode": "LR",
    "pattern": "### ### ###"
  },
  {
    "name": "Sierra Leone",
    "dialCode": "+232",
    "emoji": "🇸🇱",
    "countryCode": "SL",
    "pattern": "## ######"
  },
  {
    "name": "Ghana",
    "dialCode": "+233",
    "emoji": "🇬🇭",
    "countryCode": "GH",
    "pattern": "## ### ####"
  },
  {
    "name": "Nigeria",
    "dialCode": "+234",
    "emoji": "🇳🇬",
    "countryCode": "NG",
    "pattern": "### ### ####"
  },
  {
    "name": "Chad",
    "dialCode": "+235",
    "emoji": "🇹🇩",
    "countryCode": "TD",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Central African Republic",
    "dialCode": "+236",
    "emoji": "🇨🇫",
    "countryCode": "CF",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Cameroon",
    "dialCode": "+237",
    "emoji": "🇨🇲",
    "countryCode": "CM",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Cape Verde",
    "dialCode": "+238",
    "emoji": "🇨🇻",
    "countryCode": "CV",
    "pattern": "### ## ##"
  },
  {
    "name": "Sao Tome and Principe",
    "dialCode": "+239",
    "emoji": "🇸🇹",
    "countryCode": "ST",
    "pattern": "### ####"
  },
  {
    "name": "Equatorial Guinea",
    "dialCode": "+240",
    "emoji": "🇬🇶",
    "countryCode": "GQ",
    "pattern": "### ### ###"
  },
  {
    "name": "Gabon",
    "dialCode": "+241",
    "emoji": "🇬🇦",
    "countryCode": "GA",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Congo",
    "dialCode": "+242",
    "emoji": "🇨🇬",
    "countryCode": "CG",
    "pattern": "## ### ####"
  },
  {
    "name": "Congo, The Democratic Republic of the Congo",
    "dialCode": "+243",
    "emoji": "🇨🇩",
    "countryCode": "CD",
    "pattern": "### ### ###"
  },
  {
    "name": "Angola",
    "dialCode": "+244",
    "emoji": "🇦🇴",
    "countryCode": "AO",
    "pattern": "### ### ###"
  },
  {
    "name": "Guinea-Bissau",
    "dialCode": "+245",
    "emoji": "🇬🇼",
    "countryCode": "GW",
    "pattern": "### ####"
  },
  {
    "name": "British Indian Ocean Territory",
    "dialCode": "+246",
    "emoji": "🇮🇴",
    "countryCode": "IO",
    "pattern": "### ####"
  },
  {
    "name": "Seychelles",
    "dialCode": "+248",
    "emoji": "🇸🇨",
    "countryCode": "SC",
    "pattern": "# ### ###"
  },
  {
    "name": "Sudan",
    "dialCode": "+249",
    "emoji": "🇸🇩",
    "countryCode": "SD",
    "pattern": ""
  },
  {
    "name": "Rwanda",
    "dialCode": "+250",
    "emoji": "🇷🇼",
    "countryCode": "RW",
    "pattern": "### ### ###"
  },
  {
    "name": "Ethiopia",
    "dialCode": "+251",
    "emoji": "🇪🇹",
    "countryCode": "ET",
    "pattern": "## ### ####"
  },
  {
    "name": "Somalia",
    "dialCode": "+252",
    "emoji": "🇸🇴",
    "countryCode": "SO",
    "pattern": "## #######"
  },
  {
    "name": "Djibouti",
    "dialCode": "+253",
    "emoji": "🇩🇯",
    "countryCode": "DJ",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Kenya",
    "dialCode": "+254",
    "emoji": "🇰🇪",
    "countryCode": "KE",
    "pattern": "## #######"
  },
  {
    "name": "Tanzania, United Republic of Tanzania",
    "dialCode": "+255",
    "emoji": "🇹🇿",
    "countryCode": "TZ",
    "pattern": "### ### ###"
  },
  {
    "name": "Uganda",
    "dialCode": "+256",
    "emoji": "🇺🇬",
    "countryCode": "UG",
    "pattern": "### ######"
  },
  {
    "name": "Burundi",
    "dialCode": "+257",
    "emoji": "🇧🇮",
    "countryCode": "BI",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Mozambique",
    "dialCode": "+258",
    "emoji": "🇲🇿",
    "countryCode": "MZ",
    "pattern": "## ### ####"
  },
  {
    "name": "Zambia",
    "dialCode": "+260",
    "emoji": "🇿🇲",
    "countryCode": "ZM",
    "pattern": "## #######"
  },
  {
    "name": "Madagascar",
    "dialCode": "+261",
    "emoji": "🇲🇬",
    "countryCode": "MG",
    "pattern": "## ## ### ##"
  },
  {
    "name": "Mayotte",
    "dialCode": "+262",
    "emoji": "🇾🇹",
    "countryCode": "YT",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Reunion",
    "dialCode": "+262",
    "emoji": "🇷🇪",
    "countryCode": "RE",
    "pattern": ""
  },
  {
    "name": "Zimbabwe",
    "dialCode": "+263",
    "emoji": "🇿🇼",
    "countryCode": "ZW",
    "pattern": "## ### ####"
  },
  {
    "name": "Namibia",
    "dialCode": "+264",
    "emoji": "🇳🇦",
    "countryCode": "NA",
    "pattern": "## ### ####"
  },
  {
    "name": "Malawi",
    "dialCode": "+265",
    "emoji": "🇲🇼",
    "countryCode": "MW",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Lesotho",
    "dialCode": "+266",
    "emoji": "🇱🇸",
    "countryCode": "LS",
    "pattern": "#### ####"
  },
  {
    "name": "Botswana",
    "dialCode": "+267",
    "emoji": "🇧🇼",
    "countryCode": "BW",
    "pattern": "## ### ###"
  },
  {
    "name": "Swaziland",
    "dialCode": "+268",
    "emoji": "🇸🇿",
    "countryCode": "SZ",
    "pattern": "#### ####"
  },
  {
    "name": "Comoros",
    "dialCode": "+269",
    "emoji": "🇰🇲",
    "countryCode": "KM",
    "pattern": "### ## ##"
  },
  {
    "name": "South Africa",
    "dialCode": "+27",
    "emoji": "🇿🇦",
    "countryCode": "ZA",
    "pattern": "## ### ####"
  },
  {
    "name": "Saint Helena, Ascension and Tristan Da Cunha",
    "dialCode": "+290",
    "emoji": "🇸🇭",
    "countryCode": "SH",
    "pattern": ""
  },
  {
    "name": "Eritrea",
    "dialCode": "+291",
    "emoji": "🇪🇷",
    "countryCode": "ER",
    "pattern": "# ### ###"
  },
  {
    "name": "Aruba",
    "dialCode": "+297",
    "emoji": "🇦🇼",
    "countryCode": "AW",
    "pattern": "### ####"
  },
  {
    "name": "Faroe Islands",
    "dialCode": "+298",
    "emoji": "🇫🇴",
    "countryCode": "FO",
    "pattern": "######"
  },
  {
    "name": "Greenland",
    "dialCode": "+299",
    "emoji": "🇬🇱",
    "countryCode": "GL",
    "pattern": "## ## ##"
  },
  {
    "name": "Greece",
    "dialCode": "+30",
    "emoji": "🇬🇷",
    "countryCode": "GR",
    "pattern": "### ### ####"
  },
  {
    "name": "Netherlands",
    "dialCode": "+31",
    "emoji": "🇳🇱",
    "countryCode": "NL",
    "pattern": "# ########"
  },
  {
    "name": "Belgium",
    "dialCode": "+32",
    "emoji": "🇧🇪",
    "countryCode": "BE",
    "pattern": "### ## ## ##"
  },
  {
    "name": "France",
    "dialCode": "+33",
    "emoji": "🇫🇷",
    "countryCode": "FR",
    "pattern": "# ## ## ## ##"
  },
  {
    "name": "Spain",
    "dialCode": "+34",
    "emoji": "🇪🇸",
    "countryCode": "ES",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Cayman Islands",
    "dialCode": "+1",
    "emoji": "🇰🇾",
    "countryCode": "KY",
    "pattern": "(###) ###-####"
  },
  {
    "name": "Gibraltar",
    "dialCode": "+350",
    "emoji": "🇬🇮",
    "countryCode": "GI",
    "pattern": "### #####"
  },
  {
    "name": "Portugal",
    "dialCode": "+351",
    "emoji": "🇵🇹",
    "countryCode": "PT",
    "pattern": "### ### ###"
  },
  {
    "name": "Luxembourg",
    "dialCode": "+352",
    "emoji": "🇱🇺",
    "countryCode": "LU",
    "pattern": "## ## ## ###"
  },
  {
    "name": "Ireland",
    "dialCode": "+353",
    "emoji": "🇮🇪",
    "countryCode": "IE",
    "pattern": "## ### ####"
  },
  {
    "name": "Iceland",
    "dialCode": "+354",
    "emoji": "🇮🇸",
    "countryCode": "IS",
    "pattern": "### ####"
  },
  {
    "name": "Albania",
    "dialCode": "+355",
    "emoji": "🇦🇱",
    "countryCode": "AL",
    "pattern": "## ### ####"
  },
  {
    "name": "Malta",
    "dialCode": "+356",
    "emoji": "🇲🇹",
    "countryCode": "MT",
    "pattern": "#### ####"
  },
  {
    "name": "Cyprus",
    "dialCode": "+357",
    "emoji": "🇨🇾",
    "countryCode": "CY",
    "pattern": ""
  },
  {
    "name": "Finland",
    "dialCode": "+358",
    "emoji": "🇫🇮",
    "countryCode": "FI",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Aland Islands",
    "dialCode": "+358",
    "emoji": "🇦🇽",
    "countryCode": "AX",
    "pattern": ""
  },
  {
    "name": "Bulgaria",
    "dialCode": "+359",
    "emoji": "🇧🇬",
    "countryCode": "BG",
    "pattern": "### ### ##"
  },
  {
    "name": "Hungary",
    "dialCode": "+36",
    "emoji": "🇭🇺",
    "countryCode": "HU",
    "pattern": "## ### ####"
  },
  {
    "name": "Lithuania",
    "dialCode": "+370",
    "emoji": "🇱🇹",
    "countryCode": "LT",
    "pattern": "### #####"
  },
  {
    "name": "Latvia",
    "dialCode": "+371",
    "emoji": "🇱🇻",
    "countryCode": "LV",
    "pattern": "## ### ###"
  },
  {
    "name": "Estonia",
    "dialCode": "+372",
    "emoji": "🇪🇪",
    "countryCode": "EE",
    "pattern": "#### ####"
  },
  {
    "name": "Moldova",
    "dialCode": "+373",
    "emoji": "🇲🇩",
    "countryCode": "MD",
    "pattern": "### ## ###"
  },
  {
    "name": "Armenia",
    "dialCode": "+374",
    "emoji": "🇦🇲",
    "countryCode": "AM",
    "pattern": "## ######"
  },
  {
    "name": "Belarus",
    "dialCode": "+375",
    "emoji": "🇧🇾",
    "countryCode": "BY",
    "pattern": "## ###-##-##"
  },
  {
    "name": "Andorra",
    "dialCode": "+376",
    "emoji": "🇦🇩",
    "countryCode": "AD",
    "pattern": "### ###"
  },
  {
    "name": "Monaco",
    "dialCode": "+377",
    "emoji": "🇲🇨",
    "countryCode": "MC",
    "pattern": "# ## ## ## ##"
  },
  {
    "name": "San Marino",
    "dialCode": "+378",
    "emoji": "🇸🇲",
    "countryCode": "SM",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Holy See (Vatican City State)",
    "dialCode": "+379",
    "emoji": "🇻🇦",
    "countryCode": "VA",
    "pattern": ""
  },
  {
    "name": "Ukraine",
    "dialCode": "+380",
    "emoji": "🇺🇦",
    "countryCode": "UA",
    "pattern": "## ### ####"
  },
  {
    "name": "Serbia",
    "dialCode": "+381",
    "emoji": "🇷🇸",
    "countryCode": "RS",
    "pattern": "## #######"
  },
  {
    "name": "Montenegro",
    "dialCode": "+382",
    "emoji": "🇲🇪",
    "countryCode": "ME",
    "pattern": "## ### ###"
  },
  {
    "name": "Croatia",
    "dialCode": "+385",
    "emoji": "🇭🇷",
    "countryCode": "HR",
    "pattern": "## ### ####"
  },
  {
    "name": "Slovenia",
    "dialCode": "+386",
    "emoji": "🇸🇮",
    "countryCode": "SI",
    "pattern": "## ### ###"
  },
  {
    "name": "Bosnia and Herzegovina",
    "dialCode": "+387",
    "emoji": "🇧🇦",
    "countryCode": "BA",
    "pattern": "## ###-###"
  },
  {
    "name": "Macedonia",
    "dialCode": "+389",
    "emoji": "🇲🇰",
    "countryCode": "MK",
    "pattern": "## ### ###"
  },
  {
    "name": "Italy",
    "dialCode": "+39",
    "emoji": "🇮🇹",
    "countryCode": "IT",
    "pattern": "## #### ####"
  },
  {
    "name": "Romania",
    "dialCode": "+40",
    "emoji": "🇷🇴",
    "countryCode": "RO",
    "pattern": "## ### ####"
  },
  {
    "name": "Switzerland",
    "dialCode": "+41",
    "emoji": "🇨🇭",
    "countryCode": "CH",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Czech Republic",
    "dialCode": "+420",
    "emoji": "🇨🇿",
    "countryCode": "CZ",
    "pattern": "### ### ###"
  },
  {
    "name": "Slovakia",
    "dialCode": "+421",
    "emoji": "🇸🇰",
    "countryCode": "SK",
    "pattern": "### ### ###"
  },
  {
    "name": "Liechtenstein",
    "dialCode": "+423",
    "emoji": "🇱🇮",
    "countryCode": "LI",
    "pattern": "### ### ###"
  },
  {
    "name": "Austria",
    "dialCode": "+43",
    "emoji": "🇦🇹",
    "countryCode": "AT",
    "pattern": "### ######"
  },
  {
    "name": "Jersey",
    "dialCode": "+44",
    "emoji": "🇯🇪",
    "countryCode": "JE",
    "pattern": "#### ######"
  },
  {
    "name": "Isle of Man",
    "dialCode": "+44",
    "emoji": "🇮🇲",
    "countryCode": "IM",
    "pattern": "#### ######"
  },
  {
    "name": "United Kingdom",
    "dialCode": "+44",
    "emoji": "🇬🇧",
    "countryCode": "GB",
    "pattern": "#### ######"
  },
  {
    "name": "Guernsey",
    "dialCode": "+44",
    "emoji": "🇬🇬",
    "countryCode": "GG",
    "pattern": "#### ######"
  },
  {
    "name": "Denmark",
    "dialCode": "+45",
    "emoji": "🇩🇰",
    "countryCode": "DK",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Sweden",
    "dialCode": "+46",
    "emoji": "🇸🇪",
    "countryCode": "SE",
    "pattern": "##-### ## ##"
  },
  {
    "name": "Svalbard and Jan Mayen",
    "dialCode": "+47",
    "emoji": "🇸🇯",
    "countryCode": "SJ",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Norway",
    "dialCode": "+47",
    "emoji": "🇳🇴",
    "countryCode": "NO",
    "pattern": "### ## ###"
  },
  {
    "name": "Poland",
    "dialCode": "+48",
    "emoji": "🇵🇱",
    "countryCode": "PL",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Germany",
    "dialCode": "+49",
    "emoji": "🇩🇪",
    "countryCode": "DE",
    "pattern": "### #######"
  },
  {
    "name": "South Georgia and the South Sandwich Islands",
    "dialCode": "+500",
    "emoji": "🇬🇸",
    "countryCode": "GS",
    "pattern": ""
  },
  {
    "name": "Falkland Islands (Malvinas)",
    "dialCode": "+500",
    "emoji": "🇫🇰",
    "countryCode": "FK",
    "pattern": ""
  },
  {
    "name": "Belize",
    "dialCode": "+501",
    "emoji": "🇧🇿",
    "countryCode": "BZ",
    "pattern": "###-####"
  },
  {
    "name": "Guatemala",
    "dialCode": "+502",
    "emoji": "🇬🇹",
    "countryCode": "GT",
    "pattern": "#### ####"
  },
  {
    "name": "El Salvador",
    "dialCode": "+503",
    "emoji": "🇸🇻",
    "countryCode": "SV",
    "pattern": "#### ####"
  },
  {
    "name": "Honduras",
    "dialCode": "+504",
    "emoji": "🇭🇳",
    "countryCode": "HN",
    "pattern": "####-####"
  },
  {
    "name": "Nicaragua",
    "dialCode": "+505",
    "emoji": "🇳🇮",
    "countryCode": "NI",
    "pattern": "#### ####"
  },
  {
    "name": "Costa Rica",
    "dialCode": "+506",
    "emoji": "🇨🇷",
    "countryCode": "CR",
    "pattern": "#### ####"
  },
  {
    "name": "Panama",
    "dialCode": "+507",
    "emoji": "🇵🇦",
    "countryCode": "PA",
    "pattern": "####-####"
  },
  {
    "name": "Saint Pierre and Miquelon",
    "dialCode": "+508",
    "emoji": "🇵🇲",
    "countryCode": "PM",
    "pattern": "## ## ##"
  },
  {
    "name": "Haiti",
    "dialCode": "+509",
    "emoji": "🇭🇹",
    "countryCode": "HT",
    "pattern": "## ## ####"
  },
  {
    "name": "Peru",
    "dialCode": "+51",
    "emoji": "🇵🇪",
    "countryCode": "PE",
    "pattern": "### ### ###"
  },
  {
    "name": "Mexico",
    "dialCode": "+52",
    "emoji": "🇲🇽",
    "countryCode": "MX",
    "pattern": "### ### ### ####"
  },
  {
    "name": "Cuba",
    "dialCode": "+53",
    "emoji": "🇨🇺",
    "countryCode": "CU",
    "pattern": ""
  },
  {
    "name": "Argentina",
    "dialCode": "+54",
    "emoji": "🇦🇷",
    "countryCode": "AR",
    "pattern": "## ##-####-####"
  },
  {
    "name": "Brazil",
    "dialCode": "+55",
    "emoji": "🇧🇷",
    "countryCode": "BR",
    "pattern": "## #####-####"
  },
  {
    "name": "Chile",
    "dialCode": "+56",
    "emoji": "🇨🇱",
    "countryCode": "CL",
    "pattern": "# #### ####"
  },
  {
    "name": "Colombia",
    "dialCode": "+57",
    "emoji": "🇨🇴",
    "countryCode": "CO",
    "pattern": "### #######"
  },
  {
    "name": "Venezuela, Bolivarian Republic of Venezuela",
    "dialCode": "+58",
    "emoji": "🇻🇪",
    "countryCode": "VE",
    "pattern": "###-#######"
  },
  {
    "name": "Guadeloupe",
    "dialCode": "+590",
    "emoji": "🇬🇵",
    "countryCode": "GP",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Saint Martin",
    "dialCode": "+590",
    "emoji": "🇲🇫",
    "countryCode": "MF",
    "pattern": ""
  },
  {
    "name": "Saint Barthelemy",
    "dialCode": "+590",
    "emoji": "🇧🇱",
    "countryCode": "BL",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Bolivia, Plurinational State of",
    "dialCode": "+591",
    "emoji": "🇧🇴",
    "countryCode": "BO",
    "pattern": "########"
  },
  {
    "name": "Ecuador",
    "dialCode": "+593",
    "emoji": "🇪🇨",
    "countryCode": "EC",
    "pattern": "## ### ####"
  },
  {
    "name": "French Guiana",
    "dialCode": "+594",
    "emoji": "🇬🇫",
    "countryCode": "GF",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Guyana",
    "dialCode": "+592",
    "emoji": "🇬🇾",
    "countryCode": "GY",
    "pattern": "### ####"
  },
  {
    "name": "Paraguay",
    "dialCode": "+595",
    "emoji": "🇵🇾",
    "countryCode": "PY",
    "pattern": "## #######"
  },
  {
    "name": "Martinique",
    "dialCode": "+596",
    "emoji": "🇲🇶",
    "countryCode": "MQ",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Suriname",
    "dialCode": "+597",
    "emoji": "🇸🇷",
    "countryCode": "SR",
    "pattern": "###-####"
  },
  {
    "name": "Uruguay",
    "dialCode": "+598",
    "emoji": "🇺🇾",
    "countryCode": "UY",
    "pattern": "#### ####"
  },
  {
    "name": "Netherlands Antilles",
    "dialCode": "+599",
    "emoji": "🇧🇶",
    "countryCode": "AN",
    "pattern": ""
  },
  {
    "name": "Malaysia",
    "dialCode": "+60",
    "emoji": "🇲🇾",
    "countryCode": "MY",
    "pattern": "##-### ####"
  },
  {
    "name": "Christmas Island",
    "dialCode": "+61",
    "emoji": "🇨🇽",
    "countryCode": "CX",
    "pattern": ""
  },
  {
    "name": "Cocos (Keeling) Islands",
    "dialCode": "+61",
    "emoji": "🇨🇨",
    "countryCode": "CC",
    "pattern": ""
  },
  {
    "name": "Australia",
    "dialCode": "+61",
    "emoji": "🇦🇺",
    "countryCode": "AU",
    "pattern": "### ### ###"
  },
  {
    "name": "Indonesia",
    "dialCode": "+62",
    "emoji": "🇮🇩",
    "countryCode": "ID",
    "pattern": "###-###-###"
  },
  {
    "name": "Philippines",
    "dialCode": "+63",
    "emoji": "🇵🇭",
    "countryCode": "PH",
    "pattern": "#### ######"
  },
  {
    "name": "New Zealand",
    "dialCode": "+64",
    "emoji": "🇳🇿",
    "countryCode": "NZ",
    "pattern": "## ### ####"
  },
  {
    "name": "Singapore",
    "dialCode": "+65",
    "emoji": "🇸🇬",
    "countryCode": "SG",
    "pattern": "#### ####"
  },
  {
    "name": "Thailand",
    "dialCode": "+66",
    "emoji": "🇹🇭",
    "countryCode": "TH",
    "pattern": "## ### ####"
  },
  {
    "name": "Timor-Leste",
    "dialCode": "+670",
    "emoji": "🇹🇱",
    "countryCode": "TL",
    "pattern": "#### ####"
  },
  {
    "name": "Norfolk Island",
    "dialCode": "+672",
    "emoji": "🇳🇫",
    "countryCode": "NF",
    "pattern": ""
  },
  {
    "name": "Antarctica",
    "dialCode": "+672",
    "emoji": "🇦🇶",
    "countryCode": "AQ",
    "pattern": "## ####"
  },
  {
    "name": "Brunei Darussalam",
    "dialCode": "+673",
    "emoji": "🇧🇳",
    "countryCode": "BN",
    "pattern": "### ####"
  },
  {
    "name": "Nauru",
    "dialCode": "+674",
    "emoji": "🇳🇷",
    "countryCode": "NR",
    "pattern": "### ####"
  },
  {
    "name": "Papua New Guinea",
    "dialCode": "+675",
    "emoji": "🇵🇬",
    "countryCode": "PG",
    "pattern": "### ####"
  },
  {
    "name": "Tonga",
    "dialCode": "+676",
    "emoji": "🇹🇴",
    "countryCode": "TO",
    "pattern": "### ####"
  },
  {
    "name": "Solomon Islands",
    "dialCode": "+677",
    "emoji": "🇸🇧",
    "countryCode": "SB",
    "pattern": "### ####"
  },
  {
    "name": "Vanuatu",
    "dialCode": "+678",
    "emoji": "🇻🇺",
    "countryCode": "VU",
    "pattern": "### ####"
  },
  {
    "name": "Fiji",
    "dialCode": "+679",
    "emoji": "🇫🇯",
    "countryCode": "FJ",
    "pattern": "### ####"
  },
  {
    "name": "Palau",
    "dialCode": "+680",
    "emoji": "🇵🇼",
    "countryCode": "PW",
    "pattern": ""
  },
  {
    "name": "Wallis and Futuna",
    "dialCode": "+681",
    "emoji": "🇼🇫",
    "countryCode": "WF",
    "pattern": "## ## ##"
  },
  {
    "name": "Cook Islands",
    "dialCode": "+682",
    "emoji": "🇨🇰",
    "countryCode": "CK",
    "pattern": "## ###"
  },
  {
    "name": "Niue",
    "dialCode": "+683",
    "emoji": "🇳🇺",
    "countryCode": "NU",
    "pattern": ""
  },
  {
    "name": "Samoa",
    "dialCode": "+685",
    "emoji": "🇼🇸",
    "countryCode": "WS",
    "pattern": ""
  },
  {
    "name": "Kiribati",
    "dialCode": "+686",
    "emoji": "🇰🇮",
    "countryCode": "KI",
    "pattern": ""
  },
  {
    "name": "New Caledonia",
    "dialCode": "+687",
    "emoji": "🇳🇨",
    "countryCode": "NC",
    "pattern": "########"
  },
  {
    "name": "Tuvalu",
    "dialCode": "+688",
    "emoji": "🇹🇻",
    "countryCode": "TV",
    "pattern": ""
  },
  {
    "name": "French Polynesia",
    "dialCode": "+689",
    "emoji": "🇵🇫",
    "countryCode": "PF",
    "pattern": "## ## ##"
  },
  {
    "name": "Tokelau",
    "dialCode": "+690",
    "emoji": "🇹🇰",
    "countryCode": "TK",
    "pattern": ""
  },
  {
    "name": "Micronesia, Federated States of Micronesia",
    "dialCode": "+691",
    "emoji": "🇫🇲",
    "countryCode": "FM",
    "pattern": ""
  },
  {
    "name": "Marshall Islands",
    "dialCode": "+692",
    "emoji": "🇲🇭",
    "countryCode": "MH",
    "pattern": ""
  },
  {
    "name": "Russia",
    "dialCode": "+7",
    "emoji": "🇷🇺",
    "countryCode": "RU",
    "pattern": "### ###-##-##"
  },
  {
    "name": "Kazakhstan",
    "dialCode": "+7",
    "emoji": "🇰🇿",
    "countryCode": "KZ",
    "pattern": ""
  },
  {
    "name": "Japan",
    "dialCode": "+81",
    "emoji": "🇯🇵",
    "countryCode": "JP",
    "pattern": "##-####-####"
  },
  {
    "name": "Korea, Republic of South Korea",
    "dialCode": "+82",
    "emoji": "🇰🇷",
    "countryCode": "KR",
    "pattern": "##-####-####"
  },
  {
    "name": "Vietnam",
    "dialCode": "+84",
    "emoji": "🇻🇳",
    "countryCode": "VN",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Korea, Democratic People's Republic of Korea",
    "dialCode": "+850",
    "emoji": "🇰🇵",
    "countryCode": "KP",
    "pattern": ""
  },
  {
    "name": "Hong Kong",
    "dialCode": "+852",
    "emoji": "🇭🇰",
    "countryCode": "HK",
    "pattern": "#### ####"
  },
  {
    "name": "Macao",
    "dialCode": "+853",
    "emoji": "🇲🇴",
    "countryCode": "MO",
    "pattern": "#### ####"
  },
  {
    "name": "Cambodia",
    "dialCode": "+855",
    "emoji": "🇰🇭",
    "countryCode": "KH",
    "pattern": "## ### ###"
  },
  {
    "name": "Laos",
    "dialCode": "+856",
    "emoji": "🇱🇦",
    "countryCode": "LA",
    "pattern": "## ## ### ###"
  },
  {
    "name": "China",
    "dialCode": "+86",
    "emoji": "🇨🇳",
    "countryCode": "CN",
    "pattern": "### #### ####"
  },
  {
    "name": "Pitcairn",
    "dialCode": "+872",
    "emoji": "🇵🇳",
    "countryCode": "PN",
    "pattern": ""
  },
  {
    "name": "Bangladesh",
    "dialCode": "+880",
    "emoji": "🇧🇩",
    "countryCode": "BD",
    "pattern": "####-######"
  },
  {
    "name": "Taiwan",
    "dialCode": "+886",
    "emoji": "🇹🇼",
    "countryCode": "TW",
    "pattern": "### ### ###"
  },
  {
    "name": "Turkey",
    "dialCode": "+90",
    "emoji": "🇹🇷",
    "countryCode": "TR",
    "pattern": "### ### ####"
  },
  {
    "name": "India",
    "dialCode": "+91",
    "emoji": "🇮🇳",
    "countryCode": "IN",
    "pattern": "## ## ######"
  },
  {
    "name": "Pakistan",
    "dialCode": "+92",
    "emoji": "🇵🇰",
    "countryCode": "PK",
    "pattern": "### #######"
  },
  {
    "name": "Afghanistan",
    "dialCode": "+93",
    "emoji": "🇦🇫",
    "countryCode": "AF",
    "pattern": "## ### ####"
  },
  {
    "name": "Sri Lanka",
    "dialCode": "+94",
    "emoji": "🇱🇰",
    "countryCode": "LK",
    "pattern": "## # ######"
  },
  {
    "name": "Myanmar",
    "dialCode": "+95",
    "emoji": "🇲🇲",
    "countryCode": "MM",
    "pattern": "# ### ####"
  },
  {
    "name": "Maldives",
    "dialCode": "+960",
    "emoji": "🇲🇻",
    "countryCode": "MV",
    "pattern": "###-####"
  },
  {
    "name": "Lebanon",
    "dialCode": "+961",
    "emoji": "🇱🇧",
    "countryCode": "LB",
    "pattern": "## ### ###"
  },
  {
    "name": "Jordan",
    "dialCode": "+962",
    "emoji": "🇯🇴",
    "countryCode": "JO",
    "pattern": "# #### ####"
  },
  {
    "name": "Syrian Arab Republic",
    "dialCode": "+963",
    "emoji": "🇸🇾",
    "countryCode": "SY",
    "pattern": ""
  },
  {
    "name": "Iraq",
    "dialCode": "+964",
    "emoji": "🇮🇷",
    "countryCode": "IQ",
    "pattern": "### ### ####"
  },
  {
    "name": "Kuwait",
    "dialCode": "+965",
    "emoji": "🇰🇼",
    "countryCode": "KW",
    "pattern": "### #####"
  },
  {
    "name": "Saudi Arabia",
    "dialCode": "+966",
    "emoji": "🇸🇦",
    "countryCode": "SA",
    "pattern": "## ### ####"
  },
  {
    "name": "Yemen",
    "dialCode": "+967",
    "emoji": "🇾🇪",
    "countryCode": "YE",
    "pattern": "### ### ###"
  },
  {
    "name": "Oman",
    "dialCode": "+968",
    "emoji": "🇴🇲",
    "countryCode": "OM",
    "pattern": "#### ####"
  },
  {
    "name": "Palestinian Territory, Occupied",
    "dialCode": "+970",
    "emoji": "🇵🇸",
    "countryCode": "PS",
    "pattern": "### ### ###"
  },
  {
    "name": "United Arab Emirates",
    "dialCode": "+971",
    "emoji": "🇦🇪",
    "countryCode": "AE",
    "pattern": "## ### ####"
  },
  {
    "name": "Israel",
    "dialCode": "+972",
    "emoji": "🇮🇱",
    "countryCode": "IL",
    "pattern": "##-###-####"
  },
  {
    "name": "Bahrain",
    "dialCode": "+973",
    "emoji": "🇧🇭",
    "countryCode": "BH",
    "pattern": "#### ####"
  },
  {
    "name": "Qatar",
    "dialCode": "+974",
    "emoji": "🇶🇦",
    "countryCode": "QA",
    "pattern": "#### ####"
  },
  {
    "name": "Bhutan",
    "dialCode": "+975",
    "emoji": "🇧🇹",
    "countryCode": "BT",
    "pattern": "## ## ## ##"
  },
  {
    "name": "Mongolia",
    "dialCode": "+976",
    "emoji": "🇲🇳",
    "countryCode": "MN",
    "pattern": "#### ####"
  },
  {
    "name": "Nepal",
    "dialCode": "+977",
    "emoji": "🇳🇵",
    "countryCode": "NP",
    "pattern": "###-#######"
  },
  {
    "name": "Iran, Islamic Republic of Persian Gulf",
    "dialCode": "+98",
    "emoji": "🇮🇷",
    "countryCode": "IR",
    "pattern": ""
  },
  {
    "name": "Tajikistan",
    "dialCode": "+992",
    "emoji": "🇹🇯",
    "countryCode": "TJ",
    "pattern": "### ## ####"
  },
  {
    "name": "Turkmenistan",
    "dialCode": "+993",
    "emoji": "🇹🇲",
    "countryCode": "TM",
    "pattern": "## ##-##-##"
  },
  {
    "name": "Azerbaijan",
    "dialCode": "+994",
    "emoji": "🇦🇿",
    "countryCode": "AZ",
    "pattern": "## ### ## ##"
  },
  {
    "name": "Georgia",
    "dialCode": "+995",
    "emoji": "🇬🇪",
    "countryCode": "GE",
    "pattern": "### ## ## ##"
  },
  {
    "name": "Kyrgyzstan",
    "dialCode": "+996",
    "emoji": "🇰🇬",
    "countryCode": "KG",
    "pattern": "### ### ###"
  },
  {
    "name": "Uzbekistan",
    "dialCode": "+998",
    "emoji": "🇺🇿",
    "countryCode": "UZ",
    "pattern": "## ### ## ##"
  }
];
export default countriesWithFlagsAndCodes;