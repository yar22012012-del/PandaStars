function openPage(page) {
    const content = document.getElementById('main-content');
    
    // Активная кнопка
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) btn.classList.add('active');
    });

    if (page === 'game') {
        content.innerHTML = `
            <h1 style="text-align:center; margin:50px 0 30px; font-size:2rem;">🎮 Игры</h1>
            <div style="text-align:center; font-size:1.1rem; opacity:0.8;">
                Здесь будет основной игровой экран<br>
                (Кликер, краш, рулетка и т.д.)
            </div>
        `;
    } 
    else if (page === 'shop') {
        content.innerHTML = `
            <h1 style="text-align:center; margin:50px 0 30px; font-size:2rem;">🛒 Магазин</h1>
            <div style="text-align:center; font-size:1.1rem; opacity:0.8;">
                Здесь будут покупки и улучшения
            </div>
        `;
    } 
    else if (page === 'profile') {
        content.innerHTML = `
            <h1 style="text-align:center; margin:50px 0 30px; font-size:2rem;">👤 Профиль</h1>
            <div style="text-align:center; font-size:1.2rem;">
                <p>Баланс: <strong>4600 ⭐</strong></p>
                <p>Уровень: 12</p>
            </div>
        `;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    openPage('game');
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            openPage(btn.getAttribute('data-page'));
        });
    });
});