"use strict";
const body=document.body;
const frontCover=document.getElementById("frontCover");
const pages=[...document.querySelectorAll(".page")];
let coverOpen=false;
let currentPage=0;
let touchStartX=0;
let touchStartY=0;
let isAnimating=false;
function wait(ms){
return new Promise(resolve=>window.setTimeout(resolve,ms));
}
function updatePageLayers(){
pages.forEach((page,index)=>{
page.style.zIndex=String(pages.length-index);
});
}
async function presentBook(){
await wait(200);
body.classList.add("is-visible");
await wait(1100);
body.classList.add("is-near");
}
function openCover(){
if(isAnimating||coverOpen)return;
isAnimating=true;
coverOpen=true;
body.classList.add("is-open");
window.setTimeout(()=>{
isAnimating=false;
},1700);
}
function closeCover(){
if(isAnimating||!coverOpen||currentPage!==0)return;
isAnimating=true;
coverOpen=false;
body.classList.remove("is-open");
body.classList.remove("has-turned");
window.setTimeout(()=>{
isAnimating=false;
},1700);
}
function nextPage(){
if(isAnimating)return;
if(!coverOpen){
openCover();
return;
}
if(currentPage>=pages.length-1)return;
isAnimating=true;
body.classList.add("has-turned");
pages[currentPage].classList.add("is-turned");
currentPage+=1;
window.setTimeout(()=>{
isAnimating=false;
},950);
}
function previousPage(){
if(isAnimating)return;
if(!coverOpen)return;
if(currentPage===0){
closeCover();
return;
}
isAnimating=true;
currentPage-=1;
pages[currentPage].classList.remove("is-turned");
window.setTimeout(()=>{
isAnimating=false;
},950);
}
function handleTouchStart(event){
const touch=event.changedTouches[0];
touchStartX=touch.clientX;
touchStartY=touch.clientY;
}
function handleTouchEnd(event){
const touch=event.changedTouches[0];
const deltaX=touch.clientX-touchStartX;
const deltaY=touch.clientY-touchStartY;
if(Math.abs(deltaX)<45||Math.abs(deltaX)<Math.abs(deltaY))return;
if(deltaX<0)nextPage();
else previousPage();
}
function handleTap(event){
const x=event.clientX;
if(x>window.innerWidth*.62)nextPage();
if(x<window.innerWidth*.38)previousPage();
}
updatePageLayers();
frontCover.addEventListener("click",event=>{
event.stopPropagation();
openCover();
});
document.addEventListener("touchstart",handleTouchStart,{passive:true});
document.addEventListener("touchend",handleTouchEnd,{passive:true});
document.addEventListener("click",handleTap);
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",presentBook,{once:true});
}else{
presentBook();
}