import { type ClassValue, clsx } from "clsx";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  endOfYear,
  format,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { LG } from "../constant/constant";
import { Bank } from "@/types/LGBankTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertImage = async (file: File): Promise<string> => {
  const reader = new FileReader();
  await new Promise<void>((resolve, reject) => {
    reader.onload = () => {
      resolve();
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
  return reader.result as string;
};

export const convertDateToYYYYMMDD = (date: any) => {
  const jsDate = new Date(date);

  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
  const day = String(jsDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export function convertDate(mongooseDate: Date): string {
  // Convert the Mongoose date to a JavaScript Date object if it's not already
  const date = new Date(mongooseDate);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric", // 4-digit year
    month: "short", // Short month (e.g., Jan, Feb, Mar)
    day: "numeric", // Day of the month (1-31)
  };

  // Define options for formatting the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit", // 2-digit hour (e.g., 01, 14)
    minute: "2-digit", // 2-digit minute (e.g., 05, 59)
    hour12: false, // Use 24-hour format
  };

  // Format the date and time separately
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  // Combine the formatted date and time into the desired format
  return `${formattedDate}, ${formattedTime}`;
}

export const formatLeftDate = (date: any) => {
  if (!date) return;
  const targetDate = new Date(date);
  const currentDate = new Date();

  const daysUntilTarget = Math.ceil(
    (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const formattedDate = `${format(
    date,
    "dd MMM yyyy"
  )} (${daysUntilTarget} days left)`;

  return formattedDate;
};

export const formatLeftDays = (date: any) => {
  const targetDate = new Date(date);
  const currentDate = new Date();

  const daysUntilTarget = Math.ceil(
    (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return `${daysUntilTarget}d left`;
};

export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

export const convertDateToString = (date: any) => {
  if (!date) return "";
  const jsDate = new Date(date);

  const year = jsDate.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[jsDate.getMonth()]; // Get the month name from the array
  const day = String(jsDate.getDate()).padStart(2, "0");

  return `${day} ${month} ${year}`;
};

export const convertDateToCommaString = (date: any) => {
  if (!date) {
    return "Date not available";
  }

  const jsDate = new Date(date);

  if (isNaN(jsDate.getTime())) {
    return "Date not available";
  }

  const year = jsDate.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[jsDate.getMonth()];
  const day = String(jsDate.getDate()).padStart(2, "0");

  return `${month} ${day}, ${year}`;
};

export function convertDateAndTimeToStringGMT(date) {
  const dateObj = new Date(date);

  // Format the date and time
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Get the timezone offset in minutes
  const offsetMinutes = dateObj.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetRemainingMinutes = Math.abs(offsetMinutes) % 60;

  // Format timezone offset as GMT-04:00 or GMT+02:30
  const gmtSign = offsetMinutes <= 0 ? "+" : "-";
  const gmt = `GMT${gmtSign}${String(offsetHours).padStart(2, "0")}:${String(
    offsetRemainingMinutes
  ).padStart(2, "0")}`;

  return `${formattedDate} ${gmt}`;
}

// export const convertDateAndTimeToString = (date: any) => {
//   const jsDate = new Date(date);

//   const year = jsDate.getFullYear();

//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const month = monthNames[jsDate.getMonth()];
//   const day = String(jsDate.getDate()).padStart(2, "0");
//   const hours = String(jsDate.getHours()).padStart(2, "0");
//   const minutes = String(jsDate.getMinutes()).padStart(2, "0");
//   const seconds = String(jsDate.getSeconds()).padStart(2, "0");

//   console.log(`${month} ${day} ${year} ${hours}:${minutes}:${seconds}`);
//   return `${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;
// };
export const convertDateAndTimeToString = (date: any) => {
  // Convert the date to a JavaScript Date object
  const jsDate = new Date(date);

  // Ensure the date is valid
  if (isNaN(jsDate.getTime())) {
    console.error("Invalid date:", date);
    return null;
  }

  const year = jsDate.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[jsDate.getMonth()];
  const day = String(jsDate.getDate()).padStart(2, "0");
  const hours = String(jsDate.getHours()).padStart(2, "0");
  const minutes = String(jsDate.getMinutes()).padStart(2, "0");
  const seconds = String(jsDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;
  console.log(formattedDate);
  return formattedDate;
};
export const findTime = (date: Date) => {
  const now = new Date();
  console.log(date);

  const messageDate = new Date(date);

  const minutesDifference = differenceInMinutes(now, messageDate);
  const hoursDifference = differenceInHours(now, messageDate);
  const daysDifference = differenceInDays(now, messageDate);
  const monthsDifference = differenceInMonths(now, messageDate);

  if (minutesDifference < 1) {
    return "now";
  } else if (minutesDifference < 60) {
    return `${minutesDifference}m ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference}h ago`;
  } else if (daysDifference < 30) {
    return `${daysDifference}d ago`;
  } else {
    return `${monthsDifference}mo ago`;
  }
};
export const compareValues = (
  a: any,
  b: any,
  isDescending: boolean
): number => {
  if (typeof a === "string" && typeof b === "string") {
    return isDescending ? b.localeCompare(a) : a.localeCompare(b);
  }
  if (typeof a === "number" && typeof b === "number") {
    return isDescending ? b - a : a - b;
  }
  if (a instanceof Date && b instanceof Date) {
    return isDescending ? b.getTime() - a.getTime() : a.getTime() - b.getTime();
  }
  return 0;
};

export const calculateDaysLeft = (futureDate: any) => {
  const currentDate: any = new Date();
  const targetDate: any = new Date(futureDate);
  const timeDifference = targetDate - currentDate;
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference > 0 ? daysDifference : 0;
};

export const removeId = (title: string) => {
  const idPattern = /\b[0-9a-fA-F]{24}\b/; // pattern to match a 24-character hexadecimal string
  const removedIdTitle = title
    .split(" ")
    .filter((word) => !idPattern.test(word));
  const plainText = removedIdTitle.join(" ");
  console.log(plainText, "hi");
  return plainText;
};

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
};

/**
 * Converts a comma-separated string of numbers into a single concatenated number.
 *
 * @param {string} str - The comma-separated string of numbers.
 * @returns {number} - The concatenated number.
 */
export function convertStringToNumber(str: string): number {
  if (!str) return 0;
  str = str?.toString();
  const cleanedStr = str.replace(/,/g, ""); // Remove the commas
  const number = parseFloat(cleanedStr); // Convert to a floating-point number
  return number;
}

type CountryToIsoMap = {
  [key: string]: string;
};

export const mapCountryToIsoCode = (country: string) => {
  const countryToIsoMap: CountryToIsoMap = {
    pakistan: "PK",
    india: "IN",
    bangladesh: "BD",
    "united arab emirates": "AE",
    "saudi arabia": "SA",
    oman: "OM",
    bahrain: "BH",
    qatar: "QA",
    nigeria: "NG",
  };
  console.log(countryToIsoMap[country]);

  return countryToIsoMap[country] || null;
};

// Function to remove unnecessary fields for draft updates
export const removeUnnecessaryFieldsForLgCreate = (responseData: any) => {
  // Remove unnecessary fields based on lgIssuance type
  delete responseData?._id;
  delete responseData.createdAt;
  delete responseData.updatedAt;
  delete responseData.__v;
  delete responseData.status;

  responseData.issuingBanks = responseData?.issuingBanks?.map((bank: Bank) => {
    // @ts-ignore
    delete bank._id;
    return bank;
  });

  if (responseData.lgIssuance !== LG.cashMargin) {
    delete responseData.typeOfLg;
    delete responseData.physicalLgSwiftCode;
    delete responseData?.lgStandardText;

    if (responseData.lgDetailsType != "Choose any other type of LGs") {
      delete responseData.otherBond;
      delete responseData?.status;
      [
        "bidBond",
        "advancePaymentBond",
        "performanceBond",
        "retentionMoneyBond",
      ].forEach((element) => {
        delete responseData[element]?._id;

        if (responseData[element]?.Contract) {
          Boolean(responseData[element].Contact);
        }

        if (responseData[element]?.valueInPercentage)
          responseData[element].valueInPercentage =
            responseData[element].valueInPercentage?.toString();

        if (responseData[element]?.lgTenor?.lgTenorValue)
          responseData[element].lgTenor.lgTenorValue =
            responseData[element].lgTenor.lgTenorValue?.toString();

        if (!responseData[element]?.cashMargin) {
        } else {
          responseData[element]["cashMargin"] = convertStringToNumber(
            responseData[element]["cashMargin"]
          ).toFixed();
        }
      });
    } else {
      delete responseData.bidBond;
      delete responseData.advancePaymentBond;
      delete responseData.performanceBond;
      delete responseData.retentionMoneyBond;
      delete responseData?.status;
      delete responseData.otherBond?._id;
      delete responseData?.otherBond?.checked;

      if (responseData.otherBond?.valueInPercentage)
        responseData.otherBond.valueInPercentage =
          responseData.otherBond.valueInPercentage?.toString();

      if (responseData.otherBond?.lgTenor?.lgTenorValue)
        responseData.otherBond.lgTenor.lgTenorValue =
          responseData.otherBond.lgTenor.lgTenorValue?.toString();

      if (responseData?.otherBond?.cashMargin) {
        responseData.otherBond.cashMargin = convertStringToNumber(
          responseData?.otherBond?.cashMargin
        )?.toFixed();
        responseData.otherBond.lgDetailAmount = convertStringToNumber(
          responseData.otherBond.cashMargin
        )?.toFixed();
      }
    }
  } else {
    delete responseData.bidBond;
    delete responseData.advancePaymentBond;
    delete responseData.performanceBond;
    delete responseData.retentionMoneyBond;
    delete responseData?.otherBond?._id;
    responseData["lgDetailsType"] = "Choose any other type of LGs";
    responseData.otherBond["lgDetailAmount"] = convertStringToNumber(
      responseData.otherBond["lgDetailAmount"]
    );
    responseData.otherBond["cashMargin"] = convertStringToNumber(
      responseData.otherBond["cashMargin"]
    )?.toFixed();

    if (responseData.otherBond?.lgTenor?.lgTenorValue) {
      responseData.otherBond.lgTenor.lgTenorValue =
        responseData.otherBond?.lgTenor?.lgTenorValue?.toString();
    }
  }
  if (
    !responseData?.expectedPrice?.expectedPrice ||
    responseData?.expectedPrice?.expectedPrice === "false"
  )
    delete responseData?.expectedPrice?.pricePerAnnum;
  if (responseData?.applicantDetails?.crNumber)
    responseData.applicantDetails.crNumber =
      responseData.applicantDetails.crNumber?.toString();
};

export const bondRequiredFields = (responseData: any): boolean => {
  if (responseData.lgDetailsType !== "Choose any other type of LGs") {
    return (
      responseData.bidBond?.Contract ||
      responseData.advancePaymentBond?.Contract ||
      responseData.performanceBond?.Contract ||
      responseData.retentionMoneyBond?.Contract ||
      false
    );
  }

  return true;
};

export const convertStringValueToDate = (responseData: any) => {
  const convertDateFields = (obj: any, fields: string[]) => {
    fields.forEach((field) => {
      if (obj && obj[field]) {
        obj[field] = new Date(obj[field]);
      }
    });
  };

  // Convert date fields for responseData itself
  convertDateFields(responseData, ["lastDateOfReceivingBids"]);

  // Convert date fields for various bond types
  const bondFields = ["expectedDate", "lgExpiryDate"];
  convertDateFields(responseData.bidBond, bondFields);
  convertDateFields(responseData.advancePaymentBond, bondFields);
  convertDateFields(responseData.performanceBond, bondFields);
  convertDateFields(responseData.retentionMoneyBond, bondFields);
  convertDateFields(responseData.otherBond, bondFields);

  // Add any additional bond objects here if needed
};

export const formatAmount = (amount: number | string) => {
  return Number(amount).toLocaleString("en-US");
};
