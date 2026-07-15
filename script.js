// ==========================
// ДАННЫЕ ИГРОКА
// ==========================


let balance = Number(localStorage.getItem("balance")) || 100;

let wins = Number(localStorage.getItem("wins")) || 0;

let cases = Number(localStorage.getItem("cases")) || 0;



document.getElementById("balance").innerHTML = balance;

document.getElementById("wins").innerHTML = wins;

document.getElementById("cases").innerHTML = cases;





// ==========================
// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
// ==========================


function show(id, element){


let screens=document.querySelectorAll(".screen");


screens.forEach(screen=>{

screen.classList.remove("active");

});



document
.getElementById(id)
.classList.add("active");




let tabs=document.querySelectorAll(".tab");


tabs.forEach(tab=>{

tab.classList.remove("active");

});



if(element){

element.classList.add("active");

}


}







function back(){


show("games");


}






// ==========================
// БЕСПЛАТНЫЙ КЕЙС
// ==========================


function openCase(){


show("case");


}




const rewards=[


{
name:"⭐ 1 звезда",
chance:8
},


{
name:"⭐⭐ 2 звезды",
chance:45
},


{
name:"⭐⭐⭐ 3 звезды",
chance:35
},


{
name:"⭐⭐⭐⭐⭐ 5 звёзд",
chance:7
},


{
name:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 11 звёзд",
chance:3
},


{
name:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 17 звёзд",
chance:1.9
},


{
name:"🎁 Telegram NFT подарок",
chance:0.1
}


];







function openReward(){



let last=localStorage.getItem("caseTime");


let now=Date.now();



if(last && now-last < 86400000){


let hours=Math.ceil(
(86400000-(now-last))/3600000
);



document.getElementById("caseResult").innerHTML=

"⏳ Попробуй через "+hours+" часов";


return;


}




let random=Math.random()*100;


let count=0;


let result;



for(let reward of rewards){


count+=reward.chance;



if(random<=count){


result=reward.name;


break;


}



}



cases++;


localStorage.setItem("cases",cases);



document.getElementById("cases").innerHTML=cases;



localStorage.setItem(
"caseTime",
now
);



document.getElementById("caseResult").innerHTML=

"🎉 Выпало:<br><br>"+result;



}







// ==========================
// МИННОЕ ПОЛЕ
// ==========================


let mineActive=false;

let mineCells=[];

let currentWin=0;

let currentMultiplier=1;






function openMine(){


show("mine");


}






function startMine(){



let bet=document.getElementById("bet").value;



bet=Number(bet);



if(bet<15){


alert("Минимальная ставка 15 Stars");

return;


}




if(bet>balance){


alert("Недостаточно Stars");


return;


}




balance-=bet;


saveBalance();



currentWin=bet;


currentMultiplier=1;



mineCells=[];



let field=document.getElementById("mineField");


field.innerHTML="";





// создаём 5 мин


let mines=[];


while(mines.length<5){


let number=Math.floor(Math.random()*9);


if(!mines.includes(number)){


mines.push(number);


}


}





for(let i=0;i<9;i++){



let cell=document.createElement("div");


cell.className="mine-cell";



cell.onclick=function(){


clickMine(i,mines,cell);


};



field.appendChild(cell);



}





mineActive=true;



}







function clickMine(index,mines,cell){



if(!mineActive)

return;





if(mines.includes(index)){


cell.innerHTML="💣";

cell.classList.add("mine-boom");


alert("💥 Ты проиграл");


mineActive=false;


currentWin=0;


return;


}






let multipliers=[1,2,2.5,3];


let safeCount=
document.querySelectorAll(".mine-safe").length;



currentMultiplier=
multipliers[safeCount];



currentWin*=currentMultiplier;



cell.innerHTML="⭐";

cell.classList.add("mine-safe");



document.getElementById("win").innerHTML=

"Выигрыш: "+Math.floor(currentWin)+" ⭐";



}








function takeWin(){



if(!mineActive || currentWin<=0)

return;



balance+=Math.floor(currentWin);


wins++;



saveBalance();



document.getElementById("balance").innerHTML=balance;

document.getElementById("wins").innerHTML=wins;



alert(
"Ты забрал "+Math.floor(currentWin)+" Stars"
);



mineActive=false;



}









// ==========================
// СОХРАНЕНИЕ
// ==========================


function saveBalance(){


localStorage.setItem(
"balance",
balance
);



localStorage.setItem(
"wins",
wins
);



}