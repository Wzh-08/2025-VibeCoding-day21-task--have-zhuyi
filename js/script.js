// js/script.js

// 37 個注音符號（大字用）
const ZHUYIN_LIST = [
  "ㄅ", "ㄆ", "ㄇ", "ㄈ",
  "ㄉ", "ㄊ", "ㄋ", "ㄌ",
  "ㄍ", "ㄎ", "ㄏ",
  "ㄐ", "ㄑ", "ㄒ",
  "ㄓ", "ㄔ", "ㄕ", "ㄖ",
  "ㄗ", "ㄘ", "ㄙ",
  "ㄧ", "ㄨ", "ㄩ",
  "ㄚ", "ㄛ", "ㄜ", "ㄝ",
  "ㄞ", "ㄟ", "ㄠ", "ㄡ",
  "ㄢ", "ㄣ", "ㄤ", "ㄥ",
  "ㄦ"
];

const PREPARE_FLASH_MS = 3000;      // 綠框閃爍時間（毫秒）
const COUNTDOWN_SECONDS = 12;       // 倒數秒數
const RETRY_DELAY_MS = 8000;        // 爆炸後再試一次延遲（毫秒）

// ----- 各種文字（含 ruby 注音） -----

const TITLE_DEFAULT_HTML = `
  <span class="ruby-text">
    <ruby>我<rt>ㄨㄛˇ</rt></ruby>
    <ruby>會<rt>ㄏㄨㄟˋ</rt></ruby>
  </span>
  &nbsp;ㄅ ㄆ ㄇ
`;

const TITLE_TIMEOUT_HTML = `
  <span class="ruby-text">
    <ruby>喔<rt>ㄛ˙</rt></ruby>
    <ruby>喔<rt>ㄛ˙</rt></ruby>
    <ruby>！<rt></rt></ruby>
    <ruby>沒<rt>ㄇㄟˊ</rt></ruby>
    <ruby>有<rt>ㄧㄡˇ</rt></ruby>
    <ruby>答<rt>ㄉㄚˊ</rt></ruby>
    <ruby>對<rt>ㄉㄨㄟˋ</rt></ruby>
    <ruby>！<rt></rt></ruby>
  </span>
`;

const TITLE_CONFIRM_EXIT_HTML = `
  <span class="ruby-text">
    <ruby>確<rt>ㄑㄩㄝˋ</rt></ruby>
    <ruby>定<rt>ㄉㄧㄥˋ</rt></ruby>
    <ruby>要<rt>ㄧㄠˋ</rt></ruby>
    <ruby>關<rt>ㄍㄨㄢ</rt></ruby>
    <ruby>閉<rt>ㄅㄧˋ</rt></ruby>
    <ruby>嗎<rt>ㄇㄚ˙</rt></ruby>
    <ruby>？<rt></rt></ruby>
  </span>
`;

const MSG_READY_HTML = `
  <span class="ruby-text">
    <ruby>準<rt>ㄓㄨㄣˇ</rt></ruby>
    <ruby>備<rt>ㄅㄟˋ</rt></ruby>
    <ruby>好<rt>ㄏㄠˇ</rt></ruby>
    <ruby>了<rt>ㄌㄜ˙</rt></ruby>
    <ruby>嗎<rt>ㄇㄚ˙</rt></ruby>
    <ruby>？<rt></rt></ruby>
  </span>
`;

const MSG_LOOK_HTML = `
  <span class="ruby-text">
    <ruby>看<rt>ㄎㄢˋ</rt></ruby>
    <ruby>好<rt>ㄏㄠˇ</rt></ruby>
    <ruby>了<rt>ㄌㄜ˙</rt></ruby>
    <ruby>喔<rt>ㄛ˙</rt></ruby>
    <ruby>～<rt></rt></ruby>
  </span>
`;

const MSG_RETRY_HTML = `
  <span class="ruby-text">
    <ruby>再<rt>ㄗㄞˋ</rt></ruby>
    <ruby>試<rt>ㄕˋ</rt></ruby>
    <ruby>一<rt>ㄧ</rt></ruby>
    <ruby>次<rt>ㄘˋ</rt></ruby>
    <ruby>？<rt></rt></ruby>
    <ruby>你<rt>ㄋㄧˇ</rt></ruby>
    <ruby>可<rt>ㄎㄜˇ</rt></ruby>
    <ruby>以<rt>ㄧˇ</rt></ruby>
    <ruby>的<rt>ㄉㄜ˙</rt></ruby>
  </span>
  💪💪💪
`;

const MSG_SUCCESS_HTML = `
  <span class="ruby-text">
    <ruby>太<rt>ㄊㄞˋ</rt></ruby>
    <ruby>棒<rt>ㄅㄤˋ</rt></ruby>
    <ruby>了<rt>ㄌㄜ˙</rt></ruby>
    <ruby>！<rt></rt></ruby>
    <ruby>答<rt>ㄉㄚˊ</rt></ruby>
    <ruby>對<rt>ㄉㄨㄟˋ</rt></ruby>
    <ruby>囉<rt>ㄌㄨㄛ˙</rt></ruby>
    <ruby>～<rt></rt></ruby>
    <ruby>再<rt>ㄗㄞˋ</rt></ruby>
    <ruby>來<rt>ㄌㄞˊ</rt></ruby>
    <ruby>一<rt>ㄧ</rt></ruby>
    <ruby>題<rt>ㄊㄧˊ</rt></ruby>
    <ruby>？<rt></rt></ruby>
  </span>
`;

const BTN_START_HTML = `
  <span class="ruby-text">
    <ruby>開<rt>ㄎㄞ</rt></ruby>
    <ruby>始<rt>ㄕˇ</rt></ruby>
  </span>
`;

const BTN_DONE_HTML = `
  <span class="ruby-text">
    <ruby>完<rt>ㄨㄢˊ</rt></ruby>
    <ruby>成<rt>ㄔㄥˊ</rt></ruby>
  </span>
`;

// ----- DOM 物件 -----

const symbolArea = document.querySelector(".symbol-area");
const symbolTextEl = document.getElementById("symbolText");
const explosionImgEl = document.getElementById("explosionImage");
const day21ImgEl = document.getElementById("day21Image");
const timerValueEl = document.getElementById("timerValue");
const actionButton = document.getElementById("actionButton");
const actionButtonText = document.getElementById("actionText");
const titleTextEl = document.getElementById("page-title");

const closeButton = document.getElementById("closeButton");
const mainControlRow = document.getElementById("mainControlRow");
const confirmControlRow = document.getElementById("confirmControlRow");
const cancelExitButton = document.getElementById("cancelExitButton");
const confirmExitButton = document.getElementById("confirmExitButton");

// 狀態管理：idle / preparing / counting / confirm-exit
let gameState = "idle";
let prepareTimeoutId = null;
let countdownIntervalId = null;
let retryTimeoutId = null;
let remainingSeconds = COUNTDOWN_SECONDS;

// ---------- 顯示文字的小工具 ----------

function showMessageHTML(html) {
  symbolTextEl.style.display = "inline";
  symbolTextEl.classList.remove("symbol-area__char--zhuyin");
  symbolTextEl.innerHTML = html;
}

function showZhuyinChar(char) {
  symbolTextEl.style.display = "inline";
  symbolTextEl.classList.add("symbol-area__char--zhuyin");
  symbolTextEl.textContent = char;   // 大注音只顯示符號本身
}

function setTitleHTML(html) {
  titleTextEl.innerHTML = html;
}

// ---------- 其他工具函式 ----------

function getRandomZhuyin() {
  const index = Math.floor(Math.random() * ZHUYIN_LIST.length);
  return ZHUYIN_LIST[index];
}

function clearTimers() {
  if (prepareTimeoutId !== null) {
    clearTimeout(prepareTimeoutId);
    prepareTimeoutId = null;
  }
  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
  if (retryTimeoutId !== null) {
    clearTimeout(retryTimeoutId);
    retryTimeoutId = null;
  }
}

function hideAllImages() {
  explosionImgEl.classList.remove("symbol-area__explosion--show");
  explosionImgEl.setAttribute("aria-hidden", "true");

  day21ImgEl.classList.remove("symbol-area__day21--show");
  day21ImgEl.setAttribute("aria-hidden", "true");
}

function resetViewToIdle() {
  clearTimers();
  gameState = "idle";
  actionButton.disabled = false;
  actionButtonText.innerHTML = BTN_START_HTML;

  symbolArea.classList.remove("symbol-area--flashing");
  symbolArea.classList.remove("symbol-area--no-frame");

  hideAllImages();

  showMessageHTML(MSG_READY_HTML);

  remainingSeconds = COUNTDOWN_SECONDS;
  timerValueEl.textContent = remainingSeconds.toString();

  mainControlRow.style.display = "flex";
  confirmControlRow.style.display = "none";

  setTitleHTML(TITLE_DEFAULT_HTML);
}

// ---------- 遊戲流程 ----------

function startPreparePhase() {
  gameState = "preparing";
  actionButton.disabled = true;
  actionButtonText.innerHTML = `
    <span class="ruby-text">
      <ruby>準<rt>ㄓㄨㄣˇ</rt></ruby>
      <ruby>備<rt>ㄅㄟˋ</rt></ruby>
      <ruby>中<rt>ㄓㄨㄥ</rt></ruby>
      … 
    </span>
  `;

  setTitleHTML(TITLE_DEFAULT_HTML);

  hideAllImages();
  symbolArea.classList.remove("symbol-area--no-frame");

  showMessageHTML(MSG_LOOK_HTML);
  symbolArea.classList.add("symbol-area--flashing");

  prepareTimeoutId = setTimeout(() => {
    const randomChar = getRandomZhuyin();
    showZhuyinChar(randomChar);

    symbolArea.classList.remove("symbol-area--flashing");

    startCountdownPhase();
  }, PREPARE_FLASH_MS);
}

function startCountdownPhase() {
  gameState = "counting";
  actionButton.disabled = false;
  actionButtonText.innerHTML = BTN_DONE_HTML;

  remainingSeconds = COUNTDOWN_SECONDS;
  timerValueEl.textContent = remainingSeconds.toString();

  countdownIntervalId = setInterval(() => {
    remainingSeconds -= 1;
    timerValueEl.textContent = remainingSeconds.toString();

    if (remainingSeconds <= 0) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
      handleTimeout();
    }
  }, 1000);
}

// 時間到（沒有按完成）
function handleTimeout() {
  gameState = "idle";
  actionButtonText.innerHTML = BTN_START_HTML;

  setTitleHTML(TITLE_TIMEOUT_HTML);

  symbolTextEl.style.display = "none";
  hideAllImages();

  explosionImgEl.classList.add("symbol-area__explosion--show");
  explosionImgEl.setAttribute("aria-hidden", "false");

  symbolArea.classList.add("symbol-area--no-frame");

  retryTimeoutId = setTimeout(() => {
    symbolArea.classList.remove("symbol-area--no-frame");
    hideAllImages();
    showMessageHTML(MSG_RETRY_HTML);
  }, RETRY_DELAY_MS);
}

// 在倒數中按下「完成」
function handleCompleteInTime() {
  clearInterval(countdownIntervalId);
  countdownIntervalId = null;

  gameState = "idle";
  actionButtonText.innerHTML = BTN_START_HTML;

  hideAllImages();
  symbolArea.classList.remove("symbol-area--no-frame");

  showMessageHTML(MSG_SUCCESS_HTML);
  setTitleHTML(TITLE_DEFAULT_HTML);
}

// ---------- 關閉確認模式 ----------

function enterConfirmExitMode() {
  if (gameState === "confirm-exit") return;

  clearTimers();
  gameState = "confirm-exit";

  setTitleHTML(TITLE_CONFIRM_EXIT_HTML);

  symbolTextEl.style.display = "none";
  hideAllImages();

  symbolArea.classList.add("symbol-area--no-frame");
  day21ImgEl.classList.add("symbol-area__day21--show");
  day21ImgEl.setAttribute("aria-hidden", "false");

  mainControlRow.style.display = "none";
  confirmControlRow.style.display = "flex";
}

function cancelExitAndContinue() {
  resetViewToIdle();
}

function confirmExit() {
  window.close();
}

// ---------- 事件監聽 ----------

actionButton.addEventListener("click", () => {
  if (gameState === "idle") {
    clearTimers();
    startPreparePhase();
  } else if (gameState === "counting") {
    handleCompleteInTime();
  }
});

closeButton.addEventListener("click", () => {
  enterConfirmExitMode();
});

cancelExitButton.addEventListener("click", () => {
  cancelExitAndContinue();
});

confirmExitButton.addEventListener("click", () => {
  confirmExit();
});

// 初始畫面
resetViewToIdle();
