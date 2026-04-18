// ============================================
//  APHELION — Main Terminal Controller
//  main.js
// ============================================

// ── Terminal output ───────────────────────────

function print(text, style = '') {
  const output = document.getElementById('output');
  const line   = document.createElement('span');
  line.classList.add('output-line');
  if (style) line.classList.add(style);
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// ── Typewriter engine ─────────────────────────

const printQueue = [];
let   isPrinting = false;

function queue(text, style = '', delay = 38) {
  printQueue.push({ text, style, delay });
  if (!isPrinting) processQueue();
}

function queueBlank(delay = 38) {
  queue('', '', delay);
}

function queueDivider(delay = 38) {
  queue('─'.repeat(58), 'output-dim', delay);
}

function processQueue() {
  if (printQueue.length === 0) {
    isPrinting = false;
    enableInput();
    return;
  }
  isPrinting = true;
  const { text, style, delay } = printQueue.shift();
  print(text, style);
  setTimeout(processQueue, delay);
}

// ── Boot sequence ─────────────────────────────

function boot() {
  const MASTER_SEED = '4471-KETH-NULL';

  setTimeout(() => {

    queue('INITIALIZING — APHELION DEEP SURVEY TERMINAL', 'output-bright', 80);
    queue('MASTER SEED: ' + MASTER_SEED, 'output-dim', 120);
    queueBlank(80);
    queue('> Loading naming systems...', 'output-dim', 200);
    queue('> History engine standing by...', 'output-dim', 280);
    queue('> Guild network: CONNECTED', 'output-dim', 180);
    queueBlank(120);
    queueDivider(60);
    queue('GALAXY INITIALIZED — DEEP SURVEY ACTIVE', 'output-label', 80);
    queueDivider(60);
    queueBlank(80);

    // Initialize galaxy from master seed
    initCommands(MASTER_SEED);
    const overview = handleCommand('galaxy');
    overview.split('\n').forEach(line => queue(line, '', 12));

  }, 1400);
}

// ── Input handling ────────────────────────────

let inputEnabled = false;
let currentInput = '';

function enableInput() {
  inputEnabled = true;
}

document.addEventListener('keydown', (e) => {
  if (!inputEnabled) return;

  if (e.key === 'Enter') {
    const raw = currentInput.trim();
    currentInput = '';
    updateTyped('');

    if (raw === '') return;

    print('> ' + raw, 'output-dim');

    const response = handleCommand(raw);
    if (response) {
      response.split('\n').forEach(line => print(line));
    }

    const output = document.getElementById('output');
    if (output) output.scrollTop = output.scrollHeight;

  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateTyped(currentInput);

  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    currentInput += e.key;
    updateTyped(currentInput);
  }
});

function updateTyped(text) {
  const el = document.getElementById('typed');
  if (el) el.textContent = text;
}

// ── Run on page load ──────────────────────────
window.addEventListener('load', boot);
