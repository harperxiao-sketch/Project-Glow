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

// ⭐ 初始化时间（关键）
lastGrowTime = millis();

}

// ======================
// DRAW LOOP
// ======================

function draw(){

drawGalaxy();

// ⭐ 先更新生长
growTree();

// ⭐ 再画树
push();
translate(width/2, height*0.9);
drawLSystem();
pop();

updateLeaves();
updateParticles();

}

// ======================
// 自动生长（每2秒）
// ======================

function growTree(){

if(millis() - lastGrowTime > 2000){

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

// ⭐ 核心：更新 sentence（之前很多版本漏掉）
sentence = next;

// ⭐ 控制树变细
len *= 0.65;

// ⭐ 更新时间（必须）
lastGrowTime = millis();

}

}

// ======================
// 画树（L-system）
// ======================

function drawLSystem(){

let stack = [];

stroke(120,200,160);

for(let i=0;i<sentence.length;i++){

let c = sentence.charAt(i);

if(c === "F"){

let sw = map(len,2,100,1,16);

// 树干不动
if(sw > 10){
strokeWeight(14);
} else {
strokeWeight(sw);
}

line(0,0,0,-len);
translate(0,-len);

// 生成叶子
if(len < 12 && random() < 0.3){
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
// 叶子（真实形状+动画）
// ======================

class Leaf{

constructor(x,y){
this.x=x;
this.y=y;
this.size=0;
this.target=random(6,12);
this.angle=random(TWO_PI);
}

update(){
if(this.size < this.target){
this.size += 0.2;
}

if(random()<0.01){
particles.push(new Glow(this.x,this.y));
}
}

display(){

push();
translate(this.x,this.y);
rotate(this.angle);

fill(120,255,180);
noStroke();

beginShape();
vertex(0,0);
bezierVertex(6,-4,10,-8,0,-12);
bezierVertex(-10,-8,-6,-4,0,0);
endShape(CLOSE);

pop();

}

}

function updateLeaves(){

for(let l of leaves){
l.update();
l.display();
}

}

// ======================
// 粒子（发光）
// ======================

class Glow{

constructor(x,y){
this.x=x;
this.y=y;
this.life=120;
this.vx=random(-0.3,0.3);
this.vy=random(-1,-0.5);
}

update(){
this.x+=this.vx;
this.y+=this.vy;
this.life--;
}

display(){
noStroke();
fill(150,255,220,this.life);
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
// 银河背景
// ======================

function drawGalaxy(){

background(5,6,18);

// 银河旋转
push();
translate(width/2, height/3);

for(let i=0;i<200;i++){

let a = i*0.1 + frameCount*0.002;
let r = i*1.2;

let x = cos(a)*r;
let y = sin(a)*r*0.5;

fill(100,150,255,80);
noStroke();
circle(x,y,2);

}

pop();

// 星星
for(let i=0;i<80;i++){

let x = noise(i)*width;
let y = noise(i+100)*height*0.6;

fill(255,255,255,150);
circle(x,y,1);

}

// 月亮
fill(240);
noStroke();
circle(width-140,120,80);

}
