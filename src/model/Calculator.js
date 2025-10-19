import { CONSTANTS } from '../constants/constants.js';

const {
  SEPARATOR_COMMON,
  SEPARATOR_CUSTOM_START,
  NUMBERS_ZERO,
  // 입력값 검증 에러
  ERROR_MESSAGE_INVALID_INPUT,
  ERROR_MESSAGE_NULL_INPUT,
  ERROR_MESSAGE_UNDEFINED_INPUT,
  ERROR_MESSAGE_INVALID_FORMAT,
  // 숫자 관련 에러
  ERROR_MESSAGE_NOT_A_NUMBER,
  ERROR_MESSAGE_CANNOT_CONVERT_NUMBER,
  ERROR_MESSAGE_NEGATIVE_NUMBER,
  ERROR_MESSAGE_EMPTY_NUMBER,
  ERROR_MESSAGE_NUMBER_OVERFLOW,
  ERROR_MESSAGE_DECIMAL_NOT_ALLOWED,
  // 구분자 관련 에러
  ERROR_MESSAGE_ONLY_SEPARATOR,
  ERROR_MESSAGE_STARTS_WITH_SEPARATOR,
  ERROR_MESSAGE_ENDS_WITH_SEPARATOR,
  ERROR_MESSAGE_CONSECUTIVE_SEPARATORS,
  // 커스텀 구분자 관련 에러
  ERROR_MESSAGE_NOT_INCLUDE_SEPARATOR,
  ERROR_MESSAGE_CUSTOM_SEPARATOR_MISSING,
  ERROR_MESSAGE_CUSTOM_SEPARATOR_INVALID_FORMAT,
  ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NEWLINE,
  ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NUMBERS,
  ERROR_MESSAGE_INVALID_SLASH_COUNT,
  // 문자 관련 에러
  ERROR_MESSAGE_CONTAINS_WHITESPACE,
  ERROR_MESSAGE_INVALID_SPECIAL_CHARACTER,
  ERROR_MESSAGE_INVALID_CHARACTER,
  ERROR_MESSAGE_EMOJI_NOT_ALLOWED,
  ERROR_MESSAGE_MULTIPLE_LINES,
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
    // null/undefined 체크
    this.#validateNullOrUndefined(input);

    // 빈 문자열 처리
    if (input === '') {
      return NUMBERS_ZERO;
    }

    // 기본 입력 검증
    this.#validateBasicInput(input);

    // 커스텀 구분자 여부 판별
    if (input.startsWith(SEPARATOR_CUSTOM_START)) {
      return this.#calculateWithCustomSeparator(input);
    }

    return this.#calculateWithCommonSeparator(input);
  }

  /**
   * null/undefined 검증
   * @private
   */
  #validateNullOrUndefined(input) {
    if (input === null) {
      throw new Error(ERROR_MESSAGE_NULL_INPUT);
    }
    if (input === undefined) {
      throw new Error(ERROR_MESSAGE_UNDEFINED_INPUT);
    }
  }

  /**
   * 기본 입력 검증
   * @private
   */
  #validateBasicInput(input) {
    // 타입 체크
    if (typeof input !== 'string') {
      throw new Error(ERROR_MESSAGE_INVALID_INPUT);
    }

    // 슬래시로 시작하는데 '//'가 아닌 경우 (커스텀 구분자 형식 오류)
    if (input.startsWith('/') && !input.startsWith(SEPARATOR_CUSTOM_START)) {
      throw new Error(ERROR_MESSAGE_INVALID_SLASH_COUNT);
    }

    // 커스텀 구분자 형식이 아닌 경우에만 특수 검증 수행
    if (!input.startsWith(SEPARATOR_CUSTOM_START)) {
      // 여러 줄 입력 체크 (가장 먼저)
      if (input.includes('\n') || input.includes('\\n')) {
        throw new Error(ERROR_MESSAGE_MULTIPLE_LINES);
      }

      // 공백 체크
      if (/\s/.test(input)) {
        throw new Error(ERROR_MESSAGE_CONTAINS_WHITESPACE);
      }

      // 이모지 체크
      const emojiPattern =
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/u;
      if (emojiPattern.test(input)) {
        throw new Error(ERROR_MESSAGE_EMOJI_NOT_ALLOWED);
      }

      // 알파벳 체크 (숫자로 변환 불가)
      if (/[a-zA-Z]/.test(input)) {
        throw new Error(ERROR_MESSAGE_CANNOT_CONVERT_NUMBER);
      }

      // 한글 체크
      if (/[가-힣]/.test(input)) {
        throw new Error(ERROR_MESSAGE_INVALID_CHARACTER);
      }

      // 특수문자 체크 (숫자, 쉼표, 콜론, 마이너스, 점만 허용)
      const specialCharRegex = /[^0-9,:.\-]/;
      if (specialCharRegex.test(input)) {
        throw new Error(ERROR_MESSAGE_INVALID_SPECIAL_CHARACTER);
      }
    }
  }

  /**
   * 기본 구분자(쉼표, 콜론)로 계산
   * @private
   */
  #calculateWithCommonSeparator(input) {
    // 연속 구분자 검증 (먼저 체크)
    this.#validateConsecutiveSeparators(input, /[,:]/);

    // 구분자 위치 검증
    this.#validateSeparatorPosition(input, /[,:]/);

    const numbers = input.split(SEPARATOR_COMMON);
    return this.#sumNumbers(numbers);
  }

  /**
   * 커스텀 구분자로 계산
   * @private
   */
  #calculateWithCustomSeparator(input) {
    // 슬래시 개수 검증
    this.#validateSlashCount(input);

    const { separator, numbersString } = this.#parseCustomSeparator(input);

    // 숫자 문자열이 비어있는지 검증
    if (numbersString === '') {
      throw new Error(ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NUMBERS);
    }

    // 커스텀 구분자에 대한 연속 구분자 검증
    const separatorRegex = new RegExp(
      separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g',
    );
    this.#validateConsecutiveSeparators(numbersString, separatorRegex);

    const numbers = numbersString.split(separator);
    return this.#sumNumbers(numbers);
  }

  /**
   * 슬래시 개수 검증
   * @private
   */
  #validateSlashCount(input) {
    if (!input.startsWith('//')) {
      throw new Error(ERROR_MESSAGE_INVALID_SLASH_COUNT);
    }
    // 3개 이상의 슬래시 체크
    if (input.startsWith('///')) {
      throw new Error(ERROR_MESSAGE_INVALID_SLASH_COUNT);
    }
  }

  /**
   * 구분자 위치 검증 (시작/끝)
   * @private
   */
  #validateSeparatorPosition(input, separatorRegex) {
    const firstChar = input[0];
    const lastChar = input[input.length - 1];

    if (separatorRegex.test(firstChar)) {
      throw new Error(ERROR_MESSAGE_STARTS_WITH_SEPARATOR);
    }

    if (separatorRegex.test(lastChar)) {
      throw new Error(ERROR_MESSAGE_ENDS_WITH_SEPARATOR);
    }
  }

  /**
   * 연속된 구분자 검증
   * @private
   */
  #validateConsecutiveSeparators(input, separatorRegex) {
    // 기본 구분자인 경우: ,, 또는 :: 또는 ,: 또는 :, 체크
    if (separatorRegex.source === '[,:]') {
      if (/,,|::|,:|:,/.test(input)) {
        throw new Error(ERROR_MESSAGE_CONSECUTIVE_SEPARATORS);
      }
    } else {
      // 커스텀 구분자인 경우
      const pattern = new RegExp(
        `${separatorRegex.source}${separatorRegex.source}`,
      );
      if (pattern.test(input)) {
        throw new Error(ERROR_MESSAGE_CONSECUTIVE_SEPARATORS);
      }
    }
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
      throw new Error(ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NEWLINE);
    }

    const separator = input.slice(SEPARATOR_CUSTOM_START.length, endIndex);

    if (!separator) {
      throw new Error(ERROR_MESSAGE_CUSTOM_SEPARATOR_MISSING);
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

      // 소수점 체크
      if (trimmed.includes('.')) {
        throw new Error(ERROR_MESSAGE_DECIMAL_NOT_ALLOWED);
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

      // 오버플로우 체크 (JavaScript의 안전한 정수 범위)
      if (!Number.isSafeInteger(num)) {
        throw new Error(ERROR_MESSAGE_NUMBER_OVERFLOW);
      }

      sum += num;
    }

    return sum;
  }
}

export default Calculator;
