import * as moment from 'moment';
import { Moment } from 'moment';

export function calculateResource(
  x0: number,
  v: number,
  from: Moment,
  to: Moment = moment(),
): number {
  return x0 + v * to.diff(from, 's');
}
