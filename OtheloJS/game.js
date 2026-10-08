const N = 8;
const EMPTY = 0, BLACK = 1, WHITE = 2; // 흑이 항상 선공
let HUMAN = BLACK, CPU = WHITE; // 시작 시 선택한 색에 따라 바뀜
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

// 위치 가중치 (모서리 높음, 모서리 인접 낮음)
const WEIGHTS = [
  [100,-20, 10,  5,  5, 10,-20,100],
  [-20,-50, -2, -2, -2, -2,-50,-20],
  [ 10, -2,  1,  1,  1,  1, -2, 10],
  [  5, -2,  1,  0,  0,  1, -2,  5],
  [  5, -2,  1,  0,  0,  1, -2,  5],
  [ 10, -2,  1,  1,  1,  1, -2, 10],
  [-20,-50, -2, -2, -2, -2,-50,-20],
  [100,-20, 10,  5,  5, 10,-20,100],
];

const opp = p => (p === BLACK ? WHITE : BLACK);

function newBoard() {
  const b = Array.from({ length: N }, () => Array(N).fill(EMPTY));
  b[3][3] = WHITE; b[3][4] = BLACK;
  b[4][3] = BLACK; b[4][4] = WHITE;
  return b;
}

const inside = (r, c) => r >= 0 && r < N && c >= 0 && c < N;

// (r,c)에 player가 둘 때 뒤집히는 좌표 목록
function flipsFor(b, r, c, player) {
  if (b[r][c] !== EMPTY) return [];
  const result = [];
  for (const [dr, dc] of DIRS) {
    const line = [];
    let y = r + dr, x = c + dc;
    while (inside(y, x) && b[y][x] === opp(player)) {
      line.push([y, x]);
      y += dr; x += dc;
    }
    if (line.length && inside(y, x) && b[y][x] === player) result.push(...line);
  }
  return result;
}

function validMoves(b, player) {
  const moves = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const f = flipsFor(b, r, c, player);
      if (f.length) moves.push({ r, c, flips: f });
    }
  return moves;
}

function applyMove(b, move, player) {
  const nb = b.map(row => row.slice());
  nb[move.r][move.c] = player;
  for (const [y, x] of move.flips) nb[y][x] = player;
  return nb;
}

function count(b, player) {
  let n = 0;
  for (const row of b) for (const v of row) if (v === player) n++;
  return n;
}

// ---------- AI ----------
function evaluate(b) {
  let score = 0;
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (b[r][c] === CPU) score += WEIGHTS[r][c];
      else if (b[r][c] === HUMAN) score -= WEIGHTS[r][c];
    }
  const mobility = validMoves(b, CPU).length - validMoves(b, HUMAN).length;
  return score + mobility * 5;
}

function minimax(b, depth, alpha, beta, player) {
  const moves = validMoves(b, player);
  if (depth === 0) return evaluate(b);
  if (!moves.length) {
    if (!validMoves(b, opp(player)).length) {
      return (count(b, CPU) - count(b, HUMAN)) * 1000; // 종료
    }
    return minimax(b, depth - 1, alpha, beta, opp(player));
  }
  if (player === CPU) {
    let best = -Infinity;
    for (const m of moves) {
      best = Math.max(best, minimax(applyMove(b, m, player), depth - 1, alpha, beta, HUMAN));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    best = Math.min(best, minimax(applyMove(b, m, player), depth - 1, alpha, beta, CPU));
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

function chooseMove(b, level) {
  const moves = validMoves(b, CPU);
  if (level === 'easy') return moves[Math.floor(Math.random() * moves.length)];
  if (level === 'normal') {
    const max = Math.max(...moves.map(m => m.flips.length));
    const best = moves.filter(m => m.flips.length === max);
    return best[Math.floor(Math.random() * best.length)];
  }
  const depth = level === 'master' ? 4 : 2; // hard = 2수, master = 4수 앞을 읽음
  let best = null, bestScore = -Infinity;
  for (const m of moves) {
    const s = minimax(applyMove(b, m, CPU), depth,-Infinity, Infinity, HUMAN);
    if (s > bestScore) { bestScore = s; best = m; }
  }
  return best;
}

// ---------- UI / 게임 흐름 ----------
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const diffEl = document.getElementById('difficulty');
const sideEl = document.getElementById('side');
let board, turn, last, busy, aiTimer;

function render() {
  const moves = turn === HUMAN && !busy ? validMoves(board, HUMAN) : [];
  boardEl.innerHTML = '';
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (last && last.r === r && last.c === c) cell.classList.add('last');
      if (board[r][c] !== EMPTY) {
        const d = document.createElement('div');
        d.className = 'disc ' + (board[r][c] === BLACK ? 'black' : 'white');
        cell.appendChild(d);
      } else {
        const m = moves.find(m => m.r === r && m.c === c);
        if (m) {
          cell.classList.add('valid');
          cell.addEventListener('click', () => playerMove(m));
        }
      }
      boardEl.appendChild(cell);
    }
  document.getElementById('count-black').textContent = count(board, BLACK);
  document.getElementById('count-white').textContent = count(board, WHITE);
  document.getElementById('score-black').classList.toggle('active', turn === BLACK);
  document.getElementById('score-white').classList.toggle('active', turn === WHITE);
}

function endCheck() {
  if (validMoves(board, BLACK).length || validMoves(board, WHITE).length) return false;
  const b = count(board, HUMAN), w = count(board, CPU);
  statusEl.textContent = b > w ? `게임 종료 - 승리! (${b} : ${w})`
    : b < w ? `게임 종료 - 패배 (${b} : ${w})` : `게임 종료 - 무승부 (${b} : ${w})`;
  turn = EMPTY;
  render();
  return true;
}

function nextTurn(justPlayed) {
  if (endCheck()) return;
  const next = opp(justPlayed);
  if (!validMoves(board, next).length) {
    statusEl.textContent = next === HUMAN
      ? '둘 곳이 없어 패스합니다. 컴퓨터 차례'
      : '컴퓨터가 둘 곳이 없어 패스합니다. 당신의 차례';
    turn = justPlayed;
  } else {
    turn = next;
    statusEl.textContent = turn === HUMAN ? '당신의 차례입니다' : '컴퓨터가 생각 중...';
  }
  busy = turn === CPU;
  render();
  if (turn === CPU) aiTimer = setTimeout(computerMove, 600);
}

function playerMove(m) {
  if (turn !== HUMAN || busy) return;
  board = applyMove(board, m, HUMAN);
  last = { r: m.r, c: m.c };
  render();
  nextTurn(HUMAN);
}

function computerMove() {
  const m = chooseMove(board, diffEl.value);
  board = applyMove(board, m, CPU);
  last = { r: m.r, c: m.c };
  busy = false;
  render();
  nextTurn(CPU);
}

function start() {
  clearTimeout(aiTimer);
  HUMAN = sideEl.value === 'white' ? WHITE : BLACK;
  CPU = opp(HUMAN);
  document.getElementById('name-black').textContent = HUMAN === BLACK ? '플레이어' : '컴퓨터';
  document.getElementById('name-white').textContent = HUMAN === WHITE ? '플레이어' : '컴퓨터';
  board = newBoard();
  turn = BLACK; // 흑이 항상 선공
  last = null;
  busy = turn === CPU;
  statusEl.textContent = busy ? '컴퓨터가 생각 중...' : '당신의 차례입니다';
  render();
  if (busy) aiTimer = setTimeout(computerMove, 600);
}

document.getElementById('restart').addEventListener('click', start);
sideEl.addEventListener('change', start);
start();
