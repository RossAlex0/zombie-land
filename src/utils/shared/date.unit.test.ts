import { describe, expect, test } from 'vitest';
import { endOfUtcDay, getNbDays, startOfUtcDay } from './date';

describe('getNbDays', () => {
  test('it should count both the first and the last day of a booking', () => {
    //ARRANGE
    const from = new Date('2026-06-10T00:00:00.000Z');
    const to = new Date('2026-06-12T00:00:00.000Z');

    //ACT
    const result = getNbDays(from, to);

    //ASSERT
    expect(result).toBe(3);
  });
});

describe('startOfUtcDay and endOfUtcDay', () => {
  test('it should frame a whole day so that no booking of that day is missed', () => {
    //ARRANGE
    const date = new Date('2026-06-09T10:00:00.000Z');
    const bookedAt = new Date('2026-06-09T23:58:00.000Z');

    //ACT
    const start = startOfUtcDay(date);
    const end = endOfUtcDay(date);

    //ASSERT
    expect(start.toISOString()).toBe('2026-06-09T00:00:00.000Z');
    expect(end.toISOString()).toBe('2026-06-09T23:59:59.999Z');
    expect(bookedAt >= start && bookedAt <= end).toBe(true);
  });
});
