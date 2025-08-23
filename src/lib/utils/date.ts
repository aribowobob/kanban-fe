import { format as formatDate } from "date-fns";

/**
 * Format date with human readable format
 * @param date Date to format
 * @param formatString Format string (e.g., 'dd MMMM yyyy', 'yyyy-MM-dd')
 * @returns Formatted date string human readable
 */
export function formatDateToDisplay(
  date: string | Date,
  formatString: string = "d MMM yyyy"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDate(dateObj, formatString);
}

/**
 * Format date for display (human readable)
 * @param date Date to format
 * @returns Formatted date string like "20 July 2025"
 */
export function formatDisplayDate(date?: string | Date): string {
  if (!date) return "";
  return formatDateToDisplay(date, "d MMM yyyy");
}

/**
 * Format date for forms/API (ISO format)
 * @param date Date to format
 * @returns Formatted date string like "2025-07-20"
 */
export function formatApiDate(date: Date): string {
  return formatDate(date, "yyyy-MM-dd");
}
