"use strict";
const body=document.body;
const book=document.getElementById("book");
const pages=[...document.querySelectorAll(".page")];
const sectionTabs=[...document.querySelectorAll(".section-tab")];
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
function updateSectionTabs(){
sectionTabs.forEach(tab=>{
const pageIndex=Number(tab.dataset.page);
tab.classList.toggle("is-passed",currentPage>pageIndex);
});
}
async function openBook(){
await wait(200);
body.classList.add("is-visible");
await wait(1100);
body.classList.add("is-near");
await wait(1450);
body.classList.add("is-open");
}
function nextPage(){
if(isAnimating||currentPage>=pages.length-1)return;
isAnimating=true;
body.classList.add("has-turned");
pages[currentPage].classList.add("is-turned");
currentPage+=1;
updateSectionTabs();
window.setTimeout(()=>{
isAnimating=false;
},950);
}
function previousPage(){
if(isAnimating||currentPage<=0)return;
isAnimating=true;
currentPage-=1;
pages[currentPage].classList.remove("is-turned");
updateSectionTabs();
window.setTimeout(()=>{
isAnimating=false;
},950);
}
function goToPage(targetPage){
if(isAnimating||targetPage===currentPage)return;
isAnimating=true;
body.classList.add("has-turned");
if(targetPage>currentPage){
while(currentPage<targetPage){
pages[currentPage].classList.add("is-turned");
currentPage+=1;
}
}else{
while(currentPage>targetPage){
currentPage-=1;
pages[currentPage].classList.remove("is-turned");
}
}
updateSectionTabs();
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
if(!body.classList.contains("is-open"))return;
if(event.target.closest(".section-tab"))return;
const x=event.clientX;
if(x>window.innerWidth*.62)nextPage();
if(x<window.innerWidth*.38)previousPage();
}
updatePageLayers();
updateSectionTabs();
sectionTabs.forEach(tab=>{
tab.addEventListener("click",event=>{
event.stopPropagation();
const targetPage=Number(tab.dataset.page);
goToPage(targetPage);
});
});
document.addEventListener("touchstart",handleTouchStart,{passive:true});
document.addEventListener("touchend",handleTouchEnd,{passive:true});
document.addEventListener("click",handleTap);
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",openBook,{once:true});
}else{
openBook();
}