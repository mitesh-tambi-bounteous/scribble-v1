export type AccountClass = "adult" | "minor" | "unknown";

export const COPPA_AGE_THRESHOLD = 13;

const DATE_OF_BIRTH_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PLAUSIBLE_AGE_YEARS = 130;

function parseDateOfBirth(dateOfBirth: string): Date | null {
  if (!DATE_OF_BIRTH_PATTERN.test(dateOfBirth)) return null;
  const parsed = new Date(`${dateOfBirth}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  // Reject values like "2016-02-30" that Date silently rolls over.
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function computeAgeInYears(dateOfBirth: Date, now: Date): number {
  let age = now.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const hasHadBirthdayThisYear =
    now.getUTCMonth() > dateOfBirth.getUTCMonth() ||
    (now.getUTCMonth() === dateOfBirth.getUTCMonth() &&
      now.getUTCDate() >= dateOfBirth.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

/** Fails closed to "unknown" on unparseable or implausible input (ADR-0012). */
export function classifyAccountAge(
  dateOfBirth: string,
  now: Date = new Date(),
): AccountClass {
  const parsed = parseDateOfBirth(dateOfBirth);
  if (!parsed) return "unknown";
  if (parsed.getTime() > now.getTime()) return "unknown";

  const age = computeAgeInYears(parsed, now);
  if (age < 0 || age > MAX_PLAUSIBLE_AGE_YEARS) return "unknown";

  return age >= COPPA_AGE_THRESHOLD ? "adult" : "minor";
}

export function canProceedToAccountCreation(accountClass: AccountClass): boolean {
  return accountClass === "adult";
}

export type AppEnv = "dev" | "qa" | "prod";

/** ADR-0012 "Option A": production declines minor enrollment entirely. */
export function allowsMinorEnrollment(appEnv: AppEnv): boolean {
  return appEnv !== "prod";
}
