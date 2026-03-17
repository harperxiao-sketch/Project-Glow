// ======================
// GLOBAL
// ======================

let axiom = "F";
let sentence = axiom;
let rules = [];

let len = 100;
let angle;

let leaves = [];
let particles = [];

let lastGrowTime = 0;

// ======================
// SETUP
// ======================

function setup(){

createCanvas(window.innerWidth, window.innerHeight);

angle = radians(22);

rules.push({
  a: "F",
  b: "FF+[+F-F-F]-[-F+F+F]"
});

// ⭐ 初始化时间
lastGrowTime = millis();

}

// ======================
// DRAW LOOP
// ======================

function draw(){

drawBackground();

// ⭐ 每5秒自动生长
growTree();

push();
translate(width/2, height*0.9);
drawTree();
pop();

updateLeaves();
updateParticles();

}

// ======================
// 🌱 自动生长（5秒）
// ======================

function growTree(){

if(millis() - lastGrowTime > 5000){

let next = "";

for(let i=0; i<sentence.length; i++){

let current = sentence.charAt(i);
let found = false;

for(let j=0; j<rules.length; j++){

if(current === rules[j].a){
next += rules[j].b;
found = true;
break;
}

}

if(!found){
next += current;
}

}

sentence = next;
len *= 0.65;

lastGrowTime = millis();

}

}

// ======================
// 🌳 DRAW TREE
// ======================

function drawTree(){

let stack = [];

stroke(120,200,160);

for(let i=0;i<sentence.length;i++){

let c = sentence.charAt(i);

if(c === "F"){

let sw = map(len,2,100,1,16);

// 树干更粗
if(sw > 10){
strokeWeight(14);
}else{
strokeWeight(sw);
}

line(0,0,0,-len);
translate(0,-len);

// 🌿 生成叶子
if(len < 12 && random() < 0.25){
leaves.push(new Leaf(0,0));
}

}
else if(c === "+"){
rotate(angle);
}
else if(c === "-"){
rotate(-angle);
}
else if(c === "["){
push();
}
else if(c === "]"){
pop();
}

}

}

// ======================
// 🌿 LEAF（回到简单版本）
// ======================

class Leaf{

constructor(x,y){
this.x=x;
this.y=y;
this.size=random(6,10);
}

update(){

// 微弱呼吸感
this.size += sin(frameCount*0.05)*0.05;

if(random()<0.01){
particles.push(new Glow(this.x,this.y));
}

}

display(){

let d=dist(mouseX,mouseY,this.x,this.y);

if(d<120){
fill(160,255,200);
}else{
fill(100,200,140);
}

noStroke();
ellipse(this.x,this.y,this.size,this.size*0.6);

}

}

function updateLeaves(){

for(let l of leaves){
l.update();
l.display();
}

}

// ======================
// ✨ PARTICLES
// ======================

class Glow{

constructor(x,y){
this.x=x;
this.y=y;
this.life=100;
this.vy=random(-0.5,-1);
}

update(){
this.y+=this.vy;
this.life--;
}

display(){

fill(150,255,220,this.life);
noStroke();
circle(this.x,this.y,4);

}

}

function updateParticles(){

for(let i=particles.length-1;i>=0;i--){

particles[i].update();
particles[i].display();

if(particles[i].life<0){
particles.splice(i,1);
}

}

}

// ======================
// 🌙 BACKGROUND（原版）
// ======================

function drawBackground(){

background(5,8,20);

// ⭐ 星星
for(let i=0;i<80;i++){

let x = noise(i)*width;
let y = noise(i+100)*height*0.6;

fill(255,255,255,150);
noStroke();
circle(x,y,1);

}

// 🌙 月亮
fill(240);
noStroke();
circle(width-140,120,80);

}
