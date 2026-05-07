# 나의 할일 목록 (To-Do Web App)

HTML, CSS, JavaScript만으로 구현한 할 일 관리 웹앱입니다.  
브라우저 LocalStorage를 사용해 할 일/필터/테마 상태를 저장합니다.

## 주요 기능

- 할 일 추가 (빈 입력 방지, Enter 키 추가 지원)
- 할 일 목록 표시 및 즉시 렌더링
- 완료/미완료 토글
- 완료 항목은 목록에서 미완료 아래로 자동 정렬
- 할 일 수정 (수정 시 자동으로 미완료 처리)
- 할 일 삭제
- 필터 버튼 제공: `전체(n)`, `완료(n)`, `미완료(n)`
- 다크모드/라이트모드 전환 (이모지 버튼: `🌙` / `☀️`)
- 하단 동기부여 문구 10종 순환 표시 (페이지 진입 시마다 변경)

## LocalStorage 저장 항목

- `todos`: 할 일 데이터 목록
- `currentFilter`: 현재 필터 상태 (`all`, `completed`, `active`)
- `simple-todo-list-theme`: 현재 테마 (`light`, `dark`)
- `simple-todo-list-quote-index`: 다음에 표시할 문구 인덱스

## 파일 구조

```
todo-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 실행 방법

1. 저장소를 클론하거나 파일을 다운로드합니다.
2. `index.html`을 브라우저에서 열거나 로컬 서버로 실행합니다.
   - 예시: `python -m http.server 5500`
3. 브라우저에서 `http://localhost:5500` 접속

## GitHub Pages 배포

1. GitHub 저장소를 생성하고 파일을 업로드합니다.
2. 저장소의 `Settings > Pages`로 이동합니다.
3. `Build and deployment`에서 Source를 `Deploy from a branch`로 설정합니다.
4. 브랜치(예: `main`)와 폴더(`/root`)를 선택 후 저장합니다.
5. 생성된 배포 URL에서 앱 동작을 확인합니다.
