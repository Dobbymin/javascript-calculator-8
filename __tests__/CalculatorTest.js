import Calculator from '../src/model/Calculator.js';

describe('Calculator 에러 케이스 테스트', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('입력값 검증 에러', () => {
    test('null 입력', () => {
      expect(() => calculator.calculate(null)).toThrow('[ERROR] null 값은 입력할 수 없습니다.');
    });

    test('undefined 입력', () => {
      expect(() => calculator.calculate(undefined)).toThrow('[ERROR] undefined 값은 입력할 수 없습니다.');
    });

    test('숫자 타입 입력', () => {
      expect(() => calculator.calculate(123)).toThrow('[ERROR] 입력값이 올바르지 않습니다.');
    });
  });

  describe('숫자 관련 에러', () => {
    test('음수 입력', () => {
      expect(() => calculator.calculate('1,-2,3')).toThrow('[ERROR] 음수는 입력할 수 없습니다.');
    });

    test('숫자가 아닌 문자', () => {
      expect(() => calculator.calculate('1,a,3')).toThrow('[ERROR] 숫자로 변환할 수 없는 값이 포함되어 있습니다.');
    });

    test('빈 숫자 (연속 구분자)', () => {
      expect(() => calculator.calculate('1,,3')).toThrow('[ERROR] 연속된 구분자가 있습니다.');
    });

    test('소수점 포함', () => {
      expect(() => calculator.calculate('1.5,2.5')).toThrow('[ERROR] 소수점은 허용되지 않습니다.');
    });

    test('매우 큰 숫자 (오버플로우)', () => {
      expect(() => calculator.calculate('9007199254740992,1')).toThrow('[ERROR] 숫자가 너무 큽니다.');
    });
  });

  describe('구분자 관련 에러', () => {
    test('구분자로 시작', () => {
      expect(() => calculator.calculate(',1,2')).toThrow('[ERROR] 구분자로 시작할 수 없습니다.');
    });

    test('구분자로 끝', () => {
      expect(() => calculator.calculate('1,2,')).toThrow('[ERROR] 구분자로 끝날 수 없습니다.');
    });

    test('연속된 구분자', () => {
      expect(() => calculator.calculate('1::2')).toThrow('[ERROR] 연속된 구분자가 있습니다.');
    });

    test('공백 포함', () => {
      expect(() => calculator.calculate('1, 2, 3')).toThrow('[ERROR] 공백이 포함되어 있습니다.');
    });

    test('특수문자 혼합', () => {
      expect(() => calculator.calculate('1@2')).toThrow('[ERROR] 허용되지 않는 특수문자가 포함되어 있습니다.');
    });
  });

  describe('커스텀 구분자 관련 에러', () => {
    test('커스텀 구분자 비어있음', () => {
      expect(() => calculator.calculate('//\\n1,2,3')).toThrow('[ERROR] 커스텀 구분자가 비어있습니다.');
    });

    test('개행 문자 누락', () => {
      expect(() => calculator.calculate('//;1;2;3')).toThrow('[ERROR] 커스텀 구분자 뒤에 개행 문자가 없습니다.');
    });

    test('숫자 없음', () => {
      expect(() => calculator.calculate('//;\\n')).toThrow('[ERROR] 커스텀 구분자 뒤에 숫자가 없습니다.');
    });

    test('슬래시 1개만', () => {
      expect(() => calculator.calculate('/;\\n1;2;3')).toThrow('[ERROR] 슬래시는 정확히 2개여야 합니다.');
    });

    test('슬래시 3개', () => {
      expect(() => calculator.calculate('///\\n1/2/3')).toThrow('[ERROR] 슬래시는 정확히 2개여야 합니다.');
    });

    test('커스텀 구분자 연속', () => {
      expect(() => calculator.calculate('//;\\n1;;3')).toThrow('[ERROR] 연속된 구분자가 있습니다.');
    });
  });

  describe('문자 관련 에러', () => {
    test('이모지 포함', () => {
      expect(() => calculator.calculate('1🎉2')).toThrow('[ERROR] 이모지는 입력할 수 없습니다.');
    });

    test('한글 포함', () => {
      expect(() => calculator.calculate('1가2')).toThrow('[ERROR] 허용되지 않는 문자가 포함되어 있습니다.');
    });

    test('여러 줄 입력', () => {
      expect(() => calculator.calculate('1,2\\n3,4')).toThrow('[ERROR] 여러 줄 입력은 허용되지 않습니다.');
    });
  });

  describe('정상 동작 케이스', () => {
    test('빈 문자열', () => {
      expect(calculator.calculate('')).toBe(0);
    });

    test('기본 구분자 쉼표', () => {
      expect(calculator.calculate('1,2,3')).toBe(6);
    });

    test('기본 구분자 콜론', () => {
      expect(calculator.calculate('1:2:3')).toBe(6);
    });

    test('기본 구분자 혼합', () => {
      expect(calculator.calculate('1,2:3')).toBe(6);
    });

    test('커스텀 구분자', () => {
      expect(calculator.calculate('//;\\n1;2;3')).toBe(6);
    });

    test('0으로 시작하는 숫자', () => {
      expect(calculator.calculate('01,02,03')).toBe(6);
    });
  });
});
