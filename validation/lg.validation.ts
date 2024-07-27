import { LgDetails } from '@/types/lg';
import { LG } from '@/utils';
import { z } from 'zod';
const bondSchema = z.object({
    Contract: z.boolean({ message: "Contract is required" }).default(false),
    currencyType: z.string({ message: "Currency Type is required" }).min(1).default("USD"),
    cashMargin: z.string({ invalid_type_error: "Cash Margin must be a String" }).optional(),
    valueInPercentage: z.string({ invalid_type_error: "Cash Margin Percentage should be a number" }).optional(),
    expectedDate: z.date({ message: "Expected Date is required" }).optional(),
    lgExpiryDate: z.date({ message: "LG Expiry Date is required" }).optional(),
    lgTenor: z.object({
      lgTenorType: z.string({ message: "LG Tenor Type is required" }).min(1).default('Months'),
      lgTenorValue: z.string({ message: "LG Tenor Value is required" }).optional(),
    }).optional().nullable(),
    draft: z.string().optional(),
  }).superRefine((input, ctx) => {
    if (input.Contract === true) {
     
    //   if (typeof input.expectedDate === 'undefined') {
    //     ctx.addIssue({
    //       path: ['expectedDate'],
    //       message: "Expected Date is required",
    //       code: 'custom',
    //     });
    //   }
    //   if (typeof input.lgExpiryDate === 'undefined') {
    //     ctx.addIssue({
    //       path: ['lgExpiryDate'],
    //       message: "LG Expiry Date is required",
    //       code: 'custom',
    //     });
    //   }
   
    }
  });

// Define the main schema with all fields and refinements
export const lgValidator = z.object({
    type: z.string({ message: "Type is required" }).min(1),
    lgIssuance: z.string({ message: "LG Issuance is required" }).min(1),
    applicantDetails: z.object({
        country: z.string().min(1),
        company: z.string().min(1),
        crNumber: z.string().min(1),
    }).required(),
    beneficiaryDetails: z.object({
        name: z.string({message:"Neneficiary Name is Required"}).min(1,{message:"Beneficiary Name is Required"}),
        country: z.string({message:"Neneficiary Country is Required"}).min(1,{message:"Beneficiary Country is Required"}),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
    }).required(),
    lgDetailsType: z.string().optional().default('Choose any other type of LGs'),
    bidBond: bondSchema.optional(),
    advancePaymentBond: bondSchema.optional(),
    performanceBond: bondSchema.optional(),
    retentionMoneyBond: bondSchema.optional(),
    otherBond: bondSchema.optional(),
    issuingBank: z.object({
        bank: z.string({ message: "Issuing Bank is required" }).min(1,{message:"Issuing Bank is required"}),
        country: z.string({ message: "Issuing Bank Country is required" }).min(1,{message:"Issuing Bank Country is required"}),
        swiftCode: z.string({ message: "Issuing Bank Swift Code is required" }).min(1,{message:"Issuing Bank Swift Code is required"}),
    }).required(),
    beneficiaryBanksDetails: z.object({
        bank: z.string().optional(),
        swiftCode: z.string().optional(),
    }).optional(),
    purpose: z.string().nullable(),
    remarks: z.string().nullable(),
    priceQuotes: z.string({ message: "Price Quotes is required" }).min(1,{message:"Price Quotes is required"}),
    expectedPrice: z.object({
        expectedPrice: z.string().min(1),
        pricePerAnnum: z.string().optional().nullable(),
    }).required(),
    typeOfLg: z.string().optional(),
    issueLgWithStandardText: z.boolean().optional(),
    lgStandardText: z.string().optional().nullable(),
    draft: z.boolean().optional(),
    physicalLg: z.boolean().optional().nullable().default(false),
    physicalLgBank: z.string().optional().nullable(),
    physicalLgCountry: z.string().optional().nullable(),
    physicalLgSwiftCode: z.string().optional().nullable(),
})
.refine((input) => {
    if (input.type === LG.reIssuanceInAnotherCountry) {
        return input.beneficiaryBanksDetails !== undefined;
    }
    return true;
}, {
    message: "beneficiaryBanksDetails is required when type is reIssuanceInAnotherCountry",
})
.refine((input) => {
    if (input.type === LG.cashMargin) {
        return input.issueLgWithStandardText !== undefined;
    }
    return true;
}, {
    path: ['issueLgWithStandardText'],
    message: "issueLgWithStandardText is required when type is cashMargin",
});
