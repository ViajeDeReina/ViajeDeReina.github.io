/*
 * 앱 본체: 화면 전환, 장바구니 상태, 번호표 번호, 공통 유틸.
 * 화면별 렌더 함수는 js/screens/*.js 에서 App.screens 에 등록한다.
 */
(function () {
  var appEl;
  var current = null;          // 현재 화면 { name, cleanup }

  var App = {
    screens: {},

    state: {
      store: null,             // 선택한 매장 객체
      categoryId: null,        // 메뉴 화면에서 선택한 카테고리
      cart: [],                // [{ item, qty }]
      payment: null,           // 'card' | 'point' | 'pay'
      lastOrder: null          // 번호표 화면에 보여줄 주문
    },

    /* ---------- 화면 전환 ---------- */
    go: function (name, params) {
      if (current && current.cleanup) current.cleanup();
      var screen = document.createElement('div');
      screen.className = 'screen screen-' + name;
      var cleanup = App.screens[name](screen, params || {});
      appEl.replaceChildren(screen);
      appEl.scrollTop = 0;
      current = { name: name, cleanup: typeof cleanup === 'function' ? cleanup : null };
    },

    /* 매장 들어가기: 장바구니 비우고 메뉴 화면으로 */
    enterStore: function (store) {
      App.state.store = store;
      App.state.categoryId = store.categories[0].id;
      App.clearCart();
      appEl.style.setProperty('--brand', store.themeColor);
      App.go('menu');
    },

    goHome: function () {
      App.state.store = null;
      App.clearCart();
      appEl.style.removeProperty('--brand');
      App.go('home');
    },

    /* ---------- 장바구니 ---------- */
    MAX_QTY: 9,

    addToCart: function (item) {
      var line = App.findLine(item.id);
      if (line) {
        if (line.qty >= App.MAX_QTY) return false;
        line.qty += 1;
      } else {
        App.state.cart.push({ item: item, qty: 1 });
      }
      return true;
    },

    changeQty: function (itemId, delta) {
      var line = App.findLine(itemId);
      if (!line) return;
      line.qty = Math.min(App.MAX_QTY, line.qty + delta);
      if (line.qty <= 0) App.removeLine(itemId);
    },

    removeLine: function (itemId) {
      App.state.cart = App.state.cart.filter(function (l) { return l.item.id !== itemId; });
    },

    findLine: function (itemId) {
      for (var i = 0; i < App.state.cart.length; i++) {
        if (App.state.cart[i].item.id === itemId) return App.state.cart[i];
      }
      return null;
    },

    clearCart: function () { App.state.cart = []; },

    cartCount: function () {
      return App.state.cart.reduce(function (s, l) { return s + l.qty; }, 0);
    },

    cartTotal: function () {
      return App.state.cart.reduce(function (s, l) { return s + l.qty * l.item.price; }, 0);
    },

    /* ---------- 번호표 (매장별로 localStorage 에 다음 번호 저장) ---------- */
    nextTicket: function (store) {
      var key = 'kiosk.ticket.' + store.id;
      var n = store.ticketStart;
      try {
        var saved = parseInt(localStorage.getItem(key), 10);
        if (!isNaN(saved)) n = saved;
        localStorage.setItem(key, String(n + 1));
      } catch (e) { /* 저장 불가 환경: 매번 시작 번호 */ }
      return n;
    },

    resetTickets: function () {
      try {
        window.STORES.forEach(function (s) { localStorage.removeItem('kiosk.ticket.' + s.id); });
      } catch (e) { /* 무시 */ }
    },

    /* ---------- 공통 유틸 ---------- */
    won: function (n) { return n.toLocaleString('ko-KR') + '원'; },

    esc: function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    icon: function (name) { return window.ICONS[name] || ''; },

    /* 이미지 + 플레이스홀더. 이미지가 없거나 깨지면 img 를 지워 아래 플레이스홀더가 보이게 함 */
    thumb: function (src, label, extraClass) {
      return '<div class="thumb ' + (extraClass || '') + '">' +
        '<span class="thumb-ph">' + App.esc(label) + '</span>' +
        (src ? '<img src="' + App.esc(src) + '" alt="" draggable="false" onerror="this.remove()">' : '') +
      '</div>';
    },

    /* 버튼 클릭 위임: [data-act] 요소를 눌렀을 때 handlers[act](el) 호출 */
    onAct: function (root, handlers) {
      root.addEventListener('click', function (e) {
        var el = e.target.closest('[data-act]');
        if (!el || !root.contains(el) || el.disabled) return;
        var fn = handlers[el.dataset.act];
        if (fn) { App.beep('tap'); fn(el, e); }
      });
    },

    wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },

    /* ---------- 소리: 짧고 작은 비프음만 ---------- */
    soundOn: true,
    _audio: null,
    beep: function (type) {
      if (!App.soundOn) return;
      try {
        var ctx = App._audio || (App._audio = new (window.AudioContext || window.webkitAudioContext)());
        if (ctx.state === 'suspended') ctx.resume();
        var tones = type === 'done' ? [[880, 0], [1320, 0.12]] : [[1000, 0]];
        tones.forEach(function (t) {
          var osc = ctx.createOscillator(), gain = ctx.createGain();
          var start = ctx.currentTime + t[1], len = type === 'done' ? 0.14 : 0.05;
          osc.type = 'sine';
          osc.frequency.value = t[0];
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.06, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + len);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + len + 0.02);
        });
      } catch (e) { /* 소리 미지원 */ }
    },

    /* ---------- 시작 ---------- */
    start: function () {
      appEl = document.getElementById('app');
      fitToScreen();
      window.addEventListener('resize', fitToScreen);
      blockStrayGestures();
      registerServiceWorker();
      App.go('home');
    }
  };

  /*
   * 세로형 키오스크 비율(3:4)로 화면을 맞추고, 앱 폭 기준으로 rem 크기를 정한다.
   * 태블릿 세로(810px 폭)에서 1rem ≈ 18px. 가로로 돌리거나 PC에서 열면 가운데 세로 화면으로 보인다.
   */
  function fitToScreen() {
    var w = Math.min(window.innerWidth, window.innerHeight * 0.8);
    appEl.style.width = w + 'px';
    document.documentElement.style.fontSize = (w / 45) + 'px';
  }

  /* 아이가 앱 밖으로 나가지 않게: 길게 누르기 메뉴, 핀치 확대, 더블탭 확대, 당겨서 새로고침 방지 */
  function blockStrayGestures() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* 오프라인 사용을 위한 서비스워커 (http/https 로 열었을 때만) */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  window.App = App;
})();
