import * as Yup from "yup";

// Bond Schema (common for all bonds)
const bondSchema = Yup.object().shape({
  Contract: Yup.boolean().default(false),
  currencyType: Yup.string().min(1, "Currency Type is required").default("USD"),
  cashMargin: Yup.number().when("Contract", {
    is: true,
    then: (schema) => schema.required("Must enter LG Amount"),
    otherwise: (schema) => schema.notRequired(),
  }),
  valueInPercentage: Yup.number().nullable().notRequired(),
  expectedDate: Yup.date().when("Contract", {
    is: true,
    then: (schema) => schema.required("Expected Date is required"),
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
        .required("LG Tenor Type is required")
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

// Base schema with common fields for both LG Re-Issuance and 100% Cash Margin
const baseSchema = Yup.object().shape({
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
      phone: Yup.string().nullable(),
      city: Yup.string().nullable(),
    })
    .required(),
  remarks: Yup.string().nullable(),
  priceQuotes: Yup.string().required("Price Quotes is required"),
  expectedPrice: Yup.object()
    .shape({
      expectedPrice: Yup.string().required("Price Per Annum is required"),
      pricePerAnnum: Yup.string().nullable(),
    })
    .required(),
  lastDateOfReceivingBids: Yup.date().required(
    "Last Date of Receiving Bids is required"
  ),
});

// Keep the validation for LG Re-Issuance unchanged, including the test method
export const lgReIssuanceSchema = baseSchema.concat(
  Yup.object()
    .shape({
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
            bank: Yup.string().min(1, "Issuing Bank is required").required(),
            country: Yup.string()
              .min(1, "Issuing Bank Country is required")
              .required(),
            swiftCode: Yup.string().notRequired(),
          })
        )
        .min(1, "At least one issuing bank is required")
        .required("Issuing Banks are required"),
      totalContractValue: Yup.string().when("lgDetailsType", {
        is: "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)",
        then: (schema) => schema.required("Total Contract Value is required"),
        otherwise: (schema) => schema.notRequired().optional().nullable(),
      }),
      totalContractCurrency: Yup.string().when("lgDetailsType", {
        is: "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)",
        then: (schema) =>
          schema.required("Total Contract Currency is required"),
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

        return true;
      }
    )
);

// Define a schema for LG 100% Cash Margin, reusing common fields
export const lg100CashMarginSchema = baseSchema.concat(
  Yup.object().shape({
    typeOfLg: Yup.object()
      .shape({
        type: Yup.string().required("Type of LG is required"), // Validate that typeOfLg.type is a required string
      })
      .required("Type of LG is required"),
    preferredBanks: Yup.object()
      .shape({
        country: Yup.string().required("Preferred Bank Country is required"),
        banks: Yup.array()
          .of(
            Yup.object().shape({
              bank: Yup.string().required("Bank is required"),
              swiftCode: Yup.string().nullable(),
              accountNumber: Yup.string().nullable(),
            })
          )
          .min(1, "At least one bank is required"),
      })
      .required(),
    lgDetails: Yup.object()
      .shape({
        currency: Yup.string().required("Currency is required"),
        amount: Yup.number().required("Amount is required"),
        LgTenor: Yup.object().shape({
          type: Yup.string().required("LG Tenor Type is required"),
        }),
        number: Yup.number().required("LG Tenor Number is required"),
        expectedDateToIssueLg: Yup.date().required(
          "Expected Date to Issue LG is required"
        ),
        lgExpiryDate: Yup.date().required("LG Expiry Date is required"),
      })
      .required(),
    lgIssueIn: Yup.object()
      .shape({
        country: Yup.string().required("Country for LG Issue is required"),
        city: Yup.string().required("City for LG Issue is required"),
      })
      .required(),
    lgCollectIn: Yup.object()
      .shape({
        country: Yup.string().required("Country for LG Collection is required"),
        city: Yup.string().required("City for LG Collection is required"),
      })
      .required(),
  })
);
