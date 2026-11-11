/* 2. 주문 확인 + 결제수단 선택 */
App.screens.checkout = function (root) {
  var store = App.state.store;

  var rows = App.state.cart.map(function (l) {
    return '<div class="order-row">' +
        App.thumb(l.item.img, l.item.name) +
        '<span class="order-name">' + App.esc(l.item.name) + '</span>' +
        '<span class="order-qty">' + l.qty + '개</span>' +
        '<span class="order-amt">' + App.won(l.item.price * l.qty) + '</span>' +
      '</div>';
  }).join('');

  var pays = store.payments.map(function (key) {
    var p = window.PAYMENT_TYPES[key];
    if (!p) return '';
    return '<button class="pay-btn pressable" data-act="pay" data-id="' + key + '">' + App.icon(p.icon) + '<span>' + p.label + '</span></button>';
  }).join('');

  root.innerHTML =
    storeBar('back', '이전', store) +
    '<div class="checkout-body">' +
      '<h1 class="section-title">주문 내역을 확인해주세요</h1>' +
      '<div class="order-box">' +
        '<div class="order-list">' + rows + '</div>' +
        '<div class="order-total"><span>총 결제금액</span><strong>' + App.won(App.cartTotal()) + '</strong></div>' +
      '</div>' +
      '<h2 class="section-title">결제 수단을 선택해주세요</h2>' +
      '<div class="pay-grid">' + pays + '</div>' +
    '</div>';

  App.onAct(root, {
    back: function () { App.go('menu'); },
    pay: function (el) {
      App.state.payment = el.dataset.id;
      App.go('paying');
    }
  });
};
