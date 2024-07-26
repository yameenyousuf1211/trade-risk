import { LgDetails } from '@/types/lg';
import { z } from 'zod';

const bondSchema = z.object({
  Contract: z.boolean(),
  currencyType: z.string(),
  cashMargin: z.number(),
  valueInPercentage: z.number().optional(),
  expectedDate: z.date(),
  lgExpiryDate: z.date(),
  lgTenor: z.object({
    lgTenorType: z.string().optional(),
    lgTenorValue: z.number().optional(),
  }).required(),
  draft: z.string().optional(),
});


export const lgValidator = z.object({
    type: z.string({message:"Type is required"}).min(1),
    lgIssuance: z.string({
        message: "LG issuance is required"
    }).min(1),
    applicantDetails: z.object({
        country: z.string({
            message: "Country is required"
        }).min(1),
        company: z.string({
            message: "Company is required"
        }).min(1),
        crNumber: z.string({
            message: "CR number is required"
        }).min(1),
    }).required(),
    issuingBank: z.object({
        bank: z.string({
            message: "Issuing Bank is required"
        }).min(1),
        country: z.string({
            message: "Issuing Country is required"
        }).min(1),
        swiftCode: z.string({
            message: "Swift code is required"
        }).min(1),
    }).required(),

    beneficiaryDetails: z.object({
        country: z.string({
            message: "Country is required"
        }).min(1),
        name: z.string({
            message: "Name is required"
        }).min(1),
        address: z.string().optional().nullable(),
        phoneNumber: z.string().optional().nullable(),
    }).required(),

    lgDetailsType: z.enum([
        'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
        'Choose any other type of LGs'
    ]),
    bidBond: bondSchema.optional(),
    advancePaymentBond: bondSchema.optional(),
    performanceBond: bondSchema.optional(),
    retentionMoneyBond: bondSchema.optional(),
    otherBond: bondSchema.optional(),
    beneficiaryBanksDetails: z.object({
        bank: z.string({
            message: "Beneficiary Bank is required"
        }).min(1),
        swiftCode: z.string({
            message: "Beneficiary Bank Swift code is required"
        }).min(1),
    }).optional(),
    purpose: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
    priceQuotes: z.string({
        message: "Price Quotes is required"
    }),
    expectedPrice: z.object({
        expectedPrice: z.boolean({
            message: "Expected Price is required",
            invalid_type_error: "Expected Price should be Boolean"
        }),
        pricePerAnnum: z.string().min(1),
    }).required(),

    typeOfLg: z.enum([
        'Bid Bond', 'Advance Payment Bond', 'Performance Bond', 'Retention Money Bond',
        'Payment LG', 'Zakat', 'Custom', 'SBLC', 'Other'
    ]).optional(),

    issueLgWithStandardText: z.boolean({
        message: "Issue LG with Standard Text is required",
        invalid_type_error: "Issue LG with Standard Text should be Boolean"
    }).optional(),
    lgStandardText: z.string({
        message: "LG Standard Text is required",
        invalid_type_error: "LG Standard Text should be String"
    }).optional(),
    draft: z.boolean().optional(),
    refId: z.number(),
    physicalLg: z.boolean({
        invalid_type_error: "Physical LG should be Boolean"
    }).optional(),
    physicalLgCountry: z.string({
        message: "Physical LG Country is required",
        invalid_type_error: "Physical LG Country should be String"
    }).optional(),
    physicalLgBank: z.string({
        invalid_type_error: "Physical LG Bank should be String"
    }).optional(),
    physicalLgBankSwiftCode: z.string().optional(),
    physicalLgSwiftCode: z.string().optional(),
});
