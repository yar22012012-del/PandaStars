function openPage(page){


let app = document.getElementById("app");



if(page === "cases"){


app.innerHTML = `

<h1>
🎁 Кейсы
</h1>

<p>
Открывай кейсы за ⭐
</p>

`;

}




if(page === "mine"){


app.innerHTML = `

<h1>
⛏ Шахта
</h1>

<p>
Ищи звезды и множители
</p>

`;

}





if(page === "profile"){


app.innerHTML = `

<h1>
👤 Профиль
</h1>

<p>
Баланс: 0⭐
</p>

`;

}





if(page === "top"){


app.innerHTML = `

<h1>
🏆 Топ игроков
</h1>

<p>

1. Alex - 1000⭐

<br>

2. Max - 500⭐

<br>

3. Ivan - 250⭐

</p>

`;

}


}