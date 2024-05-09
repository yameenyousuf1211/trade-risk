import { type ClassValue, clsx } from "clsx";
import { differenceInDays, endOfYear, format } from "date-fns";
import { twMerge } from "tailwind-merge";

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

export const formatLeftDate = (date: any) => {
  const jsDate = new Date(date);
  const daysLeftInYear = differenceInDays(endOfYear(jsDate), jsDate);
  const formattedDate = `${format(
    date,
    "dd MMM yyyy"
  )} (${daysLeftInYear} days left)`;

  return formattedDate;
};

export const formatLeftDays = (date: any) => {
  const jsDate = new Date(date);
  const daysLeftInYear = differenceInDays(endOfYear(jsDate), jsDate);
  const formattedDate = `${daysLeftInYear}d left`;

  return formattedDate;
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

export const amountToWords = (number: number): string => {
  // Define dictionaries for one-digit, two-digit, and tens multiples
  const ones: { [key: number]: string } = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
  };
  const teens: { [key: number]: string } = {
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
    16: "Sixteen",
    17: "Seventeen",
    18: "Eighteen",
    19: "Nineteen",
  };
  const tens: { [key: number]: string } = {
    20: "Twenty",
    30: "Thirty",
    40: "Forty",
    50: "Fifty",
    60: "Sixty",
    70: "Seventy",
    80: "Eighty",
    90: "Ninety",
  };

  // Define a function to handle up to two digits
  function lessThan100(num: number): string {
    if (num < 10) {
      return ones[num];
    } else if (num < 20) {
      return teens[num];
    } else {
      return tens[Math.floor(num / 10) * 10] + "-" + ones[num % 10];
    }
  }

  // Define a function to handle up to three digits
  function lessThan1000(num: number): string {
    if (num < 100) {
      return lessThan100(num);
    } else {
      return ones[Math.floor(num / 100)] + " Hundred " + lessThan100(num % 100);
    }
  }

  // Define a function to handle larger numbers
  function convertToWords(num: number): string {
    if (num === 0) {
      return "Zero";
    }
    let result = "";
    if (num < 1000) {
      result = lessThan1000(num);
    } else if (num < 1000000) {
      result =
        lessThan1000(Math.floor(num / 1000)) +
        " Thousand " +
        lessThan1000(num % 1000);
    } else if (num < 1000000000) {
      result =
        lessThan1000(Math.floor(num / 1000000)) +
        " Million " +
        lessThan1000(num % 1000000);
    } else if (num < 1000000000000) {
      result =
        lessThan1000(Math.floor(num / 1000000000)) +
        " Billion " +
        lessThan1000(num % 1000000000);
    }
    return result.trim();
  }

  return convertToWords(number);
};