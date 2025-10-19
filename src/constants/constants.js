import { ERROR_MESSAGE } from './message/error-message.js';
import { PRINT_MESSAGE } from './message/print-message.js';

export const CONSTANTS = Object.freeze({
  ...ERROR_MESSAGE,
  ...PRINT_MESSAGE,
});
