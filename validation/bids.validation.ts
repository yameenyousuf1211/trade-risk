import { z } from "zod";

export const addBidTypes = z.object({
  validity: z.date({ message: "Validity date is required" }).optional(),
  confirmationPrice: z
    .string()
    .nonempty("Confirmation price is required")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "Enter a valid number",
    }),
});
