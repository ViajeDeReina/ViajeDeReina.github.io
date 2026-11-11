/* 1. 메뉴 선택 + 수량 (한 화면) */
App.screens.menu = function (root) {
  var store = App.state.store;

  root.innerHTML =
    storeBar('home', '처음으로', store) +
    '<nav class="tabs"></nav>' +
    '<main class="menu-grid"></main>' +
    '<section class="cart">' +
      '<div class="cart-list"></div>' +
      '<div class="cart-side">' +
        '<div class="cart-count"></div>' +
        '<div class="cart-total"></div>' +
        '<button class="btn-main pressable" data-act="checkout">결제하기</button>' +
      '</div>' +
    '</section>';

  var tabsEl = root.querySelector('.tabs');
  var gridEl = root.querySelector('.menu-grid');
  var listEl = root.querySelector('.cart-list');

  function currentCategory() {
    return store.categories.find(function (c) { return c.id === App.state.categoryId; }) || store.categories[0];
  }

  function renderTabs() {
    tabsEl.innerHTML = store.categories.map(function (c) {
      return '<button class="tab' + (c.id === App.state.categoryId ? ' on' : '') + '" data-act="tab" data-id="' + App.esc(c.id) + '">' + App.esc(c.name) + '</button>';
    }).join('');
  }

  function renderGrid() {
    gridEl.innerHTML = currentCategory().items.map(function (item) {
      return '<button class="menu-card pressable" data-act="add" data-id="' + App.esc(item.id) + '">' +
          App.thumb(item.img, item.name) +
          '<div class="menu-name">' + App.esc(item.name) + '</div>' +
          '<div class="menu-price">' + App.won(item.price) + '</div>' +
          '<span class="menu-badge"></span>' +
        '</button>';
    }).join('');
    gridEl.scrollTop = 0;
    renderBadges();
  }

  function renderBadges() {
    gridEl.querySelectorAll('.menu-card').forEach(function (card) {
      var line = App.findLine(card.dataset.id);
      card.classList.toggle('in-cart', !!line);
      card.querySelector('.menu-badge').textContent = line ? line.qty : '';
    });
  }

  function renderCart(flashId) {
    var cart = App.state.cart;
    if (!cart.length) {
      listEl.innerHTML = '<div class="cart-empty">메뉴를 선택해주세요</div>';
    } else {
      listEl.innerHTML = cart.map(function (l) {
        return '<div class="line" data-id="' + App.esc(l.item.id) + '">' +
            '<div class="line-name">' + App.esc(l.item.name) + '</div>' +
            '<div class="qty">' +
              '<button class="qty-btn pressable" data-act="minus" data-id="' + App.esc(l.item.id) + '" aria-label="빼기">' + App.icon('minus') + '</button>' +
              '<span class="qty-num">' + l.qty + '</span>' +
              '<button class="qty-btn pressable" data-act="plus" data-id="' + App.esc(l.item.id) + '" aria-label="더하기"' + (l.qty >= App.MAX_QTY ? ' disabled' : '') + '>' + App.icon('plus') + '</button>' +
            '</div>' +
            '<div class="line-price">' + App.won(l.item.price * l.qty) + '</div>' +
            '<button class="line-del" data-act="remove" data-id="' + App.esc(l.item.id) + '" aria-label="삭제">' + App.icon('close') + '</button>' +
          '</div>';
      }).join('');
    }
    root.querySelector('.cart-count').textContent = '총 ' + App.cartCount() + '개';
    root.querySelector('.cart-total').textContent = App.won(App.cartTotal());
    root.querySelector('[data-act="checkout"]').disabled = !cart.length;

    if (flashId) {
      var row = listEl.querySelector('.line[data-id="' + flashId + '"]');
      if (row) {
        row.classList.add('flash');
        row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
    renderBadges();
  }

  function findItem(id) {
    for (var i = 0; i < store.categories.length; i++) {
      var hit = store.categories[i].items.find(function (it) { return it.id === id; });
      if (hit) return hit;
    }
    return null;
  }

  App.onAct(root, {
    home: function () { App.goHome(); },
    tab: function (el) {
      App.state.categoryId = el.dataset.id;
      renderTabs();
      renderGrid();
    },
    add: function (el) {
      var item = findItem(el.dataset.id);
      if (!item || !App.addToCart(item)) return;
      el.classList.remove('pop');
      void el.offsetWidth;            // 애니메이션 다시 시작
      el.classList.add('pop');
      renderCart(item.id);
    },
    plus: function (el) { App.changeQty(el.dataset.id, 1); renderCart(); },
    minus: function (el) { App.changeQty(el.dataset.id, -1); renderCart(); },
    remove: function (el) { App.removeLine(el.dataset.id); renderCart(); },
    checkout: function () { if (App.state.cart.length) App.go('checkout'); }
  });

  renderTabs();
  renderGrid();
  renderCart();
};

/* 매장 화면 공통 상단 바: 왼쪽 버튼 + 가운데 매장 로고 */
function storeBar(act, label, store) {
  return '<header class="bar">' +
      '<button class="bar-btn pressable" data-act="' + act + '">' + App.icon(act === 'home' ? 'home' : 'back') + '<span>' + label + '</span></button>' +
      '<div class="brand">' +
        (store.logo ? '<img src="' + App.esc(store.logo) + '" alt="" draggable="false" onerror="this.remove()">' : '') +
        '<span class="brand-text">' + App.esc(store.brand || store.name) + '</span>' +
      '</div>' +
    '</header>';
}
