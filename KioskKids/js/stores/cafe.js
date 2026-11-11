/*
 * 카페 매장 데이터.
 * 이미지 파일이 아직 없으면 자동으로 메뉴명 플레이스홀더가 보인다.
 * 이미지 규격: 메뉴 800x800 (1:1), 대표 1200x900 (4:3), 로고 600x180 → img/README.md 참고
 */
registerStore({
  id: 'cafe',
  name: '카페',
  brand: 'CAFE MOMENT',          // 상단에 보이는 가상 매장명 (로고 이미지가 없을 때)
  icon: 'cup',
  logo: 'img/cafe/logo.png',
  cover: 'img/cafe/cover.webp',
  themeColor: '#5B3A29',
  ticketStart: 101,
  payments: ['card', 'point'],
  categories: [
    { id: 'coffee', name: '커피', items: [
      { id: 'americano',     name: '아메리카노',   price: 3000, img: 'img/cafe/americano.webp' },
      { id: 'latte',         name: '카페라떼',     price: 4000, img: 'img/cafe/latte.webp' },
      { id: 'vanilla-latte', name: '바닐라라떼',   price: 4000, img: 'img/cafe/vanilla-latte.webp' },
      { id: 'cappuccino',    name: '카푸치노',     price: 4000, img: 'img/cafe/cappuccino.webp' }
    ]},
    { id: 'beverage', name: '음료', items: [
      { id: 'strawberry-smoothie', name: '딸기스무디', price: 5000, img: 'img/cafe/strawberry-smoothie.webp' },
      { id: 'choco-latte',         name: '초코라떼',   price: 4000, img: 'img/cafe/choco-latte.webp' },
      { id: 'lemonade',            name: '레몬에이드', price: 4000, img: 'img/cafe/lemonade.webp' },
      { id: 'orange-juice',        name: '오렌지주스', price: 4000, img: 'img/cafe/orange-juice.webp' }
    ]},
    { id: 'dessert', name: '디저트', items: [
      { id: 'croissant',    name: '크루아상',   price: 3000, img: 'img/cafe/croissant.webp' },
      { id: 'cheesecake',   name: '치즈케이크', price: 5000, img: 'img/cafe/cheesecake.webp' },
      { id: 'choco-cookie', name: '초코쿠키',   price: 2000, img: 'img/cafe/choco-cookie.webp' },
      { id: 'macaron',      name: '마카롱',     price: 2000, img: 'img/cafe/macaron.webp' }
    ]}
  ]
});
