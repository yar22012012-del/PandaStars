// Переключение между страницами
function openPage(page) {
    const mainContent = document.getElementById('main-content');
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
            btn.classList.add('active');
        }
    });

    let html = '';

    switch(page) {
        case 'game':
            html = `
                <div class="card free">
                    <div class="card-content">
                        <div>
                            <h2>Бесплатно</h2>
                            <p>Бесплатные кейсы и ежедневные задания</p>
                        </div>
                        <div class="icon">🎁</div>
                    </div>
                </div>
                
                <div class="card upgrade">
                    <div class="card-content">
                        <div>
                            <h2>Апгрейд <span class="new">Новое</span></h2>
                            <p>Улучшайте кликер и множители</p>
                        </div>
                        <div class="icon">⚡</div>
                    </div>
                </div>
                
                <div class="card crash" onclick="alert('Краш запущен! (пока заглушка)')">
                    <div class="card-content">
                        <div>
                            <h2>Краш</h2>
                            <p>Умножай ставку и выводи вовремя</p>
                        </div>
                        <div class="icon">🚀</div>
                    </div>
                </div>
            `;
            break;

        case 'contests':
            html = `
                <h1 style="text-align:center; margin: 40px 0 20px;">🏆 Конкурсы</h1>
                <p style="text-align:center; opacity:0.8;">Здесь будут активные конкурсы и розыгрыши</p>
            `;
            break;

        case 'leaders':
            html = `
                <h1 style="text-align:center; margin: 30px 0 20px;">👑 Лидеры</h1>
                <div style="background:rgba(255,255,255,0.05); border-radius:16px; padding:20px;">
                    <p>1. Alex — 12400 ⭐</p>
                    <p>2. Max — 8750 ⭐</p>
                    <p>3. PandaKing — 6200 ⭐</p>
                    <p>4. Ivan — 4100 ⭐</p>
                </div>
            `;
            break;

        case 'shop':
            html = `
                <h1 style="text-align:center; margin: 40px 0 20px;">🛒 Магазин</h1>
                <p style="text-align:center; opacity:0.8;">Здесь будут бустеры, скины и особые кейсы</p>
            `;
            break;

        case 'profile':
            html = `
                <div style="text-align:center; margin-top: 40px;">
                    <h1>👤 Профиль</h1>
                    <p style="font-size:1.5rem; margin:20px 0;">Баланс: <strong>4600 ⭐</strong></p>
                    <p>Уровень: 12</p>
                    <p>Кликер: Обычный</p>
                </div>
            `;
            break;

        default:
            html = `<p>Страница не найдена</p>`;
    }

    mainContent.innerHTML = html;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Открываем страницу "Игры" по умолчанию
    openPage('game');
    
    // Добавляем обработчики на кнопки
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            openPage(page);
        });
    });
});