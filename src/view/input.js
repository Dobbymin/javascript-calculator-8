import { MissionUtils } from '@woowacourse/mission-utils';

import { CONSTANTS } from '../constants/constants.js';

const { INPUT_MESSAGE } = CONSTANTS;

export default async function getStringInput() {
  const inputString = await MissionUtils.Console.readLineAsync(INPUT_MESSAGE);

  return inputString;
}
