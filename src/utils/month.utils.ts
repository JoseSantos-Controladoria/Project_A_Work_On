/**
 * Utility functions for month handling
 */

import { MONTHS } from "@/constants";

/**
 * Converts month number or name to full month name
 */
export function parseMonth(filter?: string): string {
  if (!filter) {
    return "Atual";
  }

  const monthNum = parseInt(filter.replace(/\D/g, ""));
  
  if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
    return MONTHS[monthNum - 1] ?? filter;
  }

  // Try to match month name
  const monthLower = filter.toLowerCase();
  const monthIndex = MONTHS.findIndex(
    (m) => m.toLowerCase().includes(monthLower) || monthLower.includes(m.toLowerCase())
  );

  if (monthIndex !== -1) {
    return MONTHS[monthIndex] ?? filter;
  }

  return filter;
}

/**
 * Gets current month name
 */
export function getCurrentMonth(): string {
  return MONTHS[new Date().getMonth()] ?? "Atual";
}

