let stars = 100;

let lastCase = 0;


function openCase(){


let now = Date.now();



if(now - lastCase < 86400000){


alert("Кейс доступен раз в 24 часа");


return;


}



let random = Math.random()*100;


let reward;



if(random < 45){

reward = 2;

}

else if(random < 80){

reward = 3;

}

else if(random < 88){

reward = 1;

}

else if(random < 95){

reward = 5;

}

else if(random < 98){

reward = 11;

}

else if(random < 99.9){

reward = 17;

}

else{

alert("🎁 Тебе выпал NFT подарок!");

reward = 300;

}





stars += reward;



document.getElementById("balance").innerHTML = stars;


document.getElementById("profileBalance").innerHTML = stars;



document.getElementById("result").innerHTML =

"🎉 Ты выиграл ⭐"+reward;



lastCase = now;


}