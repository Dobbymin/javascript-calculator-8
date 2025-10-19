import { CONSTANTS } from '../constants/constants.js';

const {
  SEPARATOR_COMMON,
  ERROR_MESSAGE_NOT_INCLUDE_SEPARATOR,
  ERROR_MESSAGE_CANNOT_CONVERT_NUMBER,
  ERROR_MESSAGE_NEGATIVE_NUMBER,
  ERROR_MESSAGE_EMPTY_NUMBER,
  SEPARATOR_CUSTOM_START,
  NUMBERS_ZERO,
} = CONSTANTS;

/**
 * 계산기 모델
 * 숫자 계산과 관련된 비즈니스 로직을 담당
 */
class Calculator {
  /**
   * 구분자로 분리된 숫자들의 합을 계산
   * @param {string} input - 사용자 입력 문자열
   * @returns {number} - 계산 결과
   */
  calculate(input) {
    // 빈 문자열 처리
    if (input === '') {
      return NUMBERS_ZERO;
    }

    // 커스텀 구분자 여부 판별
    if (input.startsWith(SEPARATOR_CUSTOM_START)) {
      return this.#calculateWithCustomSeparator(input);
    }

    return this.#calculateWithCommonSeparator(input);
  }

  /**
   * 기본 구분자(쉼표, 콜론)로 계산
   * @private
   */
  #calculateWithCommonSeparator(input) {
    const numbers = input.split(SEPARATOR_COMMON);
    return this.#sumNumbers(numbers);
  }

  /**
   * 커스텀 구분자로 계산
   * @private
   */
  #calculateWithCustomSeparator(input) {
    const { separator, numbersString } = this.#parseCustomSeparator(input);
    const numbers = numbersString.split(separator);
    return this.#sumNumbers(numbers);
  }

  /**
   * 커스텀 구분자 파싱
   * @private
   */
  #parseCustomSeparator(input) {
    // 실제 개행 문자(\n) 또는 이스케이프된 문자열(\\n) 찾기
    let endIndex = input.indexOf('\n');
    let skipLength = 1;

    if (endIndex === -1) {
      endIndex = input.indexOf('\\n');
      skipLength = 2;
    }

    if (endIndex === -1) {
      throw new Error(ERROR_MESSAGE_NOT_INCLUDE_SEPARATOR);
    }

    const separator = input.slice(SEPARATOR_CUSTOM_START.length, endIndex);

    if (!separator) {
      throw new Error(ERROR_MESSAGE_NOT_INCLUDE_SEPARATOR);
    }

    const numbersString = input.slice(endIndex + skipLength);

    return { separator, numbersString };
  }

  /**
   * 숫자 배열의 합 계산
   * @private
   */
  #sumNumbers(numbers) {
    let sum = NUMBERS_ZERO;

    for (const numberString of numbers) {
      const trimmed = numberString.trim();

      // 빈 문자열 체크
      if (trimmed === '') {
        throw new Error(ERROR_MESSAGE_EMPTY_NUMBER);
      }

      const num = Number(trimmed);

      // NaN 체크
      if (Number.isNaN(num)) {
        throw new Error(ERROR_MESSAGE_CANNOT_CONVERT_NUMBER);
      }

      // 음수 체크
      if (num < 0) {
        throw new Error(ERROR_MESSAGE_NEGATIVE_NUMBER);
      }

      sum += num;
    }

    return sum;
  }
}

export default Calculator;
