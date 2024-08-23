import { LG } from "@/utils";
import * as Yup from "yup";

const bondSchema = Yup.object()
  .shape({
    Contract: Yup.boolean().default(false).required("Contract is required"),
    currencyType: Yup.string()
      .min(1, "Currency Type is required")
      .default("USD"),
    cashMargin: Yup.string()
      .typeError("Cash Margin must be a String")
      .nullable(),
    valueInPercentage: Yup.string()
      .typeError("Cash Margin Percentage should be a number")
      .nullable(),
    expectedDate: Yup.date().nullable(),
    lgExpiryDate: Yup.date().nullable(),
    lgTenor: Yup.object()
      .shape({
        lgTenorType: Yup.string()
          .min(1, "LG Tenor Type is required")
          .default("Months"),
        lgTenorValue: Yup.string().nullable(),
      })
      .nullable(),
    draft: Yup.string().nullable(),
  })
  // // SuperRefine equivalent
  // .test("contract-logic", "", function (input) {
  //   if (input.Contract === true) {
  //     // Add any conditional validations here
  //     // For example, uncommenting the lines below would make these fields required when Contract is true
  //     // if (!input.expectedDate) {
  //     //   return this.createError({
  //     //     path: 'expectedDate',
  //     //     message: "Expected Date is required",
  //     //   });
  //     // }
  //     // if (!input.lgExpiryDate) {
  //     //   return this.createError({
  //     //     path: 'lgExpiryDate',
  //     //     message: "LG Expiry Date is required",
  //     //   });
  //     // }
  //   }
  //   return true;
  // });

// Define the main schema with all fields and refinements
export const lgValidator = Yup.object()
  .shape({
    type: Yup.string().required("Type is required"),
    lgIssuance: Yup.string().required("LG Issuance is required"),
    applicantDetails: Yup.object()
      .shape({
        country: Yup.string().required("Applicant Country is required"),
        company: Yup.string().required("Applicant Company is required"),
        crNumber: Yup.string().required("Applicant CR Number is required"),
      })
      .required(),
    beneficiaryDetails: Yup.object()
      .shape({
        name: Yup.string()
          .required("Beneficiary Name is Required"),
        country: Yup.string()
          .required("Beneficiary Country is Required"),
        address: Yup.string().nullable(),
        phone: Yup.string().nullable(),
        city: Yup.string().nullable(),
      })
      .required(),
    lgDetailsType: Yup.string()
      .default("Choose any other type of LGs").required(),
    bidBond: bondSchema.nullable(),
    advancePaymentBond: bondSchema.nullable(),
    performanceBond: bondSchema.nullable(),
    retentionMoneyBond: bondSchema.nullable(),
    otherBond: bondSchema.nullable(),
    issuingBanks: Yup.array()
      .of(
        Yup.object().shape({
          bank: Yup.string()
            .min(1, "Issuing Bank is required")
            .required("Issuing Bank is required"),
          country: Yup.string()
            .min(1, "Issuing Bank Country is required")
            .required("Issuing Bank Country is required"),
          swiftCode: Yup.string()
            .min(1, "Issuing Bank Swift Code is required")
            .required("Issuing Bank Swift Code is required"),
        })
      )
      .min(1, "At least one issuing bank is required")
      .required("Issuing Banks are required"),
    beneficiaryBanksDetails: Yup.object()
      .shape({
        bank: Yup.string().nullable(),
        swiftCode: Yup.string().nullable(),
      })
      .nullable(),
    purpose: Yup.string().nullable(),
    remarks: Yup.string().nullable(),
    priceQuotes: Yup.string().required("Price Quotes is required"),
    expectedPrice: Yup.object()
      .shape({
        expectedPrice: Yup.string().required("Expected Price is required"),
        pricePerAnnum: Yup.string().nullable(),
      })
      .required(),
    // typeOfLg: Yup.string().nullable(),
    // issueLgWithStandardText: Yup.boolean().nullable(),
    // lgStandardText: Yup.string().nullable(),
    draft: Yup.boolean().nullable(),
    // physicalLg: Yup.boolean().nullable().default(false),
    // physicalLgBank: Yup.string().nullable(),
    // physicalLgCountry: Yup.string().nullable(),
    // physicalLgSwiftCode: Yup.string().nullable(),
    lastDateOfReceivingBids: Yup.date().required("Last Date of Receiving Bids is required"),
  })

