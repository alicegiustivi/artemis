/**
 * Phase calculation for menstrual cycle.
 * Boundaries (28-day reference): Menstrual 1–5, Follicular 6–13, Ovulatory 14–16, Luteal 17–end.
 * Scaled proportionally for other cycle lengths.
 */

export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

const REFERENCE_CYCLE_LENGTH = 28;
const BOUNDARIES_28 = {
  menstrualEnd: 5,
  follicularEnd: 13,
  ovulatoryEnd: 16,
} as const;

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(start: Date, end: Date): number {
  const a = toDateOnly(start);
  const b = toDateOnly(end);
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/**
 * Returns the cycle start date (day 1) for the cycle that contains targetDate.
 * lastPeriodDate is the start of a known cycle; we step backward by cycleLength
 * until we find the cycle that contains targetDate.
 */
function getCycleStartForDate(
  lastPeriodDate: Date,
  cycleLengthDays: number,
  targetDate: Date
): Date {
  const last = toDateOnly(lastPeriodDate);
  const target = toDateOnly(targetDate);

  if (target.getTime() >= last.getTime()) {
    const daysSince = daysBetween(last, target);
    const cyclesForward = Math.floor(daysSince / cycleLengthDays);
    const start = new Date(last);
    start.setDate(start.getDate() + cyclesForward * cycleLengthDays);
    return start;
  }

  const daysBefore = daysBetween(target, last);
  const cyclesBack = Math.ceil(daysBefore / cycleLengthDays);
  const start = new Date(last);
  start.setDate(start.getDate() - cyclesBack * cycleLengthDays);
  return start;
}

/**
 * Scaled phase boundaries for a given cycle length (proportional to 28-day).
 */
function getScaledBoundaries(cycleLength: number) {
  const scale = cycleLength / REFERENCE_CYCLE_LENGTH;
  return {
    menstrualEnd: Math.round(BOUNDARIES_28.menstrualEnd * scale),
    follicularEnd: Math.round(BOUNDARIES_28.follicularEnd * scale),
    ovulatoryEnd: Math.round(BOUNDARIES_28.ovulatoryEnd * scale),
  };
}

function dayInCycleToPhase(dayInCycle: number, cycleLength: number): Phase {
  const { menstrualEnd, follicularEnd, ovulatoryEnd } =
    getScaledBoundaries(cycleLength);

  if (dayInCycle <= menstrualEnd) return 'menstrual';
  if (dayInCycle <= follicularEnd) return 'follicular';
  if (dayInCycle <= ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}

export function getPhaseForDate(
  lastPeriodDate: string,
  cycleLengthDays: number,
  targetDate: Date
): { phase: Phase; dayInCycle: number; cycleLength: number } {
  const lastPeriod = new Date(lastPeriodDate);
  if (Number.isNaN(lastPeriod.getTime())) {
    throw new Error(`Invalid lastPeriodDate: ${lastPeriodDate}`);
  }

  const cycleStart = getCycleStartForDate(
    lastPeriod,
    cycleLengthDays,
    targetDate
  );
  const dayInCycle =
    daysBetween(cycleStart, toDateOnly(targetDate)) + 1;

  const phase = dayInCycleToPhase(dayInCycle, cycleLengthDays);

  return {
    phase,
    dayInCycle,
    cycleLength: cycleLengthDays,
  };
}
