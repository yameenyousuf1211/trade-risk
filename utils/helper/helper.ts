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
