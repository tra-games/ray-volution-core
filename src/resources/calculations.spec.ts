import * as moment from 'moment';

import { calculateResource } from './calculations';

describe('calculateResource', () => {
  it('should return x0 when from equals to', () => {
    const now = moment();
    let x0 = 156;

    expect(calculateResource(x0, 0, now, now)).toBe(x0);

    const inOneMinute = moment(now).add(1, 'm');
    expect(calculateResource(x0, 0, inOneMinute, inOneMinute)).toBe(x0);

    const inOneDay = moment(now).add(1, 'd');
    expect(calculateResource(x0, 0, inOneDay, inOneDay)).toBe(x0);
  });

  it('should return x0 + 60 when to is one minute later than from with v = 1', () => {
    const now = moment();
    const x0 = 156;

    const inOneMinute = moment(now).add(1, 'm');
    expect(calculateResource(x0, 1, now, inOneMinute)).toBe(x0 + 60);
  });

  it('should return x0 + 1 when to is 500ms later than from with v = 2', () => {
    const now = moment();
    const x0 = 156;

    const inOneMinute = moment(now).add(500, 'ms');
    expect(calculateResource(x0, 2, now, inOneMinute)).toBe(x0 + 1);
  });

  describe('rounding', () => {
    it('should return x0 + 1 when to is 749ms later than from with v = 2', () => {
      const now = moment();
      const x0 = 156;

      const inOneMinute = moment(now).add(749, 'ms');
      expect(calculateResource(x0, 2, now, inOneMinute)).toBe(x0 + 1);
    });

    it('should return x0 + 3 when to is 750ms later than from with v = 2', () => {
      const now = moment();
      const x0 = 156;

      const inOneMinute = moment(now).add(750, 'ms');
      expect(calculateResource(x0, 2, now, inOneMinute)).toBe(x0 + 2);
    });
  });
});
