export const columnHeaders = [
  "Ref no",
  "Request",
  "Expires",
  "Product Type",
  "Issuing Bank",
  "Beneficiary",
  "applicant",
  "Amount",
  "Bids",
];

// export const bankColumnHeaders = [
//   "Deal Received",
//   "Expires",
//   "Product Type",
//   "LC Issuing Bank",
//   "Beneficiary",
//   "LC applicant",
//   "LC Amount",
//   "Bids",
// ];

export const bankColumnHeaders = [
  { name: "Deals Id", key: "refId" },
  // { name: "Swift Code", key: "createdBy.swiftCode" },
  { name: "Deal Received", key: "lcPeriod.startDate" },
  { name: "Expires", key: "lcPeriod.endDate" },
  { name: "Product Type", key: "lcType" },
  { name: "Issuing Bank", key: "issuingBank.bank" },
  { name: "Country", key: "issuingBank.country" },
  { name: "Beneficiary", key: "exporterInfo.beneficiaryName" },
  { name: "applicant", key: "importerInfo.applicantName" },
  { name: "Amount", key: "amount" },
  { name: "Bids", key: "bids" },
];

export const myBidsColumnHeaders = [
  "Date Submitted",
  "Country of issuing bank",
  "Confirmation Rate",
  "Discounting Rate",
  "Discount Margin",
  "Minimum Charges",
  "Bid Status",
];

export const bankCountries = [
  {
    name: "United Arab Emirates",
    isoCode: "AE",
    flag: "🇦🇪",
    cities: [
      "Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", 
      "Fujairah", "Umm Al Quwain", "Khor Fakkan", "Kalba", "Dibba Al-Fujairah", 
      "Dibba Al-Hisn", "Jebel Ali", "Hatta", "Al Dhaid"
    ]
  },
  {
    name: "Saudi Arabia",
    isoCode: "SA",
    flag: "🇸🇦",
    cities: [
      "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", 
      "Dhahran", "Tabuk", "Buraidah", "Khamis Mushait", "Hofuf", 
      "Hail", "Najran", "Jubail", "Abha"
    ]
  },
  {
    name: "Pakistan",
    isoCode: "PK",
    flag: "🇵🇰",
    cities: [
      "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", 
      "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", 
      "Sukkur", "Bahawalpur", "Sargodha", "Mardan"
    ]
  },
  {
    name: "Oman",
    isoCode: "OM",
    flag: "🇴🇲",
    cities: [
      "Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Barka", 
      "Ibri", "Rustaq", "Buraimi", "Khasab", "Seeb", 
      "Shinas", "Saham", "Al Suwaiq", "Al Khaburah"
    ]
  },
  {
    name: "Bahrain",
    isoCode: "BH",
    flag: "🇧🇭",
    cities: [
      "Manama", "Muharraq", "Riffa", "Hamad Town", "Isa Town", "Sitra", 
      "Budaiya", "Jidhafs", "Zallaq", "Al Jasra", "Al Dur", 
      "Sanad", "Tubli", "A'ali", "Busaiteen"
    ]
  },
  {
    name: "Qatar",
    isoCode: "QA",
    flag: "🇶🇦",
    cities: [
      "Doha", "Al Rayyan", "Al Wakrah", "Umm Salal", "Al Khor", "Al Shamal", 
      "Dukhan", "Mesaieed", "Lusail", "Madinat ash Shamal", "Al Daayen", 
      "Al Wukair", "Al Thakhira", "Al Ghuwariyah", "Al Kharrara"
    ]
  },
  {
    name: "Bangladesh",
    isoCode: "BD",
    flag: "🇧🇩",
    cities: [
      "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", 
      "Rangpur", "Comilla", "Narayanganj", "Gazipur", "Mymensingh", 
      "Jessore", "Cox's Bazar", "Bogra", "Saidpur"
    ]
  },
  {
    name: "Nigeria",
    isoCode: "NG",
    flag: "🇳🇬",
    cities: [
      "Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", 
      "Maiduguri", "Zaria", "Aba", "Jos", "Ilorin", 
      "Oyo", "Enugu", "Abeokuta", "Onitsha"
    ]
  },
  {
    name: "India",
    isoCode: "IN",
    flag: "🇮🇳",
    cities: [
      "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", 
      "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", 
      "Kanpur", "Nagpur", "Indore", "Thane"
    ]
  }
];

export const bankCountriesPlain = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Pakistan",
  "Oman",
  "Bahrain",
  "Qatar",
  "Bangladesh",
  "Nigeria",
  "India",
];

export const sidebarItems = [
  { name: "User Profile", link: "/setting", id: 1 },
  { name: "Roles & Permission", link: "/setting/roles-permission", id: 2 },
  { name: "User Management", link: "/setting/user-management", id: 3 },
  { name: "Company Info", link: "/setting/company-infomation", id: 4 },
  {
    name: "Notification preferences",
    link: "/setting/notification-preferences",
    id: 5,
  },
];
