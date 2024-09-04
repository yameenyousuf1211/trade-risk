import * as Yup from "yup";

export const addBidTypes = Yup.object().shape({
  validity: Yup.date().required("Validity date is required"),
  confirmationPrice: Yup.string()
    .required("Confirmation price is required")
    .matches(/^\d+(\.\d+)?$/, "Enter a valid number")
    .test(
      "is-valid-confirmation-price",
      "Confirmation price must be greater than 0 and less than or equal to 100",
      (value) => {
        if (!value) return false;
        const numericValue = parseFloat(value); // Parse the number from string
        return numericValue > 0 && numericValue <= 100;
      }
    ),
});
