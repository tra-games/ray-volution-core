import * as moment from 'moment';
import { Moment } from 'moment';

let _moment = moment;

export function calculateResource(
  x0: number,
  v: number,
  from: Moment,
  to: Moment = _moment(),
): number {
  return Math.round(x0 + v * to.diff(from, 'ms') / 1000);
}
