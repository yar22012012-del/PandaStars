// ===============================
// ДАННЫЕ ИГРОКА
// ===============================


let stars = Number(localStorage.getItem("stars")) || 100;

let opened = Number(localStorage.getItem("opened")) || 0;

let wins = Number(localStorage.getItem("wins")) || 0;


updateProfile();






// ===============================
// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ===============================


function changePage(page){


    document.querySelectorAll(".page")
    .forEach(item=>{

        item.classList.remove("active");

    });



    document
    .getElementById(page)
    .classList.add("active");


}








// ===============================
// БЕСПЛАТНЫЙ КЕЙС
// ===============================


const rewards=[

    {
        text:"⭐ 1 звезда",
        chance:10,
        value:1
    },


    {
        text:"⭐⭐ 2 звезды",
        chance:45,
        value:2
    },


    {
        text:"⭐⭐⭐ 3 звезды",
        chance:30,
        value:3
    },


    {
        text:"⭐⭐⭐⭐⭐ 5 звёзд",
        chance:8,
        value:5
    },


    {
        text:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 11 звёзд",
        chance:5,
        value:11
    },


    {
        text:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 17 звёзд",
        chance:1.9,
        value:17
    },


    {
        text:"🎁 Telegram NFT подарок",
        chance:0.1,
        value:0
    }


];






function openCase(){



let lastOpen =
localStorage.getItem("caseTime");



let now=Date.now();




if(lastOpen){


let time=now-Number(lastOpen);



if(time < 86400000){


let left =
86400000-time;



let hours =
Math.floor(left/3600000);



alert(
"⏳ Кейс будет доступен через "+hours+" часов"
);


return;


}


}






let random=Math.random()*100;


let sum=0;


let result;



for(let item of rewards){


sum+=item.chance;



if(random<=sum){


result=item;


break;


}


}






opened++;



if(result.value>0){

stars+=result.value;

}




localStorage.setItem(
"caseTime",
now
);


localStorage.setItem(
"stars",
stars
);


localStorage.setItem(
"opened",
opened
);





updateProfile();



alert(
"🎉 Выпало:\n\n"+result.text
);



}










// ===============================
// МИННОЕ ПОЛЕ
// ===============================



let mines=[];

let currentWin=0;

let game=false;

let safe=0;








function openMine(){

changePage("mine");

}








function startMine(){



let bet =
Number(
document.getElementById("bet").value
);



if(bet<15){

alert(
"Минимальная ставка 15 Stars"
);

return;

}



if(bet>stars){


alert(
"Недостаточно Stars"
);


return;


}





stars-=bet;


save();




currentWin=bet;

safe=0;

game=true;




let field =
document.getElementById("field");


field.innerHTML="";



mines=[];



while(mines.length<5){


let x=
Math.floor(Math.random()*9);



if(!mines.includes(x)){


mines.push(x);


}


}





for(let i=0;i<9;i++){



let cell =
document.createElement("div");



cell.className="mine-cell";



cell.onclick=function(){


openCell(
i,
cell
);


};




field.appendChild(cell);


}



updateProfile();


}








function openCell(id,cell){


if(!game)
return;




if(mines.includes(id)){


cell.innerHTML="💣";


alert(
"💥 Бомба! Ты проиграл"
);



game=false;


currentWin=0;


return;


}





safe++;



let multipliers=[1,2,2.5,3];


let multiplier =
multipliers[safe-1] || 3;



currentWin =
Math.floor(
currentWin*multiplier
);




cell.innerHTML="⭐";

cell.style.background="#166534";



document.getElementById("result")
.innerHTML=

"Выигрыш: "+
currentWin+
" ⭐";


}








function takeMoney(){



if(currentWin<=0)
return;




stars+=currentWin;


wins++;



save();



game=false;


currentWin=0;



updateProfile();



alert(
"💰 Вы забрали выигрыш"
);


}









// ===============================
// ПРОФИЛЬ
// ===============================



function updateProfile(){


document
.getElementById("stars")
.innerHTML=stars;



document
.getElementById("profileStars")
.innerHTML=stars;



document
.getElementById("opened")
.innerHTML=opened;



document
.getElementById("wins")
.innerHTML=wins;



}







function save(){


localStorage.setItem(
"stars",
stars
);


localStorage.setItem(
"opened",
opened
);


localStorage.setItem(
"wins",
wins
);


}