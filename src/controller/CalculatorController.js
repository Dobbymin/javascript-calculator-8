import Calculator from '../model/Calculator.js';
import { getStringInput } from '../view/input.js';
import { printResult } from '../view/output.js';

/**
 * 계산기 컨트롤러
 * Model과 View를 연결하고 애플리케이션 흐름을 제어
 */
class CalculatorController {
  #calculator;

  constructor() {
    this.#calculator = new Calculator();
  }

  /**
   * 애플리케이션 실행
   */
  async run() {
    try {
      // View에서 입력 받기
      const input = await getStringInput();

      // Model에서 계산
      const result = this.#calculator.calculate(input);

      // View로 결과 출력
      printResult(result);
    } catch (error) {
      // 에러 발생 시 그대로 throw (테스트를 위해)
      throw error;
    }
  }
}

export default CalculatorController;
