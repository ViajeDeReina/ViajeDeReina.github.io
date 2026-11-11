/*
 * 매장 등록소.
 * 매장 파일(js/stores/*.js)은 registerStore({...}) 한 번만 호출하면 된다.
 * 등록 순서 = 홈 화면에 나오는 순서.
 */
window.STORES = [];

window.registerStore = function (store) {
  var required = ['id', 'name', 'categories'];
  required.forEach(function (key) {
    if (!store[key]) throw new Error('매장 데이터에 ' + key + ' 가 없습니다: ' + JSON.stringify(store.id));
  });
  store.themeColor = store.themeColor || '#1f2328';
  store.ticketStart = store.ticketStart || 101;
  store.payments = store.payments || ['card', 'point'];
  window.STORES.push(store);
};
