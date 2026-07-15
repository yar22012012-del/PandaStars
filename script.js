/* =====================================
        PANDA STARS ENGINE
        Main Game System
===================================== */



// ================================
// PLAYER DATA
// ================================


let player = {


    balance:
    Number(localStorage.getItem("balance")) || 100,


    opened:
    Number(localStorage.getItem("opened")) || 0,


    lastCase:
    Number(localStorage.getItem("lastCase")) || 0,


    history:
    JSON.parse(
        localStorage.getItem("history")
    ) || []


};








// ================================
// SAVE SYSTEM
// ================================



function savePlayer(){


localStorage.setItem(
"balance",
player.balance
);



localStorage.setItem(
"opened",
player.opened
);



localStorage.setItem(
"lastCase",
player.lastCase
);



localStorage.setItem(
"history",
JSON.stringify(player.history)
);



}








// ================================
// UPDATE UI
// ================================



function updateUI(){


document
.getElementById("balance")
.innerHTML =
player.balance;



document
.getElementById("profileBalance")
.innerHTML =
player.balance;



document
.getElementById("opened")
.innerHTML =
player.opened;



}





updateUI();









// ================================
// PAGE SYSTEM
// ================================



function openPage(page){



let pages =
document.querySelectorAll(".page");



pages.forEach(p=>{


p.classList.remove("active");


});



document
.getElementById(page)
.classList.add("active");



}









// ================================
// CASE REWARDS
// ================================



const caseRewards=[


{

name:
"⭐⭐ 2 Stars",

value:2,

chance:45

},



{

name:
"⭐⭐⭐ 3 Stars",

value:3,

chance:35

},



{

name:
"⭐ 1 Star",

value:1,

chance:8

},



{

name:
"⭐⭐⭐⭐⭐ 5 Stars",

value:5,

chance:7

},



{

name:
"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 11 Stars",

value:11,

chance:3

},



{

name:
"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 17 Stars",

value:17,

chance:1.9

},



{

name:
"🎁 Telegram NFT Gift",

value:300,

chance:0.1

}


];









// ================================
// OPEN FREE CASE
// ================================



function openCase(){



let now =
Date.now();




let cooldown =
86400000;



if(
now - player.lastCase
<
cooldown
){


let left =
cooldown -
(now-player.lastCase);



showTimer(left);



return;


}






animateCase();






}









// ================================
// CASE ANIMATION
// ================================



function animateCase(){



let result =
document.getElementById(
"caseResult"
);



let button =
document.querySelector(
".case button"
);



button.disabled=true;



let animation=0;



let spin=setInterval(()=>{


let fake =
caseRewards[
Math.floor(
Math.random()*caseRewards.length
)
];



result.innerHTML=
"🎁 "+fake.name;



animation++;



if(animation>25){



clearInterval(spin);



finishCase();



button.disabled=false;



}



},100);




}









// ================================
// FINAL REWARD
// ================================



function finishCase(){



let random =
Math.random()*100;



let total=0;



let reward;



for(
let item of caseRewards
){


total+=item.chance;



if(random<=total){


reward=item;


break;


}



}






player.balance
+=reward.value;



player.opened++;



player.lastCase =
Date.now();




player.history.unshift({

text:
reward.name,

date:
new Date()
.toLocaleString()


});



if(player.history.length>10){

player.history.pop();

}




savePlayer();



updateUI();



document
.getElementById("caseResult")
.innerHTML=


"🎉 Вы выиграли<br><br>"
+
reward.name;



startTimer();



}









// ================================
// TIMER
// ================================



function startTimer(){



setInterval(()=>{



if(!player.lastCase)
return;



let left =
86400000 -
(
Date.now()
-
player.lastCase
);



if(left<=0){



document
.getElementById("caseTimer")
.innerHTML=
"Доступен сейчас";



return;


}



showTimer(left);



},1000);



}








function showTimer(ms){



let h =
Math.floor(
ms/3600000
);



let m =
Math.floor(
(ms%3600000)/60000
);



let s =
Math.floor(
(ms%60000)/1000
);



document
.getElementById("caseTimer")
.innerHTML=

"Следующее открытие: "
+
String(h).padStart(2,"0")
+
":"
+
String(m).padStart(2,"0")
+
":"
+
String(s).padStart(2,"0");


}








startTimer();









// ================================
// TEST FUNCTIONS
// ================================



function addStars(amount){


player.balance+=amount;


savePlayer();


updateUI();


}






function resetGame(){


localStorage.clear();


location.reload();


}