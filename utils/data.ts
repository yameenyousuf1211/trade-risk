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

export const sortableHeaders = [
  "Ref no",
  "Request",
  "Expires",
  "Product Type",
  "Amount",
  "Bids",
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
  { name: "United Arab Emirates", isoCode: "AE", flag: "🇦🇪" },
  { name: "Saudi Arabia", isoCode: "SA", flag: "🇸🇦" },
  { name: "Pakistan", isoCode: "PK", flag: "🇵🇰" },
  { name: "Oman", isoCode: "OM", flag: "🇴🇲" },
  { name: "Bahrain", isoCode: "BH", flag: "🇧🇭" },
  { name: "Qatar", isoCode: "QA", flag: "🇶🇦" },
  { name: "Bangladesh", isoCode: "BD", flag: "🇧🇩" },
  { name: "Nigeria", isoCode: "NG", flag: "🇳🇬" },
  { name: "India", isoCode: "IN", flag: "🇮🇳" },
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
