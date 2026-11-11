/* 0. 홈: 매장 선택 */
App.screens.home = function (root) {
  var cards = window.STORES.map(function (s) {
    return '<button class="store-card pressable" data-act="store" data-id="' + App.esc(s.id) + '" style="--c:' + App.esc(s.themeColor) + '">' +
        '<div class="thumb">' +
          '<span class="thumb-ph">' + App.icon(s.icon || 'store') + '<span>' + App.esc(s.brand || s.name) + '</span></span>' +
          (s.cover ? '<img src="' + App.esc(s.cover) + '" alt="" draggable="false" onerror="this.remove()">' : '') +
        '</div>' +
        '<div class="store-name"><span>' + App.esc(s.name) + '</span>' + App.icon('back') + '</div>' +
      '</button>';
  }).join('');

  root.innerHTML =
    '<header class="home-head">' +
      '<div class="home-eyebrow">SELF ORDER</div>' +
      '<h1 class="home-title" id="home-title">매장을 선택해주세요</h1>' +
      '<div class="home-tools">' +
        '<button class="icon-btn" data-act="fullscreen" aria-label="전체화면">' + App.icon('fullscreen') + '</button>' +
      '</div>' +
    '</header>' +
    '<div class="store-grid">' + cards + '</div>';

  App.onAct(root, {
    store: function (el) {
      var store = window.STORES.find(function (s) { return s.id === el.dataset.id; });
      if (store) App.enterStore(store);
    },
    fullscreen: function () {
      var d = document, el = d.documentElement;
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      } else if (el.requestFullscreen || el.webkitRequestFullscreen) {
        (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      }
    },
    closeParent: function () { closeParent(); },
    resetTickets: function () {
      App.resetTickets();
      closeParent();
    },
    toggleSound: function () {
      App.soundOn = !App.soundOn;
      closeParent();
    }
  });

  /* 보호자 설정: 제목을 3초 길게 누르면 열림 (아이가 우연히 열지 않도록) */
  var title = root.querySelector('#home-title');
  var timer = null;
  function startPress() { timer = setTimeout(openParent, 3000); }
  function endPress() { clearTimeout(timer); }
  title.addEventListener('pointerdown', startPress);
  title.addEventListener('pointerup', endPress);
  title.addEventListener('pointerleave', endPress);
  title.addEventListener('pointercancel', endPress);

  function openParent() {
    var ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML =
      '<div class="dialog">' +
        '<h2>보호자 설정</h2>' +
        '<button class="dialog-btn" data-act="resetTickets">번호표를 처음 번호로 되돌리기</button>' +
        '<button class="dialog-btn" data-act="toggleSound">버튼 소리 ' + (App.soundOn ? '끄기' : '켜기') + '</button>' +
        '<button class="dialog-btn primary" data-act="closeParent">닫기</button>' +
        '<p class="dialog-note">홈 화면 제목을 3초간 누르면 이 창이 열립니다.</p>' +
      '</div>';
    root.appendChild(ov);
  }
  function closeParent() {
    var ov = root.querySelector('.overlay');
    if (ov) ov.remove();
  }

  return function cleanup() { clearTimeout(timer); };
};
