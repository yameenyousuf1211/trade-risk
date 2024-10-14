export const STATUS = Object.freeze({
  SUCCESSFUL_RESPONSE: 200,
  SUCCESSFUL_CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
});

export const permissions = [
  "Change Request",
  "Edit & Manage Requests",
  "View Bids",
  "Accept/Reject Bids",
  "Manage Users",
  "Manage Company",
];

export const permissionMapping: Record<string, string> = {
  changeRequest: "Change Request",
  manageRequests: "Edit & Manage Requests",
  viewBids: "View Bids",
  acceptAndRejectBids: "Accept/Reject Bids",
  manageUsers: "Manage Users",
  manageCompany: "Manage Company",
};

export const values = [
  "Payment Guarantee",
  "Financial Guarantee to secure Credit Facilities",
  "Stand by letter of credit (SBLC)",
  "Stand by Letter of credit (SBLC) to secure credit facilities",
  "Custom",
  "Zakat",
  "Other Type of LG (Need to type)",
];

export const LG = Object.freeze({
  cashMargin: "LG 100% Cash Margin",
  reIssuanceInAnotherCountry: "LG Re-issuance in another country",
  issuanceWithinTheCountry: "LG issuance within the country",
});

export const eurozoneCountries = [
  "Austria",
  "Belgium",
  "Cyprus",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Portugal",
  "Slovakia",
  "Slovenia",
  "Spain",
];

export const baseRatesByCountry = {
  US: ["SOFR"],
  Pakistan: ["KIBOR"],
  UK: ["SONIA", "LIBOR"],
  Japan: ["TONA"],
  Switzerland: ["SARON"],
  Australia: ["BBSW", "AONIA"],
  Canada: ["CDOR"],
  HongKong: ["HIBOR"],
  Singapore: ["SIBOR"],
  Malaysia: ["KLIBOR"],
  India: ["MIBOR"],
  Brazil: ["BRL"],
  UAE: ["EIBOR"],
  KSA: ["SAIBOR"],
  Qatar: ["QIBOR"],
  Bahrain: ["BHBOR"],
  Kuwait: ["KIBOR"],
  China: ["SHIBOR"],
  Taiwan: ["TAIBOR"],
  Nepal: ["NIBOR"],
  Philippines: ["PHIBOR"],
  SouthKorea: ["KORIBOR"],
  Cambodia: ["CIBOR"],
  Eurozone: ["EURIBOR", "ESTR"], // Eurozone countries share these rates
};
