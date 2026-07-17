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
}

// Free case overlay + spinner
const FREE_KEY = 'freeCaseLastOpen';
const DAY_MS = 24*60*60*1000;
const BALANCE_KEY = 'pandaBalance';
const OWNER_KEY = 'ownerId';

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
    return null;
}

function isCurrentOwner(){ const owner=localStorage.getItem(OWNER_KEY); const cur=getCurrentTelegramUserId(); return owner && cur && owner===cur; }

function refreshOverlayState(){
    if(!overlay) return;
    const last = parseInt(localStorage.getItem(FREE_KEY) || '0',10);
    const now = Date.now();
    const owner = localStorage.getItem(OWNER_KEY);
    const currentId = getCurrentTelegramUserId();
    const currentIsOwner = owner && currentId && owner===currentId;
    if(currentIsOwner || !last || now - last >= DAY_MS){
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

function showOverlay(){ if(!overlay) return; overlay.classList.remove('hidden'); refreshOverlayState(); }
function hideOverlay(){ if(!overlay) return; overlay.classList.add('hidden'); if(window._caseCountdownTimer){ clearInterval(window._caseCountdownTimer); window._caseCountdownTimer=null; } }

if(freeCard) freeCard.addEventListener('click', showOverlay);
if(closeOverlay) closeOverlay.addEventListener('click', hideOverlay);

// Spinner / prizes
const PRIZES = [ {label:'1 ⭐', weight:40},{label:'3 ⭐', weight:20},{label:'7 ⭐', weight:8},{label:'53 ⭐', weight:6},{label:'71 ⭐', weight:5},{label:'89 ⭐', weight:4},{label:'1252 ⭐', weight:1},{label:'0 ⭐', weight:16} ];
const REPEAT = 25;

function buildSpinner(){ if(!spinnerList) return; spinnerList.innerHTML=''; for(let r=0;r<REPEAT;r++){ for(const p of PRIZES){ const it=document.createElement('div'); it.className='spin-item'; it.textContent = p.label; spinnerList.appendChild(it); } } }

let itemHeight=76; let totalItems = PRIZES.length*REPEAT; let totalHeight = 0; let currentOffset=0; let slowInterval=null;

function startAutoScroll(){ stopAutoScroll(); slowInterval = setInterval(()=>{ currentOffset += 0.5; if(currentOffset > totalHeight) currentOffset = currentOffset - Math.floor(currentOffset/totalHeight)*totalHeight; if(spinnerList) spinnerList.style.transform = `translateY(-${currentOffset}px)`; },16); }
function stopAutoScroll(){ if(slowInterval){ clearInterval(slowInterval); slowInterval=null; } }

function pickPrizeIndex(){ const total = PRIZES.reduce((s,p)=>s+p.weight,0); let rnd = Math.random()*total; for(let i=0;i<PRIZES.length;i++){ rnd -= PRIZES[i].weight; if(rnd<=0) return i; } return PRIZES.length-1; }

function startSpinner(){ if(!spinnerWrap || !spinnerList) return; spinnerWrap.classList.remove('hidden'); buildSpinner(); const el = spinnerList.querySelector('.spin-item'); if(el) itemHeight = el.getBoundingClientRect().height || 76; totalItems = PRIZES.length*REPEAT; totalHeight = itemHeight * totalItems; currentOffset = Math.floor(totalHeight/4); spinnerList.style.transition='none'; spinnerList.style.transform = `translateY(-${currentOffset}px)`; startAutoScroll(); openCaseBtn.disabled=true; openCaseBtn.textContent='Кручу...';
    setTimeout(()=>{
        stopAutoScroll();
        const base = pickPrizeIndex();
        const cycles = 5 + Math.floor(Math.random()*6);
        const targetIndex = cycles*PRIZES.length + base;
        const targetOffset = currentOffset + targetIndex*itemHeight + (itemHeight/2);
        spinnerList.style.transition = 'transform 3.8s cubic-bezier(.22,.9,.12,1)';
        requestAnimationFrame(()=> spinnerList.style.transform = `translateY(-${targetOffset}px)` );
        spinnerList.addEventListener('transitionend', function onEnd(){ spinnerList.removeEventListener('transitionend', onEnd);
            const landedIndex = targetIndex % PRIZES.length; const prize = PRIZES[landedIndex];
            // set last open time for non-owner
            if(!isCurrentOwner()) localStorage.setItem(FREE_KEY, Date.now().toString());
            // credit balance
            const match = prize.label.match(/(\d[\d\s]*)/);
            if(match){ const num = parseInt(match[1].replace(/\s+/g,''),10); if(!isNaN(num) && num>0){ setStoredBalance(getStoredBalance()+num); } }
            openCaseBtn.textContent = `Вы выиграли ${prize.label}!`;
            caseMessage.textContent = 'Поздравляем!';
            setTimeout(()=>{ spinnerWrap.classList.add('hidden'); refreshOverlayState(); },1400);
        });
    },600);
}

if(openCaseBtn) openCaseBtn.addEventListener('click', ()=>{ if(openCaseBtn.disabled) return; startSpinner(); });

// simple upgrade/crash placeholders
const upgrade = document.querySelector('.upgrade'); if(upgrade) upgrade.addEventListener('click', ()=> alert('📈 Апгрейдер скоро появится.'));
const crash = document.querySelector('.crash'); if(crash) crash.addEventListener('click', ()=> alert('💥 Краш скоро появится.'));

    // If owner id was hardcoded, save to localStorage so checks work
    if(OWNER_ID_HARD){ localStorage.setItem('ownerId', OWNER_ID_HARD); }

    openPage('games');

});