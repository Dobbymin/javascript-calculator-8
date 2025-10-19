import CalculatorController from './controller/CalculatorController.js';

/**
 * 애플리케이션 진입점
 * Controller를 생성하고 실행
 */
class App {
  async run() {
    const controller = new CalculatorController();
    await controller.run();
  }
}

export default App;
