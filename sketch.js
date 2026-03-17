// ======================
// GLOBAL
// ======================

let branches = [];
let leaves = [];
let particles = [];

let growQueue = [];

let lastGrowTime = 0;

// ======================
// SETUP
// ======================

function setup(){

createCanvas(window.innerWidth, window.innerHeight);

// ⭐ 初始树干（确保能看到）
let root = new Branch(width/2, height*0.8, -PI/2, 120, 0);

branches.push(root);
growQueue.push(root);

// ⭐ 一开始就生长一次（关键）
growStep();

// ⭐ 让后续马上继续触发
lastGrowTime = millis() - 5000;

}

// ======================
// DRAW
// ======================

function draw(){

drawBackground();

// ⭐ 每5秒自动生长
if(millis() - lastGrowTime > 5000){
growStep();
lastGrowTime = millis();
}

drawTree();
updateLeaves();
updateParticles();

// ⭐ 防止 growQueue 变空（防黑屏）
if(growQueue.length === 0 && branches.length > 0){
growQueue.push(branches[branches.length - 1]);
}

}

// ======================
// 🌱 GROWTH（稳定版）
// ======================

function growStep(){

// ⭐ 防止卡死
if(branches.length > 1200) return;

let newQueue = [];

for(let b of growQueue){

if(b.depth < 8){

let angleOffset = random(0.3,0.6);

let left = new Branch(
b.endX,
b.endY,
b.angle - angleOffset,
b.len * 0.7,
b.depth + 1
);

let right = new Branch(
b.endX,
b.endY,
b.angle + angleOffset,
b.len * 0.7,
b.depth + 1
);

branches.push(left);
branches.push(right);

newQueue.push(left);
newQueue.push(right);

// 🌿 叶子
if(b.depth > 2){
leaves.push(new Leaf(b.endX, b.endY));
}

}

}

// ⭐ 防止队列空
if(newQueue.length > 0){
growQueue = newQueue;
}

}

// ======================
// 🌳 BRANCH（动画生长）
// ======================

class Branch{

constructor(x,y,angle,len,depth){

this.x = x;
this.y = y;
this.angle = angle;
this.len = len;
this.depth = depth;

this.progress = 0;

this.endX = x + cos(angle)*len;
this.endY = y + sin(angle)*len;

}

update(){

if(this.progress < 1){
this.progress += 0.03;
}

}

display(){

this.update();

let ex = lerp(this.x, this.endX, this.progress);
let ey = lerp(this.y, this.endY, this.progress);

let w;

if(this.depth === 0){
w = 14;
}else{
w = map(this.depth,1,8,6,1);
}

stroke(120,200,160);
strokeWeight(w);

line(this.x, this.y, ex, ey);

}

}

// ======================
// 🌿 LEAF
// ======================

class Leaf{

constructor(x,y){
this.x = x;
this.y = y;
this.size = random(6,10);
}

display(){

let d = dist(mouseX, mouseY, this.x, this.y);

// 🖱 交互发光
if(d < 120){
fill(160,255,200);
}else{
fill(100,200,140);
}

noStroke();
ellipse(this.x, this.y, this.size, this.size*0.6);

// ✨ 粒子
if(random()<0.01){
particles.push(new Glow(this.x, this.y));
}

}

}

function updateLeaves(){

for(let l of leaves){
l.display();
}

}

// ======================
// ✨ PARTICLES
// ======================

class Glow{

constructor(x,y){
this.x = x;
this.y = y;
this.life = 100;
this.vx = random(-0.3,0.3);
this.vy = random(-1,-0.5);
}

update(){
this.x += this.vx;
this.y += this.vy;
this.life--;
}

display(){

fill(150,255,220,this.life);
noStroke();
circle(this.x, this.y, 4);

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
// 🌙 BACKGROUND
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

// ======================
// 🖱 INTERACTION
// ======================

function mousePressed(){
growStep();
}

function mouseDragged(){
particles.push(new Glow(mouseX, mouseY));
}
