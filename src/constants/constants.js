import { ERROR_MESSAGE } from './message/error-message.js';
import { PRINT_MESSAGE } from './message/print-message.js';
import { SEPARATOR } from './separator/separator.js';
import { NUMBER } from './number/number.js';

export const CONSTANTS = Object.freeze({
  ...ERROR_MESSAGE,
  ...PRINT_MESSAGE,
  ...SEPARATOR,
  ...NUMBER,
});
