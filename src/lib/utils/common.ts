import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Logging function that only logs in development mode
 * @param args Arguments to log
 */
export const devLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

/**
 * Show error toast with better formatting
 * @param error The error object or message
 */
export function handleError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(errorMessage || "Something went wrong");
  console.error(error);
}
