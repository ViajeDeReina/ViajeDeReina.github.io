/*
 * 3. 결제 진행 (가짜 결제)
 *   안내(카드를 꽂아주세요) 1.5초 → 결제 진행 중 1.5초 → 결제 완료 0.9초 → 번호표
 *   진행 중에는 버튼이 없으므로 화면을 눌러도 아무 일도 일어나지 않는다.
 */
App.screens.paying = function (root) {
  var TIMING = { guide: 1500, processing: 1500, done: 900 };

  var store = App.state.store;
  var pay = window.PAYMENT_TYPES[App.state.payment] || window.PAYMENT_TYPES.card;
  var total = App.cartTotal();
  var cancelled = false;

  root.innerHTML = storeBar('none', '', store) + '<div class="paying-body"></div>';
  root.querySelector('.bar-btn').style.visibility = 'hidden';   // 결제 중엔 뒤로 가기 없음
  var body = root.querySelector('.paying-body');

  function show(html) { body.innerHTML = '<div class="stage">' + html + '</div>'; }

  (async function run() {
    show(
      App.icon(pay.guide) +
      '<div class="stage-title">' + pay.guideText + '</div>' +
      '<div class="stage-amount">결제금액 ' + App.won(total) + '</div>'
    );
    await App.wait(TIMING.guide);
    if (cancelled) return;

    show(
      '<div class="spinner"></div>' +
      '<div class="stage-title">결제 진행 중입니다</div>' +
      '<div class="stage-sub">잠시만 기다려주세요</div>'
    );
    await App.wait(TIMING.processing);
    if (cancelled) return;

    App.beep('done');
    show(
      '<div class="done-mark">' + App.icon('check') + '</div>' +
      '<div class="stage-title">결제가 완료되었습니다</div>'
    );
    await App.wait(TIMING.done);
    if (cancelled) return;

    App.state.lastOrder = {
      store: store,
      number: App.nextTicket(store),
      lines: App.state.cart.slice(),
      total: total,
      payment: pay.label,
      time: new Date()
    };
    App.clearCart();
    App.go('ticket');
  })();

  return function cleanup() { cancelled = true; };
};
