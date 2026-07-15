// пока пустой файл
// позже сюда добавим:
// переходы между страницами
// загрузку игр
// магазин
// профиль пользователя


console.log("Cosmo App запущено");



const buttons = document.querySelectorAll(".menu-btn");


buttons.forEach(button => {


    button.addEventListener("click", () => {


        console.log(
            "Нажата кнопка:",
            button.innerText
        );


    });


});