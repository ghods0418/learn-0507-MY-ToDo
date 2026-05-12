# 나의 할일 목록 (To-Do Web App)

HTML, CSS, JavaScript만으로 만든 할 일 관리 웹앱입니다.  
브라우저 **LocalStorage**에 할 일·필터·테마 등을 저장해 새로고침 후에도 유지됩니다.

## 주요 기능

- 할 일 **추가** (빈 입력 시 `alert` 없이 빨간 안내 문구 + 입력창 **shake** 애니메이션)
- **Enter** 키로도 추가 가능
- 목록 **표시** 및 변경 시 즉시 다시 그리기
- **완료/미완료** 체크박스 토글
- 전체 보기에서 완료 항목은 미완료 아래로 정렬
- 할 일 **수정** (`prompt` 사용, 빈 수정 시 입력 영역에 안내)
- 할 일 **삭제**
- 필터: `전체(n)`, `완료(n)`, `미완료(n)`
- **다크/라이트** 테마 전환 (`🌙` / `☀️`)
- 하단 **동기부여 문구** 10종, 방문할 때마다 순환

## 구현 포인트 (학습용)

### 이벤트 위임 (Event Delegation)

삭제·수정 버튼마다 리스너를 붙이지 않고, 부모 `#todo-list`에 **클릭 리스너 하나**만 둡니다.  
`event.target`과 `closest('.todo-item')`, `closest('.delete-button')`, `closest('.edit-button')`으로 동작을 나누며, 새 항목이 생겨도 추가 등록이 필요 없습니다.

### 입력 오류 UX

- 에러 메시지는 `#todo-input` 아래 `#todo-input-error`에 표시되며, 평소에는 `.is-hidden`으로 숨깁니다.
- CSS 클래스 `.shake`로 입력창 좌우 흔들림을 주고, `animationend`에서 클래스를 제거해 같은 오류가 연속으로 나도 애니메이션이 다시 재생됩니다.
- 사용자가 다시 입력(`input` 이벤트)하면 메시지와 강조 효과가 사라집니다.

## LocalStorage 키

| 키 | 설명 |
| --- | --- |
| `simple-todo-list-items` | `{ todos, currentFilter }` 형태의 JSON 문자열 |
| `simple-todo-list-theme` | `"light"` 또는 `"dark"` |
| `simple-todo-list-quote-index` | 다음 문구 인덱스(숫자 문자열) |

## 파일 구조

```
learn-0507-MY-ToDo/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 실행 방법

1. 저장소를 클론하거나 ZIP으로 내려받습니다.
2. `index.html`을 브라우저에서 직접 열거나, 로컬 서버로 실행합니다.
   - PowerShell 예: `Set-Location`으로 프로젝트 폴더로 이동 후 `py -m http.server 5500`
3. 브라우저에서 `http://localhost:5500/` 접속

## GitHub Pages 배포

1. GitHub에 저장소를 만들고 이 프로젝트 파일을 푸시합니다.
2. 저장소 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 Source를 **Deploy from a branch**로 설정합니다.
4. 브랜치(예: `main`)와 폴더(`/ (root)`)를 선택한 뒤 저장합니다.
5. 안내된 Pages URL에서 동작을 확인합니다.

## 라이선스

개인 학습·포트폴리오 용도로 자유롭게 사용하실 수 있습니다.
