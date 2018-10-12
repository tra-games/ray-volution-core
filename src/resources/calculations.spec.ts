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
    let x0 = 156;

    const inOneMinute = moment(now).add(1, 'm');
    expect(calculateResource(x0, 1, now, inOneMinute)).toBe(x0 + 60);
  });
});
