/**
 * Dates as declared data.
 *
 * The content records time at three precisions and no more: `2025`, `2024-07`,
 * `2024-07-09`. Each is stored in ISO form so it sorts lexicographically and
 * compares without a locale, and each carries the precision that was written,
 * because padding `2024-07` out to `2024-07-01` would assert a day nobody
 * recorded and then render "1 July 2024" on the page.
 *
 * `new Date('2024-07')` is implementation-defined rather than portable, and
 * `new Date('July 2024')` needs a parser the project would have to maintain, so
 * nothing here calls `Date` to interpret a value. Comparison is done on the
 * numeric fields, and formatting is done from those fields too.
 *
 * No I/O and no `Date` construction: these are pure functions, which is what
 * makes the `date` field kind testable without a runner.
 */

/** How much of a date the content actually stated. */
export type DatePrecision = 'year' | 'month' | 'day';

export interface ContentDate {
  /**
   * The value as declared, in ISO form: `2025`, `2024-07`, or `2024-07-09`.
   *
   * Kept verbatim rather than normalised, because normalising is what loses the
   * precision. It is also the form the model stores, so a record round-trips.
   */
  readonly iso: string;
  readonly year: number;
  /** 1-12, or null when the value declares only a year. */
  readonly month: number | null;
  /** 1-31, or null unless the value declared a day. */
  readonly day: number | null;
  readonly precision: DatePrecision;
}

const YEAR = /^(\d{4})$/;
const MONTH = /^(\d{4})-(\d{2})$/;
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parse one declared date, or null when it is not one.
 *
 * A null is the only failure signal, and it is a failure: the caller turns it
 * into a build failure naming the file and field. Nothing is repaired, because a
 * repaired date is a date the owner never wrote.
 *
 * Ranges are checked for real: month 13 and day 31 of February are rejected
 * rather than rolled over, since a rollover would silently change which day a
 * record refers to.
 */
export function parseDate(raw: string): ContentDate | null {
  const value = raw.trim();

  const year = YEAR.exec(value);
  if (year !== null) {
    const parsed = Number(year[1]);
    if (parsed < 1) return null;
    return { iso: value, year: parsed, month: null, day: null, precision: 'year' };
  }

  const month = MONTH.exec(value);
  if (month !== null) {
    const parsed = Number(month[1]);
    const parsedMonth = Number(month[2]);
    if (parsedMonth < 1 || parsedMonth > 12) return null;
    return { iso: value, year: parsed, month: parsedMonth, day: null, precision: 'month' };
  }

  const day = DAY.exec(value);
  if (day !== null) {
    const parsed = Number(day[1]);
    const parsedMonth = Number(day[2]);
    const parsedDay = Number(day[3]);
    if (parsedMonth < 1 || parsedMonth > 12) return null;
    if (parsedDay < 1 || parsedDay > daysInMonth(parsed, parsedMonth)) return null;
    return { iso: value, year: parsed, month: parsedMonth, day: parsedDay, precision: 'day' };
  }

  return null;
}

/** Days in a month, leap years included. */
function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Total months since year 0, for comparing dates of differing precision.
 *
 * A year-only value compares as the first month of that year, which is what the
 * owner meant by it: `2025` does not mean "sometime after 2025 started", it means
 * "2025". So `2025` and `2025-06` compare as January against June.
 */
function monthOrdinal(date: ContentDate): number {
  return date.year * 12 + (date.month ?? 1);
}

/**
 * Order two dates.
 *
 * Returns a negative number when `a` is earlier, zero when they denote the same
 * instant, positive when `a` is later. Used for the two rules that compare a
 * start against an end.
 */
export function compareDates(a: ContentDate, b: ContentDate): number {
  const byMonth = monthOrdinal(a) - monthOrdinal(b);
  if (byMonth !== 0) return byMonth;

  // Same month. A day-precision value is later within the month than a month- or
  // year-precision one, because that is what it asserts.
  const aDay = a.day ?? 1;
  const bDay = b.day ?? 1;
  return aDay - bDay;
}

/** Whether `a` is strictly before `b`. */
export function isBefore(a: ContentDate, b: ContentDate): boolean {
  return compareDates(a, b) < 0;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Render one date at the precision it was declared.
 *
 * `2025` renders as `2025`, `2024-07` as `July 2024`, `2024-07-09` as
 * `9 July 2024`. Nothing is padded: a month-precision value never grows a day,
 * because a displayed day is a claim the content did not make.
 */
export function formatDate(date: ContentDate): string {
  switch (date.precision) {
    case 'year':
      return String(date.year);
    case 'month':
      return `${MONTH_NAMES[(date.month ?? 1) - 1]} ${date.year}`;
    case 'day':
      return `${date.day} ${MONTH_NAMES[(date.month ?? 1) - 1]} ${date.year}`;
  }
}

/**
 * Render a span, the way the free-text `duration` and `period` columns used to be
 * written.
 *
 * An absent end means the span is still running, which the old data spelled
 * `- Present` and which is now stated by the field's absence rather than by a
 * marker string.
 *
 * A span whose start and end are the same instant renders as one date. The free
 * text those columns replaced wrote such a record as a bare `April 2024`, and
 * printing the month twice would be both redundant and a worse reading than the
 * string it replaced.
 */
export function formatDateRange(
  start: ContentDate,
  end: ContentDate | null,
  present = 'Present',
): string {
  if (end === null) return `${formatDate(start)} - ${present}`;
  if (compareDates(start, end) === 0) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}