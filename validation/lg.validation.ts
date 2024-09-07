import { LG } from "@/utils";
import parsePhoneNumberFromString from "libphonenumber-js";
import * as Yup from "yup";

const bondSchema = Yup.object().shape({
  Contract: Yup.boolean().default(false),
  currencyType: Yup.string().min(1, "Currency Type is required").default("USD"),
  cashMargin: Yup.number().when("Contract", {
    is: true,
    then: (schema) => schema.required("Must enter LG Amount"),
    otherwise: (schema) => schema.notRequired(),
  }),
  valueInPercentage: Yup.number()
    .nullable() // Allows null values
    .notRequired(), // Makes the field not required regardless of the condition
  expectedDate: Yup.date().when("Contract", {
    is: true,
    then: (schema) => schema.min(2).required("Expected Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  lgExpiryDate: Yup.date().when("Contract", {
    is: true,
    then: (schema) => schema.required("LG Expiry Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  lgTenor: Yup.object()
    .shape({
      lgTenorType: Yup.string()
        .min(1, "LG Tenor Type is required")
        .default("Months"),
      lgTenorValue: Yup.string().nullable(),
    })
    .nullable(),
  attachments: Yup.array().nullable().notRequired(),
  expectedPricing: Yup.number()
    .nullable() // Allows null values
    .notRequired()
    .typeError("Expected Price must be a valid number")
    .min(0, "Expected Price cannot be less than 0")
    .max(100, "Expected Price cannot be more than 100"),
});

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
        name: Yup.string().required("Beneficiary Name is Required"),
        country: Yup.string().required("Beneficiary Country is Required"),
        address: Yup.string().required("Beneficiary Address is Required"),
        phoneNumber: Yup.string()
          .nullable()
          .test(
            "is-valid-phone-number",
            "Phone number is not valid",
            (value) => {
              if (!value) return true; // If phone number is not provided, it's valid as the field is nullable
              const phoneNumber = parsePhoneNumberFromString(value);
              return phoneNumber?.isValid() || false; // If valid, return true; otherwise, false
            }
          ),
        city: Yup.string().nullable(),
      })
      .required(),
    lgDetailsType: Yup.string()
      .default("Choose any other type of LGs")
      .required(),
    bidBond: bondSchema.when("lgDetailsType", {
      is: "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)",
      then: (schema) => schema.required("Bid Bond is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    advancePaymentBond: bondSchema,
    performanceBond: bondSchema,
    retentionMoneyBond: bondSchema,
    otherBond: bondSchema,
    issuingBanks: Yup.array()
      .of(
        Yup.object().shape({
          bank: Yup.string()
            .min(1, "Issuing Bank is required")
            .required("Issuing Bank is required"),
          country: Yup.string()
            .min(1, "Issuing Bank Country is required")
            .required("Issuing Bank Country is required"),
          swiftCode: Yup.string().notRequired(),
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
    // expectedPrice: Yup.object()
    //   .shape({
    //     expectedPrice: Yup.string().required("Price Per Annum is required"),
    //     pricePerAnnum: Yup.string().nullable(),
    //   })
    //   .required(),
    // typeOfLg: Yup.string().nullable(),
    // issueLgWithStandardText: Yup.boolean().nullable(),
    // lgStandardText: Yup.string().nullable(),
    draft: Yup.boolean().nullable(),
    // physicalLg: Yup.boolean().nullable().default(false),
    // physicalLgBank: Yup.string().nullable(),
    // physicalLgCountry: Yup.string().nullable(),
    // physicalLgSwiftCode: Yup.string().nullable(),
    lastDateOfReceivingBids: Yup.date().required(
      "Last Date of Receiving Bids is required"
    ),
    totalContractValue: Yup.string().when("lgDetailsType", {
      is: "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)",
      then: (schema) => schema.required("Total Contract Value is required"),
      otherwise: (schema) => schema.notRequired().optional().nullable(),
    }),
    totalContractCurrency: Yup.string().when("lgDetailsType", {
      is: "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)",
      then: (schema) => schema.required("Total Contract Currency is required"),
      otherwise: (schema) => schema.notRequired().optional().nullable(),
    }),
  })
  .test(
    "at-least-one-bond",
    "At least one of the bond fields must be provided.",
    function (value) {
      const {
        lgDetailsType,
        bidBond,
        advancePaymentBond,
        performanceBond,
        retentionMoneyBond,
      } = value;

      if (
        lgDetailsType ===
        "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
      ) {
        // Check if at least one bond has Contract set to true
        const isContractTrueInAnyBond =
          (bidBond && bidBond.Contract) ||
          (advancePaymentBond && advancePaymentBond.Contract) ||
          (performanceBond && performanceBond.Contract) ||
          (retentionMoneyBond && retentionMoneyBond.Contract);

        if (!isContractTrueInAnyBond) {
          return this.createError({
            path: "lgDetailsType",
            message:
              "At least one of the provided bonds must have Contract set to true.",
          });
        }
      }

      if (lgDetailsType === "Choose any other type of LGs") {
        if (!value.otherBond.Contract) {
          return this.createError({
            path: "lgDetailsType",
            message: "Please select at least one LG type",
          });
        }
      }

      return true; // Validation passes
    }
  );
