function openPage(page) {
    const content = document.getElementById('main-content');
    
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    if (page === 'game') {
        content.innerHTML = `
            <div class="card free">
                <div><h2>Бесплатно</h2><p>Бесплатные кейсы и задания</p></div>
                <div style="font-size:3rem;">🎁</div>
            </div>
            <div class="card upgrade">
                <div><h2>Апгрейд <span style="background:#22c55e;color:black;padding:2px 8px;border-radius:12px;font-size:0.8rem;">Новое</span></h2>
                <p>Улучшите свои подарки или приумножьте звёзды</p></div>
                <div style="font-size:3rem;">📈</div>
            </div>
            <div class="card roulette">
                <div><h2>Рулетка</h2><p>Крутите рулетку и получайте призы</p></div>
                <div style="font-size:3rem;">🎰</div>
            </div>
            <div class="card crash">
                <div><h2>Краш</h2><p>Умножайте ставку и забирайте вовремя</p></div>
                <div style="font-size:3rem;">🐸</div>
            </div>
        `;
    } else if (page === 'shop') {
        content.innerHTML = `<h1 style="text-align:center;margin-top:80px;">🛒 Магазин</h1>`;
    } else if (page === 'profile') {
        content.innerHTML = `<h1 style="text-align:center;margin-top:80px;">👤 Профиль</h1>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    openPage('game');
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => openPage(btn.getAttribute('data-page')));
    });
});