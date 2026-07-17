// You can hardcode your Telegram numeric id here (string), or leave null and set via localStorage
const OWNER_ID_HARD = '7054395396'; // hardcoded owner id

// Pages handling
document.addEventListener('DOMContentLoaded', function(){
    
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
const OWNER_BYPASS = true; // owner mode: case available anytime

const freeCard = document.querySelector('.free');
const overlay = document.getElementById('freeCaseOverlay');
const openCaseBtn = document.getElementById('openCaseBtn');
const closeOverlay = document.getElementById('closeOverlay');
const countdownEl = document.getElementById('case-countdown');
const caseMessage = document.getElementById('case-message') || document.createElement('div');

// Spinner elements
const spinnerWrap = document.getElementById('spinnerWrap');
const spinnerList = document.getElementById('spinnerList');

function pad(v){ return v.toString().padStart(2,'0'); }

function getStoredBalance(){ return parseInt(localStorage.getItem(BALANCE_KEY) || '0',10); }
function setStoredBalance(v){ localStorage.setItem(BALANCE_KEY, String(v)); const el=document.getElementById('balance'); if(el) el.textContent = v; }
setStoredBalance(getStoredBalance());

function getCurrentTelegramUserId(){
    try{ if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) return String(Telegram.WebApp.initDataUnsafe.user.id); }catch(e){}
    return OWNER_ID_HARD || null;
}

function isCurrentOwner(){ const owner=localStorage.getItem(OWNER_KEY) || OWNER_ID_HARD; const cur=getCurrentTelegramUserId(); return owner && cur && owner===cur; }

function refreshOverlayState(){
    if(!overlay) return;
    const last = parseInt(localStorage.getItem(FREE_KEY) || '0',10);
    const now = Date.now();
    const owner = localStorage.getItem(OWNER_KEY);
    const currentId = getCurrentTelegramUserId();
    const currentIsOwner = owner && currentId && owner===currentId;
    const canOpen = OWNER_BYPASS && currentIsOwner ? true : (!last || now - last >= DAY_MS);
    if(canOpen){
        // can open
        countdownEl.textContent = '';
        openCaseBtn.disabled = false; openCaseBtn.classList.remove('disabled'); openCaseBtn.textContent = 'Открыть бесплатно';
    } else {
        // cooldown
        openCaseBtn.disabled = true; openCaseBtn.classList.add('disabled');
        updateCountdown();
        if(window._caseCountdownTimer) clearInterval(window._caseCountdownTimer);
        window._caseCountdownTimer = setInterval(updateCountdown,1000);
    }
}

function updateCountdown(){ const last=parseInt(localStorage.getItem(FREE_KEY)||'0',10); const left = DAY_MS - (Date.now()-last); if(left<=0){ refreshOverlayState(); return; } const h=Math.floor(left/3600000); const m=Math.floor((left%3600000)/60000); const s=Math.floor((left%60000)/1000); countdownEl.textContent = `До следующего открытия осталось ${pad(h)}:${pad(m)}:${pad(s)}`; }

function prepareSpinner(){ if(!spinnerList) return; buildSpinner(); const el = spinnerList.querySelector('.spin-item'); if(el) itemHeight = el.getBoundingClientRect().height || 76; totalItems = PRIZES.length*REPEAT; totalHeight = itemHeight * totalItems; const startIndex = Math.floor(totalItems / 2); currentOffset = startIndex * itemHeight; spinnerList.style.transition = 'none'; spinnerList.style.transform = `translateY(-${currentOffset}px)`; }

function showOverlay(){ if(!overlay) return; overlay.classList.remove('hidden'); refreshOverlayState(); prepareSpinner(); spinnerWrap.classList.remove('hidden'); startAutoScroll(); caseMessage.textContent = 'Откройте кейс, чтобы выиграть NFT‑подарок или звезды'; }
function hideOverlay(){ if(!overlay) return; overlay.classList.add('hidden'); if(window._caseCountdownTimer){ clearInterval(window._caseCountdownTimer); window._caseCountdownTimer=null; } stopAutoScroll(); }

if(freeCard) freeCard.addEventListener('click', showOverlay);
if(closeOverlay) closeOverlay.addEventListener('click', hideOverlay);

// Spinner / prizes
const PRIZES = [
    {label:'0.3 ⭐', weight:28},
    {label:'0.7 ⭐', weight:26},
    {label:'1 ⭐', weight:22},
    {label:'2 ⭐', weight:18},
    {label:'4 ⭐', weight:16},
    {label:'7 ⭐', weight:4},
    {label:'8.1 ⭐', weight:3},
    {label:'1286 ⭐', weight:0.6},
    {label:'1634 ⭐', weight:0.35},
    {label:'6528 ⭐', weight:0.15}
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

function pickPrizeIndex(){ const total = PRIZES.reduce((s,p)=>s+p.weight,0); let rnd = Math.random()*total; for(let i=0;i<PRIZES.length;i++){ rnd -= PRIZES[i].weight; if(rnd<=0) return i; } return PRIZES.length-1; }

function startSpinner(){ if(!spinnerWrap || !spinnerList) return; if(!spinnerList.children.length) prepareSpinner(); spinnerWrap.classList.remove('hidden'); const el = spinnerList.querySelector('.spin-item'); if(el) itemHeight = el.getBoundingClientRect().height || 76; totalItems = PRIZES.length*REPEAT; totalHeight = itemHeight * totalItems; const startIndex = Math.floor(totalItems / 2); currentOffset = startIndex * itemHeight; spinnerList.style.transition='none'; spinnerList.style.transform = `translateY(-${currentOffset}px)`; startAutoScroll(); openCaseBtn.disabled=true; openCaseBtn.textContent='Кручу...';
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
            if(!isCurrentOwner()) localStorage.setItem(FREE_KEY, Date.now().toString());
            const match = prize.label.match(/(\d+(?:[.,]\d+)?)/);
            if(match){ const num = parseFloat(match[1].replace(',', '.')); if(!isNaN(num) && num>0){ setStoredBalance(getStoredBalance()+num); } }
            openCaseBtn.textContent = `Вы выиграли ${prize.label}!`;
            caseMessage.textContent = 'Поздравляем!';
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

    openPage('games');

});