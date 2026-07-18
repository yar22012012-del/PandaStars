// You can hardcode your Telegram numeric id here (string), or leave null and set via localStorage
const OWNER_ID_HARD = '7054395396'; // hardcoded owner id

// Pages handling
document.addEventListener('DOMContentLoaded', async function(){
    
    const pages = {
    games: document.getElementById('gamesPage'),
    shop: document.getElementById('shopPage'),
    profile: document.getElementById('profilePage')
};
const buttons = document.querySelectorAll('.bottom-menu button');

function openPage(page){
    for(const k in pages) pages[k].classList.remove('active');
    if(pages[page]) pages[page].classList.add('active');
    buttons.forEach(b=>b.classList.remove('active'));
    if(page==='games') buttons[0].classList.add('active');
    if(page==='shop') buttons[1].classList.add('active');
    if(page==='profile') buttons[2].classList.add('active');
    try{ console.log('[openPage] switched to', page); }catch(e){}
}
// expose to global so inline onclick handlers work
window.openPage = openPage;

// Attach fallback event listeners to bottom menu buttons (in case inline onclick fails)
try{
    if(buttons && buttons.length>=3){
        const mapping = ['games','shop','profile'];
        buttons.forEach((b,i)=>{
            // avoid double-binding if already using inline onclick
            b.addEventListener('click', (ev)=>{
                ev.stopPropagation();
                openPage(mapping[i]);
            });
        });
    }
}catch(e){ console.error('bottom menu bind error', e); }

// Free case overlay + spinner
const FREE_KEY = 'freeCaseLastOpen';
const DAY_MS = 24*60*60*1000;
const BALANCE_KEY = 'pandaBalance';
const OWNER_KEY = 'ownerId';
const DEMO_KEY = 'demoMode';
const OWNER_BYPASS = true; // owner mode: case available anytime
const API_BASE_URL = 'http://localhost:8080/api';

let serverUserId = null;
let serverUserName = '';
let serverLastFreeCase = 0;
let serverBalance = null;
let useServerSync = false;

const freeCard = document.querySelector('.free');
const overlay = document.getElementById('freeCaseOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const openCaseBtn = document.getElementById('openCaseBtn');
const closeOverlay = document.getElementById('closeOverlay');
const countdownEl = document.getElementById('case-countdown');
const caseMessage = document.getElementById('case-message') || document.createElement('div');

// Spinner elements
const spinnerWrap = document.getElementById('spinnerWrap');
const spinnerList = document.getElementById('spinnerList');
const settingsBtn = document.getElementById('settingsBtn');
const prizesBtn = document.getElementById('prizesBtn');
const settingsClose = document.getElementById('settingsClose');
const settingsDone = document.getElementById('settingsDone');
const demoToggle = document.getElementById('demoToggle');

function pad(v){ return v.toString().padStart(2,'0'); }

function getStoredBalance(){ return parseInt(localStorage.getItem(BALANCE_KEY) || '0',10); }
function setStoredBalance(v){ localStorage.setItem(BALANCE_KEY, String(v)); const el=document.getElementById('balance'); if(el) el.textContent = v; }
setStoredBalance(getStoredBalance());

function getCurrentTelegramUserId(){
    try{
        if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user){
            return String(Telegram.WebApp.initDataUnsafe.user.id);
        }
    }catch(e){ }
    return null;
}

function getCurrentTelegramUserName(){
    try{
        if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user){
            return Telegram.WebApp.initDataUnsafe.user.username || '';
        }
    }catch(e){ }
    return '';
}

function getStoredOwnerId(){ return localStorage.getItem(OWNER_KEY) || OWNER_ID_HARD; }
function isCurrentOwner(){ const owner = getStoredOwnerId(); const cur = getCurrentTelegramUserId(); return owner && cur && owner === cur; }

function isDemoMode(){ return localStorage.getItem(DEMO_KEY) === '1'; }

function setDemoMode(enabled){ localStorage.setItem(DEMO_KEY, enabled ? '1' : '0'); if(demoToggle) demoToggle.checked = enabled; }

async function requestJson(url, options={}){
    try{
        const response = await fetch(url, options);
        if(!response.ok){ throw new Error('HTTP ' + response.status); }
        return await response.json();
    }catch(err){
        console.warn('[api] request failed', err, url);
        return null;
    }
}

async function initServerSync(){
    const userId = getCurrentTelegramUserId();
    if(!userId) return false;
    serverUserId = userId;
    serverUserName = getCurrentTelegramUserName();
    const url = `${API_BASE_URL}/user/${encodeURIComponent(userId)}`;
    const data = await requestJson(url);
    if(!data) return false;
    useServerSync = true;
    serverBalance = parseInt(data.balance ?? 0, 10);
    serverLastFreeCase = parseInt(data.last_free_case ?? 0, 10);
    setStoredBalance(serverBalance);
    return true;
}

async function updateServerUser(balance, lastFreeCase){
    if(!useServerSync || !serverUserId) return;
    const url = `${API_BASE_URL}/user/${encodeURIComponent(serverUserId)}`;
    await requestJson(url, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            username: serverUserName,
            balance: balance,
            last_free_case: lastFreeCase
        })
    });
}

function refreshOverlayState(){
    if(!overlay) return;
    const last = useServerSync ? serverLastFreeCase : parseInt(localStorage.getItem(FREE_KEY) || '0',10);
    const now = Date.now();
    const owner = localStorage.getItem(OWNER_KEY);
    const currentId = getCurrentTelegramUserId();
    const currentIsOwner = owner && currentId && owner===currentId;
    const demo = isDemoMode();
    const canOpen = demo ? true : (OWNER_BYPASS && currentIsOwner ? true : (!last || now - last >= DAY_MS));

    countdownEl.textContent = demo ? 'Демо включено: кейсы доступны сразу, но баланс не изменяется.' : '';

    if(canOpen){
        openCaseBtn.disabled = false;
        openCaseBtn.classList.remove('disabled');
        openCaseBtn.textContent = demo ? 'Открыть бесплатно (демо)' : 'Открыть бесплатно';
    } else {
        openCaseBtn.disabled = true;
        openCaseBtn.classList.add('disabled');
        openCaseBtn.textContent = 'Открыть бесплатно';
        updateCountdown();
        if(window._caseCountdownTimer) clearInterval(window._caseCountdownTimer);
        window._caseCountdownTimer = setInterval(updateCountdown,1000);
    }
}

function updateCountdown(){ const last=useServerSync ? serverLastFreeCase : parseInt(localStorage.getItem(FREE_KEY)||'0',10); const left = DAY_MS - (Date.now()-last); if(left<=0){ refreshOverlayState(); return; } const h=Math.floor(left/3600000); const m=Math.floor((left%3600000)/60000); const s=Math.floor((left%60000)/1000); countdownEl.textContent = `До следующего открытия осталось ${pad(h)}:${pad(m)}:${pad(s)}`; }

function prepareSpinner(){ if(!spinnerList) return; buildSpinner(); const el = spinnerList.querySelector('.spin-item'); if(el) itemHeight = el.getBoundingClientRect().height || 76; totalItems = PRIZES.length*REPEAT; totalHeight = itemHeight * totalItems; const startIndex = Math.floor(totalItems / 2); currentOffset = startIndex * itemHeight; spinnerList.style.transition = 'none'; spinnerList.style.transform = `translateY(-${currentOffset}px)`; }

function showOverlay(){ if(!overlay) return; overlay.classList.remove('hidden'); refreshOverlayState(); prepareSpinner(); spinnerWrap.classList.remove('hidden'); startAutoScroll(); caseMessage.textContent = 'Откройте кейс, чтобы выиграть NFT‑подарок или звезды'; }
function hideOverlay(){ if(!overlay) return; overlay.classList.add('hidden'); if(window._caseCountdownTimer){ clearInterval(window._caseCountdownTimer); window._caseCountdownTimer=null; } stopAutoScroll(); }

if(freeCard) freeCard.addEventListener('click', showOverlay);
if(closeOverlay) closeOverlay.addEventListener('click', hideOverlay);
if(settingsBtn) settingsBtn.addEventListener('click', ()=>{
    if(settingsOverlay) settingsOverlay.classList.remove('hidden');
    if(demoToggle) demoToggle.checked = isDemoMode();
});
if(settingsClose) settingsClose.addEventListener('click', ()=>{ if(settingsOverlay) settingsOverlay.classList.add('hidden'); });
if(settingsDone) settingsDone.addEventListener('click', ()=>{ if(settingsOverlay) settingsOverlay.classList.add('hidden'); });
if(demoToggle) demoToggle.addEventListener('change', ()=>{ setDemoMode(demoToggle.checked); refreshOverlayState(); });
if(prizesBtn) prizesBtn.addEventListener('click', ()=> alert('Призы пока не готовы.'));

// Live feed data
const LIVE_FEED_CONTAINER_ID = 'liveFeedList';

function addLiveFeedItem(user, prize){
    const container = document.getElementById(LIVE_FEED_CONTAINER_ID);
    if(!container) return;
    const item = document.createElement('div');
    item.className = 'wins-item';
    item.innerHTML = `<span class="wins-user">${user}</span> открыл кейс и выиграл <span class="wins-prize">${prize}</span>`;
    container.prepend(item);
    if(container.childNodes.length > 6){
        container.removeChild(container.lastChild);
    }
}

// Spinner / prizes
const PRIZES = [
    {label:'0.5 ⭐', weight:28},
    {label:'1.2 ⭐', weight:26},
    {label:'2 ⭐', weight:24},
    {label:'2.7 ⭐', weight:22},
    {label:'3 ⭐', weight:20},
    {label:'4 ⭐', weight:18},
    {label:'5 ⭐', weight:16},
    {label:'6.7 ⭐', weight:14},
    {label:'8.2 ⭐', weight:12},
    {label:'9 ⭐', weight:10},
    {label:'12 ⭐', weight:5},
    {label:'19 ⭐', weight:4},
    {label:'23 ⭐', weight:3},
    {label:'29 ⭐', weight:2.5},
    {label:'31 ⭐', weight:2},
    {label:'34 ⭐', weight:1.8},
    {label:'46 ⭐', weight:1.4},
    {label:'52 ⭐', weight:1.2},
    {label:'69 ⭐', weight:1},
    {label:'192 ⭐', weight:0.8},
    {label:'408 ⭐', weight:0.6},
    {label:'457 ⭐', weight:0.5},
    {label:'1485 ⭐', weight:0.25},
    {label:'2039 ⭐', weight:0.15}
];
const REPEAT = 30;

function buildSpinner(){
    if(!spinnerList) return;
    spinnerList.innerHTML = '';
    for(let r=0;r<REPEAT;r++){
        for(const p of PRIZES){
            const it = document.createElement('div');
            it.className='spin-item';
            it.textContent = p.label;
            spinnerList.appendChild(it);
        }
    }
}

let itemHeight=76; let totalItems = PRIZES.length*REPEAT; let totalHeight = 0; let currentOffset=0; let slowInterval=null;

function startAutoScroll(){ stopAutoScroll(); slowInterval = setInterval(()=>{ currentOffset += 0.5; if(currentOffset > totalHeight) currentOffset = currentOffset - Math.floor(currentOffset/totalHeight)*totalHeight; if(spinnerList) spinnerList.style.transform = `translateY(-${currentOffset}px)`; },16); }
function stopAutoScroll(){ if(slowInterval){ clearInterval(slowInterval); slowInterval=null; } }

function getPrizeWeights(){ const demo = isDemoMode(); return PRIZES.map((p)=>{
        let weight = p.weight;
        if(demo){
            const value = parseFloat(p.label.replace(',', '.')) || 0;
            if(value >= 408) weight *= 4;
            else if(value >= 192) weight *= 3;
            else if(value >= 69) weight *= 2.2;
            else if(value >= 46) weight *= 1.6;
            else if(value >= 23) weight *= 1.3;
            else weight *= 0.9;
        }
        return weight;
    });
}

function pickPrizeIndex(){ const weights = getPrizeWeights(); const total = weights.reduce((s,w)=>s+w,0); let rnd = Math.random()*total; for(let i=0;i<PRIZES.length;i++){ rnd -= weights[i]; if(rnd<=0) return i; } return PRIZES.length-1; }

function startSpinner(){ if(!spinnerWrap || !spinnerList) return; if(!spinnerList.children.length) prepareSpinner(); spinnerWrap.classList.remove('hidden'); const el = spinnerList.querySelector('.spin-item'); if(el) itemHeight = el.getBoundingClientRect().height || 60; totalItems = PRIZES.length*REPEAT; totalHeight = itemHeight * totalItems; const startIndex = Math.floor(totalItems / 2); currentOffset = startIndex * itemHeight; spinnerList.style.transition='none'; spinnerList.style.transform = `translateY(-${currentOffset}px)`; startAutoScroll(); openCaseBtn.disabled=true; openCaseBtn.textContent='Кручу...';
    setTimeout(()=>{
        stopAutoScroll();
        const base = pickPrizeIndex();
        const cycles = 5 + Math.floor(Math.random()*6);
        const targetIndex = startIndex + cycles*PRIZES.length + base;
        const targetOffset = targetIndex * itemHeight;
        spinnerList.style.transition = 'transform 3.8s cubic-bezier(.22,.9,.12,1)';
        requestAnimationFrame(()=> spinnerList.style.transform = `translateY(-${targetOffset}px)` );
        spinnerList.addEventListener('transitionend', function onEnd(){ spinnerList.removeEventListener('transitionend', onEnd);
            const landedIndex = targetIndex % PRIZES.length; const prize = PRIZES[landedIndex];
            const demo = isDemoMode();
            const timestamp = Date.now();
            if(!isCurrentOwner()){
                if(useServerSync){
                    serverLastFreeCase = timestamp;
                } else {
                    localStorage.setItem(FREE_KEY, timestamp.toString());
                }
            }
            if(!demo){
                const match = prize.label.match(/(\d+(?:[.,]\d+)?)/);
                if(match){ const num = parseFloat(match[1].replace(',', '.')); if(!isNaN(num) && num>0){ const newBalance = getStoredBalance()+num; setStoredBalance(newBalance); if(useServerSync){ serverBalance = newBalance; updateServerUser(newBalance, serverLastFreeCase); } } }
            } else if(useServerSync){
                updateServerUser(getStoredBalance(), serverLastFreeCase);
            }
            openCaseBtn.textContent = demo ? `Демо: ${prize.label}` : `Вы выиграли ${prize.label}!`;
            caseMessage.textContent = demo ? 'Режим демо: баланс не изменяется.' : 'Поздравляем!';
            addLiveFeedItem('Вы', prize.label);
            setTimeout(()=>{ spinnerWrap.classList.add('hidden'); refreshOverlayState(); },1400);
        });
    },950);
}

if(openCaseBtn) openCaseBtn.addEventListener('click', ()=>{ if(openCaseBtn.disabled) return; startSpinner(); });

// simple upgrade/crash placeholders
const upgrade = document.querySelector('.upgrade'); if(upgrade) upgrade.addEventListener('click', ()=> alert('📈 Апгрейдер скоро появится.'));
const crash = document.querySelector('.crash'); if(crash) crash.addEventListener('click', ()=> alert('💥 Краш скоро появится.'));

    // If owner id was hardcoded, save to localStorage so checks work
    if(OWNER_ID_HARD){ localStorage.setItem('ownerId', OWNER_ID_HARD); }
    setDemoMode(localStorage.getItem(DEMO_KEY) === '1');
    openPage('games');

});