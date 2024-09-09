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
  advising: "LG Advising",
});
