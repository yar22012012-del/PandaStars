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
    if(!last || now - parseInt(last,10) >= DAY_MS){
        // Можно открыть
        caseMessage.textContent = 'Бесплатное открытие доступно сейчас';
        countdownEl.textContent = '';
        openCaseBtn.disabled = false;
        openCaseBtn.textContent = 'Открыть кейс';
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
    caseMessage.textContent = 'Бесплатный кейс недоступен';
}

function pad(v){ return v.toString().padStart(2,'0'); }

freeCard.onclick = function(){
    showOverlay();
};

closeOverlay.onclick = hideOverlay;

openCaseBtn.onclick = function(){
    // Запись времени открытия
    localStorage.setItem(FREE_KEY, Date.now().toString());
    // Показать короткое подтверждение
    openCaseBtn.disabled = true;
    openCaseBtn.textContent = 'Открыто! 🎉';
    caseMessage.textContent = 'Вы открыли кейс!';
    countdownEl.textContent = '';
    // Запустить обратный отсчёт
    setTimeout(()=>{
        refreshOverlayState();
    }, 1500);
};

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