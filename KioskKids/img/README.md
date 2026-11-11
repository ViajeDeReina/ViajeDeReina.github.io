# 이미지 넣는 곳

파일이 없으면 화면에 메뉴명 플레이스홀더가 대신 보입니다. 아래 파일명 그대로 넣으면 바로 바뀝니다.
파일명을 바꾸려면 `js/stores/<매장>.js` 의 `img` / `cover` / `logo` 경로를 함께 고치세요.

## 규격

| 종류 | 크기 | 형식 | 비고 |
| --- | --- | --- | --- |
| 메뉴 사진 | 800×800 (1:1) | WebP (투명 배경 가능) | 피사체 가운데, 화면의 70~80%. 개당 150KB 이하 |
| 매장 대표 이미지 `cover.webp` | 1200×900 (4:3) | WebP/JPG | 홈 화면 카드. 꽉 채워 잘림(cover) |
| 매장 로고 `logo.png` | 600×180 (가로형) | 투명 PNG | 상단 바(매장 색 배경) 위에 올라가므로 흰색 로고 권장 |

결제수단 아이콘과 결제 안내 그림은 코드(SVG)로 그려져 있어 이미지가 필요 없습니다.

## 카페 `img/cafe/`

- logo.png, cover.webp
- americano.webp, latte.webp, vanilla-latte.webp, cappuccino.webp
- strawberry-smoothie.webp, choco-latte.webp, lemonade.webp, orange-juice.webp
- croissant.webp, cheesecake.webp, choco-cookie.webp, macaron.webp

## 햄버거 가게 `img/burger/`

- logo.png, cover.webp
- cheese-burger.webp, bulgogi-burger.webp, chicken-burger.webp, shrimp-burger.webp
- fries.webp, nuggets.webp, cheese-stick.webp, corn-salad.webp
- cola.webp, cider.webp, orange-juice.webp, ice-cream.webp

## 새 매장 추가

1. `js/stores/cafe.js` 를 복사해 `js/stores/<새매장>.js` 로 만들고 내용 수정
2. `index.html` 의 매장 데이터 부분에 `<script src="js/stores/<새매장>.js"></script>` 한 줄 추가
3. `img/<새매장>/` 폴더에 이미지 넣기
