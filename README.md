# SAINT-VEIL ARCHIVE · 재가 되어버린 고체(固體)

리핀 캐릭터 챗의 비공식 공개 세계관·캐릭터 안내 홈페이지. 반응형 HTML/CSS/JavaScript만 사용합니다. 별도의 설치·빌드 과정은 필요하지 않습니다.

## 구성

- `index.html` — 모든 페이지와 콘텐츠
- `styles.css` — 디자인, 모바일 반응형 레이아웃
- `script.js` — 메뉴, 세계관 검색, 접기/펼치기, 복사, 랜덤 이벤트
- `assets/cover.webp` — 기존 3인 합성 표지
- `assets/ash.webp`, `ian.webp`, `luca.webp` — 기존 인장 이미지
- `.nojekyll` — GitHub Pages에서 정적 파일 그대로 공개

## GitHub Pages 업로드

1. GitHub에서 **New repository** → 예시 이름 `saint-veil-guide` → **Public**으로 생성.
2. 해당 저장소에서 **Add file → Upload files**를 열고 이 폴더 안의 파일·`assets` 폴더를 업로드하여 `main`에 커밋. (압축 ZIP 자체를 올리는 것이 아니라 내부 파일을 업로드합니다.)
3. 저장소의 **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. 잠시 기다린 뒤 Pages 화면에 게시 주소가 나타나는지 확인. 보통 `https://<사용자명>.github.io/saint-veil-guide/` 형태입니다.
5. 해당 주소를 리핀 제작자 코멘트에 복사해 링크로 안내합니다.

로컬 미리보기는 `index.html`을 브라우저로 열면 됩니다. 링크를 통해 배포하는 것은 별도의 작업입니다.

## 편집

- 내용은 `index.html`에서 한글 텍스트를 찾아 변경할 수 있습니다.
- 이미지 교체는 `assets`의 같은 파일 이름으로 교체합니다.
- 새로운 캐릭터나 페이지는 코드 수정이 필요합니다.

> 주의: 사이트에 올린 이미지와 텍스트는 공개 웹에서 열람·저장할 수 있습니다. 현재 제공한 파일에는 작품의 비밀 로어북과 성인 이미지를 포함하지 않았습니다.
