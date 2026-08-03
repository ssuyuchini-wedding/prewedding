"use strict";

const body=document.body;
const frontCover=document.getElementById("frontCover");
const pages=[...document.querySelectorAll(".page")];
const sectionTabs=[...document.querySelectorAll(".section-tab")];
const bgMusic=document.getElementById("bgMusic");
const pageHint=document.getElementById("pageHint");
const stage=document.querySelector(".stage");
const pageTurnSound=new Audio("assets/audio/page-turn.mp3");
pageTurnSound.preload="auto";
pageTurnSound.volume=0.6;

let coverOpen=false;
let currentPage=0;
let touchStartX=0;
let touchStartY=0;
let isAnimating=false;

function createBackgroundSparkle(){
if(!stage)return;

const sparkle=document.createElement("span");
sparkle.className="album-sparkle";

let x;
let y;

do{
x=Math.random()*100;
y=Math.random()*100;
}while(
x>38 &&
x<62 &&
y>22 &&
y<78
);

sparkle.style.left=x+"%";
sparkle.style.top=y+"%";

const randomSize=Math.random();
let size;

if(randomSize<0.75){
size=Math.random()*2+1.5;
}else if(randomSize<0.97){
size=Math.random()*2+3.5;
}else{
size=Math.random()*2+5.5;
}

sparkle.style.width=size+"px";
sparkle.style.height=size+"px";
sparkle.style.animationDuration=(Math.random()*2+2.5)+"s";

stage.appendChild(sparkle);

window.setTimeout(()=>{
sparkle.remove();
},5000);
}

function playSound(){
pageTurnSound.currentTime=0;
pageTurnSound.play().catch(()=>{});
}

function wait(ms){
return new Promise(resolve=>window.setTimeout(resolve,ms));
}

function updatePageLayers(){
pages.forEach((page,index)=>{
page.style.zIndex=String(pages.length-index);
});
}
function updatePageHint(){
if(!pageHint)return;

if(!coverOpen){
pageHint.textContent="輕觸或滑動開始";
body.classList.remove("hide-page-hint");
return;
}

if(currentPage<3){
pageHint.textContent="← 滑動翻頁 · 點右側標籤切換章節";
body.classList.remove("hide-page-hint");
}else{
body.classList.add("hide-page-hint");
}
}

async function presentBook(){
await wait(150);
body.classList.add("is-visible");
await wait(50);
body.classList.add("is-near");
}

function openCover(){
if(isAnimating||coverOpen)return;

isAnimating=true;
coverOpen=true;
if(bgMusic && bgMusic.paused){
fadeInMusic();
}
playSound();
body.classList.add("is-reading","is-open");
updatePageHint();

window.setTimeout(()=>{
isAnimating=false;
},1700);
}

function closeCover(){
if(isAnimating||!coverOpen||currentPage!==0)return;

isAnimating=true;
coverOpen=false;
updatePageHint();
playSound();
body.classList.remove("is-open");
body.classList.remove("has-turned");

window.setTimeout(()=>{
body.classList.remove("is-reading");
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
playSound();
body.classList.add("has-turned");
pages[currentPage].classList.add("is-turned");
currentPage+=1;
updatePageHint();

window.setTimeout(()=>{
isAnimating=false;
},950);
}

function previousPage(){
if(isAnimating||!coverOpen)return;

if(currentPage===0){
closeCover();
return;
}

isAnimating=true;
playSound();
currentPage-=1;
updatePageHint();
pages[currentPage].classList.remove("is-turned");

window.setTimeout(()=>{
isAnimating=false;
},950);
}

function goToPage(targetPage){
if(isAnimating)return;

if(!coverOpen){
openCover();

window.setTimeout(()=>{
goToPage(targetPage);
},1700);

return;
}

if(targetPage===currentPage)return;

isAnimating=true;
playSound();
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
updatePageHint();

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

if(deltaX<0){
nextPage();
}else{
previousPage();
}
}

function handleTap(event){
if(event.target.closest(".section-tab"))return;

const x=event.clientX;

if(x>window.innerWidth*.62){
nextPage();
}else if(x<window.innerWidth*.38){
previousPage();
}
}

updatePageLayers();
window.setInterval(createBackgroundSparkle,280);

sectionTabs.forEach(tab=>{
tab.addEventListener("click",event=>{
event.stopPropagation();

const targetSelector=tab.dataset.target;
const targetPageElement=document.querySelector(targetSelector);
const targetPage=pages.indexOf(targetPageElement);

if(targetPage>=0){
goToPage(targetPage);
}
});
});

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
let musicFadeInterval=null;

function fadeInMusic(){

if(!bgMusic)return;

if(musicFadeInterval){
clearInterval(musicFadeInterval);
}

bgMusic.volume=0;

bgMusic.play().catch(()=>{});

const targetVolume=0.10;

musicFadeInterval=setInterval(()=>{

if(bgMusic.volume>=targetVolume){

bgMusic.volume=targetVolume;

clearInterval(musicFadeInterval);

musicFadeInterval=null;

return;

}

bgMusic.volume=Math.min(
bgMusic.volume+0.01,
targetVolume
);

},100);

}