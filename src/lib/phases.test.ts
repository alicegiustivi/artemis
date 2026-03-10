import { describe, it, expect } from 'vitest';
import { getPhaseForDate } from './phases';

describe('getPhaseForDate', () => {
  const lastPeriod28 = '2025-03-01';
  const cycleLength28 = 28;

  it('returns menstrual and dayInCycle 1 on first day of cycle', () => {
    const result = getPhaseForDate(
      lastPeriod28,
      cycleLength28,
      new Date('2025-03-01')
    );
    expect(result.phase).toBe('menstrual');
    expect(result.dayInCycle).toBe(1);
    expect(result.cycleLength).toBe(28);
  });

  it('returns follicular for mid-follicular day (day 9)', () => {
    const result = getPhaseForDate(
      lastPeriod28,
      cycleLength28,
      new Date('2025-03-09')
    );
    expect(result.phase).toBe('follicular');
    expect(result.dayInCycle).toBe(9);
  });

  it('returns ovulatory for ovulation window (day 15)', () => {
    const result = getPhaseForDate(
      lastPeriod28,
      cycleLength28,
      new Date('2025-03-15')
    );
    expect(result.phase).toBe('ovulatory');
    expect(result.dayInCycle).toBe(15);
  });

  it('returns luteal for mid-luteal day (day 22)', () => {
    const result = getPhaseForDate(
      lastPeriod28,
      cycleLength28,
      new Date('2025-03-22')
    );
    expect(result.phase).toBe('luteal');
    expect(result.dayInCycle).toBe(22);
  });

  it('scales phase boundaries for non-28-day cycle (32 days)', () => {
    const lastPeriod32 = '2025-03-01';
    const cycleLength32 = 32;
    // Day 15 in 28-day is ovulatory; in 32-day scaled boundaries:
    // menstrualEnd = round(5*32/28)=6, follicularEnd = round(13*32/28)=15, ovulatoryEnd = round(16*32/28)=18
    // So day 15 in 32-day is still follicular (6-15). Day 17 should be ovulatory.
    const resultFollicular = getPhaseForDate(
      lastPeriod32,
      cycleLength32,
      new Date('2025-03-15')
    );
    expect(resultFollicular.phase).toBe('follicular');
    expect(resultFollicular.dayInCycle).toBe(15);
    expect(resultFollicular.cycleLength).toBe(32);

    const resultOvulatory = getPhaseForDate(
      lastPeriod32,
      cycleLength32,
      new Date('2025-03-17')
    );
    expect(resultOvulatory.phase).toBe('ovulatory');
    expect(resultOvulatory.dayInCycle).toBe(17);
  });

  it('handles targetDate before lastPeriodDate (previous cycle)', () => {
    const result = getPhaseForDate(
      lastPeriod28,
      cycleLength28,
      new Date('2025-02-25')
    );
    expect(result.phase).toBe('luteal');
    expect(result.dayInCycle).toBeGreaterThanOrEqual(17);
    expect(result.dayInCycle).toBeLessThanOrEqual(28);
    expect(result.cycleLength).toBe(28);
  });
});
