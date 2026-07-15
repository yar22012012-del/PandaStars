let balance =
Number(localStorage.getItem("balance")) || 100;


let opened =
Number(localStorage.getItem("opened")) || 0;



update();





function changeScreen(id){


document.querySelectorAll(".screen")
.forEach(x=>{

x.classList.remove("active");

});



document
.getElementById(id)
.classList.add("active");


}







const rewards=[


{
name:"⭐⭐ 2 Stars",
value:2,
chance:45
},


{
name:"⭐⭐⭐ 3 Stars",
value:3,
chance:35
},


{
name:"⭐ 1 Star",
value:1,
chance:8
},


{
name:"⭐⭐⭐⭐⭐ 5 Stars",
value:5,
chance:7
},


{
name:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 11 Stars",
value:11,
chance:3
},


{
name:"⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 17 Stars",
value:17,
chance:1.9
},


{
name:"🎁 Telegram NFT",
value:300,
chance:.1
}


];








function openCase(){



let last =
localStorage.getItem("caseTime");



let now =
Date.now();




if(last){


let left =
86400000-(now-last);



if(left>0){


showTimer(left);


return;


}


}






let random =
Math.random()*100;


let total=0;


let win;



for(let r of rewards){


total+=r.chance;


if(random<=total){

win=r;

break;

}


}




balance+=win.value;


opened++;



localStorage.setItem(
"balance",
balance
);


localStorage.setItem(
"opened",
opened
);


localStorage.setItem(
"caseTime",
now
);




document.getElementById("result")
.innerHTML=

"🎉 Выпало:<br>"+win.name;



update();


startTimer();


}







function startTimer(){


setInterval(()=>{


let last =
localStorage.getItem("caseTime");


if(!last)return;



let left =
86400000-(Date.now()-last);



if(left<=0){


document.getElementById("timer")
.innerHTML=
"Доступен сейчас";


return;


}



showTimer(left);



},1000);


}






function showTimer(ms){


let h =
Math.floor(ms/3600000);


let m =
Math.floor(ms%3600000/60000);


let s =
Math.floor(ms%60000/1000);



document.getElementById("timer")
.innerHTML=

"Следующее открытие: "
+h+":"+
m+":"+
s;


}







function update(){


document.getElementById("balance")
.innerHTML=balance;


document.getElementById("profileBalance")
.innerHTML=balance;


document.getElementById("opened")
.innerHTML=opened;


}