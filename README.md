# javascript-calculator-precourse

## 기능 요구사항 체크리스트

### 핵심 기능
- [ ] **기본 구분자로 숫자 추출 및 합산**
  - 쉼표(,) 또는 콜론(:)을 구분자로 사용하여 문자열에서 숫자를 추출하고 더하기
  - 예: `""` => 0, `"1,2"` => 3, `"1,2,3"` => 6, `"1,2:3"` => 6

- [ ] **커스텀 구분자 처리**
  - 문자열 앞부분의 `//`와 `\n` 사이에 위치하는 문자를 커스텀 구분자로 인식하여 처리
  - 예: `"//;\n1;2;3"` => 6 (세미콜론이 커스텀 구분자)

- [ ] **빈 문자열 처리**
  - 빈 문자열 입력 시 0을 반환

- [ ] **잘못된 값 입력 시 에러 처리**
  - `[ERROR]`로 시작하는 메시지와 함께 Error를 발생시키고 애플리케이션 종료
  - 검증이 필요한 케이스:
    - **음수 입력**: `"1,-2,3"`, `"-1"`, `"//;\n1;-2"`
      - 에러: `ERROR_MESSAGE_NEGATIVE_NUMBER` - "음수는 입력할 수 없습니다."
    - **숫자가 아닌 문자**: `"1,a,3"`, `"abc"`, `"1,2,three"`
      - 에러: `ERROR_MESSAGE_NOT_A_NUMBER` - "숫자가 아닌 값이 포함되어 있습니다."
    - **구분자만 있는 경우**: `","`, `"::"`, `",,,"`, `"1,,3"`
      - 에러: `ERROR_MESSAGE_ONLY_SEPARATOR` - "구분자만 입력되었습니다."
      - 에러: `ERROR_MESSAGE_EMPTY_NUMBER` - "빈 숫자가 포함되어 있습니다."
    - **구분자로 시작/끝**: `",1,2"`, `"1,2,"`, `":1:2:"`
      - 에러: `ERROR_MESSAGE_STARTS_WITH_SEPARATOR` - "구분자로 시작할 수 없습니다."
      - 에러: `ERROR_MESSAGE_ENDS_WITH_SEPARATOR` - "구분자로 끝날 수 없습니다."
    - **공백 포함**: `"1, 2, 3"`, `" 1,2,3 "`, `"1 , 2"`
      - 에러: `ERROR_MESSAGE_CONTAINS_WHITESPACE` - "공백이 포함되어 있습니다."
    - **특수문자 혼합**: `"1@2"`, `"1#2#3"`, `"1.5,2.5"`
      - 에러: `ERROR_MESSAGE_INVALID_SPECIAL_CHARACTER` - "허용되지 않는 특수문자가 포함되어 있습니다."
    - **커스텀 구분자 형식 오류**: 
      - `"//\n1,2,3"` (구분자 누락)
        - 에러: `ERROR_MESSAGE_CUSTOM_SEPARATOR_MISSING` - "커스텀 구분자가 비어있습니다."
      - `"/;1;2;3"` (슬래시 1개만)
        - 에러: `ERROR_MESSAGE_INVALID_SLASH_COUNT` - "슬래시는 정확히 2개여야 합니다."
      - `"///\n1/2/3"` (슬래시 3개)
        - 에러: `ERROR_MESSAGE_INVALID_SLASH_COUNT` - "슬래시는 정확히 2개여야 합니다."
      - `"//;\n"` (숫자 없음)
        - 에러: `ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NUMBERS` - "커스텀 구분자 뒤에 숫자가 없습니다."
      - `"//;1;2;3"` (\n 누락)
        - 에러: `ERROR_MESSAGE_CUSTOM_SEPARATOR_NO_NEWLINE` - "커스텀 구분자 뒤에 개행 문자가 없습니다."
        - 에러: `ERROR_MESSAGE_CUSTOM_SEPARATOR_INVALID_FORMAT` - "커스텀 구분자 형식이 올바르지 않습니다."
    - **빈 숫자**: `"//;\n;;3"`, `"1,,3"`
      - 에러: `ERROR_MESSAGE_EMPTY_NUMBER` - "빈 숫자가 포함되어 있습니다."
    - **연속된 구분자**: `"1,,2"`, `"1::2"`, `"1,:2"`
      - 에러: `ERROR_MESSAGE_CONSECUTIVE_SEPARATORS` - "연속된 구분자가 있습니다."
      - 에러: `ERROR_MESSAGE_EMPTY_NUMBER` - "빈 숫자가 포함되어 있습니다."
    - **null/undefined**: null, undefined 입력
      - 에러: `ERROR_MESSAGE_NULL_INPUT` - "null 값은 입력할 수 없습니다."
      - 에러: `ERROR_MESSAGE_UNDEFINED_INPUT` - "undefined 값은 입력할 수 없습니다."
    - **매우 큰 숫자**: 오버플로우 가능성
      - 에러: `ERROR_MESSAGE_NUMBER_OVERFLOW` - "숫자가 너무 큽니다."
      - 에러: `ERROR_MESSAGE_NUMBER_TOO_LARGE` - "허용 범위를 초과한 숫자입니다."
    - **0으로 시작하는 숫자**: `"01,02,03"` (유효한지 확인 필요)
      - 참고: JavaScript Number()는 자동으로 처리하므로 에러 없이 동작 가능
    - **소수점**: `"1.5,2.5"` (정수만 허용하는지 확인)
      - 에러: `ERROR_MESSAGE_DECIMAL_NOT_ALLOWED` - "소수점은 허용되지 않습니다."
      - 에러: `ERROR_MESSAGE_ONLY_INTEGER_ALLOWED` - "정수만 입력 가능합니다."
    - **여러 줄 입력**: 개행 문자 포함
      - 에러: `ERROR_MESSAGE_MULTIPLE_LINES` - "여러 줄 입력은 허용되지 않습니다."
    - **이모지/유니코드**: `"1🎉2"`, `"1가2"`
      - 에러: `ERROR_MESSAGE_EMOJI_NOT_ALLOWED` - "이모지는 입력할 수 없습니다."
      - 에러: `ERROR_MESSAGE_INVALID_CHARACTER` - "허용되지 않는 문자가 포함되어 있습니다."

  - 기존 에러 메시지 (추가 활용 가능):
    - `ERROR_MESSAGE_NOT_INCLUDE_SEPARATOR` - "사용자 정의 구분자가 포함되어 있지 않습니다."
    - `ERROR_MESSAGE_CANNOT_CONVERT_NUMBER` - "숫자로 변환할 수 없는 값이 포함되어 있습니다."
    - `ERROR_MESSAGE_INVALID_INPUT` - "입력값이 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_NUMBER_LENGTH` - "숫자의 길이가 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_NUMBER_RANGE` - "숫자의 범위가 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_SEPARATOR_LENGTH` - "구분자의 길이가 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_SEPARATOR_TYPE` - "타입이 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_VALUE_LENGTH` - "값의 길이가 올바르지 않습니다."
    - `ERROR_MESSAGE_INVALID_FORMAT` - "잘못된 형식입니다."

### 입출력
- [ ] **사용자 입력 받기**
  - `Console.readLineAsync()`를 사용하여 "덧셈할 문자열을 입력해 주세요." 프롬프트와 함께 입력 받기

- [ ] **결과 출력**
  - `Console.print()`를 사용하여 `결과 : {합계}` 형식으로 출력

### 구현 및 검증
- [ ] **App.js run() 메서드 구현**
  - 프로그램 실행의 시작점인 `App.js`의 `run()` 메서드에서 전체 로직 구현
  - `@woowacourse/mission-utils`의 Console API 사용

- [ ] **테스트 케이스 검증**
  - `__tests__/ApplicationTest.js`의 테스트가 통과하는지 확인

## 실행 결과 예시
```
덧셈할 문자열을 입력해 주세요.
1,2:3
결과 : 6
```

## 프로그래밍 요구 사항
- Node.js 22.19.0 버전에서 실행 가능
- 프로그램 실행의 시작점은 `App.js`의 `run()`
- `package.json` 파일은 변경 불가
- 제공된 라이브러리 외의 외부 라이브러리 사용 금지
- 프로그램 종료 시 `process.exit()` 호출 금지
- JavaScript Style Guide 준수