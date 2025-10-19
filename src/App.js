import { MissionUtils } from '@woowacourse/mission-utils';

class App {
  async run() {
    const input = await MissionUtils.Console.readLineAsync(
      '덧셈할 문자열을 입력해 주세요.\n',
    );

    let separatorPatterns = [',', ':'];
    let numbersString = input;

    // 커스텀 구분자 처리
    if (input.startsWith('//')) {
      let separatorEndIndex = input.indexOf('\n');

      if (separatorEndIndex === -1) {
        separatorEndIndex = input.indexOf('\\n');
      }

      if (separatorEndIndex === -1) {
        throw new Error('[ERROR] 잘못된 형식입니다.');
      }

      const customSeparator = input.substring(2, separatorEndIndex);

      if (customSeparator.length === 0) {
        throw new Error('[ERROR] 구분자가 비어있습니다.');
      }

      separatorPatterns.push(customSeparator);

      const skipLength = input[separatorEndIndex] === '\\' ? 2 : 1;
      numbersString = input.substring(separatorEndIndex + skipLength);
    }

    // 빈 문자열 처리
    if (numbersString === '') {
      MissionUtils.Console.print('결과 : 0');
      return;
    }

    const separatorRegex = new RegExp(separatorPatterns.join('|'), 'g');
    const numbers = numbersString.split(separatorRegex);

    // 합계 계산
    let result = 0;
    for (const num of numbers) {
      const trimmedNum = num.trim();

      if (trimmedNum === '') {
        throw new Error('[ERROR] 빈 숫자가 포함되어 있습니다.');
      }

      const parsedNum = Number(trimmedNum);

      // NaN 체크 (숫자가 아닌 값)
      if (isNaN(parsedNum)) {
        throw new Error('[ERROR] 숫자가 아닌 값이 포함되어 있습니다.');
      }

      // 음수 체크
      if (parsedNum < 0) {
        throw new Error('[ERROR] 음수는 입력할 수 없습니다.');
      }

      result += parsedNum;
    }

    MissionUtils.Console.print(`결과 : ${result}`);
  }
}

export default App;
