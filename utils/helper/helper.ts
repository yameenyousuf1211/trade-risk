import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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

export const convertDateToYYYYMMDD = (date:any) => {
    const jsDate = new Date(date);
  
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(jsDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };