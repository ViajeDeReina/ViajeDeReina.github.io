/*
 * 단색 라인 아이콘 (SVG 문자열). 색은 currentColor 를 따른다.
 * 결제수단 아이콘·안내 그림을 이미지 파일 없이 그리기 위해 사용.
 */
(function () {
  function svg(body, vb) {
    return '<svg viewBox="' + (vb || '0 0 24 24') + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  window.ICONS = {
    home: svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    fullscreen: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),

    card: svg('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 15h4"/>'),
    point: svg('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M9 8v6M11 8v6M13.5 8v6M15 8v6"/><path d="M10.5 18.5h3"/>'),
    pay: svg('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><circle cx="12" cy="11" r="3.5"/><path d="M10.5 18.5h3"/>'),

    cup: svg('<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1.5 1 2.5M11.5 3.5c0 1 1 1.5 1 2.5"/>'),
    burger: svg('<path d="M4 11a8 6 0 0 1 16 0z"/><path d="M3.5 14h17"/><path d="M4.5 17h15a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 17z"/><path d="M9 8h.01M12 7h.01M15 8h.01"/>'),
    store: svg('<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5h16v1a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0z"/><path d="M5.5 13v7h13v-7"/>'),

    /* 결제 안내 그림: 카드 단말기에 카드 꽂기 */
    guideCard:
      '<svg class="guide-art" viewBox="0 0 240 200" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="60" y="70" width="120" height="120" rx="14"/>' +
        '<rect x="78" y="88" width="84" height="34" rx="5"/>' +
        '<path d="M84 140h12M114 140h12M144 140h12M84 160h12M114 160h12M144 160h12"/>' +
        '<path d="M80 70h80" stroke-width="6"/>' +
        '<g class="guide-card-move">' +
          '<rect x="88" y="6" width="64" height="80" rx="6" fill="var(--surface)"/>' +
          '<rect x="98" y="16" width="16" height="12" rx="2"/>' +
        '</g>' +
      '</svg>',

    /* 결제 안내 그림: 바코드를 스캐너에 보여주기 */
    guidePoint:
      '<svg class="guide-art" viewBox="0 0 240 200" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M150 150h60v40h-60z"/>' +
        '<path d="M160 150l10-30h20l10 30"/>' +
        '<path class="guide-beam" d="M180 118 L110 70" stroke-dasharray="4 6"/>' +
        '<g class="guide-phone-move">' +
          '<rect x="30" y="20" width="80" height="140" rx="12" fill="var(--surface)"/>' +
          '<path d="M46 60v50M54 60v50M62 60v50M70 60v50M80 60v50M88 60v50M94 60v50"/>' +
          '<path d="M60 145h20"/>' +
        '</g>' +
      '</svg>'
  };

  window.PAYMENT_TYPES = {
    card:  { label: '신용카드', icon: 'card',  guide: 'guideCard',  guideText: '카드를 투입구에 꽂아주세요' },
    point: { label: '포인트',   icon: 'point', guide: 'guidePoint', guideText: '바코드를 스캐너에 보여주세요' },
    pay:   { label: '간편결제', icon: 'pay',   guide: 'guidePoint', guideText: '휴대폰 화면을 스캐너에 보여주세요' }
  };
})();
