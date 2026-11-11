/* 4. 번호표 발급. 10초 뒤 같은 매장의 메뉴 화면으로 자동 복귀 */
App.screens.ticket = function (root) {
  var AUTO_RETURN_SEC = 10;
  var o = App.state.lastOrder;

  var t = o.time;
  var time = t.getFullYear() + '.' + pad(t.getMonth() + 1) + '.' + pad(t.getDate()) + ' ' + pad(t.getHours()) + ':' + pad(t.getMinutes());

  var items = o.lines.map(function (l) {
    return '<div class="receipt-row"><span>' + App.esc(l.item.name) + ' × ' + l.qty + '</span><span>' + App.won(l.item.price * l.qty) + '</span></div>';
  }).join('');

  root.innerHTML =
    '<div class="ticket-body">' +
      '<div class="receipt">' +
        '<div class="receipt-brand">' + App.esc(o.store.brand || o.store.name) + '</div>' +
        '<div class="receipt-label">주문번호</div>' +
        '<div class="receipt-no">' + o.number + '</div>' +
        '<hr>' +
        '<div class="receipt-items">' + items + '</div>' +
        '<hr>' +
        '<div class="receipt-row receipt-total"><span>합계</span><span>' + App.won(o.total) + '</span></div>' +
        '<div class="receipt-row"><span>결제수단</span><span>' + o.payment + '</span></div>' +
        '<div class="receipt-row"><span>주문일시</span><span>' + time + '</span></div>' +
      '</div>' +
      '<div class="ticket-actions">' +
        '<button class="btn-main pressable" data-act="done">확인</button>' +
        '<div class="ticket-note"><span class="sec">' + AUTO_RETURN_SEC + '</span>초 후 주문 화면으로 돌아갑니다</div>' +
      '</div>' +
    '</div>';

  var left = AUTO_RETURN_SEC;
  var secEl = root.querySelector('.sec');
  var timer = setInterval(function () {
    left -= 1;
    secEl.textContent = left;
    if (left <= 0) backToMenu();
  }, 1000);

  function backToMenu() {
    clearInterval(timer);
    App.enterStore(o.store);
  }

  App.onAct(root, { done: backToMenu });

  return function cleanup() { clearInterval(timer); };

  function pad(n) { return n < 10 ? '0' + n : String(n); }
};
