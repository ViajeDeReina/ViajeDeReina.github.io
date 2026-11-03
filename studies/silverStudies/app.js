// 쉬운 자격증 공부 - 화면 프로토타입 (서버 없이 정적 파일 + 브라우저 저장소)
const DATA_URL = "../data/realtor/2024-35-1-1.json";
const STORE_KEY = "easyexam:v1";
const CIRCLED = ["①", "②", "③", "④", "⑤"];
const MOCK_MINUTES = 100; // 1차 1교시 시험시간
const FONT_LABELS = ["보통", "크게", "아주 크게"];

const app = document.getElementById("app");
const titleEl = document.getElementById("title");
const backBtn = document.getElementById("backBtn");
const fontBtn = document.getElementById("fontBtn");

let exam = null;       // 시험 데이터
let byId = {};         // id → 문항
let session = null;    // 진행 중인 풀이
let timerHandle = null;

// ---------- 저장소 ----------
function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}
const store = Object.assign({ records: {}, wrong: [], star: [], last: null, size: 0 }, loadStore());
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* 저장 불가 환경은 무시 */ }
}
function toggleIn(list, id, on) {
  const i = list.indexOf(id);
  if (on && i < 0) list.push(id);
  if (!on && i >= 0) list.splice(i, 1);
}

// ---------- 공통 ----------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const isCorrect = (q, pick) => q.answer.includes(pick);
const shortSubject = (s) => (s.startsWith("민법") ? "민법 및 민사특별법" : s);

function applyFont() {
  document.documentElement.dataset.size = store.size;
  fontBtn.setAttribute("aria-label", `글자 크기: ${FONT_LABELS[store.size]} (누르면 바뀜)`);
}
fontBtn.onclick = () => {
  store.size = (store.size + 1) % FONT_LABELS.length;
  applyFont();
  save();
};

function setHeader(title, showBack) {
  titleEl.textContent = title;
  backBtn.hidden = !showBack;
}
backBtn.onclick = () => {
  if (session && session.mode === "mock" && !session.submitted &&
      !confirm("모의고사를 그만두시겠어요?\n지금까지 푼 답은 저장되지 않습니다.")) return;
  history.back();
};

function bottomBar(html) {
  document.querySelector(".bottom-bar")?.remove();
  if (!html) return null;
  const bar = document.createElement("div");
  bar.className = "bottom-bar";
  bar.innerHTML = html;
  document.body.appendChild(bar);
  return bar;
}

function stopTimer() {
  clearInterval(timerHandle);
  timerHandle = null;
}

// ---------- 라우팅 ----------
function go(hash) {
  location.hash = hash;
}
window.addEventListener("hashchange", render);

function render() {
  stopTimer();
  bottomBar(null);
  window.scrollTo(0, 0);
  const [route, arg] = location.hash.slice(1).split("/");
  if (route === "exam") return renderExam();
  if (route === "quiz" && session) return renderQuestion();
  if (route === "result" && session) return renderResult();
  if (route === "settings") return renderSettings();
  if (route && route !== "home") return go("home");
  renderHome();
}

// ---------- 홈 ----------
function renderHome() {
  setHeader("쉬운 자격증 공부", false);
  const solved = exam.questions.filter((q) => store.records[q.id]).length;
  app.innerHTML = `
    <p class="section-title">공부할 시험을 고르세요</p>
    <button class="big-btn" data-go="exam">
      공인중개사 1차
      <small>${esc(exam.year)}년 제${esc(exam.round)}회 기출 · ${exam.questions.length}문제 · ${solved}문제 풀었음</small>
    </button>
    <button class="big-btn" disabled style="opacity:.55">
      주택관리사보 <small>준비 중</small>
    </button>
    <button class="big-btn" disabled style="opacity:.55">
      경비지도사 <small>준비 중</small>
    </button>`;
  app.querySelector("[data-go]").onclick = () => go("exam");
}

// ---------- 시험 메인 ----------
function renderExam() {
  session = null;
  setHeader("공인중개사 1차", true);
  const qs = exam.questions;
  const solved = qs.filter((q) => store.records[q.id]);
  const correct = solved.filter((q) => store.records[q.id].correct).length;
  const pct = Math.round((solved.length / qs.length) * 100);
  const rate = solved.length ? Math.round((correct / solved.length) * 100) : 0;
  const subjects = [...new Set(qs.map((q) => q.subject))];
  const last = store.last;

  app.innerHTML = `
    <div class="card">
      <div><b>${esc(exam.year)}년 제${esc(exam.round)}회</b> 기출문제</div>
      <div class="progress" aria-hidden="true"><div style="width:${pct}%"></div></div>
      <div class="stat">전체 ${qs.length}문제 중 <b>${solved.length}문제</b> 풀었어요 · 정답률 <b>${rate}%</b></div>
    </div>
    ${last ? `<button class="big-btn primary" id="resume">이어서 풀기<small>${esc(last.label)} ${last.idx + 1}번째 문제부터</small></button>` : ""}

    <p class="section-title">연습하기 (바로 정답 확인)</p>
    <button class="big-btn" data-practice="all">처음부터 전체 풀기<small>${qs.length}문제</small></button>
    ${subjects.map((s, i) => `
      <button class="big-btn" data-practice="${i}">${esc(shortSubject(s))}<small>${qs.filter((q) => q.subject === s).length}문제</small></button>`).join("")}

    <p class="section-title">실전처럼</p>
    <button class="big-btn" id="mock">모의고사 보기<small>${qs.length}문제 · ${MOCK_MINUTES}분 · 끝나고 채점</small></button>

    <p class="section-title">다시 보기</p>
    <button class="big-btn" id="wrong">틀린 문제 다시 풀기<small>${store.wrong.length}문제</small></button>
    <button class="big-btn" id="star">별표한 문제<small>${store.star.length}문제</small></button>
    <button class="big-btn" id="settings">설정<small>글자 크기, 기록 지우기</small></button>

    <p class="footer-source">문제·정답 출처: ${esc(exam.source)}<br>
    해설은 이 서비스가 작성한 것으로, 한국산업인력공단의 공식 해설이 아닙니다.</p>`;

  if (last) app.querySelector("#resume").onclick = () => {
    startSession("practice", last.ids.filter((id) => byId[id]), last.label, last.idx);
  };
  app.querySelectorAll("[data-practice]").forEach((b) => {
    b.onclick = () => {
      const key = b.dataset.practice;
      const list = key === "all" ? qs : qs.filter((q) => q.subject === subjects[key]);
      startSession("practice", list.map((q) => q.id), key === "all" ? "전체 풀기" : shortSubject(subjects[key]));
    };
  });
  app.querySelector("#mock").onclick = () => {
    if (confirm(`모의고사를 시작할까요?\n${qs.length}문제, ${MOCK_MINUTES}분입니다.\n정답은 다 풀고 나서 확인할 수 있어요.`)) {
      startSession("mock", qs.map((q) => q.id), "모의고사");
    }
  };
  app.querySelector("#wrong").onclick = () => listOrEmpty(store.wrong, "틀린 문제");
  app.querySelector("#star").onclick = () => listOrEmpty(store.star, "별표한 문제");
  app.querySelector("#settings").onclick = () => go("settings");
}

function listOrEmpty(ids, label) {
  const list = ids.filter((id) => byId[id]).sort((a, b) => byId[a].number - byId[b].number);
  if (!list.length) return alert(`${label}가 아직 없어요.`);
  startSession("practice", list, label);
}

// ---------- 풀이 ----------
function startSession(mode, ids, label, idx = 0) {
  session = {
    mode, ids, label, idx,
    picks: {}, checked: {},
    deadline: mode === "mock" ? Date.now() + MOCK_MINUTES * 60000 : null,
    submitted: false,
  };
  go("quiz");
}

function renderQuestion() {
  const s = session;
  const q = byId[s.ids[s.idx]];
  const pick = s.picks[q.id];
  const reveal = s.mode === "review" || (s.mode === "practice" && s.checked[q.id]);
  const starred = store.star.includes(q.id);
  setHeader(s.label, true);

  if (s.mode === "practice") {
    store.last = { ids: s.ids, idx: s.idx, label: s.label };
    save();
  }

  const choiceHtml = q.choices.map((c, i) => {
    const n = i + 1;
    let cls = "", tag = "";
    if (reveal) {
      if (isCorrect(q, n)) { cls = "correct"; tag = "정답"; }
      else if (pick === n) { cls = "wrong"; tag = "내가 고른 답 (오답)"; }
    }
    return `<button class="choice ${cls}" data-n="${n}" aria-pressed="${pick === n}" ${reveal ? "disabled" : ""}>
      <span class="num">${CIRCLED[i]}</span><span>${esc(c)}${tag ? `<span class="tag">${tag}</span>` : ""}</span></button>`;
  }).join("");

  const tableHtml = q.table ? `<div class="table-wrap"><table>
      <tr>${q.table.header.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>
      ${q.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}
    </table></div>` : "";

  const ok = pick != null && isCorrect(q, pick);
  const verdict = reveal && s.mode === "practice"
    ? `<div class="verdict ${ok ? "ok" : "bad"}">${ok ? "⭕ 맞았어요!" : "❌ 틀렸어요"}</div>` : "";
  const reviewVerdict = s.mode === "review"
    ? `<div class="verdict ${ok ? "ok" : "bad"}">${pick == null ? "풀지 않은 문제" : ok ? "⭕ 맞힌 문제" : "❌ 틀린 문제"}</div>` : "";
  const special = q.answer.length > 1
    ? `<div class="special">이 문제는 출제 오류로 모든 보기가 정답 처리되었습니다.</div>` : "";
  const explain = reveal ? `
    <div class="card explain">
      <h3>해설</h3>${esc(q.explanation || "해설을 준비 중입니다.")}
      ${q.explanationStatus === "ai-draft" ? `<p class="notice">AI가 작성한 해설 초안으로, 전문가 검수 전입니다. ${esc(exam.year)}년 시험 당시 법령 기준입니다.</p>` : ""}
    </div>` : "";

  app.innerHTML = `
    <div class="q-head">
      <span class="q-count"><b>${s.idx + 1}</b> / ${s.ids.length}</span>
      ${s.mode === "mock" ? `<span class="timer" id="timer"></span>` : ""}
      <button class="star-btn" id="starBtn" aria-pressed="${starred}">${starred ? "★ 별표함" : "☆ 별표"}</button>
    </div>
    <div class="q-subject">${esc(shortSubject(q.subject))} · ${q.number}번</div>
    <p class="q-text">${esc(q.question)}</p>
    ${q.passage ? `<div class="passage">${esc(q.passage)}</div>` : ""}
    ${tableHtml}
    ${reveal ? special : ""}
    ${verdict}${reviewVerdict}
    ${choiceHtml}
    ${explain}`;

  app.querySelector("#starBtn").onclick = () => {
    toggleIn(store.star, q.id, !store.star.includes(q.id));
    save();
    renderQuestion();
  };
  app.querySelectorAll(".choice").forEach((b) => {
    b.onclick = () => {
      s.picks[q.id] = Number(b.dataset.n);
      renderQuestion();
    };
  });

  const isLast = s.idx === s.ids.length - 1;
  let mainLabel, mainDisabled = false;
  if (s.mode === "practice" && !reveal) { mainLabel = "정답 확인"; mainDisabled = pick == null; }
  else if (s.mode === "mock" && isLast) mainLabel = "제출하기";
  else if (s.mode === "review" && isLast) mainLabel = "결과로";
  else mainLabel = isLast ? "끝내기" : "다음 ▶";

  const bar = bottomBar(`
    <button class="prev" ${s.idx === 0 ? "disabled" : ""}>◀ 이전</button>
    <button class="go" ${mainDisabled ? "disabled" : ""}>${mainLabel}</button>`);
  bar.querySelector(".prev").onclick = () => { s.idx--; render(); };
  bar.querySelector(".go").onclick = () => {
    if (mainLabel === "정답 확인") return checkAnswer(q);
    if (mainLabel === "제출하기") return submitMock();
    if (mainLabel === "결과로") return go("result");
    if (mainLabel === "끝내기") {
      store.last = null;
      save();
      alert("다 풀었어요! 수고하셨습니다.");
      return history.back();
    }
    s.idx++;
    render();
  };

  if (s.mode === "mock") startTimer();
}

function checkAnswer(q) {
  const ok = isCorrect(q, session.picks[q.id]);
  session.checked[q.id] = true;
  const rec = store.records[q.id] || { tries: 0, correct: false };
  rec.tries++;
  rec.correct = ok;
  store.records[q.id] = rec;
  toggleIn(store.wrong, q.id, !ok); // 틀리면 오답노트에 넣고, 맞히면 뺀다
  save();
  renderQuestion();
}

function startTimer() {
  const el = document.getElementById("timer");
  const tick = () => {
    const left = Math.max(0, session.deadline - Date.now());
    const m = Math.floor(left / 60000), sec = Math.floor((left % 60000) / 1000);
    el.textContent = `남은 시간 ${m}:${String(sec).padStart(2, "0")}`;
    if (left === 0) {
      stopTimer();
      alert("시험 시간이 끝났습니다. 채점합니다.");
      submitMock(true);
    }
  };
  tick();
  timerHandle = setInterval(tick, 1000);
}

function submitMock(force) {
  const unanswered = session.ids.filter((id) => session.picks[id] == null).length;
  if (!force && !confirm(unanswered ? `아직 ${unanswered}문제를 풀지 않았어요.\n그래도 제출할까요?` : "제출하고 채점할까요?")) return;
  session.submitted = true;
  session.ids.forEach((id) => {
    const q = byId[id], pick = session.picks[id];
    if (pick == null) return;
    const ok = isCorrect(q, pick);
    const rec = store.records[id] || { tries: 0, correct: false };
    rec.tries++;
    rec.correct = ok;
    store.records[id] = rec;
    toggleIn(store.wrong, id, !ok);
  });
  save();
  location.replace("#result");
}

// ---------- 모의고사 결과 ----------
function renderResult() {
  const s = session;
  s.mode = "review";
  setHeader("모의고사 결과", true);
  const subjects = [...new Set(s.ids.map((id) => byId[id].subject))];
  const scores = subjects.map((sub) => {
    const ids = s.ids.filter((id) => byId[id].subject === sub);
    const right = ids.filter((id) => s.picks[id] != null && isCorrect(byId[id], s.picks[id])).length;
    return { sub, total: ids.length, right, score: (right / ids.length) * 100 };
  });
  // 공인중개사 1차 합격 기준: 과목별 40점 이상, 전 과목 평균 60점 이상 (반올림하면 합격 여부가 바뀔 수 있어 그대로 비교)
  const avg = scores.reduce((a, b) => a + b.score, 0) / scores.length;
  const pt = (n) => `${Number.isInteger(n) ? n : n.toFixed(1)}점`;
  const pass = avg >= 60 && scores.every((x) => x.score >= 40);

  app.innerHTML = `
    <div class="card score">
      <div>평균 점수</div>
      <div class="big ${pass ? "pass" : "fail"}">${pt(avg)}</div>
      <div class="${pass ? "pass" : "fail"}" style="font-weight:800">${pass ? "합격 기준 통과!" : "합격 기준에 못 미쳤어요"}</div>
      <p class="stat">합격 기준: 과목별 40점 이상, 평균 60점 이상</p>
    </div>
    ${scores.map((x) => `<div class="card"><b>${esc(shortSubject(x.sub))}</b><br>
      ${x.total}문제 중 ${x.right}문제 맞힘 · <b class="${x.score >= 40 ? "pass" : "fail"}">${pt(x.score)}</b></div>`).join("")}
    <p class="section-title">번호를 누르면 정답과 해설을 볼 수 있어요</p>
    <div class="result-list">
      ${s.ids.map((id, i) => {
        const p = s.picks[id];
        const cls = p == null ? "" : isCorrect(byId[id], p) ? "r-ok" : "r-bad";
        const mark = p == null ? "－" : cls === "r-ok" ? "○" : "✕";
        return `<button class="${cls}" data-i="${i}" aria-label="${byId[id].number}번 ${mark === "○" ? "맞음" : mark === "✕" ? "틀림" : "안 풂"}">${byId[id].number}<br>${mark}</button>`;
      }).join("")}
    </div>`;

  app.querySelectorAll("[data-i]").forEach((b) => {
    b.onclick = () => { s.idx = Number(b.dataset.i); go("quiz"); };
  });
  bottomBar(`<button class="go" id="home">시험 처음 화면으로</button>`).querySelector("#home").onclick = () => go("exam");
}

// ---------- 설정 ----------
function renderSettings() {
  setHeader("설정", true);
  app.innerHTML = `
    <p class="section-title">글자 크기</p>
    ${FONT_LABELS.map((l, i) => `<button class="big-btn" data-size="${i}" aria-pressed="${store.size === i}">
      ${store.size === i ? "✔ " : ""}${l}</button>`).join("")}
    <p class="section-title">기록</p>
    <button class="big-btn" id="reset">푼 기록 모두 지우기<small>정답률, 틀린 문제, 별표가 모두 지워집니다</small></button>`;
  app.querySelectorAll("[data-size]").forEach((b) => {
    b.onclick = () => { store.size = Number(b.dataset.size); applyFont(); save(); renderSettings(); };
  });
  app.querySelector("#reset").onclick = () => {
    if (!confirm("푼 기록을 모두 지울까요?\n지운 기록은 되돌릴 수 없습니다.")) return;
    Object.assign(store, { records: {}, wrong: [], star: [], last: null });
    save();
    alert("기록을 지웠습니다.");
  };
}

// ---------- 시작 ----------
applyFont();
fetch(DATA_URL)
  .then((r) => r.json())
  .then((d) => {
    exam = d;
    byId = Object.fromEntries(d.questions.map((q) => [q.id, q]));
    if (location.hash.startsWith("#quiz") || location.hash.startsWith("#result")) location.replace("#exam");
    render();
  })
  .catch(() => {
    app.innerHTML = `<p class="empty">문제를 불러오지 못했습니다.<br>잠시 후 다시 열어 주세요.</p>`;
  });
