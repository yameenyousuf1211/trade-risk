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

  return `${month} ${day}, ${year}`;
};

export const convertDateAndTimeToString = (date: any) => {
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

  const month = monthNames[jsDate.getMonth()];
  const day = String(jsDate.getDate()).padStart(2, "0");
  const hours = String(jsDate.getHours()).padStart(2, "0");
  const minutes = String(jsDate.getMinutes()).padStart(2, "0");

  return `${month} ${day} ${year} ${hours}:${minutes}`;
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
  const removedIdTitle = title.split(" ").filter(word => !idPattern.test(word));
  const plainText = removedIdTitle.join(" ");
  console.log(plainText, "hi");
  return plainText;
};


export const formatPhoneNumber = (phoneNumber:string) => {
  return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
};

