import * as Yup from "yup";

export const addBidTypes = Yup.object().shape({
  validity: Yup.date().required("Validity date is required"),
  confirmationPrice: Yup.string()
    .required("Confirmation price is required")
    .matches(/^\d+(\.\d+)?$/, "Enter a valid number"),
});
