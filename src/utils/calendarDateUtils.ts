// Date parsing and utility functions for Shristi Academy School Calendar
export interface ParsedEventDate {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  day: number;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Robust date parser for user-entered event dates.
 * Supports:
 * - YYYY-MM-DD (e.g., 2026-11-15) without UTC timezone drift
 * - Month DD, YYYY (e.g., November 15, 2026, Nov 15 2026)
 * - DD Month YYYY (e.g., 15 November 2026)
 * - Standard Date fallbacks
 */
export function parseSchoolEventDate(dateStr: string): ParsedEventDate | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const s = dateStr.trim();
  if (!s) return null;

  // 1. ISO format: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1; // 0-indexed
    const day = parseInt(isoMatch[3], 10);
    if (!isNaN(year) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { year, month, day };
    }
  }

  // 2. Day-first numeric format: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (!isNaN(year) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { year, month, day };
    }
  }

  // 3. Named month format (e.g., "August 20, 2026", "20 Aug 2026")
  const lower = s.toLowerCase();
  for (let m = 0; m < 12; m++) {
    const full = MONTH_NAMES[m].toLowerCase();
    const short = MONTH_SHORT_NAMES[m].toLowerCase();
    if (lower.includes(full) || lower.includes(short)) {
      // Extract year (4 digits)
      const yearMatch = s.match(/\b(20\d\d)\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

      // Extract day number (1-31)
      const withoutYear = s.replace(/\b(20\d\d)\b/, "");
      const dayMatch = withoutYear.match(/\b([1-3]?\d)\b/);
      const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

      return { year, month: m, day };
    }
  }

  // 4. Native Date parsing fallback
  const fallback = new Date(s);
  if (!isNaN(fallback.getTime())) {
    return {
      year: fallback.getFullYear(),
      month: fallback.getMonth(),
      day: fallback.getDate(),
    };
  }

  return null;
}

/**
 * Checks if a specific day (in year, monthIndex) matches an event,
 * including single-day and multi-day vacations.
 */
export function isEventActiveOnDay(
  evtDateStr: string,
  evtEndDateStr: string | undefined,
  targetYear: number,
  targetMonthIndex: number,
  targetDay: number
): boolean {
  const start = parseSchoolEventDate(evtDateStr);
  if (!start) return false;

  // Single-day event
  if (!evtEndDateStr) {
    return (
      start.year === targetYear &&
      start.month === targetMonthIndex &&
      start.day === targetDay
    );
  }

  // Multi-day event
  const end = parseSchoolEventDate(evtEndDateStr);
  if (!end) {
    return (
      start.year === targetYear &&
      start.month === targetMonthIndex &&
      start.day === targetDay
    );
  }

  // Compare timestamps using local midnight
  const targetTs = new Date(targetYear, targetMonthIndex, targetDay, 12, 0, 0).getTime();
  const startTs = new Date(start.year, start.month, start.day, 0, 0, 0).getTime();
  const endTs = new Date(end.year, end.month, end.day, 23, 59, 59).getTime();

  return targetTs >= startTs && targetTs <= endTs;
}

/**
 * Extracts the 0-indexed month for an event for monthly grouping.
 */
export function getEventMonthIndex(dateStr: string): number {
  const parsed = parseSchoolEventDate(dateStr);
  return parsed ? parsed.month : 0;
}

/**
 * Extracts the 4-digit year for an event.
 */
export function getEventYear(dateStr: string): number {
  const parsed = parseSchoolEventDate(dateStr);
  return parsed ? parsed.year : new Date().getFullYear();
}
