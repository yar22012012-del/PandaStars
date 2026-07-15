function showPage(id){


let pages=document.querySelectorAll(".page");


pages.forEach(page=>{

page.classList.remove("active");

});



document
.getElementById(id)
.classList.add("active");




let nav=document.querySelectorAll(".nav");


nav.forEach(n=>{

n.classList.remove("active");

});


}




function openGame(game){


showPage(game);


}





function backGames(){


showPage("games");


}