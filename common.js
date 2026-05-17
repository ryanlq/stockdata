/* ===== 股市工具公共脚本 ===== */

// ---- Theme ----
function getTheme() { return localStorage.getItem("stk_theme") || "light"; }

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("stk_theme", theme);
    const btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = theme === "dark" ? "☀" : "🌙";
}

function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
}

// ---- Cache ----
const CACHE_PREFIX = "stk_";
const CACHE_TTL = 90 * 24 * 3600 * 1000;

function cacheGet(key) {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_PREFIX + key); return null; }
        return data;
    } catch { return null; }
}

function cacheSet(key, data) {
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data })); }
    catch { /* quota exceeded */ }
}

// ---- Watchlist (stocks) ----
const WATCHLIST_KEY = "stk_watchlist";

function getWatchlist() {
    try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || []; }
    catch { return []; }
}

function saveWatchlist(list) {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

function isInWatchlist(secucode) {
    return getWatchlist().some(s => s.secucode === secucode);
}

function toggleWatchlist(secucode, name, market) {
    let list = getWatchlist();
    const idx = list.findIndex(s => s.secucode === secucode);
    if (idx >= 0) {
        list.splice(idx, 1);
    } else {
        list.push({ secucode, name, market, addedAt: Date.now() });
    }
    saveWatchlist(list);
    return idx < 0; // true = added, false = removed
}

// ---- Board detection ----
function getBoard(code) {
    if (!code) return "";
    const c = String(code);
    if (c.startsWith("688")) return "kcb";
    if (c.startsWith("300") || c.startsWith("301")) return "cyb";
    if (c.startsWith("8") || c.startsWith("43")) return "bse";
    if (c.startsWith("900") || c.startsWith("200")) return "b";
    return "main";
}

function getBoardLabel(code) {
    const map = { kcb: "科创板", cyb: "创业板", bse: "北交所", b: "B股", main: "主板" };
    return map[getBoard(code)] || "";
}

// ---- TradingView ----
function secucodeToSymbol(secucode) {
    if (!secucode || !secucode.includes(".")) return "";
    const [code, m] = secucode.split(".");
    return `${m === "SH" ? "SSE" : "SZSE"}:${code}`;
}

function codeToF10Url(secucode) {
    if (!secucode || !secucode.includes(".")) return "#";
    const [code, m] = secucode.split(".");
    let market;
    if (m === "SH" || code.startsWith("688")) market = "sh";
    else if (code.startsWith("8") || code.startsWith("4") || code.startsWith("92")) market = "bj";
    else market = "sz";
    return `https://f10.9fzt.com/index.html#/f10?code=${code}&market=${market}&softNameAbbr=jfztGW&topnav=zxdt`;
}

// ---- Notes ----
const NOTES_KEY = "stk_notes";
function getNote(secucode) {
    try { return (JSON.parse(localStorage.getItem(NOTES_KEY)) || {})[secucode] || ""; }
    catch { return ""; }
}
function saveNote(secucode, text) {
    let all; try { all = JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; } catch { all = {}; }
    if (text.trim()) all[secucode] = text; else delete all[secucode];
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
}

// ---- Init theme on load ----
applyTheme(getTheme());
