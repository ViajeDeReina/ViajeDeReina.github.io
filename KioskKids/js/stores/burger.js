/*
 * 햄버거 가게 매장 데이터.
 */
registerStore({
  id: 'burger',
  name: '햄버거 가게',
  brand: 'BURGER STATION',
  icon: 'burger',
  logo: 'img/burger/logo.png',
  cover: 'img/burger/cover.webp',
  themeColor: '#C8102E',
  ticketStart: 201,
  payments: ['card', 'point'],
  categories: [
    { id: 'burger', name: '버거', items: [
      { id: 'cheese-burger',   name: '치즈버거',   price: 5000, img: 'img/burger/cheese-burger.webp' },
      { id: 'bulgogi-burger',  name: '불고기버거', price: 5000, img: 'img/burger/bulgogi-burger.webp' },
      { id: 'chicken-burger',  name: '치킨버거',   price: 6000, img: 'img/burger/chicken-burger.webp' },
      { id: 'shrimp-burger',   name: '새우버거',   price: 6000, img: 'img/burger/shrimp-burger.webp' }
    ]},
    { id: 'side', name: '사이드', items: [
      { id: 'fries',         name: '감자튀김',   price: 2000, img: 'img/burger/fries.webp' },
      { id: 'nuggets',       name: '치킨너겟',   price: 3000, img: 'img/burger/nuggets.webp' },
      { id: 'cheese-stick',  name: '치즈스틱',   price: 2000, img: 'img/burger/cheese-stick.webp' },
      { id: 'corn-salad',    name: '콘샐러드',   price: 2000, img: 'img/burger/corn-salad.webp' }
    ]},
    { id: 'drink', name: '음료·디저트', items: [
      { id: 'cola',          name: '콜라',       price: 2000, img: 'img/burger/cola.webp' },
      { id: 'cider',         name: '사이다',     price: 2000, img: 'img/burger/cider.webp' },
      { id: 'orange-juice',  name: '오렌지주스', price: 2000, img: 'img/burger/orange-juice.webp' },
      { id: 'ice-cream',     name: '아이스크림', price: 1000, img: 'img/burger/ice-cream.webp' }
    ]}
  ]
});
