function openPage(page){


let area=document.getElementById("page");



if(page==="cases"){


area.innerHTML=`

<h1>
🎁 Кейсы
</h1>

<p>
Открывай кейсы за звезды
</p>

`;

}




if(page==="mine"){


area.innerHTML=`

<h1>
⛏ Шахта
</h1>

<p>
Ищи множители и звезды
</p>

`;

}





if(page==="profile"){


area.innerHTML=`

<h1>
👤 Профиль
</h1>

<p>
Баланс: 0⭐
</p>

`;

}





if(page==="top"){


area.innerHTML=`

<h1>
🏆 Топ игроков
</h1>

<p>
1. Alex
<br>
2. Max
<br>
3. Ivan
</p>

`;

}



}