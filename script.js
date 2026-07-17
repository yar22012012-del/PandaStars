const pages = {

    games: document.getElementById("gamesPage"),

    shop: document.getElementById("shopPage"),

    profile: document.getElementById("profilePage")

};

const buttons = document.querySelectorAll(".bottom-menu button");

function openPage(page){

    for(const key in pages){

        pages[key].classList.remove("active");

    }

    pages[page].classList.add("active");

    buttons.forEach(btn=>btn.classList.remove("active"));

    if(page==="games"){

        buttons[0].classList.add("active");

    }

    if(page==="shop"){

        buttons[1].classList.add("active");

    }

    if(page==="profile"){

        buttons[2].classList.add("active");

    }

}

// --------------------------
// Бесплатный кейс
// --------------------------

const freeCard = document.querySelector(".free");
const overlay = document.getElementById("freeCaseOverlay");
const openCaseBtn = document.getElementById("openCaseBtn");
const closeOverlay = document.getElementById("closeOverlay");
const countdownEl = document.getElementById("case-countdown");
const caseMessage = document.getElementById("case-message");

const FREE_KEY = 'freeCaseLastOpen';
const DAY_MS = 24 * 60 * 60 * 1000;
let countdownTimer = null;

// Balance and owner handling
const BALANCE_KEY = 'pandaBalance';
const OWNER_KEY = 'ownerId'; // set your telegram numeric id here via localStorage

function getStoredBalance(){
    return parseInt(localStorage.getItem(BALANCE_KEY) || '0',10);
}

function setStoredBalance(v){
    localStorage.setItem(BALANCE_KEY, String(v));
    const el = document.getElementById('balance');
    if(el) el.textContent = v;
}

// Initialize balance in UI
setStoredBalance(getStoredBalance());

function getCurrentTelegramUserId(){
    try{
        if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user && Telegram.WebApp.initDataUnsafe.user.id){
            return String(Telegram.WebApp.initDataUnsafe.user.id);
        }
    }catch(e){ }
    return null;
}

function isOwnerPresent(){
    const owner = localStorage.getItem(OWNER_KEY);
    if(!owner) return false;
    const current = getCurrentTelegramUserId();
    if(current && current === owner) return true;
    // if not in telegram context, allow owner if running locally and owner equals 'local'
    return false;
}

function isCurrentOwner(){
    const owner = localStorage.getItem(OWNER_KEY);
    if(!owner) return false;
    const current = getCurrentTelegramUserId();
    return current && current === owner;
}

function showOverlay(){
    overlay.classList.remove('hidden');
    refreshOverlayState();
}

function hideOverlay(){
    overlay.classList.add('hidden');
    if(countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function refreshOverlayState(){
    if(countdownTimer){ clearInterval(countdownTimer); countdownTimer = null; }
    const last = localStorage.getItem(FREE_KEY);
    const now = Date.now();
    const owner = localStorage.getItem(OWNER_KEY);
    const currentId = getCurrentTelegramUserId();
    const currentIsOwner = (owner && currentId && owner === currentId);

    if(currentIsOwner || !last || now - parseInt(last,10) >= DAY_MS){
        // Можно открыть
        caseMessage.textContent = '';
        countdownEl.textContent = '';
        // Если владелец задан — проверяем текущего пользователя
        if(owner){
            if(currentIsOwner){
                openCaseBtn.disabled = false;
                openCaseBtn.textContent = 'Открыть бесплатно';
                openCaseBtn.classList.remove('disabled');
            } else if(!last || now - parseInt(last,10) >= DAY_MS){
                // не владелец, но прошло 24ч
                openCaseBtn.disabled = false;
                openCaseBtn.textContent = 'Открыть бесплатно';
                openCaseBtn.classList.remove('disabled');
            } else {
                // не владелец и ещё в кулдауне — обработается ниже
                openCaseBtn.disabled = true;
                openCaseBtn.textContent = 'Только владелец';
                openCaseBtn.classList.add('disabled');
            }
        } else {
            openCaseBtn.disabled = false;
            openCaseBtn.textContent = 'Открыть бесплатно';
            openCaseBtn.classList.remove('disabled');
        }
    } else {
        // Ждем
        openCaseBtn.disabled = true;
        updateCountdown();
        countdownTimer = setInterval(updateCountdown, 1000);
    }
}

function updateCountdown(){
    const last = parseInt(localStorage.getItem(FREE_KEY) || '0',10);
    const now = Date.now();
    const left = DAY_MS - (now - last);
    if(left <= 0){
        refreshOverlayState();
        return;
    }
    const h = Math.floor(left / (1000*60*60));
    const m = Math.floor((left % (1000*60*60)) / (1000*60));
    const s = Math.floor((left % (1000*60)) / 1000);
    countdownEl.textContent = `До следующего открытия осталось ${pad(h)}:${pad(m)}:${pad(s)}`;
    caseMessage.textContent = '';
    openCaseBtn.classList.add('disabled');
}

function pad(v){ return v.toString().padStart(2,'0'); }

freeCard.onclick = function(){
    showOverlay();
};

closeOverlay.onclick = hideOverlay;

openCaseBtn.onclick = function(){
    // Если кнопка активна — запустить спиннер
    if(openCaseBtn.disabled) return;
    startSpinner();
};

// --------------------------
// Spinner (carousel) logic
// --------------------------
const spinnerWrap = document.getElementById('spinnerWrap');
const spinnerList = document.getElementById('spinnerList');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

// Prize definitions (label and weight)
const PRIZES = [
    {label: '0 ⭐', weight: 20},
    {label: '1 ⭐', weight: 40},
    {label: '3 ⭐', weight: 15},
    {label: '7 ⭐', weight: 8},
    {label: '53 ⭐', weight: 6},
    {label: '71 ⭐', weight: 5},
    {label: '89 ⭐', weight: 4},
    {label: '1252 ⭐', weight: 1}
];

// Build repeated list for smooth long scroll
const REPEAT = 30;
function buildSpinner(){
    spinnerList.innerHTML = '';
    for(let r=0;r<REPEAT;r++){
        for(const p of PRIZES){
            const it = document.createElement('div');
            it.className = 'spin-item';
            it.textContent = p.label;
            spinnerList.appendChild(it);
        }
    }
}

let itemHeight = 0;
let totalItems = PRIZES.length * REPEAT;
let totalHeight = 0;
let currentOffset = 0;
let slowInterval = null;

function startAutoScroll(){
    stopAutoScroll();
    slowInterval = setInterval(()=>{
        currentOffset += 0.6; // slow speed px per tick
        if(currentOffset > totalHeight/2) currentOffset = currentOffset - Math.floor(currentOffset/totalHeight)*totalHeight;
        spinnerList.style.transform = `translateY(-${currentOffset}px)`;
    }, 16);
}

function stopAutoScroll(){
    if(slowInterval){ clearInterval(slowInterval); slowInterval = null; }
}

function pickPrizeIndex(){
    const totalW = PRIZES.reduce((s,p)=>s+p.weight,0);
    let rnd = Math.random()*totalW;
    for(let i=0;i<PRIZES.length;i++){
        rnd -= PRIZES[i].weight;
        if(rnd<=0) return i;
    }
    return PRIZES.length-1;
}

function startSpinner(){
    // show spinner area
    spinnerWrap.classList.remove('hidden');
    buildSpinner();
    // measure
    const itemEl = spinnerList.querySelector('.spin-item');
    itemHeight = itemEl ? itemEl.getBoundingClientRect().height : 60;
    totalHeight = itemHeight * totalItems;
    // place currentOffset somewhere in middle
    currentOffset = (totalHeight/4) | 0;
    spinnerList.style.transition = 'none';
    spinnerList.style.transform = `translateY(-${currentOffset}px)`;
    // start slow auto scroll
    startAutoScroll();
    // set spin button behaviour: speed up then decelerate
    openCaseBtn.disabled = true;
    openCaseBtn.textContent = 'Кручу...';
    // after short delay accelerate then perform final stop
    setTimeout(()=>{
        // stop auto and compute target
        stopAutoScroll();
        const prizeBaseIndex = pickPrizeIndex();
        // choose target in later repeats to allow long spin
        const cycles = 6 + Math.floor(Math.random()*4); // 6-9 cycles
        const targetIndex = cycles*PRIZES.length + prizeBaseIndex;
        const targetOffset = currentOffset + targetIndex*itemHeight + (itemHeight/2);
        // apply transition to target
        spinnerList.style.transition = 'transform 4s cubic-bezier(.22,.9,.12,1)';
        // small timeout to ensure transition is applied
        requestAnimationFrame(()=>{
            spinnerList.style.transform = `translateY(-${targetOffset}px)`;
        });
        spinnerList.addEventListener('transitionend', function onEnd(){
            spinnerList.removeEventListener('transitionend', onEnd);
            // compute landed prize
            const landedIndex = (targetIndex) % PRIZES.length;
            const prize = PRIZES[landedIndex];
            // set last open time only for non-owner, so owner doesn't block others
            if(!isCurrentOwner()){
                localStorage.setItem(FREE_KEY, Date.now().toString());
            }
            // show result briefly
            openCaseBtn.textContent = `Вы выиграли ${prize.label}!`;
            caseMessage.textContent = 'Поздравляем!';
            // начисление на баланс: если в label есть число — добавить
            const match = prize.label.match(/(\d[\d\s]*)/);
            if(match){
                const num = parseInt(match[1].replace(/\s+/g,''),10);
                if(!isNaN(num) && num>0){
                    const prev = getStoredBalance();
                    setStoredBalance(prev + num);
                }
            }
            // keep spinner positioned; disable further spins until refreshOverlayState
            setTimeout(()=>{
                // hide spinner and refresh overlay state
                spinnerWrap.classList.add('hidden');
                refreshOverlayState();
            }, 1800);
        });
    }, 500);
}

// --------------------------
// Апгрейдер
// --------------------------

const upgrade=document.querySelector(".upgrade");

upgrade.onclick=function(){

    alert("📈 Апгрейдер скоро появится.");

};

// --------------------------
// Краш
// --------------------------

const crash=document.querySelector(".crash");

crash.onclick=function(){

    alert("💥 Краш скоро появится.");

};

openPage("games");